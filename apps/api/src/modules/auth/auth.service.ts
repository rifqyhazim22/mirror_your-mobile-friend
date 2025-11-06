import { Injectable, UnauthorizedException } from "@nestjs/common";
import jwt from "jsonwebtoken";

export interface AuthPayload {
  sub: string;
}

@Injectable()
export class AuthService {
  private readonly sharedCode = process.env.AUTH_SHARED_SECRET || "mirror-demo-code";
  private readonly jwtSecret = process.env.AUTH_JWT_SECRET || "mirror-demo-secret";
  private readonly expiresIn = process.env.AUTH_JWT_EXPIRES_IN || "7d";

  login(code: string) {
    if (!code || code.trim() !== this.sharedCode) {
      throw new UnauthorizedException("Kode akses tidak valid.");
    }
    const payload: AuthPayload = { sub: "mirror-demo-user" };
    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.expiresIn,
    });
    return {
      accessToken,
      tokenType: "Bearer",
      expiresIn: this.expiresIn,
    };
  }

  verify(token: string) {
    try {
      return jwt.verify(token, this.jwtSecret) as AuthPayload;
    } catch (error) {
      throw new UnauthorizedException("Token tidak valid.");
    }
  }
}
