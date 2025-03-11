import express from "express";
import perfumesController from "../controllers/perfumes.controller.js";
import { requireAuth, validateRequest } from "@bhtickix/common";
import {
  perfumeValidation,
  commentValidation,
} from "../validations/perfume.validation.js";

const router = express.Router();

// Public routes
router.get("/", (req, res) =>
  perfumesController.getPerfumes("member")(req, res)
);
router.get("/:id", perfumesController.getPerfumeDetail);

// Protected user routes
router.post(
  "/:perfumeId/comments",
  requireAuth,
  commentValidation,
  validateRequest,
  perfumesController.postAddComment
);
router.put(
  "/:perfumeId/comments/:commentId",
  requireAuth,
  commentValidation,
  validateRequest,
  perfumesController.putEditComment
);
router.delete(
  "/:perfumeId/comments/:commentId",
  requireAuth,
  perfumesController.deleteComment
);

// Admin only routes
router.get("/admin/all", requireAuth, (req, res) =>
  perfumesController.getPerfumes("admin")(req, res)
);
router.post(
  "/",
  requireAuth,
  perfumeValidation,
  validateRequest,
  perfumesController.postAddPerfume
);
router.put(
  "/:id",
  requireAuth,
  perfumeValidation,
  validateRequest,
  perfumesController.putEditPefume
);
router.delete("/:id", requireAuth, perfumesController.deletePerfume);

export default router;
