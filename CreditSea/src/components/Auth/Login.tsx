// src/components/Auth/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { toast } from "react-toastify";
import { loginUser } from "../../slices/authSlice";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      console.log(response);

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        // Try to parse error JSON if available
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || "Login failed");
        } catch (jsonError) {
          // If JSON parsing fails, use status text
          throw new Error(`Login failed: ${response.statusText}`);
        }
      }

      // Now safely parse the successful response
      const data = await response.json();

      // Get the token from response header or body
      const token =
        response.headers.get("Authorization")?.split(" ")[1] || data.token;

      if (!token) {
        throw new Error("No authentication token received");
      }

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

      toast.success("Login successful!");

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
      console.error("Login error:", error);
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-200">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">
          Login to Your Account
        </h2>

        <form onSubmit={handleSubmit}>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 font-medium disabled:bg-green-300"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-slate-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-green-500 hover:text-green-700 font-medium"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
