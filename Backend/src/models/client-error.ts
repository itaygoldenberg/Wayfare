import { StatusCode } from "./enums";

export class ClientError extends Error {
  public status: StatusCode;

  public constructor(status: StatusCode, message: string) {
    super(message);
    this.status = status;
  }
}
