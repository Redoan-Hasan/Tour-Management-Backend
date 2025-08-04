import { Router } from "express";
import { TourController } from "./tour.controller";
import { checkAuth } from "../../utils/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../utils/validateRequests";
import { createAndUpdateTourTypeZodSchema } from "./tour.ZodValidation";

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

export const TourRoutes = router;
