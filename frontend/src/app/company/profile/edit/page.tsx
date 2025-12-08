"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useCompany } from "@/context/companyContext";
import { useRouter } from "next/navigation";
import { Mail,  Upload, Lock,  Clock } from "lucide-react";
import Header from "@/components/company/Header";
import { companyApiMethods } from "@/services/APIservices/companyApiService";
import { showSuccessToast, showErrorToast } from "@/utils/Toast";
import dynamic from "next/dynamic";

const CropperModal = dynamic(() => import("@/components/common/ImageCropper"), { ssr: false });

export default function EditCompanyProfile() {
  const { company, setCompany } = useCompany();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    about: "",
    address: "",
    pincode: "",
    social_links: { linkedin: "", instagram: "", twitter: "" },
    profilePicture: "",
  });

  // Email Change State
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string | any }>({});
  const [loading, setLoading] = useState(false);

  const [rawImage, setRawImage] = useState<string>("");
  const [showCropper, setShowCropper] = useState(false);

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        email: company.email || "",
        phone: company.phone || "",
        website: company.website || "",
        about: company.about || "",
        address: company.address || "",
        pincode: company.pincode || "",
        social_links: {
          linkedin: company.social_links?.linkedin || "",
          instagram: company.social_links?.instagram || "",
          twitter: company.social_links?.twitter || "",
        },
        profilePicture: company.profilePicture || "",
      });
    }
  }, [company]);

  // Timer countdown for OTP
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("social_links.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        social_links: { ...prev.social_links, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRawImage(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCroppedImage = (img: string) => {
    setFormData((prev) => ({ ...prev, profilePicture: img }));
    setShowCropper(false);
  };

  const validate = () => {
    const newErrors: any = {};
    if (!formData.name.trim()) newErrors.name = "Company name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.address.trim()) newErrors.address = "Address is required.";
    if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Enter valid 6-digit pincode.";

    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email))
      newErrors.email = "Invalid email format.";
    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone))
      newErrors.phone = "Invalid phone number.";
    if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website))
      newErrors.website = "Invalid website URL.";

    const socialErrors: any = {};
    if (formData.social_links.linkedin && !/^https?:\/\/(www\.)?linkedin\.com\/.+$/.test(formData.social_links.linkedin))
      socialErrors.linkedin = "Enter a valid LinkedIn URL";
    if (formData.social_links.twitter && !/^https?:\/\/(www\.)?twitter\.com\/.+$/.test(formData.social_links.twitter))
      socialErrors.twitter = "Enter a valid Twitter URL";
    if (formData.social_links.instagram && !/^https?:\/\/(www\.)?instagram\.com\/.+$/.test(formData.social_links.instagram))
      socialErrors.instagram = "Enter a valid Instagram URL";

    if (Object.keys(socialErrors).length > 0) newErrors.social_links = socialErrors;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await companyApiMethods.updateCompanyProfile(formData);
      if (res.ok) {
        setCompany(res.data);
        showSuccessToast(res.message);
        router.push("/company/profile");
      }
    } catch (err: any) {
      showErrorToast(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Email Change Functions
  const handleSendOTP = async () => {
    if (!newEmail || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(newEmail)) {
      showErrorToast("Please enter a valid email address");
      return;
    }

    setSendingOtp(true);
    try {
      await companyApiMethods.sendEmailChangeOTP(newEmail);
      showSuccessToast("OTP sent to your new email address");
      setOtpSent(true);
      setTimer(60); // 60 seconds timer
    } catch (err: any) {
      showErrorToast(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      showErrorToast("Please enter a valid 6-digit OTP");
      return;
    }

    setVerifyingOtp(true);
    try {
      const res = await companyApiMethods.verifyEmailChangeOTP(newEmail, otp);
      showSuccessToast("Email updated successfully!");
      setCompany(res.data);
      setFormData((prev) => ({ ...prev, email: newEmail }));
      // Reset email change form
      setNewEmail("");
      setOtp("");
      setOtpSent(false);
      setTimer(0);
    } catch (err: any) {
      showErrorToast(err?.response?.data?.message || "Invalid OTP");
    } finally {
      setVerifyingOtp(false);
    }
  };

  // Password Change Function
  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showErrorToast("All password fields are required");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showErrorToast("New password must be at least 6 characters");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showErrorToast("New passwords do not match");
      return;
    }

    setChangingPassword(true);
    try {
      await companyApiMethods.changePassword(passwordData.currentPassword, passwordData.newPassword);
      showSuccessToast("Password changed successfully!");
      // Reset password form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      showErrorToast(err?.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  if (!company) return <div className="text-center mt-10 text-gray-500">Loading profile...</div>;

  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-screen px-4 sm:px-6 py-10 mt-10">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Main Profile Form */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">Edit Company Profile</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Profile Picture */}
              <div className="flex flex-col gap-2">
                <label className="font-medium">Profile Picture</label>
                <div className="flex items-center gap-4">
                  <img
                    src={formData.profilePicture || "/gallery/avatar.jpg"}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border"
                  />
                  <label className="cursor-pointer bg-gray-100 px-3 py-2 rounded-md border text-sm flex items-center gap-2 hover:bg-gray-200 transition">
                    <Upload size={16} /> Upload
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>

              {/* Company Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Company Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`border rounded-md p-2 w-full ${errors.name ? "border-red-500" : ""}`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block mb-1 font-medium">Email (Read-only)</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="border rounded-md p-2 w-full bg-gray-100 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Use "Change Email" section below to update</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`border rounded-md p-2 w-full ${errors.address ? "border-red-500" : ""}`}
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block mb-1 font-medium">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={handleChange}
                    className={`border rounded-md p-2 w-full ${errors.pincode ? "border-red-500" : ""}`}
                  />
                  {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`border rounded-md p-2 w-full ${errors.phone ? "border-red-500" : ""}`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block mb-1 font-medium">Website</label>
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className={`border rounded-md p-2 w-full ${errors.website ? "border-red-500" : ""}`}
                  />
                  {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium">About Company</label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  className="border rounded-md p-2 w-full h-24"
                />
              </div>

              {/* Social Links */}
              <div className="space-y-2">
                <label className="block mb-1 font-medium">Social Links</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["linkedin", "instagram", "twitter"].map((key) => (
                    <div key={key}>
                      <input
                        type="text"
                        name={`social_links.${key}`}
                        placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                        value={formData.social_links[key as keyof typeof formData.social_links]}
                        onChange={handleChange}
                        className={`border rounded-md p-2 w-full ${errors.social_links?.[key] ? "border-red-500" : ""
                          }`}
                      />
                      {errors.social_links?.[key] && (
                        <p className="text-red-500 text-sm mt-1">{errors.social_links[key]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          {/* Email Change Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Mail size={20} /> Change Email
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">New Email Address</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email"
                  disabled={otpSent}
                  className="border rounded-md p-2 w-full disabled:bg-gray-100"
                />
              </div>

              {!otpSent ? (
                <button
                  onClick={handleSendOTP}
                  disabled={sendingOtp || !newEmail}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {sendingOtp ? "Sending..." : "Send OTP"}
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium">Enter OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="6-digit OTP"
                      maxLength={6}
                      className="border rounded-md p-2 w-full"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleVerifyOTP}
                      disabled={verifyingOtp || otp.length !== 6}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
                    >
                      {verifyingOtp ? "Verifying..." : "Verify OTP"}
                    </button>

                    {timer > 0 ? (
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <Clock size={16} /> Resend in {timer}s
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setOtpSent(false);
                          setOtp("");
                        }}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Password Change Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Lock size={20} /> Change Password
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  className="border rounded-md p-2 w-full"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password (min 6 characters)"
                  className="border rounded-md p-2 w-full"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  className="border rounded-md p-2 w-full"
                />
              </div>

              <button
                onClick={handleChangePassword}
                disabled={changingPassword}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition disabled:opacity-50"
              >
                {changingPassword ? "Changing..." : "Change Password"}
              </button>
            </div>
          </div>
        </div>

        {showCropper && rawImage && (
          <CropperModal
            image={rawImage}
            onCropComplete={handleCroppedImage}
            onClose={() => setShowCropper(false)}
          />
        )}
      </div>
    </>
  );
}
