// Helpers for the "YYYY-MM-DD" dates the server sends.
class DateUtil {
  // Today's local date as "YYYY-MM-DD" - the format date inputs and the server use.
  public today(): string {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${now.getFullYear()}-${month}-${day}`;
  }

  // Turns "2026-03-14" into "14/03/2026" for display.
  public format(date: string): string {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  }
}

export const dateUtil = new DateUtil();
