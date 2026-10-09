import { configureStore } from "@reduxjs/toolkit";
import { AppState } from "./app-state";
import { userSlice } from "./user-slice";
import { vacationSlice } from "./vacation-slice";

// The global state, one slice per part of it.
export const store = configureStore<AppState>({
  reducer: {
    user: userSlice.reducer,
    vacations: vacationSlice.reducer,
  },
});
