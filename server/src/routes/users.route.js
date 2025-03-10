import { Router } from "express";
import { requestValidation, requireAuth } from "@bhtickix/common";
import usersController from "../controllers/users.controller.js";
import {
  changePasswordValidator,
  editProfileValidator,
} from "../validators/users.validator.js";

const usersRouter = Router();
usersRouter.use(requireAuth);

// PUT /users/profile
usersRouter.put(
  "/profile",
  editProfileValidator,
  requestValidation,
  usersController.putEditProfile
);

// PATCH /users/profile/password
usersRouter.patch(
  "/profile/password",
  changePasswordValidator,
  requestValidation,
  usersController.patchEditPassword
);

export default usersRouter;
