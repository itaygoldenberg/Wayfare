import { VacationModel } from "../models/vacation-model";
import { ReportSummaryModel } from "../models/report-summary-model";

// The admin's likes report and its CSV export.
class ReportService {
  // Builds a CSV of every destination and its likes, as an address a download link can point to.
  public getCsvUrl(vacations: VacationModel[]): string {
    const rows = vacations.map(
      (v) => this.toCsvValue(v.destination) + "," + v.likesCount,
    );
    const csv = ["Destination,Likes", ...rows].join("\r\n");

    // The file itself lives inside the address; the byte-order mark lets Excel read it as UTF-8.
    return "data:text/csv;charset=utf-8," + encodeURIComponent("\uFEFF" + csv);
  }

  // The chart's bars, most liked first; a copy, so the vacations page keeps its date order.
  public getChartData(vacations: VacationModel[]): VacationModel[] {
    return [...vacations].sort((a, b) => b.likesCount - a.likesCount);
  }

  // The three figures shown above the chart, and the average the chart marks with a line.
  public getSummary(vacations: VacationModel[]): ReportSummaryModel {
    const summary = new ReportSummaryModel();
    summary.totalLikes = 0;
    for (const v of vacations) {
      summary.totalLikes += v.likesCount;
    }
    summary.likedCount = vacations.filter((v) => v.likesCount > 0).length;
    summary.favorite = this.getChartData(vacations)[0];
    summary.average =
      vacations.length > 0 ? summary.totalLikes / vacations.length : 0;
    return summary;
  }

  // Quotes a value, because destinations like "Rome, Italy" contain the separator itself.
  private toCsvValue(value: string): string {
    return '"' + value.split('"').join('""') + '"';
  }
}

export const reportService = new ReportService();
