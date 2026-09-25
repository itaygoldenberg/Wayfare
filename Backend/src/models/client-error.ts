import { StatusCode } from "./enums";

// An error caused by the request (4xx), carrying the status code to send back.
export class ClientError extends Error {
  public status: StatusCode;

  public constructor(status: StatusCode, message: string) {
    super(message);
    this.status = status;
  }
}
