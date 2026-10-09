import express, { Request, Response, NextFunction, Router } from "express";
import path from "path";
import { saver } from "smart-saver";
import { vacationService } from "../services/vacation-service";
import { VacationModel } from "../models/vacation-model";
import { StatusCode } from "../models/enums";
import { securityMiddleware } from "../middleware/security-middleware";
import { cyber } from "../utils/cyber";

// Routes for vacations: reading needs a login, changing needs an admin.
class VacationController {
  public router: Router = express.Router();

  // Registers the routes as soon as the controller is created.
  public constructor() {
    this.registerRoutes();
  }

  // Maps each URL to its access guard and handler.
  private registerRoutes(): void {
    this.router.get(
      "/api/vacations",
      securityMiddleware.verifyLoggedIn,
      this.getAllVacations,
    );
    this.router.get(
      "/api/vacations/:vacationId",
      securityMiddleware.verifyLoggedIn,
      this.getOneVacation,
    );
    this.router.post(
      "/api/vacations",
      securityMiddleware.verifyAdmin,
      this.addVacation,
    );
    this.router.put(
      "/api/vacations/:vacationId",
      securityMiddleware.verifyAdmin,
      this.updateVacation,
    );
    this.router.delete(
      "/api/vacations/:vacationId",
      securityMiddleware.verifyAdmin,
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
      // +"" is 0, so an empty price stays empty and the validation refuses it
      const price = String(request.body.price).trim();
      request.body.price = price === "" ? undefined : +price;
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
      // +"" is 0, so an empty price stays empty and the validation refuses it
      const price = String(request.body.price).trim();
      request.body.price = price === "" ? undefined : +price;
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
  // A missing image is answered with smart-saver's "file not found" picture.
  private getImage(request: Request, response: Response): void {
    // basename keeps only the file name, so "../../app.ts" cannot reach outside the images folder
    const imageName = path.basename(request.params.imageName as string);
    const filePath = saver.getFilePath(imageName);
    response.sendFile(filePath);
  }
}

export const vacationController = new VacationController();
