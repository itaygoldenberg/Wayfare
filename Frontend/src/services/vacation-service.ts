import axios from "axios";
import { VacationModel } from "../models/vacation-model";
import { VacationFilter } from "../models/enums";
import { appConfig } from "../utils/app-config";
import { dateUtil } from "../utils/date-util";
import { store } from "../redux/store";
import { vacationSlice } from "../redux/vacation-slice";

// Loads and changes vacations, keeping the global state in step with the server.
class VacationService {
  // Loads the list once; later calls reuse the global state.
  public async getAllVacations(): Promise<VacationModel[]> {
    const vacations = store.getState().vacations;
    if (vacations.length > 0) return vacations;

    const response = await axios.get<VacationModel[]>(appConfig.vacationsUrl);
    store.dispatch(vacationSlice.actions.initVacations(response.data));
    return response.data;
  }

  // Returns one vacation, from the global state when it is already there.
  public async getOneVacation(vacationId: number): Promise<VacationModel> {
    const vacation = store
      .getState()
      .vacations.find((v) => v.vacationId === vacationId);
    if (vacation) return vacation;

    const response = await axios.get<VacationModel>(
      appConfig.vacationsUrl + "/" + vacationId,
    );
    return response.data;
  }

  // Adds a vacation; only touches the global state if the list was already loaded,
  // otherwise a list of one would look like the whole list.
  public async addVacation(vacation: VacationModel): Promise<void> {
    const response = await axios.post<VacationModel>(
      appConfig.vacationsUrl,
      this.toFormData(vacation),
    );
    const dbVacation = { ...response.data, likesCount: 0, isLiked: 0 };
    if (store.getState().vacations.length > 0)
      store.dispatch(vacationSlice.actions.addVacation(dbVacation));
  }

  // Updates a vacation.
  public async updateVacation(vacation: VacationModel): Promise<void> {
    const response = await axios.put<VacationModel>(
      appConfig.vacationsUrl + "/" + vacation.vacationId,
      this.toFormData(vacation),
    );
    store.dispatch(vacationSlice.actions.updateVacation(response.data));
  }

  // Deletes a vacation.
  public async deleteVacation(vacationId: number): Promise<void> {
    await axios.delete(appConfig.vacationsUrl + "/" + vacationId);
    store.dispatch(vacationSlice.actions.deleteVacation(vacationId));
  }

  // Adds or removes the current user's like, depending on its current state.
  public async toggleLike(vacation: VacationModel): Promise<void> {
    const url = appConfig.vacationsUrl + "/" + vacation.vacationId + "/like";
    if (vacation.isLiked) await axios.delete(url);
    else await axios.post(url);
    store.dispatch(
      vacationSlice.actions.setLike({
        vacationId: vacation.vacationId,
        isLiked: !vacation.isLiked,
      }),
    );
  }

  // Keeps only the vacations that match the chosen filter.
  public filterVacations(
    vacations: VacationModel[],
    filter: VacationFilter,
  ): VacationModel[] {
    const today = dateUtil.today();
    switch (filter) {
      case VacationFilter.Liked:
        return vacations.filter((v) => v.isLiked);
      case VacationFilter.Active:
        return vacations.filter(
          (v) => v.startDate <= today && v.endDate >= today,
        );
      case VacationFilter.Future:
        return vacations.filter((v) => v.startDate > today);
      default:
        return vacations;
    }
  }

  // The address of a vacation's image on the server.
  public getImageUrl(imageName: string): string {
    return appConfig.vacationImagesUrl + imageName;
  }

  // Builds the multipart body the server expects; the image is sent only when one was chosen.
  private toFormData(vacation: VacationModel): FormData {
    const formData = new FormData();
    formData.append("destination", vacation.destination);
    formData.append("description", vacation.description);
    formData.append("startDate", vacation.startDate);
    formData.append("endDate", vacation.endDate);
    formData.append("price", String(vacation.price));
    if (vacation.image) formData.append("image", vacation.image);
    return formData;
  }
}

export const vacationService = new VacationService();
