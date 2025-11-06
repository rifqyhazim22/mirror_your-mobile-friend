import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import * as Sentry from "@sentry/node";

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  constructor() {
    const dsn = process.env.SENTRY_DSN;
    if (dsn && !Sentry.getCurrentHub().getClient()) {
      Sentry.init({
        dsn,
        tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? "0.1"),
      });
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((error) => {
        if (Sentry.getCurrentHub().getClient()) {
          Sentry.withScope((scope) => {
            const request = context.switchToHttp().getRequest();
            scope.setTag("requestId", request.headers?.["x-request-id"] ?? "");
            scope.setExtras({
              method: request.method,
              url: request.originalUrl ?? request.url,
              userId: request.user?.sub ?? "anonymous",
            });
            Sentry.captureException(error);
          });
        }
        throw error;
      }),
    );
  }
}
