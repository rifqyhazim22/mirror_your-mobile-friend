import { AsyncLocalStorage } from "async_hooks";
import { randomUUID } from "crypto";

type RequestContextStore = {
  requestId: string;
  userId?: string;
};

class RequestContext {
  private readonly storage = new AsyncLocalStorage<RequestContextStore>();

  run<T>(context: RequestContextStore, callback: () => T) {
    return this.storage.run(context, callback);
  }

  get store(): RequestContextStore | undefined {
    return this.storage.getStore();
  }

  get requestId(): string {
    return this.storage.getStore()?.requestId ?? randomUUID();
  }

  get userId(): string | undefined {
    return this.storage.getStore()?.userId;
  }
}

export const requestContext = new RequestContext();
