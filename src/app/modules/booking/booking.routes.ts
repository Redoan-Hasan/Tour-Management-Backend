import { Router } from "express";
import { BookingController } from "./booking.controller";
import { checkAuth } from "../../utils/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../utils/validateRequests";
import {
  createBookingZodSchema,
  updateBookingStatusZodSchema,
} from "./booking.ZodValidation";

const router = Router();
router.post(
  "/",
  checkAuth(...Object.values(Role)),
  validateRequest(createBookingZodSchema),
  BookingController.createBooking
);
router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  BookingController.getAllBookings
);
router.get(
  "/my-bookings",
  checkAuth(...Object.values(Role)),
  BookingController.getUserBooking
);
router.get(
  "/:bookingId",
  checkAuth(...Object.values(Role)),
  BookingController.getBookingById
);
router.patch(
  "/:bookingId/status",
  checkAuth(...Object.values(Role)),
  validateRequest(updateBookingStatusZodSchema),
  BookingController.updateBookingStatus
);
export const BookingRoutes = router;
