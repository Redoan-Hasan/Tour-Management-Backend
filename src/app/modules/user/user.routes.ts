import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../utils/validateRequests";
import { createUserZodSchema, updateUserZodSchema } from "./user.ZodValidation";
import { checkAuth } from "../../utils/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserController.createUser
);
router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserController.getAllUsers
);
router.get(
  "/me",
  checkAuth(...Object.values(Role)),
  UserController.getMe
);
router.patch(
  "/:id",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserController.updateUser
);

export const UserRoutes = router;
