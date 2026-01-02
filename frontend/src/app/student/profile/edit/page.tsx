"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { ArrowLeft, Camera, Save, Eye, EyeOff, RefreshCw } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/student/header";
import { useStudent } from "@/context/studentContext";
import { studentProfileApi } from "@/services/APIservices/studentApiservice";
import { showSuccessToast, showErrorToast } from "@/utils/Toast";
import { motion } from "framer-motion";
import { cubicBezier } from "framer-motion";


const CropperModal = dynamic(() => import("@/components/common/ImageCropper"), {
  ssr: false,
});

interface ProfileErrors {
  name?: string;
  phone?: string;
  about?: string;
  linkedin?: string;
  gitHub?: string;
  leetCode?: string;
  [key: string]: string | undefined;
}

interface PasswordErrors {
  current?: string;
  new?: string;
  confirm?: string;
}

interface EmailErrors {
  email?: string;
  otp?: string;
}

const fadeIn = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.36,
    ease: cubicBezier(0, 0, 0.2, 1),
  },
};


// Reusable Password Input with Eye Toggle
const PasswordInput = ({
  placeholder,
  value,
  onChange,
  error,
}: {
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={error ? "border-red-500 pr-10" : "pr-10"}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default function EditProfilePage() {
  const router = useRouter();
  const { student, setStudent } = useStudent();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    about: "",
    profilePicture: "",
    social_links: { linkedin: "", gitHub: "", leetCode: "" },
  });

  // Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  // Image
  const [imagePreview, setImagePreview] = useState("");
  const [rawImage, setRawImage] = useState("");
  const [showCropper, setShowCropper] = useState(false);

  // Errors & Loading
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [pwErrors, setPwErrors] = useState<PasswordErrors>({});
  const [emailErrors, setEmailErrors] = useState<EmailErrors>({});
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [emailSaving, setEmailSaving] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || "",
        phone: student.phone || "",
        about: student.about || "",
        profilePicture: student.profilePicture || "",
        social_links: {
          linkedin: student.social_links?.linkedin || "",
          gitHub: student.social_links?.gitHub || "",
          leetCode: student.social_links?.leetCode || "",
        },
      });
      setImagePreview(student.profilePicture || "");
    }
  }, [student]);

  // Resend OTP Countdown
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  /* ---------------------- Handlers ---------------------- */
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("social_")) {
      const key = name.replace("social_", "") as "linkedin" | "gitHub" | "leetCode";
      setFormData((p) => ({
        ...p,
        social_links: { ...p.social_links, [key]: value },
      }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
    // Clear error on change
    setErrors((prev: ProfileErrors) => ({ ...prev, [name]: "" }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showErrorToast("Please upload a valid image");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showErrorToast("Image must be under 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setRawImage(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCroppedImage = (img: string) => {
    setImagePreview(img);
    setFormData((p) => ({ ...p, profilePicture: img }));
    setShowCropper(false);
  };

  /* ---------------------- Validation Functions ---------------------- */
  const validateProfile = () => {
    const newErrors: ProfileErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    else if (formData.name.trim().length < 2) newErrors.name = "Name must be at least 2 characters";

    const cleanPhone = formData.phone.replace(/\D/g, "");

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (cleanPhone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    } else if (/^0/.test(cleanPhone)) {
      newErrors.phone = "Phone number cannot start with 0";
    } else if (/^0+$/.test(cleanPhone)) {
      newErrors.phone = "Invalid phone number (all zeros not allowed)";
    } else if (!/^\d{10}$/.test(cleanPhone)) {
      newErrors.phone = "Only digits allowed";
    }
    if (formData.about && formData.about.length > 500)
      newErrors.about = "About section must be under 500 characters";

    // Social links - optional but validate format if provided
    if (formData.social_links.linkedin && !/^https?:\/\/(www\.)?linkedin\.com\/in\/.+/i.test(formData.social_links.linkedin))
      newErrors.linkedin = "Invalid LinkedIn URL";

    if (formData.social_links.gitHub && !/^https?:\/\/(www\.)?github\.com\/.+/i.test(formData.social_links.gitHub))
      newErrors.gitHub = "Invalid GitHub URL";

    if (formData.social_links.leetCode && !/^https?:\/\/(www\.)?leetcode\.com\/.+/i.test(formData.social_links.leetCode))
      newErrors.leetCode = "Invalid LeetCode URL";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const err: PasswordErrors = {};
    if (!currentPassword) err.current = "Current password is required";
    if (!newPassword) err.new = "New password is required";
    else if (newPassword.length < 8) err.new = "Password must be at least 8 characters";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword))
      err.new = "Password must contain uppercase, lowercase, and number";

    if (newPassword !== confirmNewPassword) err.confirm = "Passwords do not match";

    setPwErrors(err);
    return Object.keys(err).length === 0;
  };

  const validateEmail = () => {
    const err: EmailErrors = {};
    if (!newEmail) err.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) err.email = "Invalid email address";
    setEmailErrors(err);
    return Object.keys(err).length === 0;
  };

  const validateOtp = () => {
    if (!emailOtp || emailOtp.length !== 6 || !/^\d+$/.test(emailOtp)) {
      setEmailErrors({ otp: "Enter a valid 6-digit OTP" });
      return false;
    }
    setEmailErrors({});
    return true;
  };

  /* ---------------------- Submit Handlers ---------------------- */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateProfile()) return;

    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.replace(/\D/g, ""),
        about: formData.about.trim(),
        profilePicture: formData.profilePicture,
        social_links: {
          linkedin: formData.social_links.linkedin.trim(),
          gitHub: formData.social_links.gitHub.trim(),
          leetCode: formData.social_links.leetCode.trim(),
        },
      };

      const res = await studentProfileApi.editProfile(payload);
      if (res?.ok && res.data) {
        showSuccessToast(res.message || "Profile updated successfully");
        setStudent(res.data);
        router.push("/student/profile");
      } else {
        showErrorToast(res?.message || "Failed to update profile");
      }
    } catch (err) {
      console.log(err)
      showErrorToast("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;
    setPwSaving(true);
    try {
      const res = await studentProfileApi.changePassword({
        currentPassword,
        newPassword,
      });
      if (res?.ok) {
        showSuccessToast("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setPwErrors({});
      } else {
        showErrorToast(res?.message || "Failed to change password");
      }
    } catch (err) {
      console.log(err)
      showErrorToast("Something went wrong");
    } finally {
      setPwSaving(false);
    }
  };

  const handleSendEmailOtp = async () => {
    if (!validateEmail()) return;
    setEmailSaving(true);
    try {
      const res = await studentProfileApi.sendEmailOtp({ newEmail });
      if (res?.ok) {
        showSuccessToast("OTP sent successfully!");
        setEmailOtpSent(true);
        setResendCountdown(30);
        setEmailErrors({});
      } else {
        showErrorToast(res?.message || "Failed to send OTP");
      }
    } catch (err) {
      console.log(err)
      showErrorToast("Failed to send OTP");
    } finally {
      setEmailSaving(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCountdown > 0) return;
    await handleSendEmailOtp();
  };

  const handleVerifyEmailOtp = async () => {
    if (!validateOtp()) return;
    setEmailSaving(true);
    try {
      const res = await studentProfileApi.verifyEmailOtp({
        newEmail,
        otp: emailOtp,
      });
      if (res?.ok && res.data) {
        showSuccessToast("Email updated successfully!");
        setStudent(res.data);
        setNewEmail("");
        setEmailOtp("");
        setEmailOtpSent(false);
        setEmailErrors({});
      } else {
        showErrorToast(res?.message || "Invalid or expired OTP");
      }
    } catch (err) {
      console.log(err)
      showErrorToast("Verification failed");
    } finally {
      setEmailSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="border-b bg-card p-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-md hover:bg-muted transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Edit Profile</h1>
            <p className="text-sm text-muted-foreground">Update your personal details</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto w-full px-4 py-8 space-y-8">
        {/* Profile Picture */}
        <motion.div {...fadeIn} className="bg-card border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Profile Picture</h2>
          <div className="flex items-center gap-6 flex-wrap">
            <div className="relative">
              <Avatar className="w-28 h-28 border-2">
                <AvatarImage src={imagePreview} />
                <AvatarFallback>{formData.name.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <label htmlFor="upload" className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer shadow-lg hover:scale-110 transition">
                <Camera size={18} />
              </label>
              <input id="upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Upload a professional photo</p>
              <p className="text-xs mt-1">PNG, JPG • Max 5MB</p>
            </div>
          </div>
        </motion.div>

        {/* Basic Info */}
        <motion.div {...fadeIn} transition={{ delay: 0.06 }} className="bg-card border rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-semibold">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium mb-1 block">Full Name *</label>
              <Input name="name" value={formData.name} onChange={handleChange} className={errors.name ? "border-red-500" : ""} />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Phone Number *</label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10); // Only digits, max 10
                  setFormData((p) => ({ ...p, phone: value }));
                  setErrors((prev: ProfileErrors) => ({ ...prev, phone: "" })); // Clear error on typing
                }}
                placeholder="e.g. 9876543210"
                maxLength={10}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              <p className="text-xs text-muted-foreground mt-1">
                {formData.phone.length}/10 digits
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1 block">About (Optional)</label>
              <Textarea name="about" rows={4} value={formData.about} onChange={handleChange} placeholder="Tell us about yourself..." />
              {errors.about && <p className="text-xs text-red-500 mt-1">{errors.about}</p>}
              <p className="text-xs text-muted-foreground text-right">{formData.about.length}/500</p>
            </div>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div {...fadeIn} transition={{ delay: 0.12 }} className="bg-card border rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-semibold">Social Links (Optional)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium mb-1 block">LinkedIn</label>
              <Input name="social_linkedin" value={formData.social_links.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/username" />
              {errors.linkedin && <p className="text-xs text-red-500 mt-1">{errors.linkedin}</p>}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">GitHub</label>
              <Input name="social_gitHub" value={formData.social_links.gitHub} onChange={handleChange} placeholder="https://github.com/username" />
              {errors.gitHub && <p className="text-xs text-red-500 mt-1">{errors.gitHub}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1 block">LeetCode</label>
              <Input name="social_leetCode" value={formData.social_links.leetCode} onChange={handleChange} placeholder="https://leetcode.com/username" />
              {errors.leetCode && <p className="text-xs text-red-500 mt-1">{errors.leetCode}</p>}
            </div>
          </div>
        </motion.div>

        {/* Security Settings */}
        <motion.div {...fadeIn} transition={{ delay: 0.18 }} className="bg-card border rounded-xl p-6 space-y-8">
          <h2 className="text-lg font-semibold">Security Settings</h2>

          {/* Change Password */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Change Password</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PasswordInput placeholder="Current password" value={currentPassword} onChange={(e) => { setCurrentPassword(e.target.value); setPwErrors({ ...pwErrors, current: "" }); }} error={pwErrors.current} />
              <PasswordInput placeholder="New password" value={newPassword} onChange={(e) => { setNewPassword(e.target.value); setPwErrors({ ...pwErrors, new: "" }); }} error={pwErrors.new} />
              <PasswordInput placeholder="Confirm new password" value={confirmNewPassword} onChange={(e) => { setConfirmNewPassword(e.target.value); setPwErrors({ ...pwErrors, confirm: "" }); }} error={pwErrors.confirm} />
            </div>
            <button
              type="button"
              onClick={handleChangePassword}
              disabled={pwSaving || !currentPassword || !newPassword || !confirmNewPassword}
              className="px-5 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50 flex items-center gap-2"
            >
              {pwSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Update Password"}
            </button>
          </div>

          <hr className="border-border" />

          {/* Change Email */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Change Email Address</h3>

            {!emailOtpSent ? (
              <div className="flex gap-3 items-start">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="Enter new email"
                    value={newEmail}
                    onChange={(e) => { setNewEmail(e.target.value); setEmailErrors({}); }}
                    className={emailErrors.email ? "border-red-500" : ""}
                  />
                  {emailErrors.email && <p className="text-xs text-red-500 mt-1">{emailErrors.email}</p>}
                </div>
                <button
                  type="button"
                  onClick={handleSendEmailOtp}
                  disabled={emailSaving || !newEmail}
                  className="px-5 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
                >
                  {emailSaving ? "Sending..." : "Send OTP"}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className={emailErrors.otp ? "border-red-500" : ""}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyEmailOtp}
                    disabled={emailSaving || emailOtp.length !== 6}
                    className="px-5 py-2 bg-green-600 text-white rounded-md disabled:opacity-50"
                  >
                    Verify
                  </button>
                </div>
                {emailErrors.otp && <p className="text-xs text-red-500">{emailErrors.otp}</p>}

                <div className="text-sm text-muted-foreground">
                  Didn't receive OTP?{" "}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCountdown > 0}
                    className="text-primary hover:underline font-medium inline-flex items-center gap-1 disabled:opacity-50"
                  >
                    <RefreshCw size={14} className={resendCountdown > 0 ? "animate-spin" : ""} />
                    Resend {resendCountdown > 0 && `(${resendCountdown}s)`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Save/Cancel Buttons */}
        <motion.div {...fadeIn} transition={{ delay: 0.24 }} className="flex justify-end gap-3 pb-10">
          <button type="button" onClick={() => router.back()} className="px-6 py-2 border rounded-md hover:bg-muted transition">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
            Save Changes
          </button>
        </motion.div>
      </form>

      {showCropper && (
        <CropperModal image={rawImage} onCropComplete={handleCroppedImage} onClose={() => setShowCropper(false)} />
      )}
    </div>
  );
}