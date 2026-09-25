import z from "zod";
import { ClientError } from "./client-error";
import { StatusCode } from "./enums";
import { UploadedFile } from "express-fileupload";

// Validation rules for a vacation.
const VacationSchema = z.object({
  vacationId: z.number().int().positive().optional(),
  destination: z.string().min(2).max(50),
  description: z.string().min(2).max(65000),
  startDate: z.string().min(10).max(10),
  endDate: z.string().min(10).max(10),
  price: z.number().min(0).max(10000),
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
  public image: UploadedFile;

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
      const message =
        result.error.issues[0].path + ": " + result.error.issues[0].message;
      throw new ClientError(StatusCode.UnprocessableContent, message);
    }
  }
}
