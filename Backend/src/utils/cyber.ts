import crypto from "crypto";
import { appConfig } from "./app-config";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user-model";

class Cyber {
  public hash(plainText: string): string {
    const hashText = crypto
      .createHmac("sha512", appConfig.hashSalt)
      .update(plainText)
      .digest("hex");
    return hashText;
  }
  public getNewToken(user: UserModel): string {
    const payload = {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    const container = { user: payload };

    const options: jwt.SignOptions = { expiresIn: "3h" };

    return jwt.sign(container, appConfig.jwtSecret, options);
  }
      public verifyToken(token: string): boolean {
        try {
            jwt.verify(token, appConfig.jwtSecret);
            return true;
        }
        catch {
            return false;
        }
    }
}

export const cyber = new Cyber();
