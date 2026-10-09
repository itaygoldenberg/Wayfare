import { dal } from "../utils/dal";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";
import { vacationService } from "./vacation-service";

// Business logic for likes.
class LikeService {
  // Adds a like; 401 if the user no longer exists, 404 if the vacation does not exist, 409 if this user already liked it.
  public async addLike(userId: number, vacationId: number): Promise<void> {
    // A token can outlive its user (for example after the database was reset), so the user is checked first
    if (!(await this.userExists(userId)))
      throw new ClientError(StatusCode.Unauthorized, "You are not logged in.");

    await vacationService.getOneVacation(vacationId);

    if (await this.isLiked(userId, vacationId))
      throw new ClientError(
        StatusCode.Conflict,
        "You already liked this vacation.",
      );

    const sql = "INSERT INTO likes(userId, vacationId) VALUES(?, ?)";
    try {
      await dal.execute(sql, [userId, vacationId]);
    } catch (err: any) {
      // Two requests at the same moment can both pass isLiked; the primary key lets only one in
      if (await this.isLiked(userId, vacationId))
        throw new ClientError(
          StatusCode.Conflict,
          "You already liked this vacation.",
        );
      throw err;
    }
  }

  // Removes a like; succeeds even if there was none.
  public async removeLike(userId: number, vacationId: number): Promise<void> {
    const sql = "DELETE FROM likes WHERE userId = ? AND vacationId = ?";
    await dal.execute(sql, [userId, vacationId]);
  }

  // Checks whether the user from the token still exists in the database.
  private async userExists(userId: number): Promise<boolean> {
    const sql = "SELECT COUNT(*) AS count FROM users WHERE userId = ?";
    const result = await dal.execute(sql, [userId]);
    return result[0].count > 0;
  }

  // Checks whether this user already liked the vacation.
  private async isLiked(userId: number, vacationId: number): Promise<boolean> {
    const sql =
      "SELECT COUNT(*) AS count FROM likes WHERE userId = ? AND vacationId = ?";
    const result = await dal.execute(sql, [userId, vacationId]);
    return result[0].count > 0;
  }
}

export const likeService = new LikeService();
