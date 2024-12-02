import { Router } from "express";
import passport from "passport";
import {
  register,
  login,
  authStatus,
  logout,
  setup2FA,
  verify2FA,
  reset2FA,
} from "../controllers/UserController.js";
import authenticationCheckFor2FA from "../middlewares/authenticationCheckFor2FA.js";

export const UserRouter = Router();

UserRouter.post("/register", register); // Create Register Route
UserRouter.post("/login", passport.authenticate("local"), login);
UserRouter.get("/status", authStatus);
UserRouter.post("/logout", logout);

UserRouter.post("/2fa/setup", authenticationCheckFor2FA, setup2FA);
UserRouter.post("/2fa/verify", authenticationCheckFor2FA, verify2FA);
UserRouter.post("/2fa/reset", authenticationCheckFor2FA, reset2FA);
