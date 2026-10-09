import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VacationModel } from "../models/vacation-model";

// Keeps the list ordered by start date, like the server returns it.
function sortByStartDate(vacations: VacationModel[]): VacationModel[] {
  return vacations.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );
}

// Replaces the whole list.
function initVacations(
  _currentState: VacationModel[],
  action: PayloadAction<VacationModel[]>,
): VacationModel[] {
  return action.payload;
}

// Adds a new vacation in its place by date.
function addVacation(
  currentState: VacationModel[],
  action: PayloadAction<VacationModel>,
): VacationModel[] {
  return sortByStartDate([...currentState, action.payload]);
}

// Replaces an edited vacation, keeping its likes, which the edit response does not include.
function updateVacation(
  currentState: VacationModel[],
  action: PayloadAction<VacationModel>,
): VacationModel[] {
  const newState = currentState.map((v) =>
    v.vacationId === action.payload.vacationId
      ? { ...v, ...action.payload }
      : v,
  );
  return sortByStartDate(newState);
}

// Removes a deleted vacation.
function deleteVacation(
  currentState: VacationModel[],
  action: PayloadAction<number>,
): VacationModel[] {
  return currentState.filter((v) => v.vacationId !== action.payload);
}

// Flips the current user's like and moves the count with it.
function setLike(
  currentState: VacationModel[],
  action: PayloadAction<{ vacationId: number; isLiked: boolean }>,
): VacationModel[] {
  const { vacationId, isLiked } = action.payload;
  return currentState.map((v) =>
    v.vacationId === vacationId
      ? {
          ...v,
          isLiked: isLiked ? 1 : 0,
          likesCount: v.likesCount + (isLiked ? 1 : -1),
        }
      : v,
  );
}

// The vacations list, shared by the vacations page and the report.
export const vacationSlice = createSlice({
  name: "vacation-slice",
  initialState: [] as VacationModel[],
  reducers: {
    initVacations,
    addVacation,
    updateVacation,
    deleteVacation,
    setLike,
  },
});
