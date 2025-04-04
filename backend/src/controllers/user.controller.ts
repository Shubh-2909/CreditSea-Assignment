const { userModel } = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
import { sendOTPEmail } from "../services/email.service";

export const registerUser = async (req: any, res: any, next: any) => {
  console.log("HIJOJO");
  try {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await userModel.hashPassword(password);
    const otp = userModel.generateOTP();

    // Create user with OTP
    const user = await userService.createUser({
      fullName,
      email,
      password: hashedPassword,
      role,
      otp: {
        code: otp,
        expiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
      },
    });

    console.log({
      code: otp,
      expiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
    });

    console.log(user);

    // Send OTP email
    await sendOTPEmail(email, otp);

    res.status(201).json({
      message:
        "Registration successful. Please verify your email with the OTP sent.",
      userId: user._id,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res
      .status(500)
      .json({ message: "Failed to register user. Please try again later." });
  }
};

export const verifyOTP = async (req: any, res: any, next: any) => {
  try {
    const { userId, otp } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (!user.otp || !user.otp.code || !user.otp.expiry) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    if (new Date() > user.otp.expiry) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (user.otp.code !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Verify user and remove OTP
    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    const token = user.generateAuthToken();

    // Set Authorization header with the token
    res.set("Authorization", `Bearer ${token}`);

    res.status(200).json({
      message: "Email verified successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res
      .status(500)
      .json({ message: "Failed to verify OTP. Please try again." });
  }
};

export const resendOTP = async (req: any, res: any, next: any) => {
  try {
    const { userId } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    const otp = userModel.generateOTP();
    user.otp = {
      code: otp,
      expiry: new Date(Date.now() + 10 * 60 * 1000),
    };
    await user.save();

    await sendOTPEmail(user.email, otp);

    res.status(200).json({
      message: "OTP resent successfully",
      userId: user._id,
    });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    res
      .status(500)
      .json({ message: "Failed to resend OTP. Please try again." });
  }
};

export const loginUser = async (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  if (user.isVerified === false) {
    return res
      .status(401)
      .json({ message: "Login Access Denied: User not verified" });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = user.generateAuthToken();
  res.set("Authorization", `Bearer ${token}`);

  return res.status(200).json({ token, user });
};

export const updateUser = async (req: any, res: any, next: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.params;
    const { fullName, email } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email && email !== user.email) {
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    if (fullName) {
      user.fullName = fullName;
    }

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update User Error:", error);
    res
      .status(500)
      .json({ message: "Failed to update user profile. Please try again." });
  }
};

export const getUser = async (req: any, res: any, next: any) => {
  try {
    const { userId } = req.params;
    console.log(userId);

    const user = await userModel
      .findById({ _id: userId })
      .select("-password -otp");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    console.error("Get User Error:", error);
    res
      .status(500)
      .json({ message: "Unable to fetch user details at the moment." });
  }
};
