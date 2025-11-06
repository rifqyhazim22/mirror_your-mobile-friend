import { Injectable } from "@nestjs/common";
import { Registry, collectDefaultMetrics, Histogram } from "prom-client";

@Injectable()
export class MetricsService {
  private readonly registry: Registry;
  readonly httpHistogram: Histogram<string>;

  constructor() {
    this.registry = new Registry();
    collectDefaultMetrics({ register: this.registry });

    this.httpHistogram = new Histogram({
      name: "http_server_duration_seconds",
      help: "HTTP request duration in seconds",
      labelNames: ["method", "route", "status_code"],
      registers: [this.registry],
    });
  }

  async metrics() {
    return this.registry.metrics();
  }
}
