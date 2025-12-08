"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { employeeApiMethods } from "@/services/APIservices/employeeApiService";
import { showErrorToast, showSuccessToast } from "@/utils/Toast";

export default function EmailOtpModal({ newEmail, onClose, onSuccess }: any) {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer === 0) { setCanResend(true); return; }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const resendOtp = async () => {
    if (!canResend) return;
    await employeeApiMethods.changeEmailSendOtp({ newEmail });
    showSuccessToast("OTP resent");
    setCanResend(false);
    setTimer(60);
  };

  const verifyOtp = async () => {
    if (!otp) return showErrorToast("Enter OTP");
    setLoading(true);
    try {
      await employeeApiMethods.verifyChangeEmail({ newEmail, otp });
      showSuccessToast("Email updated!");
      onSuccess();
      onClose();
    } catch (err: any) {
      showErrorToast(err?.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Verify Email</h2>
      <p className="text-sm text-gray-600">
        Enter OTP sent to <strong>{newEmail}</strong>
      </p>

      <Input
        maxLength={6}
        className="text-center font-bold"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <div className="flex justify-between text-sm">
        {canResend ? (
          <button className="text-indigo-600" onClick={resendOtp}>Resend OTP</button>
        ) : (
          <span className="text-gray-500">Resend in {timer}s</span>
        )}
      </div>

      <Button onClick={verifyOtp} disabled={loading} className="w-full">
        {loading ? "Verifying..." : "Verify & Update Email"}
      </Button>
    </div>
  );
}
