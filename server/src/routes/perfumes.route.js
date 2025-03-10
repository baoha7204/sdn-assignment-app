import { Router } from "express";
import { requestValidation, requireAuth } from "@bhtickix/common";

import perfumesController from "../controllers/perfumes.controller.js";

import { requireAdmin } from "../middlewares/requireAdmin.middleware.js";

import { perfumeValidator } from "../validators/perfumes.validator.js";

const perfumesRouter = Router();

// PUBLIC ROUTES
// GET /perfumes/:id
perfumesRouter.get("/:id", perfumesController.getPerfumeDetail);

// ADMIN ROUTES
perfumesRouter.use(requireAuth, requireAdmin);
// POST /perfumes
perfumesRouter.post(
  "/",
  perfumeValidator,
  requestValidation,
  perfumesController.postAddPerfume
);

// PUT /perfumes/:id
perfumesRouter.put(
  "/:id",
  perfumeValidator,
  requestValidation,
  perfumesController.putEditPefume
);

// DELETE /perfumes/:id
perfumesRouter.delete("/:id", perfumesController.deletePerfume);

export default perfumesRouter;
