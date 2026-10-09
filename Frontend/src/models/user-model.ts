import { Role } from "./enums";

// A user as sent to the server on registration or read back from the token.
export class UserModel {
  public userId: number;
  public firstName: string;
  public lastName: string;
  public email: string;
  public password: string;
  public role: Role;
}
