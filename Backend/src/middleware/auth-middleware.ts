import { Request, Response, NextFunction } from "express";
import { cyber } from "../utils/cyber";
import { ClientError } from "../models/client-error";
import { Role, StatusCode } from "../models/enums";

class AuthMiddleware {
  public verifyLoggedIn(
    request: Request,
    response: Response,
    next: NextFunction,
  ): void {
    const header = request.headers.authorization;
    if (!header)
      throw new ClientError(StatusCode.Unauthorized, "You are not logged in.");

    const token = header.substring(7);
    if (!cyber.verifyToken(token))
      throw new ClientError(StatusCode.Unauthorized, "You are not logged in.");

    next();
  }

  public verifyAdmin(
    request: Request,
    response: Response,
    next: NextFunction,
  ): void {
    const header = request.headers.authorization;
    if (!header)
      throw new ClientError(StatusCode.Unauthorized, "You are not logged in.");

    const token = header.substring(7);
    if (!cyber.verifyToken(token))
      throw new ClientError(StatusCode.Unauthorized, "You are not logged in.");

    const role = cyber.getUserFromToken(token).role;
    if (role !== Role.Admin)
      throw new ClientError(StatusCode.Forbidden, "You are not authorized.");

    next();
  }
}

export const authMiddleware = new AuthMiddleware();
