"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminApiMethods } from "@/services/APImethods/adminAPImethods";
import { showErrorToast, showSuccessToast } from "@/utils/Toast";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const validateEmail = (email: string): string => {
    if (!email) return "Email is required";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) ? "" : "Invalid email format";
  };

  const validatePassword = (password: string): string => {
    if (!password) return "Password is required";
    return password.length < 8 ? "Password must be at least 8 characters" : "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    setEmailError(emailErr);
    setPasswordError(passErr);

    if (emailErr || passErr) return;

    try {
      const res = await adminApiMethods.login({email,password})
      if (res.ok) {
        localStorage.setItem("adminToken", res.data.token);
        showSuccessToast(res.message)
        router.push("/admin/dashboard");
      }
    } catch (err) {
      console.error(err);
      setMessageType("error");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 p-8 sm:p-12 bg-white flex flex-col justify-center items-center shadow-2xl">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Admin Login</h1>

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(validateEmail(e.target.value));
              }}
              className={`p-3 border ${
                emailError ? "border-red-500" : "border-gray-300"
              } rounded-lg w-full focus:ring-2 focus:ring-blue-500 text-gray-900`}
            />
            {emailError && (
              <p className="text-sm text-red-600 mt-1">{emailError}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(validatePassword(e.target.value));
              }}
              className={`p-3 border ${
                passwordError ? "border-red-500" : "border-gray-300"
              } rounded-lg w-full focus:ring-2 focus:ring-blue-500 text-gray-900`}
            />
            {passwordError && (
              <p className="text-sm text-red-600 mt-1">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-lg font-semibold hover:from-gray-700 hover:to-gray-700 transition-all"
          >
            Sign In
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center text-sm font-medium ${
              messageType === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-gray-600">
          Not a Admin?{" "}
          <a
            href="/student/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Go to Student Login
          </a>
        </p>

        <p className="mt-4 text-center text-gray-400 text-xs">
          © 2025 DevNext. All rights reserved.
        </p>
      </div>

      {/* Right Side - Banner */}
      <div className="hidden lg:flex w-1/2 p-12 bg-gradient-to-br from-gray-800 to-gray-900 text-white flex-col justify-center items-center">
        <h2 className="text-3xl font-bold mb-6 tracking-wide">ADMIN PANEL</h2>

        

        <p className="text-lg text-gray-200 text-center max-w-lg leading-relaxed">
          Manage companies, monitor users, and keep DevNext running smoothly from
          one central admin hub.
        </p>
      </div>
    </div>
  );
}
