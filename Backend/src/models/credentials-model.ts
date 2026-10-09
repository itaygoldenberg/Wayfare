import z from "zod";
import { ClientError } from "./client-error";
import { StatusCode } from "./enums";

// Validation rules for a login request, each with a message the user can understand.
const CredentialsSchema = z.object({
  email: z
    .email("Please enter a valid email address.")
    .max(100, "Email can have up to 100 characters."),
  password: z
    .string("Password is required.")
    .min(4, "Password must have at least 4 characters.")
    .max(100, "Password can have up to 100 characters."),
});

// The model's shape, derived from the schema.
type ICredentialsModel = z.infer<typeof CredentialsSchema>;

// The email and password sent to log in.
export class CredentialsModel implements ICredentialsModel {
  public email: string;
  public password: string;

  // Copies the fields from the request body.
  public constructor(user: CredentialsModel) {
    this.email = user.email;
    this.password = user.password;
  }

  // Throws a 422 with the first validation problem found.
  public validate(): void {
    const result = CredentialsSchema.safeParse(this);
    if (!result.success) {
      const message = result.error.issues[0].message;
      throw new ClientError(StatusCode.UnprocessableContent, message);
    }
  }
}
