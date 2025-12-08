"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { showInfoToast, showSuccessToast } from "@/utils/Toast";

interface Props {
  localStorageKey: string;
  verifyUrl: any;
  resendUrl: any;
  redirectPath: string;
  purpose: string;
  backToPath?: string;
}

export default function OtpVerificationPage({
  localStorageKey,
  verifyUrl,
  resendUrl,
  redirectPath,
  purpose,
  backToPath = "/",
}: Props) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const router = useRouter();


  useEffect(() => {
    const storedEmail = localStorage.getItem(localStorageKey);
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setMessage("Email not found. Please signup again.");
    }
  }, [localStorageKey]);

  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (timer > 0) {
      countdown = setTimeout(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setIsButtonDisabled(false);
    }
    return () => clearTimeout(countdown);
  }, [timer]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !otp) {
      setMessage("Missing email or OTP");
      return;
    }

    try {
      const res = await verifyUrl({ email, otp });
      console.log("response form verify otp",res)
      if (res?.ok) {
        showSuccessToast(res.message);
        if (localStorageKey !== "tempforgetEmail") {
          localStorage.removeItem(localStorageKey);
        }
        router.push(redirectPath);
      }else{
        setMessage(res?.message)
      }

    } catch (err: any) {
      console.log(err)
      setMessage(err?.response?.data?.message || "Verification failed");
    }
  }

  const handleResendOtp = async () => {
    setIsResending(true);
    setMessage("");

    try {
      const res = await resendUrl({ email, purpose });
      if(res?.ok){
        showSuccessToast(res?.message)
        setTimer(1);
        setIsButtonDisabled(true);
      }else{
        showInfoToast(res?.message)
      }


    } catch (err: any) {
      console.log("response:", err)
      setMessage(err?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Verify OTP</h1>
        <p className="text-gray-700 text-center mb-2">
          We sent an OTP to <strong>{email}</strong>
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={6}
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="p-3 border border-gray-300 text-gray-800 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className="w-full p-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all"
          >
            Verify
          </button>
        </form>

        <div className="mt-4 text-center">
          {isButtonDisabled ? (
            <p className="text-sm text-gray-500">Resend OTP in {timer}s</p>
          ) : (
            <button
              onClick={handleResendOtp}
              disabled={isResending}
              className="text-blue-600 hover:underline text-sm font-medium disabled:opacity-50"
            >
              {isResending ? "Resending..." : "Resend OTP"}
            </button>
          )}
        </div>

        {message && (
          <p className="mt-4 text-center font-medium text-sm text-gray-700">{message}</p>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          Didn’t receive the code?{" "}
          <a href={backToPath} className="text-blue-600 hover:underline">
            Go back to Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
