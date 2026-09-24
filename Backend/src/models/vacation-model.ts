import z from "zod";
import { ClientError } from "./client-error";
import { StatusCode } from "./enums";
import { UploadedFile } from "express-fileupload";

const VacationSchema = z.object({
  vacationId: z.number().int().positive().optional(),
  destination: z.string().min(2).max(50),
  description: z.string().min(2).max(65000),
  startDate: z.string().min(10).max(10),
  endDate: z.string().min(10).max(10),
  price: z.number().min(0).max(10000),
  imageName: z.string().optional(),
});

type IVacationModel = z.infer<typeof VacationSchema>;

export class VacationModel implements IVacationModel {
  public vacationId: number;
  public destination: string;
  public description: string;
  public startDate: string;
  public endDate: string;
  public price: number;
  public imageName: string;
  public image: UploadedFile;

  public constructor(vacation: VacationModel) {
    this.vacationId = vacation.vacationId;
    this.destination = vacation.destination;
    this.description = vacation.description;
    this.startDate = vacation.startDate;
    this.endDate = vacation.endDate;
    this.price = vacation.price;
    this.imageName = vacation.imageName;
    this.image = vacation.image;
  }

  public validate(): void {
    const result = VacationSchema.safeParse(this);
    if (!result.success) {
      const message =
        result.error.issues[0].path + ": " + result.error.issues[0].message;
      throw new ClientError(StatusCode.UnprocessableContent, message);
    }
  }
}
