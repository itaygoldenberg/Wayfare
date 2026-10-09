import express, { Request, Response, NextFunction, Router } from "express";
import { UserModel } from "../models/user-model";
import { userService } from "../services/user-service";
import { StatusCode } from "../models/enums";
import { CredentialsModel } from "../models/credentials-model";

// Routes for registering and logging in.
class UserController {
  public router: Router = express.Router();

  // Registers the routes as soon as the controller is created.
  public constructor() {
    this.registerRoutes();
  }

  // Maps each URL to its handler.
  private registerRoutes(): void {
    this.router.post("/api/register", this.register);
    this.router.post("/api/login", this.login);
  }

  // POST /api/register - creates a regular user and returns a token.
  private async register(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = new UserModel(request.body);
      const token = await userService.register(user);
      response.status(StatusCode.Created).json(token);
    } catch (err: any) {
      next(err);
    }
  }
  // POST /api/login - returns a token for valid credentials.
  private async login(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const credentials = new CredentialsModel(request.body);
      const token = await userService.login(credentials);
      response.json(token);
    } catch (err: any) {
      next(err);
    }
  }
}

export const userController = new UserController();
