// HTTP status codes used by the API.
export enum StatusCode {
  // Success:
  OK = 200,
  Created = 201,
  NoContent = 204,

  // Client Errors:
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  PayloadTooLarge = 413,
  UnprocessableContent = 422,

  // Server Errors:
  InternalServerError = 500,
}

// String values on purpose: MySQL reads a number inserted into an ENUM as its position.
export enum Role {
  Admin = "Admin",
  User = "User",
}
