import { dal } from "../utils/dal";
import { cyber } from "../utils/cyber";
import { UserModel } from "../models/user-model";
import { Role, StatusCode } from "../models/enums";
import { ClientError } from "../models/client-error";
import { CredentialsModel } from "../models/credentials-model";

// Business logic for users.
class UserService {
  // Checks whether an email is already registered.
  private async isEmailTaken(email: string): Promise<boolean> {
    const sql = "SELECT COUNT(*) AS count FROM users WHERE email = ?";

    const result = await dal.execute(sql, [email]);

    return result[0].count > 0;
  }
  // Validates, hashes the password, forces the User role, saves, and returns a token.
  public async register(user: UserModel): Promise<string> {
    user.validate();
    if (await this.isEmailTaken(user.email))
      throw new ClientError(StatusCode.Conflict, "Email already taken.");

    user.password = cyber.hash(user.password);

    user.role = Role.User;

    const sql =
      "INSERT INTO users(firstName, lastName, email, password, role) VALUES(?, ?, ?, ?, ?)";
    const values = [
      user.firstName,
      user.lastName,
      user.email,
      user.password,
      user.role,
    ];
    const info = await dal.execute(sql, values);

    user.userId = info.insertId;

    return cyber.getNewToken(user);
  }
  // Hashes the given password and looks for a user with that email and hash.
  public async login(credentials: CredentialsModel): Promise<string> {
    credentials.validate();

    credentials.password = cyber.hash(credentials.password);

    const sql =
      "SELECT userId, firstName, lastName, role FROM users WHERE email = ? AND password = ?";

    const users = await dal.execute(sql, [
      credentials.email,
      credentials.password,
    ]);

    if (users.length === 0)
      throw new ClientError(
        StatusCode.Unauthorized,
        "Incorrect email or password.",
      );

    const user = users[0];

    return cyber.getNewToken(user);
  }
}

export const userService = new UserService();
