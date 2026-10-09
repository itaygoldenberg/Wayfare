import { VacationFilter } from "../../../models/enums";
import "./vacation-filters.css";

// What the filter buttons need to know.
class VacationFiltersProps {
  public filter: VacationFilter;
  public onChange: (filter: VacationFilter) => void;
}

// The label shown on each filter button.
const labels = [
  { filter: VacationFilter.All, label: "All vacations" },
  { filter: VacationFilter.Liked, label: "My likes" },
  { filter: VacationFilter.Active, label: "Happening now" },
  { filter: VacationFilter.Future, label: "Coming up" },
];

// The four filters as one segmented control; data-index tells the CSS which slot the highlight slides to.
export function VacationFilters(props: VacationFiltersProps) {
  const index = labels.findIndex((l) => l.filter === props.filter);

  return (
    <div className="VacationFilters" data-index={index}>
      {labels.map((l) => (
        <button
          key={l.filter}
          className={props.filter === l.filter ? "selected" : ""}
          onClick={() => props.onChange(l.filter)}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
