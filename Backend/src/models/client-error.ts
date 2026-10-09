import { StatusCode } from "./enums";

// An error caused by the request (4xx), carrying the status code to send back.
export class ClientError extends Error {
  public status: StatusCode;

  // Keeps the HTTP status next to the message, for the error middleware.
  public constructor(status: StatusCode, message: string) {
    super(message);
    this.status = status;
  }
}
