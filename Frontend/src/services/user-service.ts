import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { UserModel } from "../models/user-model";
import { CredentialsModel } from "../models/credentials-model";
import { appConfig } from "../utils/app-config";
import { store } from "../redux/store";
import { userSlice } from "../redux/user-slice";
import { vacationSlice } from "../redux/vacation-slice";

// Registration, login and logout; the token is kept in localStorage so a refresh keeps the user logged in.
class UserService {
  // Restores the user from a saved token after a page refresh, unless the token has expired.
  public constructor() {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const container = jwtDecode<{ user: UserModel; exp: number }>(token);
      if (container.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        return;
      }
      store.dispatch(userSlice.actions.initUser(container.user));
    } catch {
      localStorage.removeItem("token");
    }
  }

  // Creates a new user and logs them in.
  public async register(user: UserModel): Promise<void> {
    const response = await axios.post<string>(appConfig.registerUrl, user);
    this.startSession(response.data);
  }

  // Logs in an existing user.
  public async login(credentials: CredentialsModel): Promise<void> {
    const response = await axios.post<string>(appConfig.loginUrl, credentials);
    this.startSession(response.data);
  }

  // Forgets the user and their vacations list.
  public logout(): void {
    localStorage.removeItem("token");
    store.dispatch(userSlice.actions.logoutUser());
    store.dispatch(vacationSlice.actions.initVacations([]));
  }

  // Saves the token and the user in it; clears any vacations loaded for a previous user,
  // because isLiked belongs to whoever was logged in when they were fetched.
  private startSession(token: string): void {
    localStorage.setItem("token", token);
    const user = jwtDecode<{ user: UserModel }>(token).user;
    store.dispatch(vacationSlice.actions.initVacations([]));
    store.dispatch(userSlice.actions.initUser(user));
  }
}

export const userService = new UserService();
