import express, { Request, Response, NextFunction } from "express";
import { likeService } from "../services/like-service";
import { cyber } from "../utils/cyber";
import { authMiddleware } from "../middleware/auth-middleware";
import { StatusCode } from "../models/enums";

class LikeController {
  public readonly router = express.Router();

  public constructor() {
    this.registerRoutes();
  }

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
