import { Router } from "express";
import * as invoiceController from "./invoice.controller.js";
import { protect, authorize } from "../../middleware/auth.middleware.js";
import validateRequest from "../../middleware/validateRequest.js";
import { payInvoiceValidation } from "./invoice.validation.js";

const router = Router();

router.get(
    "/",
    protect,
    authorize("admin", "staff"),
    invoiceController.getAllInvoices
);

router.get(
    "/my-invoices",
    protect,
    invoiceController.getMyInvoices
);

router.get(
    "/:id",
    protect,
    invoiceController.getInvoiceById
);

router.get(
    "/:id/pdf",
    protect,
    invoiceController.downloadInvoicePdf
);

router.patch(
    "/:id/pay",
    protect,
    validateRequest(payInvoiceValidation),
    invoiceController.payInvoiceBalance
);

export default router;
