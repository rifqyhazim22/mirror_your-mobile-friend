import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { PaymentsService } from "./payments.service";
import { AuthGuard } from "../auth/auth.guard";

type MidtransNotification = {
  transaction_time?: string;
  transaction_status?: string;
  fraud_status?: string;
  order_id?: string;
  status_code?: string;
  signature_key?: string;
  gross_amount?: string;
  payment_type?: string;
};

@Controller({ path: "payments", version: "1" })
export class PaymentsWebhookController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post("webhook/midtrans")
  async handleMidtransWebhook(
    @Body() payload: MidtransNotification,
    @Headers("x-callback-token") callbackToken?: string,
    @Req() req?: Request,
  ) {
    if (!payload || !payload.order_id) {
      throw new BadRequestException("Payload Midtrans tidak valid");
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const callbackSecret = process.env.MIDTRANS_CALLBACK_TOKEN;
    if (!serverKey) {
      throw new BadRequestException("Server key Midtrans belum dikonfigurasi");
    }

    if (callbackSecret && callbackToken !== callbackSecret) {
      throw new BadRequestException("Callback token tidak valid");
    }

    const signature = payload.signature_key;
    if (!signature) {
      throw new BadRequestException("Signature tidak ditemukan");
    }

    const expectedSignature = this.generateMidtransSignature(
      payload.order_id,
      payload.status_code,
      payload.gross_amount,
      serverKey,
    );
    if (signature !== expectedSignature) {
      throw new BadRequestException("Signature tidak valid");
    }

    const result = await this.paymentsService.handleMidtransNotification(payload);

    return {
      ok: true,
      result,
    };
  }

  private generateMidtransSignature(
    orderId?: string,
    statusCode?: string,
    grossAmount?: string,
    serverKey?: string,
  ) {
    const rawSignature = `${orderId}${statusCode}${grossAmount}${serverKey}`;
    return Buffer.from(require("crypto").createHash("sha512").update(rawSignature).digest("hex"))
      .toString()
      .toLowerCase();
  }

  @UseGuards(AuthGuard)
  @Post("webhook/mock")
  async handleMockWebhook(@Body("sessionId") sessionId: string, @Req() req: Request) {
    const owner = (req as Request & { user?: { sub: string } }).user;
    if (!owner?.sub) {
      throw new BadRequestException("Unauthenticated");
    }
    const result = await this.paymentsService.markPaid(sessionId, owner.sub);
    return {
      ok: true,
      result,
    };
  }
}
