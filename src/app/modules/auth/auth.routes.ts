import { Response, Request, Router, NextFunction } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../utils/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";
import envVars from "../../config/env";

const router = Router();

router.post("/login", AuthController.credentialsLogin);
router.post("/refresh-token", AuthController.getNewAccessToken);
router.post("/logout", AuthController.logout);
router.post(
  "/set-password",
  checkAuth(...Object.values(Role)),
  AuthController.setPassword
);
router.post(
  "/reset-password",
  checkAuth(...Object.values(Role)),
  AuthController.resetPassword
);
router.post(
  "/change-password",
  checkAuth(...Object.values(Role)),
  AuthController.changePassword
);
router.post(
  "/forget-password",
  AuthController.forgetPassword
);
router.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/";
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string,
    })(req, res, next);
  }
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${envVars.FRONTEND_URL}/login?error=Login failed! please contact with our support team`}),
  AuthController.googleCallBackController
);

export const AuthRoutes = router;
