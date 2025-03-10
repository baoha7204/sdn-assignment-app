import { body } from "express-validator";
import { BadRequestError, NotFoundError } from "@bhtickix/common";

import Member from "../models/member.model.js";

export const editProfileValidator = [
  body("name").trim().not().isEmpty().withMessage("Name is required"),
  body("YOB", "Invalid year of birth").isInt({
    min: 1900,
    max: new Date().getFullYear(),
  }),
  body("gender", "Invalid gender").isBoolean(),
];

export const changePasswordValidator = [
  body("oldPassword")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Old password is required")
    .custom(async (value, { req }) => {
      const user = await Member.findById(req.currentUser.id);
      if (!user) {
        throw new NotFoundError("User not found");
      }

      const isMatch = await user.matchPassword(value);
      if (!isMatch) {
        throw new BadRequestError("Invalid password");
      }
      return true;
    }),
  body("newPassword")
    .trim()
    .isLength({ min: 4 })
    .withMessage("Password must be at least 4 characters long")
    .custom((value, { req }) => {
      if (value === req.body.oldPassword) {
        throw new BadRequestError(
          "New password should be different from old password"
        );
      }
      return true;
    }),
];
