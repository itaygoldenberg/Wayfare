import crypto from "crypto";
import { appConfig } from "./app-config";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user-model";
import { Request } from "express";

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
    } catch {
      return false;
    }
  }
  public getUserFromToken(token: string): UserModel {
    const container = jwt.decode(token) as { user: UserModel };
    return container.user;
  }
  public getUserIdFromRequest(request: Request): number {
    const token = request.headers.authorization!.substring(7);
    return this.getUserFromToken(token).userId;
  }
}

export const cyber = new Cyber();
