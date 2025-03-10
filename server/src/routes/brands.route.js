import { Router } from "express";
import { requestValidation, requireAuth } from "@bhtickix/common";

import brandsController from "../controllers/brands.controller.js";

import { requireAdmin } from "../middlewares/requireAdmin.middleware.js";

import {
  addbrandValidator,
  editbrandValidator,
} from "../validators/brands.validator.js";

const brandsRouter = Router();

// GET /brands
brandsRouter.get("/", brandsController.getBrands);

// GET /brands/:id
brandsRouter.get("/:id", brandsController.getBrandDetail);

// ADMIN ROUTES
brandsRouter.use(requireAuth, requireAdmin);

// POST /brands
brandsRouter.post(
  "/",
  addbrandValidator,
  requestValidation,
  brandsController.postAddBrand
);

// PUT /brands/:id
brandsRouter.put(
  "/:id",
  editbrandValidator,
  requestValidation,
  brandsController.putEditBrand
);

// DELETE /brands/:id
brandsRouter.delete("/:id", brandsController.deleteBrand);

export default brandsRouter;
