import { body } from "express-validator";
import { BadRequestError } from "@bhtickix/common";

import Member from "../models/member.model.js";

export const signinValidator = [
  body("email").isEmail().withMessage("Email must be valid").normalizeEmail(),
  body("password").trim().notEmpty().withMessage("Password must be provided"),
];

export const signupValidator = [
  body("name", "Invalid name").trim().notEmpty(),
  body("YOB", "Invalid year of birth").isInt({
    min: 1900,
    max: new Date().getFullYear(),
  }),
  body("gender", "Invalid gender").isBoolean().withMessage("Invalid gender"),
  body("email")
    .isEmail()
    .withMessage("Email must be valid")
    .normalizeEmail()
    .custom(async (value) => {
      const user = await Member.findOne({ email: value });
      if (user) {
        throw new BadRequestError("Email already exists! Please login.");
      }
      return true;
    }),
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 and 20 characters"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new BadRequestError("Passwords do not match.");
    }
    return true;
  }),
];
