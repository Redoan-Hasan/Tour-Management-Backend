import { Router } from "express";
import { DivisionController } from "./division.controller";
import { validateRequest } from "../../utils/validateRequests";
import {
  createDivisionZodSchema,
  updateDivisionZodSchema,
} from "./division.ZodValidation";
import { checkAuth } from "../../utils/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createDivisionZodSchema),
  DivisionController.createDivision
);
router.get("/", DivisionController.getAllDivisions);
router.get("/:slug", DivisionController.getSingleDivision);
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateDivisionZodSchema),
  DivisionController.updateDivision
);
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DivisionController.deleteDivision
);

export const DivisionRoutes = router;
