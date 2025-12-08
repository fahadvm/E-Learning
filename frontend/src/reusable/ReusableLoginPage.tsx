"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { showInfoToast, showSuccessToast } from "@/utils/Toast";
import { GoogleLoginButton } from "@/components/student/googleLogin";


interface LoginPageProps<TData = { email: string; password: string }, TResult = any> {
  role: "student" | "company" | "employee" | "teacher";
  apiEndpoint: (data: TData) => Promise<TResult>;
  googleSignup?: (userData: any) => Promise<any>;
  redirectPath: string;
  signupPath: string;
  forgotPasswordPath: string;
  bannerTitle: string;
  bannerImage: string;

}

export default function ReusableLoginPage({
  role,
  apiEndpoint,
  googleSignup,
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
  const [showPassword, setShowPassword] = useState(false);
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

  const handleGoogleSuccess = ( ) => {
    showSuccessToast("Google signup successful!");
    router.push(redirectPath);
  };


  const handleGoogleError = (error: any) => {
    console.error("Google login error:", error);
    showInfoToast("Google login failed. Please try again.");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await apiEndpoint({ email, password });
      showSuccessToast(res?.message);
      router.push(redirectPath);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Login failed.";
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

        {/* Google Signup */}
        {googleSignup && (
          <div className="flex items-center space-x-4 mb-6">
            <GoogleLoginButton
              onLoginSuccess={handleGoogleSuccess}
              onLoginError={handleGoogleError}
              apiRouter={googleSignup} 
            />
          </div>
        )}

        <p className="text-gray-500 font-medium mb-4">OR</p>

        <form onSubmit={handleLogin} className="w-full text-gray-900 max-w-md space-y-4 relative">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateField("email", e.target.value);
            }}
            className={`p-3 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validateField("password", e.target.value);
              }}
              className={`p-3 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10`}
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.048 10.048 0 012.041-3.362M6.223 6.223A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-4.132 5.411M3 3l18 18M15 12a3 3 0 01-3 3c-.795 0-1.543-.31-2.1-.867M9.878 9.878A3 3 0 0112 9c.795 0 1.543.31 2.1.867"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )
              }
            </span>
          </div>
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
            className={`w-full p-3 ${loading ? "bg-gray-400" : "bg-gradient-to-br from-gray-800 to-gray-900"} text-white rounded-lg font-semibold hover:from-gray-700 hover:to-gray-700 transition-all shadow-md hover:shadow-lg`}
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
