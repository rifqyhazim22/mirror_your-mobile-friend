import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { randomUUID } from "crypto";

@Injectable()
export class StructuredLoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request & { user?: { sub: string } }>();
    const start = Date.now();
    const requestId = request.headers?.["x-request-id"] ?? randomUUID();

    const method = (request as any)?.method;
    const url = (request as any)?.originalUrl ?? (request as any)?.url;
    const userId = (request as any)?.user?.sub ?? "anonymous";

    return next.handle().pipe(
      tap({
        next: (value) => {
          const duration = Date.now() - start;
          console.info(
            JSON.stringify({
              type: "request",
              level: "info",
              requestId,
              method,
              url,
              userId,
              duration,
              status: (context.switchToHttp().getResponse() as any)?.statusCode ?? 200,
            }),
          );
          return value;
        },
        error: (error: any) => {
          const duration = Date.now() - start;
          console.error(
            JSON.stringify({
              type: "request",
              level: "error",
              requestId,
              method,
              url,
              userId,
              duration,
              message: error?.message ?? "Unknown error",
              stack: process.env.NODE_ENV === "production" ? undefined : error?.stack,
            }),
          );
        },
      }),
    );
  }
}
