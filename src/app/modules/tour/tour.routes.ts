import { Router } from "express";
import { TourController } from "./tour.controller";
import { checkAuth } from "../../utils/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../utils/validateRequests";
import {
  createAndUpdateTourTypeZodSchema,
  createTourZodSchema,
  updateTourZodSchema,
} from "./tour.ZodValidation";

const router = Router();
/**-------------------Tour Types----------------------*/
router.post(
  "/create-tour-type",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createAndUpdateTourTypeZodSchema),
  TourController.createTourType
);
router.get("/tour-types", TourController.getAllTourTypes);
router.patch(
  "/tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createAndUpdateTourTypeZodSchema),
  TourController.updateTourType
);
router.delete(
  "/tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.deleteTourType
);

/**-------------------Tours----------------------*/
router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTourZodSchema),
  TourController.createTour
);
router.get("/", TourController.getAllTours);
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateTourZodSchema),
  TourController.updateTour
);
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), TourController.deleteTour);
export const TourRoutes = router;
