import { dal } from "../utils/dal";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";

class LikeService {
  public async addLike(userId: number, vacationId: number): Promise<void> {
    if (await this.isLiked(userId, vacationId))
      throw new ClientError(
        StatusCode.Conflict,
        "You already liked this vacation.",
      );

    const sql = "INSERT INTO likes(userId, vacationId) VALUES(?, ?)";
    await dal.execute(sql, [userId, vacationId]);
  }

  public async removeLike(userId: number, vacationId: number): Promise<void> {
    const sql = "DELETE FROM likes WHERE userId = ? AND vacationId = ?";
    await dal.execute(sql, [userId, vacationId]);
  }

  private async isLiked(userId: number, vacationId: number): Promise<boolean> {
    const sql =
      "SELECT COUNT(*) AS count FROM likes WHERE userId = ? AND vacationId = ?";
    const result = await dal.execute(sql, [userId, vacationId]);
    return result[0].count > 0;
  }
}

export const likeService = new LikeService();
