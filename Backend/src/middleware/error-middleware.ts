import { Request, Response, NextFunction } from "express";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";
import { appConfig } from "../utils/app-config";

// Turns every error into a JSON response with the right status code.
class ErrorMiddleware {
  // Registered after all controllers, so it runs only when no route matched.
  public routeNotFound(
    request: Request,
    response: Response,
    next: NextFunction,
  ): void {
    next(
      new ClientError(
        StatusCode.NotFound,
        `Route ${request.originalUrl} not found.`,
      ),
    );
  }

  // Client errors are sent as they are; server error details are hidden outside development.
  public catchAll(
    err: any,
    request: Request,
    response: Response,
    next: NextFunction,
  ): void {
    console.log(err);

    // express.json() marks a body it cannot read as JSON this way; that is the client's mistake, so it is a 400
    if (err.type === "entity.parse.failed")
      err = new ClientError(
        StatusCode.BadRequest,
        "The request body is not valid JSON.",
      );

    // express.json() refuses a body over 100 KB this way; that is also the client's mistake, so it is a 413
    if (err.type === "entity.too.large")
      err = new ClientError(
        StatusCode.PayloadTooLarge,
        "The request body is too large.",
      );

    const status =
      err instanceof ClientError ? err.status : StatusCode.InternalServerError;

    const canShow = err instanceof ClientError || appConfig.isDevelopment;

    const message = canShow
      ? err.message
      : "Some error, please try again later.";

    response.status(status).json({ message: message });
  }
}

export const errorMiddleware = new ErrorMiddleware();
