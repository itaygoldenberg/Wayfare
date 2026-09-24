import path from "path";
import crypto from "crypto";
import { UploadedFile } from "express-fileupload";
import { dal } from "../utils/dal";
import { VacationModel } from "../models/vacation-model";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";

class VacationService {
  public async getAllVacations(): Promise<VacationModel[]> {
    const sql = "SELECT * FROM vacations ORDER BY startDate";
    const vacations = await dal.execute(sql);
    return vacations;
  }

  public async getOneVacation(vacationId: number): Promise<VacationModel> {
    const sql = "SELECT * FROM vacations WHERE vacationId = ?";
    const vacations = await dal.execute(sql, [vacationId]);
    if (vacations.length === 0)
      throw new ClientError(
        StatusCode.NotFound,
        `Vacation ${vacationId} not found.`,
      );
    return vacations[0];
  }

  private async saveImage(image: UploadedFile): Promise<string> {
    const extension = image.name.substring(image.name.lastIndexOf("."));
    const imageName = crypto.randomUUID() + extension;
    const absolutePath = path.join(
      __dirname,
      "..",
      "assets",
      "images",
      imageName,
    );
    await image.mv(absolutePath);
    return imageName;
  }
  public async addVacation(vacation: VacationModel): Promise<VacationModel> {
    vacation.validate();
    this.validateDates(vacation, true);

    if (!vacation.image)
      throw new ClientError(
        StatusCode.UnprocessableContent,
        "Image is required.",
      );
    vacation.imageName = await this.saveImage(vacation.image);

    const sql =
      "INSERT INTO vacations(destination, description, startDate, endDate, price, imageName) VALUES(?, ?, ?, ?, ?, ?)";
    const values = [
      vacation.destination,
      vacation.description,
      vacation.startDate,
      vacation.endDate,
      vacation.price,
      vacation.imageName,
    ];
    const info = await dal.execute(sql, values);

    vacation.vacationId = info.insertId;
    return vacation;
  }

  public async updateVacation(vacation: VacationModel): Promise<VacationModel> {
    vacation.validate();
    this.validateDates(vacation, false);

    const existing = await this.getOneVacation(vacation.vacationId);

    vacation.imageName = vacation.image
      ? await this.saveImage(vacation.image)
      : existing.imageName;

    const sql =
      "UPDATE vacations SET destination = ?, description = ?, startDate = ?, endDate = ?, price = ?, imageName = ? WHERE vacationId = ?";
    const values = [
      vacation.destination,
      vacation.description,
      vacation.startDate,
      vacation.endDate,
      vacation.price,
      vacation.imageName,
      vacation.vacationId,
    ];
    await dal.execute(sql, values);

    return vacation;
  }

  public async deleteVacation(vacationId: number): Promise<void> {
    await this.getOneVacation(vacationId);
    const sql = "DELETE FROM vacations WHERE vacationId = ?";
    await dal.execute(sql, [vacationId]);
  }

  private validateDates(
    vacation: VacationModel,
    blockPastDates: boolean,
  ): void {
    if (vacation.endDate < vacation.startDate)
      throw new ClientError(
        StatusCode.UnprocessableContent,
        "End date cannot be before the start date.",
      );

    if (blockPastDates) {
      const today = new Date().toISOString().substring(0, 10);
      if (vacation.startDate < today)
        throw new ClientError(
          StatusCode.UnprocessableContent,
          "Start date cannot be in the past.",
        );
    }
  }
}

export const vacationService = new VacationService();
