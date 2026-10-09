import z from "zod";
import { ClientError } from "./client-error";
import { Role, StatusCode } from "./enums";

// Validation rules for a user, each with a message the user can understand; trim() makes a name of spaces only count as empty.
const UserSchema = z.object({
  userId: z
    .number("User id must be a number.")
    .int("User id must be a whole number.")
    .positive("User id must be positive.")
    .optional(),
  firstName: z
    .string("First name is required.")
    .trim()
    .min(2, "First name must have at least 2 characters.")
    .max(50, "First name can have up to 50 characters."),
  lastName: z
    .string("Last name is required.")
    .trim()
    .min(2, "Last name must have at least 2 characters.")
    .max(50, "Last name can have up to 50 characters."),
  email: z
    .email("Please enter a valid email address.")
    .max(100, "Email can have up to 100 characters."),
  password: z
    .string("Password is required.")
    .min(4, "Password must have at least 4 characters.")
    .max(100, "Password can have up to 100 characters."),
  role: z.enum(Role, "Role must be User or Admin.").optional(),
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

  // Copies the fields from the request body or a database row.
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
      const message = result.error.issues[0].message;
      throw new ClientError(StatusCode.UnprocessableContent, message);
    }
    // trim() checked the names without the spaces around them, so they are saved that way too
    this.firstName = result.data.firstName;
    this.lastName = result.data.lastName;
  }
}
