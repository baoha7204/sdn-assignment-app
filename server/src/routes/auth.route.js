import { Router } from "express";
import { requestValidation, requireAuth } from "@bhtickix/common";

import authController from "../controllers/auth.controller.js";

import {
  signinValidator,
  signupValidator,
} from "../validators/auth.validator.js";

const authRouter = Router();

// GET /auth/self
authRouter.get("/self", authController.getSelf);

// POST /auth/signin
authRouter.post(
  "/signin",
  signinValidator,
  requestValidation,
  authController.postSignin
);

// POST /auth/signup
authRouter.post(
  "/signup",
  signupValidator,
  requestValidation,
  authController.postSignup
);

// POST /auth/signout
authRouter.post("/signout", requireAuth, authController.postSignout);

export default authRouter;
