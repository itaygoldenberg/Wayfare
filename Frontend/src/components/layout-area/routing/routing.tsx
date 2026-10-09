import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Register } from "../../user-area/register/register";
import { Login } from "../../user-area/login/login";
import { VacationList } from "../../vacation-area/vacation-list/vacation-list";
import { AddVacation } from "../../vacation-area/add-vacation/add-vacation";
import { EditVacation } from "../../vacation-area/edit-vacation/edit-vacation";
import { AiAdvisor } from "../../ai-area/ai-advisor/ai-advisor";
import { AskWayfare } from "../../ai-area/ask-wayfare/ask-wayfare";
import { Page404 } from "../../pages-area/page404/page404";
import { Spinner } from "../../shared-area/spinner/spinner";

// The report pulls in the chart library, so it is loaded only when opened.
const ReportLazy = lazy(() =>
  import("../../report-area/report/report").then((module) => ({
    default: module.Report,
  })),
);

// Maps each address to its page.
export function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/vacations" />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/vacations" element={<VacationList />} />
      <Route path="/vacations/new" element={<AddVacation />} />
      <Route path="/vacations/edit/:vacationId" element={<EditVacation />} />
      <Route path="/ai" element={<AiAdvisor />} />
      <Route path="/ask" element={<AskWayfare />} />
      <Route
        path="/reports"
        element={
          <Suspense fallback={<Spinner />}>
            <ReportLazy />
          </Suspense>
        }
      />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}
