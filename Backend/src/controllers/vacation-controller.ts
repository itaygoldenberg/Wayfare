import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { vacationService } from "../services/vacation-service";
import { VacationModel } from "../models/vacation-model";
import { StatusCode } from "../models/enums";
import { authMiddleware } from "../middleware/auth-middleware";

class VacationController {
  public readonly router = express.Router();

  public constructor() {
    this.registerRoutes();
  }

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

  private async getAllVacations(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const vacations = await vacationService.getAllVacations();
      response.json(vacations);
    } catch (err: any) {
      next(err);
    }
  }

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
      response.sendFile(absolutePath);
    } catch (err: any) {
      next(err);
    }
  }
}

export const vacationController = new VacationController();
