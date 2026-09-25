import z from "zod";
import { ClientError } from "./client-error";
import { Role, StatusCode } from "./enums";

// Validation rules for a user.
const UserSchema = z.object({
  userId: z.number().int().positive().optional(),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.email().min(2).max(100),
  password: z.string().min(4).max(100),
  role: z.enum(Role).optional(),
});

// The model's shape, derived from the schema.
type IUserModel = z.infer<typeof UserSchema>;

// A user as sent by the client or read from the database.
export class UserModel implements IUserModel {
  public userId: number;
  public firstName: string;
  public lastName: string;
  public email: string;
  public password: string;
  public role: Role;

  public constructor(user: UserModel) {
    this.userId = user.userId;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.password = user.password;
    this.role = user.role;
  }

  // Throws a 422 with the first validation problem found.
  public validate(): void {
    const result = UserSchema.safeParse(this);
    if (!result.success) {
      const message =
        result.error.issues[0].path + ": " + result.error.issues[0].message;
      throw new ClientError(StatusCode.UnprocessableContent, message);
    }
  }
}
