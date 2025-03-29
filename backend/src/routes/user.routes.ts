import express from "express";
const router = express.Router();
import { body } from "express-validator";
import {
  registerUser,
  loginUser,
  verifyOTP,
  resendOTP,
  getUser,
  updateUser,
} from "../controllers/user.controller";

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullName")
      .isLength({ min: 3 })
      .withMessage("First name should be minimum of 3 characters long."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be of atleast 6 characters."),
  ],
  registerUser
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be of atleast 6 characters."),
  ],
  loginUser
);

router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.put("/update/:userId", updateUser);
router.get("/single/:userId", getUser);

//TODO:- Add routes for forgot password, reset password, and change password
//TODO:- Add middleware to check for admin access through token and also use that to get user details for update process.

export default router;
