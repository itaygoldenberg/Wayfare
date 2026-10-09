import z from "zod";
import { ClientError } from "./client-error";
import { StatusCode } from "./enums";
import { UploadedFile } from "express-fileupload";

// Validation rules for a vacation, each with a message the user can understand; trim() makes text of spaces only count as empty,
// and iso.date() accepts only a real calendar date (YYYY-MM-DD), so MySQL never gets one it cannot store.
const VacationSchema = z.object({
  vacationId: z
    .number("Vacation id must be a number.")
    .int("Vacation id must be a whole number.")
    .positive("Vacation id must be positive.")
    .optional(),
  destination: z
    .string("Destination is required.")
    .trim()
    .min(2, "Destination must have at least 2 characters.")
    .max(50, "Destination can have up to 50 characters."),
  description: z
    .string("Description is required.")
    .trim()
    .min(2, "Description must have at least 2 characters.")
    .max(2000, "Description can have up to 2,000 characters."),
  startDate: z.iso.date("Start date must be a valid date."),
  endDate: z.iso.date("End date must be a valid date."),
  price: z
    .number("Price must be a number.")
    .min(0, "Price cannot be negative.")
    .max(10000, "Price cannot be more than 10,000."),
  imageName: z.string().optional(),
});

// The model's shape, derived from the schema.
type IVacationModel = z.infer<typeof VacationSchema>;

// A vacation; likesCount and isLiked are computed by the query, image is the uploaded file.
export class VacationModel implements IVacationModel {
  public vacationId: number;
  public destination: string;
  public description: string;
  public startDate: string;
  public endDate: string;
  public price: number;
  public imageName: string;
  public likesCount: number;
  public isLiked: number;
  public image?: UploadedFile;

  // Copies the fields from the request body or a database row.
  public constructor(vacation: VacationModel) {
    this.vacationId = vacation.vacationId;
    this.destination = vacation.destination;
    this.description = vacation.description;
    this.startDate = vacation.startDate;
    this.endDate = vacation.endDate;
    this.price = vacation.price;
    this.imageName = vacation.imageName;
    this.likesCount = vacation.likesCount;
    this.isLiked = vacation.isLiked;
    this.image = vacation.image;
  }

  // Throws a 422 with the first validation problem found.
  public validate(): void {
    const result = VacationSchema.safeParse(this);
    if (!result.success) {
      const message = result.error.issues[0].message;
      throw new ClientError(StatusCode.UnprocessableContent, message);
    }
    // trim() checked the text without the spaces around it, so it is saved that way too
    this.destination = result.data.destination;
    this.description = result.data.description;
  }
}
