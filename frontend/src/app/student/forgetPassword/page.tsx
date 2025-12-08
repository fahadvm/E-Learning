"use client";
import { useState } from "react";
import  { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { studentAuthApi } from "@/services/APIservices/studentApiservice";
import { showInfoToast, showSuccessToast } from "@/utils/Toast";

interface ForgetPasswordForm {
  email: string;
}

export default function StudentSignupPage() {
  const [formData, setFormData] = useState<ForgetPasswordForm>({ email: "" });
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

   

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage(""); // Clear message on input change
  };

  // Form validation
  const validateForm = (): boolean => {
    const { email } = formData;

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("Invalid email format");
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await studentAuthApi.forgotPassword(formData)
      if(response?.ok){
        showSuccessToast(response.message)
        localStorage.setItem("tempforgetEmail", formData.email);
        router.push("/student/verify-forget-otp");
      }else{
        showInfoToast(response?.message)
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      if (error.response?.status === 400) {
        setMessage(error.response.data?.message || "Invalid input data");
      } else if (error.response?.status === 429) {
        setMessage("Too many requests, please try again later");
      } else {
        setMessage(error.response?.data?.message || "Request failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Section: Forget Password Form */}
      <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-16 bg-white flex flex-col justify-center items-center shadow-2xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">
          Forget Password
        </h1>
        <h6 className="text-1xl sm:text-1xl font-bold text-gray-500 mb-8 tracking-tight">Enter Your Email To Reset</h6>

        <form className="w-full max-w-md space-y-5" onSubmit={handleSignup}>
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-lg w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 shadow-sm"
              required
              aria-describedby={message && formData.email ? "email-error" : undefined}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full p-3 bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-lg font-semibold hover:from-gray-700 hover:to-gray-700 transition-all shadow-md hover:shadow-lg ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-label="Send OTP To Email"
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
              "Continue with Email"
            )}
          </button>
        </form>

        {message && (
          <p
            id="form-error"
            className={`mt-4 text-center text-sm font-medium ${message.includes("") ? "text-green-600" : "text-red-600"}`}
            role="alert"
          >
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-gray-600">
          Back to sign in?{" "}
          <a href="/student/login" className="text-blue-600 hover:underline font-medium">
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
          src="/studentLogin.png"
          alt="Student illustration"
          className="mb-6 rounded-lg shadow-lg w-96 h-96 object-cover"
          onError={(e) => (e.currentTarget.src = "/fallback-image.png")} // Fallback image
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
