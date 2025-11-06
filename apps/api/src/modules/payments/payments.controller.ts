import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { AuthGuard } from "../auth/auth.guard";
import type { AuthPayload } from "../auth/auth.service";
import { CreateSessionDto } from "./dto/create-session.dto";
import { PaymentsService } from "./payments.service";

@UseGuards(AuthGuard)
@Controller({ path: "payments", version: "1" })
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get("plans")
  listPlans() {
    return this.paymentsService.listPlans();
  }

  @Post("checkout-session")
  createCheckoutSession(@Req() req: Request, @Body() dto: CreateSessionDto) {
    const owner = (req as Request & { user?: AuthPayload }).user;
    return this.paymentsService.createCheckoutSession(dto, owner!.sub);
  }
}
