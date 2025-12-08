"use client";
import { useState } from "react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { studentAuthApi } from "@/services/APIservices/studentApiservice";
import { showInfoToast, showSuccessToast } from "@/utils/Toast";
import { GoogleLoginButton } from "@/components/student/googleLogin";

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  global?: string;
}

export default function StudentSignupPage() {
  const [formData, setFormData] = useState<SignupForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: undefined, global: undefined }));
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    const { name, email, password, confirmPassword } = formData;

    if (!/^[a-zA-Z\s]{2,}$/.test(name)) {
      errors.name = "Name must be at least 2 characters and contain only letters and spaces";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email format";
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
      errors.password =
        "Password must be at least 8 characters and include uppercase, lowercase, and a number";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await studentAuthApi.signup(formData);

      if (response?.ok) {
        localStorage.setItem("tempSignupEmail", formData.email);
        showSuccessToast(response.message);
        router.push("/student/verify-otp");
      } else {
        showInfoToast(response.message);
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      if (error.response?.data?.message) {
        setFormErrors({ global: error.response.data?.message || "Invalid input data" });
      } else if (error.response?.status === 429) {
        setFormErrors({ global: "Too many requests, please try again later" });
      } else {
        setFormErrors({ global: "Signup failed. Try again later." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = (user: any) => {
    showSuccessToast("Google signup successful!");
    router.push("/student/home");
  };

  const handleGoogleError = (error: any) => {
    console.error("Google login error:", error);
    showInfoToast("Google login failed. Please try again.");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-16 bg-white flex flex-col justify-center items-center shadow-2xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">
          Sign Up to DevNext
        </h1>

        {/* Google Signup */}
        <div className="flex items-center space-x-4 mb-6">
          <GoogleLoginButton
            onLoginSuccess={handleGoogleSuccess}
            onLoginError={handleGoogleError}
            apiRouter={studentAuthApi.googleSignup}

          />
        </div>

        <p className="text-gray-500 font-medium mb-4">OR</p>

        <form onSubmit={handleSignup} className="w-full max-w-md space-y-5">
          {/* Name */}
          <div>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              className={`p-3 border ${formErrors.name ? "border-red-500" : "border-gray-300"
                } rounded-lg w-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm`}
            />
            {formErrors.name && <p className="text-red-600 text-sm mt-1">{formErrors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              className={`p-3 border ${formErrors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg w-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm`}
            />
            {formErrors.email && <p className="text-red-600 text-sm mt-1">{formErrors.email}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create Password"
              value={formData.password}
              onChange={handleInputChange}
              className={`p-3 border ${formErrors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg w-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.048 10.048 0 012.041-3.362M6.223 6.223A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-4.132 5.411M3 3l18 18M15 12a3 3 0 01-3 3c-.795 0-1.543-.31-2.1-.867M9.878 9.878A3 3 0 0112 9c.795 0 1.543.31 2.1.867"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              )}
            </button>
            {formErrors.password && <p className="text-red-600 text-sm mt-1">{formErrors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`p-3 border ${formErrors.confirmPassword ? "border-red-500" : "border-gray-300"
                } rounded-lg w-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.048 10.048 0 012.041-3.362M6.223 6.223A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-4.132 5.411M3 3l18 18M15 12a3 3 0 01-3 3c-.795 0-1.543-.31-2.1-.867M9.878 9.878A3 3 0 0112 9c.795 0 1.543.31 2.1.867"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              )}
            </button>
            {formErrors.confirmPassword && <p className="text-red-600 text-sm mt-1">{formErrors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full p-3 bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-lg font-semibold hover:from-gray-700 hover:to-gray-700 transition-all shadow-md hover:shadow-lg ${isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {isLoading ? "Loading..." : "Continue with Email"}
          </button>
        </form>

        {formErrors.global && (
          <p className="mt-4 text-red-600 text-sm text-center" role="alert">
            {formErrors.global}
          </p>
        )}

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/student/login" className="text-blue-600 hover:underline font-medium">
            Sign In
          </a>
        </p>
      </div>

      {/* Right side visual */}
      <div className="hidden lg:flex w-1/2 p-12 bg-gradient-to-br from-gray-800 to-gray-900 text-white flex-col justify-center items-center">
        <h2 className="text-3xl font-bold mb-6 tracking-wide">Student Sign Up</h2>
        <img
          src="/studentLogin.png"
          alt="Student illustration"
          className="mb-6 rounded-lg shadow-lg w-96 h-96 object-cover"
          onError={(e) => (e.currentTarget.src = "/fallback-image.png")}
        />
        <p className="text-lg text-gray-200 text-center max-w-lg leading-relaxed">
          DevNext is your ultimate platform to master coding, connect with expert mentors, and elevate your tech career to new heights!
        </p>
      </div>
    </div>
  );
}
