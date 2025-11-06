import { Injectable, UnauthorizedException } from "@nestjs/common";
import jwt, { SignOptions } from "jsonwebtoken";

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
    const options: SignOptions = {
      expiresIn: this.expiresIn as SignOptions["expiresIn"],
    };
    const accessToken = jwt.sign(payload, this.jwtSecret, options);
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
