import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  private get bypassEnabled() {
    const envFlag = process.env.AUTH_BYPASS;
    if (envFlag === "true") return true;
    if (envFlag === "false") return false;
    return process.env.NODE_ENV !== "production";
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (this.bypassEnabled) {
      request.user = { sub: "dev-bypass-user" };
      return true;
    }
    const authHeader: string | undefined = request.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Header Authorization tidak ditemukan.");
    }
    const token = authHeader.slice(7).trim();
    if (!token) {
      throw new UnauthorizedException("Token tidak valid.");
    }
    const payload = this.authService.verify(token);
    request.user = payload;
    return true;
  }
}
