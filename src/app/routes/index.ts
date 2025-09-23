import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { DivisionRoutes } from "../modules/division/division.routes";
import { TourRoutes } from "../modules/tour/tour.routes";
import { BookingRoutes } from "../modules/booking/booking.routes";
import { PaymentRoutes } from "../modules/payment/payment.routes";
import { OTPRoutes } from "../modules/otp/otp.routes";
import { StatsRoutes } from "../modules/stats/stats.routes";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/division",
    route: DivisionRoutes,
  },
  {
    path: "/tour",
    route: TourRoutes,
  },
  {
    path: "/booking",
    route: BookingRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
  {
    path: "/otp",
    route: OTPRoutes,
  },
  {
    path: "/stats",
    route: StatsRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
