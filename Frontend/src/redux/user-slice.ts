import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserModel } from "../models/user-model";

// Saves the logged-in user.
function initUser(
  _currentState: UserModel,
  action: PayloadAction<UserModel>,
): UserModel {
  return action.payload;
}

// Clears the user on logout.
function logoutUser(): UserModel {
  return null!;
}

// The logged-in user, or null for a guest.
export const userSlice = createSlice({
  name: "user-slice",
  initialState: null! as UserModel,
  reducers: { initUser, logoutUser },
});
