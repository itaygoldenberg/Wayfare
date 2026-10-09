import { NavLink } from "react-router-dom";
import "./page404.css";

// Shown for any address that does not exist: a lost flight circling a globe.
export function Page404() {
  return (
    <div className="Page404">
      <div className="scene">
        <span className="code">
          4<span className="globe" />4
        </span>
        <span className="plane" />
      </div>

      <span className="status">Vacation not found</span>
      <h2>This road doesn't lead anywhere</h2>
      <p>The page you are looking for does not exist, or it has moved.</p>

      <NavLink to="/vacations" className="back-button">
        Back to the vacations
      </NavLink>
    </div>
  );
}
