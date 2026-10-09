import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { AppState } from "../../../redux/app-state";
import { VacationModel } from "../../../models/vacation-model";
import { Role, VacationFilter } from "../../../models/enums";
import { vacationService } from "../../../services/vacation-service";
import { useIsUser } from "../../../hooks/use-is-user";
import { appConfig } from "../../../utils/app-config";
import { notify } from "../../../utils/notify";
import { VacationCard } from "../vacation-card/vacation-card";
import { VacationFilters } from "../vacation-filters/vacation-filters";
import { Pagination } from "../pagination/pagination";
import { Spinner } from "../../shared-area/spinner/spinner";
import "./vacation-list.css";

// The vacations page: filters for users, add/edit/delete for the admin, 9 cards per page.
export function VacationList() {
  const user = useIsUser();
  const vacations = useSelector<AppState, VacationModel[]>(
    (state) => state.vacations,
  );
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<VacationFilter>(VacationFilter.All);
  const [page, setPage] = useState(1);
  const isAdmin = user?.role === Role.Admin;

  useEffect(() => {
    if (!user) return;
    vacationService
      .getAllVacations()
      .catch((err) => notify.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  // Changes the filter and starts again from the first page.
  function changeFilter(newFilter: VacationFilter): void {
    setFilter(newFilter);
    setPage(1);
  }

  if (!user) return null;
  if (loading) return <Spinner />;

  const filtered = vacationService.filterVacations(vacations, filter);
  const pageCount = Math.max(
    1,
    Math.ceil(filtered.length / appConfig.vacationsPerPage),
  );
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * appConfig.vacationsPerPage;
  const pageVacations = filtered.slice(
    start,
    start + appConfig.vacationsPerPage,
  );

  return (
    <div className="VacationList">
      <div className="list-header">
        <div>
          <h2 className="page-title">
            {isAdmin ? "Manage vacations" : "Find your next escape"}
          </h2>
          <p className="page-subtitle">
            {filtered.length} {filtered.length === 1 ? "vacation" : "vacations"}
            {filter !== VacationFilter.All && " match this filter"}
          </p>
        </div>

        {isAdmin && (
          <NavLink to="/vacations/new" className="add-button">
            Add vacation
          </NavLink>
        )}
      </div>

      {!isAdmin && <VacationFilters filter={filter} onChange={changeFilter} />}

      {pageVacations.length === 0 ? (
        <p className="empty">No vacations here yet - try another filter.</p>
      ) : (
        <div className="cards">
          {pageVacations.map((v) => (
            <VacationCard key={v.vacationId} vacation={v} isAdmin={isAdmin} />
          ))}
        </div>
      )}

      <Pagination page={currentPage} pageCount={pageCount} onChange={setPage} />
    </div>
  );
}
