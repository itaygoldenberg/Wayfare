import crypto from "crypto";
import { appConfig } from "./app-config";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user-model";
import { Request } from "express";

// Security helpers: password hashing and JWT handling.
class Cyber {
  // One-way HMAC-SHA512 hash with the secret salt - it can be compared, never decrypted.
  public hash(plainText: string): string {
    const hashText = crypto
      .createHmac("sha512", appConfig.hashSalt)
      .update(plainText)
      .digest("hex");
    return hashText;
  }
  // Signs a 3-hour token; the payload is readable by anyone, so it carries no password.
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
  // True only if the signature is valid and the token has not expired.
  public verifyToken(token: string): boolean {
    try {
      jwt.verify(token, appConfig.jwtSecret);
      return true;
    } catch {
      return false;
    }
  }
  // Reads the user from a token without checking it - verifyToken must run first.
  public getUserFromToken(token: string): UserModel {
    const container = jwt.decode(token) as { user: UserModel };
    return container.user;
  }
  // Returns the logged-in user's id from the Authorization header, skipping "Bearer ".
  public getUserIdFromRequest(request: Request): number {
    const token = request.headers.authorization!.substring(7);
    return this.getUserFromToken(token).userId;
  }
}

export const cyber = new Cyber();
