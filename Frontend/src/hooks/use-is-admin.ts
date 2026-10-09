import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppState } from "../redux/app-state";
import { UserModel } from "../models/user-model";
import { Role } from "../models/enums";
import { notify } from "../utils/notify";

// Sends guests to the login page and regular users back to the vacations page.
export function useIsAdmin(): boolean {
  const user = useSelector<AppState, UserModel>((state) => state.user);
  const navigate = useNavigate();
  const isAdmin = user?.role === Role.Admin;

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (!isAdmin) {
      notify.error("This page is for admins only.");
      navigate("/vacations");
    }
  }, [user, isAdmin, navigate]);

  return isAdmin;
}
