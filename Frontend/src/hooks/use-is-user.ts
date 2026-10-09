import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppState } from "../redux/app-state";
import { UserModel } from "../models/user-model";

// Sends guests to the login page; also fires on logout, because it watches the user.
export function useIsUser(): UserModel {
  const user = useSelector<AppState, UserModel>((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  return user;
}
