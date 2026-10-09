import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppState } from "../../../redux/app-state";
import { VacationModel } from "../../../models/vacation-model";
import { vacationService } from "../../../services/vacation-service";
import { reportService } from "../../../services/report-service";
import { useIsAdmin } from "../../../hooks/use-is-admin";
import { notify } from "../../../utils/notify";
import { appConfig } from "../../../utils/app-config";
import { Spinner } from "../../shared-area/spinner/spinner";
import { LikesTooltip } from "../likes-tooltip/likes-tooltip";
import { BarValue } from "../bar-value/bar-value";
import "./report.css";

// Admin report: three headline figures, likes per destination as a bar chart, and the CSV download.
// Every color of the chart is set in report.css, through the class names recharts gives its SVG parts.
export function Report() {
  const isAdmin = useIsAdmin();
  const vacations = useSelector<AppState, VacationModel[]>(
    (state) => state.vacations,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;
    vacationService
      .getAllVacations()
      .catch((err) => notify.error(err))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  if (!isAdmin) return null;
  if (loading) return <Spinner />;

  const chartData = reportService.getChartData(vacations);
  const summary = reportService.getSummary(vacations);

  return (
    <div className="Report">
      <div className="report-header">
        <div>
          <h2 className="page-title">Likes report</h2>
          <p className="page-subtitle">
            {summary.totalLikes} likes across {vacations.length} vacations
          </p>
        </div>
        <a
          className="button-link"
          href={reportService.getCsvUrl(vacations)}
          download={appConfig.csvFileName}
        >
          Download CSV
        </a>
      </div>

      <div className="stats">
        <div className="stat total">
          <span className="stat-icon" />
          <span className="stat-label">Total likes</span>
          <span className="stat-value">{summary.totalLikes}</span>
        </div>
        <div className="stat favorite">
          <span className="stat-icon" />
          <span className="stat-label">Most liked</span>
          <span className="stat-value text">
            {summary.favorite?.destination}
          </span>
          <span className="stat-note">
            {summary.favorite?.likesCount} likes
          </span>
        </div>
        <div className="stat liked">
          <span className="stat-icon" />
          <span className="stat-label">Vacations with likes</span>
          <span className="stat-value">
            {summary.likedCount}
            <small> / {vacations.length}</small>
          </span>
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-head">
          <h3>Likes per destination</h3>
          <span>Most liked first</span>
        </div>
        <div className="chart-scroll">
          <ResponsiveContainer width="100%" height={380} minWidth={760}>
            <BarChart
              data={chartData}
              margin={{ top: 28, right: 8, left: -8, bottom: 0 }}
              barCategoryGap="28%"
            >
              {/* Paints that report.css uses: one color spectrum across the whole chart (so each bar takes its own slice),
                  a mask that fades every bar toward its base, and the soft glow of the hover beam */}
              <defs>
                <linearGradient
                  id="spectrum-gradient"
                  gradientUnits="userSpaceOnUse"
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="0"
                >
                  <stop offset="0%" className="spectrum-sky" />
                  <stop offset="35%" className="spectrum-indigo" />
                  <stop offset="70%" className="spectrum-violet" />
                  <stop offset="100%" className="spectrum-pink" />
                </linearGradient>
                <linearGradient id="fade-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" className="fade-top" />
                  <stop offset="100%" className="fade-bottom" />
                </linearGradient>
                <mask id="bar-fade" maskContentUnits="objectBoundingBox">
                  <rect width="1" height="1" className="fade-fill" />
                </mask>
                <linearGradient id="beam-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" className="beam-top" />
                  <stop offset="100%" className="beam-bottom" />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="destination"
                interval={0}
                tickFormatter={(destination: string) =>
                  destination.split(",")[0]
                }
                tickLine={false}
                tickMargin={10}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Tooltip
                content={<LikesTooltip total={summary.totalLikes} />}
                cursor={{ radius: 12 }}
              />
              <ReferenceLine
                y={summary.average}
                label={{
                  value: "Average " + summary.average.toFixed(1),
                  position: "insideTopRight",
                }}
              />
              <Bar
                dataKey="likesCount"
                name="Likes"
                radius={[10, 10, 3, 3]}
                maxBarSize={40}
                minPointSize={4}
                animationDuration={1100}
              >
                <LabelList dataKey="likesCount" content={<BarValue />} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
