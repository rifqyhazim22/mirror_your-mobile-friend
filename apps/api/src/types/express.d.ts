import type { AuthPayload } from "../modules/auth/auth.service";

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthPayload;
  }
}
