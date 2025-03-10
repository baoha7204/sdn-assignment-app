import { Router } from "express";
import { requestValidation, requireAuth } from "@bhtickix/common";

import brandsController from "../controllers/brands.controller.js";

import { requireAdmin } from "../middlewares/requireAdmin.middleware.js";

import { brandValidator } from "../validators/brands.validator.js";

const brandsRouter = Router();

// PUBLIC ROUTES
// GET /brands/:id
brandsRouter.get("/:id", brandsController.getBrandDetail);

// ADMIN ROUTES
brandsRouter.use(requireAuth, requireAdmin);
// POST /brands
brandsRouter.post(
  "/",
  brandValidator,
  requestValidation,
  brandsController.postAddBrand
);

// PUT /brands/:id
brandsRouter.put(
  "/:id",
  brandValidator,
  requestValidation,
  brandsController.putEditBrand
);

// DELETE /brands/:id
brandsRouter.delete("/:id", brandsController.deleteBrand);

export default brandsRouter;
