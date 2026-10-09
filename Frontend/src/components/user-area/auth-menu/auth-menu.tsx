import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "../../../redux/app-state";
import { UserModel } from "../../../models/user-model";
import { Role } from "../../../models/enums";
import { userService } from "../../../services/user-service";
import { notify } from "../../../utils/notify";
import "./auth-menu.css";

// The user's corner of the header: their full name and logout, or register and login for guests.
export function AuthMenu() {
  const user = useSelector<AppState, UserModel>((state) => state.user);
  const navigate = useNavigate();

  // Logs out and returns to the login page.
  function logout(): void {
    userService.logout();
    notify.success("See you next trip!");
    navigate("/login");
  }

  if (!user) {
    return (
      <div className="AuthMenu">
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/register" className="register-link">
          Register
        </NavLink>
      </div>
    );
  }

  return (
    <div className="AuthMenu">
      <span className="greeting">
        <span className="hello">Hello,</span>
        <strong>
          {user.firstName} {user.lastName}
        </strong>
        {user.role === Role.Admin && <span className="admin-badge">Admin</span>}
      </span>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
