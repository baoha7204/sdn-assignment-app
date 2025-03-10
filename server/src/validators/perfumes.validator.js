import { body } from "express-validator";
import { NotFoundError } from "@bhtickix/common";

import Brand from "../models/brand.model.js";
import {
  PerfumeConcentration,
  TargetAudience,
} from "../models/perfume.model.js";

export const perfumeValidator = [
  body("perfumeName", "Invalid perfume name").trim().notEmpty(),
  body("uri", "Invalid URI").trim().notEmpty().isURL(),
  body("price", "Invalid price").trim().isNumeric(),
  body("volume", "Invalid volume").trim().isNumeric(),
  body("isActive", "Invalid active state").trim().isBoolean(),
  body("concentration", "Invalid concentration")
    .trim()
    .notEmpty()
    .isIn(Object.values(PerfumeConcentration)),
  body("targetAudience", "Invalid target audience")
    .trim()
    .notEmpty()
    .isIn(Object.values(TargetAudience)),
  body("brand", "Invalid brand")
    .trim()
    .notEmpty()
    .custom(async (value) => {
      const brand = await Brand.findById(value);

      if (!brand) {
        throw new NotFoundError("Brand not found");
      }

      return true;
    }),
];
