"use client";
import { useState ,useEffect} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { companyApiMethods } from "@/services/APImethods/companyAPImethods";
import { showSuccessToast } from "@/utils/Toast";

export default function CompanySignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  const router = useRouter();


  // Password validation regex
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
   
  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "", email: "", password: "", confirmPassword: "" };

    // Validate name
    if (!name.trim()) {
      newErrors.name = "Company Name is required";
      isValid = false;
    }

    // Validate email
    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    // Validate password
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character";
      isValid = false;
    }

    // Validate confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    if (!validateForm()) {
      return;
    }

    try {
      const response = await companyApiMethods.signup({ name, email, password })
      if(response.ok){
        showSuccessToast(response.message)
         setMessage("✅ OTP sent to your email");
         localStorage.setItem("tempComSignupEmail", email);
         router.push("/company/verify-otp");
      }
    } catch (err: any) {
      setMessage(`❌ ${err?.response?.data?.message || "Signup failed"}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sign Up Form */}
      <div className="w-full lg:w-1/2 p-10 sm:p-16 bg-white flex flex-col justify-center items-center shadow-2xl">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">
          Sign Up to DevNext
        </h1>

        <div className="flex items-center space-x-4 mb-6">
          <button className="p-3 bg-blue-500 border border-gray-300 rounded-full shadow-md hover:bg-blue-400 transition-transform transform hover:scale-105 text-lg font-semibold">
            G
          </button>
        </div>

        <p className="text-gray-500 font-medium mb-4">OR</p>

        <form onSubmit={handleSignup} className="w-full max-w-md space-y-5">
          <div>
            <input
              type="text"
              placeholder="Company Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`p-3 border border-gray-300 text-gray-800 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 shadow-sm ${
                errors.name ? "border-red-500" : ""
              }`}
              required
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`p-3 border border-gray-300 text-gray-800 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 shadow-sm ${
                errors.email ? "border-red-500" : ""
              }`}
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`p-3 border border-gray-300 text-gray-800 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 shadow-sm ${
                errors.password ? "border-red-500" : ""
              }`}
              required
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`p-3 border border-gray-300 text-gray-800 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 shadow-sm ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
              required
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-lg font-semibold hover:from-gray-700 hover:to-gray-700 transition-all shadow-md hover:shadow-lg"
          >
            Continue with Email
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm font-medium text-gray-700">
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/company/login" className="text-blue-600 hover:underline font-medium">
            Sign In
          </a>
        </p>

        <p className="mt-4 text-center text-gray-400 text-xs">
          Terms • Privacy • Help
        </p>
      </div>

      {/* Right Banner with arrows */}
      <div className="hidden lg:flex w-1/2 p-12 bg-gradient-to-br from-gray-800 to-gray-900 text-white flex-col justify-center items-center">
        <h2 className="text-3xl font-bold mb-6 tracking-wide">Company Sign Up</h2>

        <img
          src="/companyLogin.jpg"
          alt="company"
          className="mb-6 rounded-lg shadow-lg w-96 h-96 object-cover"
        />

        <p className="text-lg text-gray-200 text-center max-w-lg leading-relaxed">
          DevNext is your ultimate platform to master coding, connect with expert mentors, and elevate your tech career to new heights!
        </p>

        <div className="flex justify-center space-x-6 mt-10">
          <button
            onClick={() => router.push("/student/login")}
            className="p-3 bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-gray-900 transition-transform transform hover:scale-110"
            title="Teacher Login"
          >
            ←
          </button>
          <button
            onClick={() => router.push("/student/login")}
            className="p-3 bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-gray-900 transition-transform transform hover:scale-110"
            title="Company Login"
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