import { NavLink } from "react-router-dom";
import { Menu } from "../menu/menu";
import { AuthMenu } from "../../user-area/auth-menu/auth-menu";
import logo from "../../../assets/images/wayfare-logo.webp";
import "./header.css";

// The top bar: the logo, the main menu and the user's corner.
export function Header() {
  return (
    <div className="Header">
      <NavLink to="/vacations" className="brand">
        <img src={logo} alt="Wayfare" className="brand-logo" />
      </NavLink>

      <Menu />

      <AuthMenu />
    </div>
  );
}
