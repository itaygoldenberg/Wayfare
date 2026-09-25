import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { vacationService } from "../services/vacation-service";
import { VacationModel } from "../models/vacation-model";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";
import { authMiddleware } from "../middleware/auth-middleware";
import { cyber } from "../utils/cyber";

// Routes for vacations: reading needs a login, changing needs an admin.
class VacationController {
  public readonly router = express.Router();

  public constructor() {
    this.registerRoutes();
  }

  // Maps each URL to its access guard and handler.
  private registerRoutes(): void {
    this.router.get(
      "/api/vacations",
      authMiddleware.verifyLoggedIn,
      this.getAllVacations,
    );
    this.router.get(
      "/api/vacations/:vacationId",
      authMiddleware.verifyLoggedIn,
      this.getOneVacation,
    );
    this.router.post(
      "/api/vacations",
      authMiddleware.verifyAdmin,
      this.addVacation,
    );
    this.router.put(
      "/api/vacations/:vacationId",
      authMiddleware.verifyAdmin,
      this.updateVacation,
    );
    this.router.delete(
      "/api/vacations/:vacationId",
      authMiddleware.verifyAdmin,
      this.deleteVacation,
    );
    this.router.get("/api/vacations/images/:imageName", this.getImage);
  }

  // GET /api/vacations - every vacation with likes information for the logged-in user.
  private async getAllVacations(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = cyber.getUserIdFromRequest(request);
      const vacations = await vacationService.getAllVacations(userId);
      response.json(vacations);
    } catch (err: any) {
      next(err);
    }
  }

  // GET /api/vacations/:vacationId - one vacation.
  private async getOneVacation(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const vacationId = +request.params.vacationId;
      const vacation = await vacationService.getOneVacation(vacationId);
      response.json(vacation);
    } catch (err: any) {
      next(err);
    }
  }

  // POST /api/vacations - adds a vacation with its image; form fields arrive as text, so price is converted.
  private async addVacation(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      request.body.image = request.files?.image;
      request.body.price = +request.body.price;
      const vacation = new VacationModel(request.body);
      const added = await vacationService.addVacation(vacation);
      response.status(StatusCode.Created).json(added);
    } catch (err: any) {
      next(err);
    }
  }

  // PUT /api/vacations/:vacationId - updates a vacation; a new image is optional.
  private async updateVacation(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      request.body.vacationId = +request.params.vacationId;
      request.body.image = request.files?.image;
      request.body.price = +request.body.price;
      const vacation = new VacationModel(request.body);
      const updated = await vacationService.updateVacation(vacation);
      response.json(updated);
    } catch (err: any) {
      next(err);
    }
  }

  // DELETE /api/vacations/:vacationId - deletes a vacation and, by cascade, its likes.
  private async deleteVacation(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await vacationService.deleteVacation(+request.params.vacationId);
      response.sendStatus(StatusCode.NoContent);
    } catch (err: any) {
      next(err);
    }
  }

  // GET /api/vacations/images/:imageName - open to all, because an <img> tag cannot send a token.
  private async getImage(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const imageName = request.params.imageName as string;
      const absolutePath = path.join(
        __dirname,
        "..",
        "assets",
        "images",
        imageName,
      );
      if (!fs.existsSync(absolutePath))
        throw new ClientError(
          StatusCode.NotFound,
          `Image ${imageName} not found.`,
        );
      response.sendFile(absolutePath);
    } catch (err: any) {
      next(err);
    }
  }
}

export const vacationController = new VacationController();
