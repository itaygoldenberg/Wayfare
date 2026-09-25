import { Request, Response, NextFunction } from "express";
import { cyber } from "../utils/cyber";
import { ClientError } from "../models/client-error";
import { Role, StatusCode } from "../models/enums";

// Guards routes using the JWT sent in the Authorization header.
class AuthMiddleware {
  // Lets the request through only with a valid token (401 otherwise).
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

  // Lets the request through only with a valid admin token (401 without a token, 403 for a regular user).
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
