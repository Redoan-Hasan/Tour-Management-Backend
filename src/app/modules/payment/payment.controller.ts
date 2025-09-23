import httpStatus from "http-status-codes";
import { Request, Response } from "express";
import { catchHandler } from "../../utils/catchHandler";
import { PaymentServices } from "./payment.service";
import envVars from "../../config/env";
import { sendResponse } from "../../utils/sendResponse";
import { sslServices } from "../SSLCommerz/sslCommerz.service";

const initPayment = catchHandler(async (req: Request, res: Response) => {
  const bookingId = req.params.bookingId;
  const result = await PaymentServices.initPayment(bookingId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment done successfully",
    data: result,
  });
});

const successPayment = catchHandler(async (req: Request, res: Response) => {
  const query = req.query as Record<string, string>;
  const result = await PaymentServices.successPayment(query);
  if (result?.success) {
    res.redirect(
      `${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query?.transactionId}&amount=${query.amount}&status=${query.status}&message=${result.message}`
    );
  }
});
const failPayment = catchHandler(async (req: Request, res: Response) => {
  const query = req.query as Record<string, string>;
  const result = await PaymentServices.failPayment(query);
  if (!result.success) {
    res.redirect(
      `${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query?.transactionId}&amount=${query.amount}&status=${query.status}&message=${result.message}`
    );
  }
});
const cancelPayment = catchHandler(async (req: Request, res: Response) => {
  const query = req.query as Record<string, string>;
  const result = await PaymentServices.cancelPayment(query);
  if (!result.success) {
    res.redirect(
      `${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query?.transactionId}&amount=${query.amount}&status=${query.status}&message=${result.message}`
    );
  }
});

const getInvoiceDownloadURL = catchHandler(
  async (req: Request, res: Response) => {
    const { paymentId } = req.params;
    const result = await PaymentServices.getInvoiceDownloadURL(paymentId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Invoice download URL fetched successfully",
      data: result,
    });
  }
);
const validatePayment = catchHandler(async (req: Request, res: Response) => {
  await sslServices.validatePayment(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment validated successfully",
    data: null,
  });
});

export const PaymentController = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
  getInvoiceDownloadURL,
  validatePayment,
};
