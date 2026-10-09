import { VacationModel } from "./vacation-model";

// The headline figures of the likes report.
export class ReportSummaryModel {
  public totalLikes: number;
  public likedCount: number;
  public favorite: VacationModel;
  public average: number;
}
