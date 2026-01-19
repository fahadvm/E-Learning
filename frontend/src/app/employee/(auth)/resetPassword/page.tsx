"use client";
import { useState, useEffect } from "react";
import type { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { employeeApiMethods } from "@/services/APIservices/employeeApiService";
import { showInfoToast, showSuccessToast } from "@/utils/Toast";

interface SignupForm {
  password: string;
  confirmPassword: string;
}

export default function StudentResetPasswordPage() {
  const [formData, setFormData] = useState<SignupForm>({ password: "", confirmPassword: "" });
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();



  useEffect(() => {
    const storedEmail = localStorage.getItem("tempforgetEmail");
    console.log("storedEmail:", storedEmail);
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setMessage("No email found. Please restart the password reset process.");
      router.push("/employee/forgetPassword");
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage("");
  };

  const validateForm = (): boolean => {
    const { password, confirmPassword } = formData;
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
      setMessage("Password must be at least 8 characters and include uppercase, lowercase, and a number");
      return false;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await employeeApiMethods.setNewPassword({
        email,
        newPassword: formData.password
      })
      if (response?.ok) {
        showSuccessToast(response?.message)
        localStorage.removeItem("tempforgetEmail");
        router.push("/employee/login");
      } else {
        showInfoToast(response?.message)
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      if (error.response?.status === 400) {
        setMessage(error.response.data?.message || "Invalid input data");
      } else if (error.response?.status === 429) {
        setMessage("Too many requests, please try again later");
      } else {
        setMessage(error.response?.data?.message || "Password reset failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Section: Reset Password Form */}
      <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-16 bg-white flex flex-col justify-center items-center shadow-2xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">
          Reset Password
        </h1>

        <form onSubmit={handleResetPassword} className="w-full max-w-md space-y-5">
          <div>
            <label htmlFor="password" className="sr-only">New Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="New Password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
              className="p-3 border border-gray-300 rounded-lg w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 shadow-sm"
              required
              aria-describedby={message && formData.password ? "password-error" : undefined}
            />
            {message && formData.password && (
              <span id="password-error" className="text-sm text-red-500">{message}</span>
            )}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="sr-only">Confirm New Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              disabled={isLoading}
              className="p-3 border border-gray-300 rounded-lg w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 shadow-sm"
              required
              aria-describedby={message && formData.confirmPassword ? "confirm-password-error" : undefined}
            />
            {message && formData.confirmPassword && (
              <span id="confirm-password-error" className="text-sm text-red-500">{message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full p-3 bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-lg font-semibold hover:from-gray-700 hover:to-gray-700 transition-all shadow-md hover:shadow-lg ${isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            aria-label="Reset Password"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Loading...
              </span>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>



        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/employee/login" className="text-blue-600 hover:underline font-medium">
            Sign In
          </a>
        </p>
        <p className="mt-4 text-center text-gray-400 text-xs">
          Terms • Privacy • Help
        </p>
      </div>

      {/* Right Section: Decorative */}
      <div className="hidden lg:flex w-1/2 p-12 bg-gradient-to-br from-gray-800 to-gray-900 text-white flex-col justify-center items-center">
        <h2 className="text-3xl font-bold mb-6 tracking-wide">Student Sign Up</h2>
        <img
          src="/employeeLogin.png"
          alt="Student illustration"
          className="mb-6 rounded-lg shadow-lg w-96 h-96 object-cover"
          onError={(e) => (e.currentTarget.src = "/fallback-image.png")}
        />
        <p className="text-lg text-gray-200 text-center max-w-lg leading-relaxed">
          DevNext is your ultimate platform to master coding, connect with expert mentors, and elevate your tech career to new heights!
        </p>
        <div className="flex justify-center space-x-6 mt-10">
          <button
            onClick={() => router.push("/teacher/login")}
            className="p-3 bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-gray-900 transition-transform transform hover:scale-110"
            title="Switch to Teacher Login"
            aria-label="Switch to Teacher Login"
          >
            ←
          </button>
          <button
            onClick={() => router.push("/company/login")}
            className="p-3 bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-gray-900 transition-transform transform hover:scale-110"
            title="Switch to Company Login"
            aria-label="Switch to Company Login"
          >
            →
          </button>
        </div>
        <p className="mt-10 text-center text-gray-400 text-xs">
          © 2025 DevNext. All rights reserved.
        </p>
      </div>
    </div>
  );
}
