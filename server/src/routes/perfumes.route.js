import { Router } from "express";
import { requestValidation, requireAuth } from "@bhtickix/common";

import perfumesController from "../controllers/perfumes.controller.js";

import { requireAdmin } from "../middlewares/requireAdmin.middleware.js";

import { perfumeValidator } from "../validators/perfumes.validator.js";
import { commentValidator } from "../validators/comments.validator.js";

const perfumesRouter = Router();

// PUBLIC ROUTES
// GET /perfumes - get all perfumes with pagination with active status
perfumesRouter.get("/", perfumesController.getPerfumes("member"));

// GET /perfumes/:id
perfumesRouter.get("/:id", perfumesController.getPerfumeDetail);

// PROTECTED ROUTES
perfumesRouter.use(requireAuth);

// POST /perfumes/:perfumeId/comments
perfumesRouter.post(
  "/:perfumeId/comments",
  commentValidator,
  requestValidation,
  perfumesController.postAddComment
);

// PUT /perfumes/:perfumeId/comments/:commentId
perfumesRouter.put(
  "/:perfumeId/comments/:commentId",
  commentValidator,
  requestValidation,
  perfumesController.putEditComment
);

// DELETE /perfumes/:perfumeId/comments/:commentId
perfumesRouter.delete(
  "/:perfumeId/comments/:commentId",
  perfumesController.deleteComment
);

// ADMIN ROUTES
perfumesRouter.use(requireAdmin);

// GET /perfumes - get all perfumes with pagination
perfumesRouter.get("/", perfumesController.getPerfumes("admin"));

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
