import { UploadedFile } from "express-fileupload";
import { saver } from "smart-saver";
import path from "path";
import { dal } from "../utils/dal";
import { VacationModel } from "../models/vacation-model";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";

// Business logic for vacations.
class VacationService {
  // Returns all vacations by start date, with the like count and whether this user liked each one.
  public async getAllVacations(userId: number): Promise<VacationModel[]> {
    // LEFT JOIN keeps vacations with no likes; COUNT(L.userId) skips their NULL row, so they count 0, not 1.
    // EXISTS checks this user's like on its own, so it is always 1 or 0.
    const sql = `
      SELECT
        V.*,
        COUNT(L.userId) AS likesCount,
        EXISTS(SELECT 1 FROM likes WHERE vacationId = V.vacationId AND userId = ?) AS isLiked
      FROM vacations AS V
      LEFT JOIN likes AS L ON V.vacationId = L.vacationId
      GROUP BY V.vacationId
      ORDER BY V.startDate
    `;
    const vacations = await dal.execute(sql, [userId]);
    return vacations;
  }

  // The shared parts of the queries the MCP tools use: like counts, but no user data and no image names.
  private readonly aiSelect = `
    SELECT V.vacationId, V.destination, V.description, V.startDate, V.endDate, V.price, COUNT(L.userId) AS likesCount
    FROM vacations AS V
    LEFT JOIN likes AS L ON V.vacationId = L.vacationId`;
  private readonly aiGroup = "GROUP BY V.vacationId ORDER BY V.startDate";

  // Every vacation with its like count.
  public async getVacationsForAi(): Promise<VacationModel[]> {
    return await dal.execute(`${this.aiSelect} ${this.aiGroup}`);
  }

  // Vacations running today; CURDATE() is the database's own date.
  public async getActiveVacationsForAi(): Promise<VacationModel[]> {
    return await dal.execute(
      `${this.aiSelect} WHERE CURDATE() BETWEEN V.startDate AND V.endDate ${this.aiGroup}`,
    );
  }

  // Vacations that have not started yet.
  public async getFutureVacationsForAi(): Promise<VacationModel[]> {
    return await dal.execute(
      `${this.aiSelect} WHERE V.startDate > CURDATE() ${this.aiGroup}`,
    );
  }

  // Totals across all vacations, computed by MySQL rather than left to the AI's arithmetic.
  public async getStatistics(): Promise<Record<string, number>> {
    const sql = `
      SELECT COUNT(*) AS vacationsCount, ROUND(AVG(price), 2) AS averagePrice,
             MIN(price) AS lowestPrice, MAX(price) AS highestPrice,
             (SELECT COUNT(*) FROM likes) AS totalLikes
      FROM vacations`;
    const rows = await dal.execute(sql);
    return rows[0];
  }

  // Returns one vacation, or 404.
  public async getOneVacation(vacationId: number): Promise<VacationModel> {
    const sql = "SELECT * FROM vacations WHERE vacationId = ?";
    const vacations = await dal.execute(sql, [vacationId]);
    if (vacations.length === 0)
      throw new ClientError(StatusCode.NotFound, "Vacation not found.");
    return vacations[0];
  }

  // Only real images are accepted: an .html file saved with the images would be served from our own address.
  // The mimetype is a label the sender writes, so the file's extension is checked too.
  private checkImage(image: UploadedFile): void {
    const extension = path.extname(image.name).toLowerCase();
    const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];
    if (!image.mimetype.startsWith("image/") || !allowed.includes(extension))
      throw new ClientError(
        StatusCode.UnprocessableContent,
        "The file must be an image.",
      );
  }

  // Destination and description are in English only, like the AI pages: a Hebrew letter (codes 1424 to 1535) gets a 422.
  private checkEnglish(vacation: VacationModel): void {
    const text = vacation.destination + vacation.description;
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      if (code >= 1424 && code <= 1535)
        throw new ClientError(
          StatusCode.UnprocessableContent,
          "Please write in English only.",
        );
    }
  }

  // Validates, saves the image, and inserts the vacation.
  public async addVacation(vacation: VacationModel): Promise<VacationModel> {
    vacation.validate();
    this.checkEnglish(vacation);
    this.validateDates(vacation, true);

    if (!vacation.image)
      throw new ClientError(
        StatusCode.UnprocessableContent,
        "Image is required.",
      );
    this.checkImage(vacation.image);

    // Save image to disk:
    const imageName = await saver.save(vacation.image);
    vacation.imageName = imageName!;

    const sql =
      "INSERT INTO vacations(destination, description, startDate, endDate, price, imageName) VALUES(?, ?, ?, ?, ?, ?)";
    const values = [
      vacation.destination,
      vacation.description,
      vacation.startDate,
      vacation.endDate,
      vacation.price,
      vacation.imageName,
    ];
    const info = await dal.execute(sql, values);

    vacation.vacationId = info.insertId;
    delete vacation.image;
    return vacation;
  }

  // Validates and updates a vacation, keeping the old image when no new one is sent.
  public async updateVacation(vacation: VacationModel): Promise<VacationModel> {
    vacation.validate();
    this.checkEnglish(vacation);
    this.validateDates(vacation, false);

    const existing = await this.getOneVacation(vacation.vacationId);
    if (vacation.image) this.checkImage(vacation.image);

    // Update image (keeps the old one when no new file was sent):
    const imageName = await saver.update(vacation.image!, existing.imageName);
    vacation.imageName = imageName!;

    const sql =
      "UPDATE vacations SET destination = ?, description = ?, startDate = ?, endDate = ?, price = ?, imageName = ? WHERE vacationId = ?";
    const values = [
      vacation.destination,
      vacation.description,
      vacation.startDate,
      vacation.endDate,
      vacation.price,
      vacation.imageName,
      vacation.vacationId,
    ];
    await dal.execute(sql, values);

    delete vacation.image;
    return vacation;
  }

  // Deletes a vacation and its image file, or 404 if it does not exist.
  public async deleteVacation(vacationId: number): Promise<void> {
    const existing = await this.getOneVacation(vacationId);
    const sql = "DELETE FROM vacations WHERE vacationId = ?";
    await dal.execute(sql, [vacationId]);

    // Delete image:
    await saver.delete(existing.imageName);
  }

  // Checks the date rules; a past start date is blocked when adding but allowed when editing.
  private validateDates(
    vacation: VacationModel,
    blockPastDates: boolean,
  ): void {
    if (vacation.endDate < vacation.startDate)
      throw new ClientError(
        StatusCode.UnprocessableContent,
        "End date cannot be before the start date.",
      );

    if (blockPastDates) {
      const today = new Date().toLocaleDateString("en-CA");
      if (vacation.startDate < today)
        throw new ClientError(
          StatusCode.UnprocessableContent,
          "Start date cannot be in the past.",
        );
    }
  }
}

export const vacationService = new VacationService();
