import { body } from "express-validator";

export const commentValidator = [
  body("rating", "Rating is required")
    .not()
    .isEmpty()
    .isInt({ min: 1, max: 3 })
    .withMessage("Rating must be between 1 and 3"),
  body("content")
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage("Comment must be between 5 and 500 characters"),
];
