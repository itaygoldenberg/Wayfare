import express, { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/user-model";
import { userService } from "../services/user-service";
import { StatusCode } from "../models/enums";
import { CredentialsModel } from "../models/credentials-model";

class UserController {
  public readonly router = express.Router();

  public constructor() {
    this.registerRoutes();
  }

  private registerRoutes(): void {
    this.router.post("/api/register", this.register);
    this.router.post("/api/login", this.login);
  }

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
