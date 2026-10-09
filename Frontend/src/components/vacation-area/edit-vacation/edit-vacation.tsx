import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { VacationModel } from "../../../models/vacation-model";
import { vacationService } from "../../../services/vacation-service";
import { aiService } from "../../../services/ai-service";
import { useIsAdmin } from "../../../hooks/use-is-admin";
import { appConfig } from "../../../utils/app-config";
import { notify } from "../../../utils/notify";

// Admin form for an existing vacation; past dates are allowed here, and a new image is optional.
export function EditVacation() {
  const isAdmin = useIsAdmin();
  const { register, handleSubmit, watch, reset } = useForm<VacationModel>();
  const navigate = useNavigate();
  const params = useParams();
  const vacationId = Number(params.vacationId);
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [warned, setWarned] = useState(false);
  const startDate = watch("startDate");

  useEffect(() => {
    if (!isAdmin) return;
    vacationService
      .getOneVacation(vacationId)
      .then((vacation) => {
        reset({ ...vacation });
        setPreview(vacationService.getImageUrl(vacation.imageName));
      })
      .catch((err) => {
        notify.error(err);
        navigate("/vacations");
      });
  }, [isAdmin, vacationId, reset, navigate]);

  // Stops a Hebrew letter from being typed, with the same check as the AI pages; the message shows once, not on every key.
  function blockHebrew(
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void {
    if (!aiService.hasHebrew(event.key)) return;
    event.preventDefault();
    if (!warned) notify.error(aiService.englishOnly);
    setWarned(true);
  }

  // Swaps the preview, and the shown file name, to a newly chosen image.
  function showPreview(event: ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setFileName(file.name);
  }

  // Sends the changes; with no new file the server keeps the current image.
  async function send(vacation: VacationModel): Promise<void> {
    try {
      vacation.vacationId = vacationId;
      vacation.image = (vacation.image as unknown as FileList)?.[0];
      await vacationService.updateVacation(vacation);
      notify.success("Vacation updated.");
      navigate("/vacations");
    } catch (err: any) {
      notify.error(err);
    }
  }

  if (!isAdmin) return null;

  return (
    <div className="form-card wide">
      <NavLink to="/vacations" className="back-link">
        Back to vacations
      </NavLink>
      <h2 className="page-title">Edit vacation</h2>

      <form onSubmit={handleSubmit(send)}>
        <label htmlFor="destination">Destination</label>
        <input
          id="destination"
          type="text"
          {...register("destination")}
          onKeyDown={blockHebrew}
          placeholder="In English, e.g. Lisbon, Portugal"
          required
          minLength={2}
          maxLength={50}
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          {...register("description")}
          onKeyDown={blockHebrew}
          placeholder="In English"
          required
          minLength={2}
          maxLength={2000}
        />

        <div className="date-row">
          <div>
            <label htmlFor="startDate">Start date</label>
            <input
              id="startDate"
              type="date"
              {...register("startDate")}
              required
            />
          </div>
          <div>
            <label htmlFor="endDate">End date</label>
            <input
              id="endDate"
              type="date"
              {...register("endDate")}
              required
              min={startDate}
            />
          </div>
        </div>

        <label htmlFor="price">Price ($)</label>
        <input
          id="price"
          type="number"
          {...register("price")}
          required
          min={0}
          max={appConfig.maxPrice}
          step={0.01}
        />

        <label htmlFor="image">Image</label>
        <div className="file-picker">
          <input
            id="image"
            type="file"
            accept="image/*"
            {...register("image", { onChange: showPreview })}
          />
          <span className="file-button">Choose image</span>
          <span className="file-name">{fileName || "Current image"}</span>
        </div>
        <span className="hint">Leave empty to keep the current image.</span>
        {preview && (
          <img
            src={preview}
            alt="The vacation's image"
            className="image-preview"
          />
        )}

        <button className="icon-save">Save changes</button>
      </form>
    </div>
  );
}
