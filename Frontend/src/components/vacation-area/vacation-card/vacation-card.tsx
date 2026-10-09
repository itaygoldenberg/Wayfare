import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { VacationModel } from "../../../models/vacation-model";
import { vacationService } from "../../../services/vacation-service";
import { dateUtil } from "../../../utils/date-util";
import { notify } from "../../../utils/notify";
import { Flag } from "../../shared-area/flag/flag";
import "./vacation-card.css";

// What a card needs to know.
class VacationCardProps {
  public vacation: VacationModel;
  public isAdmin: boolean;
}

// One vacation: users get the like button, the admin gets edit and delete instead.
export function VacationCard(props: VacationCardProps) {
  const { vacation, isAdmin } = props;
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  // Likes or unlikes; the button is disabled until the server answers, so a double click cannot send two.
  async function toggleLike(): Promise<void> {
    try {
      setBusy(true);
      await vacationService.toggleLike(vacation);
    } catch (err: any) {
      notify.error(err);
    } finally {
      setBusy(false);
    }
  }

  // Deletes after the admin confirms.
  async function deleteVacation(): Promise<void> {
    const sure = confirm(`Delete the vacation to ${vacation.destination}?`);
    if (!sure) return;
    try {
      await vacationService.deleteVacation(vacation.vacationId);
      notify.success("Vacation deleted.");
    } catch (err: any) {
      notify.error(err);
    }
  }

  return (
    <div className="VacationCard">
      <div className="card-image">
        <img
          src={vacationService.getImageUrl(vacation.imageName)}
          alt={vacation.destination}
          loading="lazy"
        />

        {!isAdmin && (
          <button
            className={vacation.isLiked ? "like liked" : "like"}
            onClick={toggleLike}
            disabled={busy}
          >
            {vacation.isLiked ? "♥" : "♡"} {vacation.likesCount}
          </button>
        )}

        {isAdmin && (
          <div className="admin-actions">
            <button
              className="edit"
              onClick={() => navigate("/vacations/edit/" + vacation.vacationId)}
            >
              Edit
            </button>
            <button className="delete" onClick={deleteVacation}>
              Delete
            </button>
          </div>
        )}

        <span className="price">${vacation.price.toLocaleString()}</span>
      </div>

      <div className="card-body">
        <h3>
          {vacation.destination}
          <Flag place={vacation.destination} />
        </h3>
        <span className="dates">
          {dateUtil.format(vacation.startDate)} –{" "}
          {dateUtil.format(vacation.endDate)}
        </span>
        <p>{vacation.description}</p>
      </div>
    </div>
  );
}
