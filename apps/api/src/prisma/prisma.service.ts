import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient, type Prisma } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: process.env.NODE_ENV === "production" ? [] : ["query", "info", "warn", "error"],
    } satisfies Prisma.PrismaClientOptions);
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on("beforeExit", async () => {
      await app.close();
    });
  }
}
