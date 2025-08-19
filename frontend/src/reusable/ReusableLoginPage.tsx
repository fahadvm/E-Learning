"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { showSuccessToast } from "@/utils/Toast";

interface LoginPageProps<TData = { email: string; password: string }, TResult = any> {
  role: "student" | "company" | "employee" | "teacher";
  apiEndpoint: (data: TData) => Promise<TResult>;
  redirectPath: string;
  signupPath: string;
  forgotPasswordPath: string;
  bannerTitle: string;
  bannerImage: string;
}

export default function ReusableLoginPage({
  role,
  apiEndpoint,
  redirectPath,
  signupPath,
  forgotPasswordPath,
  bannerTitle,
  bannerImage,
}: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const router = useRouter();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    role === "company"
      ? /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
      : /^.{8,}$/;

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };

    if (name === "email") {
      if (!value.trim()) newErrors.email = "Email is required.";
      else if (!emailRegex.test(value)) newErrors.email = "Invalid email format.";
      else newErrors.email = "";
    }

    if (name === "password") {
      if (!value) newErrors.password = "Password is required.";
      else if (!passwordRegex.test(value))
        newErrors.password =
          role === "company"
            ? "Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char."
            : "Password must be at least 8 characters.";
      else newErrors.password = "";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const validateForm = (): boolean => {
    return validateField("email", email) && validateField("password", password);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await apiEndpoint({ email, password });
      localStorage.setItem("token", res.data.token);
      setMessage("✅ Login successful!");
      showSuccessToast(res?.message)
      setTimeout(() => router.push(redirectPath), 1500);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "❌ Login failed";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Side */}
      <div className="w-full lg:w-1/2 p-8 sm:p-12 bg-white flex flex-col justify-center items-center shadow-2xl">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
          Sign In to DevNext
        </h1>

        <div className="flex items-center space-x-4 mb-6">
          <button className="p-3 bg-blue-500 border border-gray-300 rounded-full shadow-md hover:bg-blue-400 transition-transform transform hover:scale-105 text-lg font-semibold">
            G
          </button>
        </div>


        <p className="text-gray-500 font-medium mb-4">OR</p>

        <form onSubmit={handleLogin} className="w-full text-gray-900 max-w-md space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateField("email", e.target.value);
            }}
            className={`p-3 border ${errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validateField("password", e.target.value);
            }}
            className={`p-3 border ${errors.password ? "border-red-500" : "border-gray-300"
              } rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}

          <div className="text-right">
            <a
              href={forgotPasswordPath}
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 ${loading ? "bg-gray-400" : "bg-gradient-to-br from-gray-800 to-gray-900"
              } text-white rounded-lg font-semibold hover:from-gray-700 hover:to-gray-700 transition-all shadow-md hover:shadow-lg`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm font-medium text-gray-700">{message}</p>
        )}

        <p className="mt-6 text-center text-gray-600">
          Need an account?{" "}
          <a href={signupPath} className="text-blue-600 hover:underline font-medium">
            Sign Up
          </a>
        </p>

        <p className="mt-4 text-center text-gray-400 text-xs">Privacy Policy</p>
      </div>

      {/* Right Side Banner */}
      <div className="hidden lg:flex w-1/2 p-12 bg-gradient-to-br from-gray-800 to-gray-900 text-white flex-col justify-center items-center">
        <h2 className="text-3xl font-bold mb-6 tracking-wide">{bannerTitle}</h2>
        <img
          src={bannerImage}
          alt="Banner"
          className="mb-6 rounded-lg shadow-lg w-full h-auto object-cover"
        />
        <p className="text-lg text-gray-200 text-center max-w-lg leading-relaxed">
          DevNext is your ultimate platform to master coding, connect with expert mentors, and elevate your tech career to new heights!
        </p>
        <p className="mt-10 text-center text-gray-400 text-xs">
          © 2025 DevNext. All rights reserved.
        </p>
      </div>
    </div>
  );
}
