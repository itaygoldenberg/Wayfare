import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "../../../redux/app-state";
import { UserModel } from "../../../models/user-model";
import { VacationModel } from "../../../models/vacation-model";
import { Role } from "../../../models/enums";
import { vacationService } from "../../../services/vacation-service";
import { reportService } from "../../../services/report-service";
import { appConfig } from "../../../utils/app-config";
import { notify } from "../../../utils/notify";
import "./menu.css";

// The main menu; its links depend on who is logged in.
export function Menu() {
  const user = useSelector<AppState, UserModel>((state) => state.user);
  const vacations = useSelector<AppState, VacationModel[]>(
    (state) => state.vacations,
  );
  const isAdmin = user?.role === Role.Admin;

  // The CSV link needs the vacations, whichever page the admin opened first.
  useEffect(() => {
    if (!isAdmin) return;
    vacationService.getAllVacations().catch((err) => notify.error(err));
  }, [isAdmin]);

  if (!user) return <nav className="Menu" />;

  return (
    <nav className="Menu">
      <NavLink to="/vacations" end>
        Vacations
      </NavLink>

      {user.role === Role.User && (
        <>
          <NavLink to="/ai">AI Advisor</NavLink>
          <NavLink to="/ask">Ask Wayfare</NavLink>
        </>
      )}

      {user.role === Role.Admin && (
        <>
          <NavLink to="/vacations/new">Add Vacation</NavLink>
          <NavLink to="/reports">Reports</NavLink>
          <a
            className="menu-button"
            href={reportService.getCsvUrl(vacations)}
            download={appConfig.csvFileName}
          >
            Download CSV
          </a>
        </>
      )}
    </nav>
  );
}
