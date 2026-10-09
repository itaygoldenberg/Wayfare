import { ChangeEvent, KeyboardEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { VacationModel } from "../../../models/vacation-model";
import { vacationService } from "../../../services/vacation-service";
import { aiService } from "../../../services/ai-service";
import { useIsAdmin } from "../../../hooks/use-is-admin";
import { appConfig } from "../../../utils/app-config";
import { dateUtil } from "../../../utils/date-util";
import { notify } from "../../../utils/notify";

// Admin form for a new vacation; past dates and an end before the start are blocked by the inputs themselves.
export function AddVacation() {
  const isAdmin = useIsAdmin();
  const { register, handleSubmit, watch } = useForm<VacationModel>();
  const navigate = useNavigate();
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [warned, setWarned] = useState(false);
  const today = dateUtil.today();
  const startDate = watch("startDate");

  // Stops a Hebrew letter from being typed, with the same check as the AI pages; the message shows once, not on every key.
  function blockHebrew(
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void {
    if (!aiService.hasHebrew(event.key)) return;
    event.preventDefault();
    if (!warned) notify.error(aiService.englishOnly);
    setWarned(true);
  }

  // Shows the chosen image, and its name, before it is uploaded.
  function showPreview(event: ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    setPreview(file ? URL.createObjectURL(file) : "");
    setFileName(file ? file.name : "");
  }

  // Sends the vacation with its image and returns to the list.
  async function send(vacation: VacationModel): Promise<void> {
    try {
      vacation.image = (vacation.image as unknown as FileList)[0];
      await vacationService.addVacation(vacation);
      notify.success("Vacation added.");
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
      <h2 className="page-title">Add a vacation</h2>

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
              min={today}
            />
          </div>
          <div>
            <label htmlFor="endDate">End date</label>
            <input
              id="endDate"
              type="date"
              {...register("endDate")}
              required
              min={startDate || today}
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
            required
          />
          <span className="file-button">Choose image</span>
          <span className="file-name">{fileName || "No image chosen"}</span>
        </div>
        {preview && (
          <img
            src={preview}
            alt="Preview of the chosen image"
            className="image-preview"
          />
        )}

        <button className="icon-add">Add vacation</button>
      </form>
    </div>
  );
}
