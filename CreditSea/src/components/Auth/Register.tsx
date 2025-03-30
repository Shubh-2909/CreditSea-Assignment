// src/components/Auth/Register.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginUser } from "../../slices/authSlice";

// OTP Verification Component
const OTPVerification = ({ userId }: { userId: string }) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/users/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, otp }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "OTP verification failed");
      }

      const data = await response.json();

      // Get the token from response header
      const token =
        response.headers.get("Authorization")?.split(" ")[1] || data.token;

      // Store user data in Redux
      dispatch(
        loginUser({
          user: data.user,
          token,
        })
      );

      // Store in localStorage for persistence
      localStorage.setItem("token", token);
      localStorage.setItem("userId", data.user._id);
      localStorage.setItem("userRole", data.user.role);

      toast.success("Email verified successfully!");

      // Redirect based on role
      switch (data.user.role) {
        case "admin":
          navigate("/admin");
          break;
        case "verifier":
          navigate("/verifier");
          break;
        default:
          navigate("/user");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error(
        error instanceof Error ? error.message : "OTP verification failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);

    try {
      const response = await fetch("http://localhost:3000/users/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to resend OTP");
      }

      const data = await response.json();
      toast.success("OTP has been resent to your email!");
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to resend OTP"
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-200">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">
          Verify Your Email
        </h2>
        <p className="text-slate-600 mb-6 text-center">
          We've sent a verification code to your email. Please enter it below.
        </p>

        <form onSubmit={handleVerify}>
          <div className="mb-6">
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Verification Code
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter 6-digit code"
              maxLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 font-medium disabled:bg-green-300"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-slate-600">
            Didn't receive the code?{" "}
            <button
              onClick={handleResendOTP}
              disabled={resendLoading}
              className="text-green-500 hover:text-green-700 font-medium disabled:text-green-300"
            >
              {resendLoading ? "Resending..." : "Resend Code"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // Default role
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (formData.fullName.length < 3) {
      newErrors.fullName = "Full name should be at least 3 characters long";
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });
      console.log(response);

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        // Try to parse error JSON if available
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || "Registration failed");
        } catch (jsonError) {
          // If JSON parsing fails, use status text
          throw new Error(`Registration failed: ${response.statusText}`);
        }
      }

      // Now safely parse the successful response
      const data = await response.json();

      toast.success("Registration successful! Please verify your email.");
      setUserId(data.userId);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error instanceof Error ? error.message : "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // If we have a userId, show the OTP verification form
  if (userId) {
    return <OTPVerification userId={userId} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-200">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.fullName ? "border-red-500" : "border-slate-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="John Doe"
              required
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.email ? "border-red-500" : "border-slate-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="you@example.com"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.password ? "border-red-500" : "border-slate-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="••••••••"
              required
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.confirmPassword ? "border-red-500" : "border-slate-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="••••••••"
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="user">User</option>
              <option value="verifier">Verifier</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 font-medium disabled:bg-green-300"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-green-500 hover:text-green-700 font-medium"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
