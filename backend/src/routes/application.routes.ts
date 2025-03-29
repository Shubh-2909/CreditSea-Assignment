// src/routes/applicationRoutes.ts

import express from "express";
import { auth, isAdmin, isVerifier } from "../middlewares/auth";
import { applicationController } from "../controllers/application.controller";
import { adminController } from "../controllers/admin.controller";

const router = express.Router();

// Application routes
router.post("/applications", auth, applicationController.createApplication);
router.get("/applications", auth, applicationController.getAllApplications);
router.get("/applications/:id", auth, applicationController.getApplicationById);
router.patch(
  "/applications/:id/verify",
  auth,
  isVerifier,
  applicationController.verifyApplication
);
router.patch(
  "/applications/:id/status",
  auth,
  isAdmin,
  applicationController.updateApplicationStatus
);
router.delete(
  "/applications/:id",
  auth,
  isAdmin,
  applicationController.deleteApplication
);

// Admin management routes
router.post("/admins", auth, isAdmin, adminController.addAdmin);
router.delete("/admins/:id", auth, isAdmin, adminController.removeAdmin);
router.get("/admins", auth, isAdmin, adminController.getAllAdmins);

// Verifier management routes
router.post("/verifiers", auth, isAdmin, adminController.manageVerifier);
router.get("/verifiers", auth, isAdmin, adminController.getAllVerifiers);

export default router;
