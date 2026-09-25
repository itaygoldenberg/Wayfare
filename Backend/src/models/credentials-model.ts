import z from "zod";
import { ClientError } from "./client-error";
import { StatusCode } from "./enums";

// Validation rules for a login request.
const CredentialsSchema = z.object({
  email: z.email().min(2).max(100),
  password: z.string().min(4).max(100),
});

// The model's shape, derived from the schema.
type ICredentialsModel = z.infer<typeof CredentialsSchema>;

// The email and password sent to log in.
export class CredentialsModel implements ICredentialsModel {
  public email: string;
  public password: string;

  public constructor(user: CredentialsModel) {
    this.email = user.email;
    this.password = user.password;
  }

  // Throws a 422 with the first validation problem found.
  public validate(): void {
    const result = CredentialsSchema.safeParse(this);
    if (!result.success) {
      const message =
        result.error.issues[0].path + ": " + result.error.issues[0].message;
      throw new ClientError(StatusCode.UnprocessableContent, message);
    }
  }
}
