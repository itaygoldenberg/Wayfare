import express, { Request, Response, NextFunction } from "express";
import { likeService } from "../services/like-service";
import { cyber } from "../utils/cyber";
import { authMiddleware } from "../middleware/auth-middleware";
import { StatusCode } from "../models/enums";

// Routes for liking and unliking a vacation.
class LikeController {
  public readonly router = express.Router();

  public constructor() {
    this.registerRoutes();
  }

  // Maps each URL to its handler.
  private registerRoutes(): void {
    this.router.post(
      "/api/vacations/:vacationId/like",
      authMiddleware.verifyLoggedIn,
      this.addLike,
    );
    this.router.delete(
      "/api/vacations/:vacationId/like",
      authMiddleware.verifyLoggedIn,
      this.removeLike,
    );
  }

  // POST /api/vacations/:vacationId/like - the user id comes from the token, never from the body.
  private async addLike(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = cyber.getUserIdFromRequest(request);
      const vacationId = +request.params.vacationId;
      await likeService.addLike(userId, vacationId);
      response.sendStatus(StatusCode.Created);
    } catch (err: any) {
      next(err);
    }
  }

  // DELETE /api/vacations/:vacationId/like - removes the like.
  private async removeLike(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = cyber.getUserIdFromRequest(request);
      const vacationId = +request.params.vacationId;
      await likeService.removeLike(userId, vacationId);
      response.sendStatus(StatusCode.NoContent);
    } catch (err: any) {
      next(err);
    }
  }
}

export const likeController = new LikeController();
