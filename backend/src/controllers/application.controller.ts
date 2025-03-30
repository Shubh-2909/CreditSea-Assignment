// src/controllers/applicationController.ts

import { Response } from "express";
import { ApplicationModel } from "../models/application.model";
import { AuthRequest } from "../middlewares/auth";

export const applicationController = {
  // Create a new application (accessible by all users)
  createApplication: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Authentication required" });
        return;
      }

      const newApplication = new ApplicationModel({
        user: req.user._id,
        content: req.body.content,
      });

      await newApplication.save();
      res.status(201).json({
        message: "Application submitted successfully",
        application: newApplication,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error creating application",
        error: (error as Error).message,
      });
    }
  },

  // Get all applications (admin can see all, users see only their own)
  getAllApplications: async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Authentication required" });
        return;
      }

      let applications;

      // Admins and verifiers can see all applications
      if (req.user.role === "admin" || req.user.role === "verifier") {
        // Handle filtering by status if provided
        const { status } = req.query;
        const filter = status ? { status } : {};

        applications = await ApplicationModel.find(filter)
          .populate("user", "fullName email")
          .populate("reviewedBy", "fullName");
      } else {
        // Regular users can only see their own applications
        applications = await ApplicationModel.find({ user: req.user._id });
      }

      res.status(200).json({ applications });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching applications",
        error: (error as Error).message,
      });
    }
  },

  // Get a specific application by ID
  getApplicationById: async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Authentication required" });
        return;
      }

      const application = await ApplicationModel.findById(req.params.id)
        .populate("user", "fullName email")
        .populate("reviewedBy", "fullName");

      if (!application) {
        res.status(404).json({ message: "Application not found" });
        return;
      }

      // Check if the user has permission to view this application
      if (
        req.user.role === "user" &&
        application.user._id.toString() !== req.user._id.toString()
      ) {
        res.status(403).json({ message: "Access denied" });
        return;
      }

      res.status(200).json({ application });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching application",
        error: (error as Error).message,
      });
    }
  },

  // Verify an application (verifier only)
  verifyApplication: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Authentication required" });
        return;
      }

      if (req.user.role !== "verifier") {
        res
          .status(403)
          .json({ message: "Only verifiers can verify applications" });
        return;
      }

      const { id } = req.params;
      const { status } = req.body;

      if (status !== "approved" && status !== "rejected") {
        res.status(400).json({ message: "Invalid status value" });
        return;
      }

      const application = await ApplicationModel.findById(id);

      if (!application) {
        res.status(404).json({ message: "Application not found" });
        return;
      }

      if (application.status !== "pending") {
        res
          .status(400)
          .json({ message: "Only pending applications can be verified" });
        return;
      }

      application.status = status;
      application.reviewedBy = req.user._id;
      await application.save();

      res.status(200).json({
        message: `Application has been ${status}`,
        application,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error verifying application",
        error: (error as Error).message,
      });
    }
  },

  // Approve or reject an application (admin only)
  updateApplicationStatus: async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Authentication required" });
        return;
      }

      console.log(req.body);

      if (req.user.role !== "admin") {
        res
          .status(403)
          .json({ message: "Only admins can update application status" });
        return;
      }

      const { id } = req.params;
      console.log("id", id);
      const { status } = req.body;

      if (status !== "approved" && status !== "rejected") {
        res.status(400).json({ message: "Invalid status value" });
        return;
      }

      const application = await ApplicationModel.findById(id);

      if (!application) {
        res.status(404).json({ message: "Application not found" });
        return;
      }

      console.log(application);
      application.status = status;
      application.reviewedBy = req.user._id;
      await application.save();

      res.status(200).json({
        message: `Application has been ${status}`,
        application,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error updating application status",
        error: (error as Error).message,
      });
    }
  },

  // Delete an application (admin only)
  deleteApplication: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Authentication required" });
        return;
      }

      if (req.user.role !== "admin") {
        res
          .status(403)
          .json({ message: "Only admins can delete applications" });
        return;
      }

      const { id } = req.params;
      const application = await ApplicationModel.findByIdAndDelete(id);

      if (!application) {
        res.status(404).json({ message: "Application not found" });
        return;
      }

      res.status(200).json({
        message: "Application deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error deleting application",
        error: (error as Error).message,
      });
    }
  },
};
