import { body } from "express-validator";
import Brand from "../models/brand.model.js";

export const addbrandValidator = [
  body("brandName")
    .trim()
    .notEmpty()
    .withMessage("Brand name is required")
    .custom(async (value) => {
      const existedBrand = await Brand.findOne({
        brandName: {
          $regex: value,
          $options: "i",
        },
      });
      if (existedBrand) {
        throw new Error("Brand already exists! Please input another one.");
      }
      return true;
    }),
];

export const editbrandValidator = [
  body("brandName").trim().notEmpty().withMessage("Brand name is required"),
];
