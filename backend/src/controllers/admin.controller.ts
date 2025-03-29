// src/controllers/adminController.ts

import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { userModel } from "../models/user.model";

export const adminController = {
  // Add a new admin (admin only)
  addAdmin: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Authentication required" });
        return;
      }

      if (req.user.role !== "admin") {
        res.status(403).json({ message: "Only admins can add new admins" });
        return;
      }

      const { email } = req.body;

      if (!email) {
        res.status(400).json({ message: "Email is required" });
        return;
      }

      const user = await userModel.findOne({ email });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      if (user.role === "admin") {
        res.status(400).json({ message: "User is already an admin" });
        return;
      }

      user.role = "admin";
      await user.save();

      res.status(200).json({
        message: "User promoted to admin successfully",
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Error adding admin",
        error: (error as Error).message,
      });
    }
  },

  // Remove admin role (admin only)
  removeAdmin: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Authentication required" });
        return;
      }

      if (req.user.role !== "admin") {
        res.status(403).json({ message: "Only admins can remove admin roles" });
        return;
      }

      const { id } = req.params;

      // Prevent removing yourself as admin
      if (id === req.user._id.toString()) {
        res
          .status(400)
          .json({ message: "You cannot remove yourself as admin" });
        return;
      }

      const user = await userModel.findById(id);

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      if (user.role !== "admin") {
        res.status(400).json({ message: "User is not an admin" });
        return;
      }

      user.role = "user";
      await user.save();

      res.status(200).json({
        message: "Admin role removed successfully",
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Error removing admin role",
        error: (error as Error).message,
      });
    }
  },

  // List all admins (admin only)
  getAllAdmins: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Authentication required" });
        return;
      }

      if (req.user.role !== "admin") {
        res.status(403).json({ message: "Only admins can view admin list" });
        return;
      }

      const admins = await userModel.find({ role: "admin" }, "fullName email");

      res.status(200).json({ admins });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching admins",
        error: (error as Error).message,
      });
    }
  },

  // Add or update a verifier (admin only)
  manageVerifier: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Authentication required" });
        return;
      }

      if (req.user.role !== "admin") {
        res.status(403).json({ message: "Only admins can manage verifiers" });
        return;
      }

      const { email, action } = req.body;

      if (!email || !action) {
        res.status(400).json({ message: "Email and action are required" });
        return;
      }

      if (action !== "add" && action !== "remove") {
        res
          .status(400)
          .json({ message: 'Invalid action. Use "add" or "remove"' });
        return;
      }

      const user = await userModel.findOne({ email });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      if (action === "add" && user.role === "verifier") {
        res.status(400).json({ message: "User is already a verifier" });
        return;
      }

      if (action === "remove" && user.role !== "verifier") {
        res.status(400).json({ message: "User is not a verifier" });
        return;
      }

      user.role = action === "add" ? "verifier" : "user";
      await user.save();

      res.status(200).json({
        message:
          action === "add"
            ? "User assigned as verifier"
            : "Verifier role removed",
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Error managing verifier",
        error: (error as Error).message,
      });
    }
  },

  // List all verifiers (admin only)
  getAllVerifiers: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Authentication required" });
        return;
      }

      if (req.user.role !== "admin") {
        res.status(403).json({ message: "Only admins can view verifier list" });
        return;
      }

      const verifiers = await userModel.find(
        { role: "verifier" },
        "fullName email"
      );

      res.status(200).json({ verifiers });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching verifiers",
        error: (error as Error).message,
      });
    }
  },
};
