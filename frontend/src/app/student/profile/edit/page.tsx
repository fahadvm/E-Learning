'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Phone,
  Linkedin,
  Upload,
  Save,
  ArrowLeft,
  Camera
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useStudent } from '@/context/studentContext';
import { studentProfileApi } from '@/services/APIservices/studentApiservice';
import { showSuccessToast, showErrorToast } from '@/utils/Toast';

const CropperModal = dynamic(() => import('@/components/common/ImageCropper'), { ssr: false });

// -------------------- TYPES --------------------
interface SocialLinks {
  linkedin: string;
  gitHub: string;
  leetCode: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  social_links?: Partial<SocialLinks>;
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: 'easeOut' }
};

export default function EditProfilePage() {
  const { student, setStudent } = useStudent();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profilePicture: '',
    about: '',
    social_links: {
      linkedin: '',
      gitHub: '',
      leetCode: '',
    },

    // NEW
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    newEmail: '',
    emailOtp: '',
    emailOtpSent: false
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [showCropper, setShowCropper] = useState(false);
  const [rawImage, setRawImage] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  // -------------------- LOAD FROM CONTEXT --------------------
  useEffect(() => {
    if (student) {
      setFormData(prev => ({
        ...prev,
        name: student.name || '',
        email: student.email || '',
        phone: student.phone || '',
        profilePicture: student.profilePicture || '',
        about: student.about || '',
        social_links: {
          linkedin: student.social_links?.linkedin || '',
          gitHub: student.social_links?.gitHub || '',
          leetCode: student.social_links?.leetCode || ''
        }
      }));
      setImagePreview(student.profilePicture || '');
    }
  }, [student]);

  // -------------------- HANDLERS --------------------
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('social_')) {
      const key = name.replace('social_', '') as keyof SocialLinks;
      setFormData(prev => ({
        ...prev,
        social_links: { ...prev.social_links, [key]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setRawImage(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCroppedImage = (img: string) => {
    setFormData(prev => ({ ...prev, profilePicture: img }));
    setImagePreview(img);
    setShowCropper(false);
  };

  // -------------------- VALIDATION --------------------
  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';

    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Enter a valid 10-digit phone number';
    }

    const validateUrl = (value: string, key: keyof SocialLinks, regex: RegExp) => {
      if (value && !regex.test(value)) {
        if (!newErrors.social_links) newErrors.social_links = {};
        newErrors.social_links[key] = `Enter a valid ${key} URL`;
      }
    };

    validateUrl(formData.social_links.linkedin, 'linkedin', /^https?:\/\/(www\.)?linkedin\.com\/.+$/);
    validateUrl(formData.social_links.gitHub, 'gitHub', /^https?:\/\/(www\.)?github\.com\/.+$/);
    validateUrl(formData.social_links.leetCode, 'leetCode', /^https?:\/\/(www\.)?leetcode\.com\/.+$/);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -------------------- SUBMIT --------------------
  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();

    if (!validateForm()) return;
    setIsSaving(true);

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        about: formData.about,
        profilePicture: formData.profilePicture,
        social_links: formData.social_links
      };

      const res = await studentProfileApi.editProfile(payload);

      if (res?.ok && res.data) {
        showSuccessToast(res.message || 'Profile updated');
        setStudent(res.data);
        router.push('/student/profile');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => router.back();

  // -------------------- UI --------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center gap-4">
          <button onClick={handleCancel} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Edit Profile</h1>
            <p className="text-gray-600 text-sm">Update your personal information</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Profile Image */}
          <motion.div {...fadeIn} className="bg-white rounded-2xl shadow-sm border p-8">
            <h2 className="text-lg font-semibold mb-6">Profile Picture</h2>

            <div className="flex items-center gap-6 flex-col sm:flex-row">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1">
                  <img src={imagePreview || '/default-avatar.png'} className="w-full h-full rounded-full object-cover" />
                </div>

                <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-blue-600 text-white p-3 rounded-full cursor-pointer">
                  <Camera className="w-4 h-4" />
                </label>

                <input id="profile-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>

              <div className="text-center sm:text-left">
                <h3 className="font-semibold text-sm mb-1">Upload new picture</h3>
                <p className="text-gray-600 text-sm mb-4">JPG, PNG or GIF. Max size 5MB</p>

                <label htmlFor="profile-upload" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer inline-flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Choose File
                </label>
              </div>
            </div>
          </motion.div>

          {/* Basic Information */}
          <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-sm border p-8">
            <h2 className="text-lg font-semibold mb-6">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Name */}
              <div>
                <label className="block mb-2 text-sm font-medium">Name *</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
                />
                {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block mb-2 text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    name="email"
                    value={formData.email}
                    readOnly
                    className="w-full px-11 py-3 border bg-gray-100 rounded-lg cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block mb-2 text-sm font-medium">Phone *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-11 py-3 border rounded-lg ${errors.phone ? 'border-red-400' : 'border-gray-300'}`}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
              </div>

              {/* About */}
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium">About</label>
                <textarea
                  name="about"
                  rows={4}
                  value={formData.about}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg border-gray-300 resize-none"
                />
              </div>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-sm border p-8">
            <h2 className="text-lg font-semibold mb-6">Social Links</h2>

            <div className="space-y-5">
              <SocialInput
                label="LinkedIn"
                icon={<Linkedin className="w-5 h-5 text-gray-400" />}
                name="linkedin"
                value={formData.social_links.linkedin}
                error={errors.social_links?.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
              />

              <SocialInput
                label="GitHub"
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.85 10.95..." />
                  </svg>
                }
                name="gitHub"
                value={formData.social_links.gitHub}
                error={errors.social_links?.gitHub}
                onChange={handleChange}
                placeholder="https://github.com/username"
              />

              <SocialInput
                label="LeetCode"
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.37 2.01a1 1 0 0 0-1.74 0L3.13 17.7..." />
                  </svg>
                }
                name="leetCode"
                value={formData.social_links.leetCode}
                error={errors.social_links?.leetCode}
                onChange={handleChange}
                placeholder="https://leetcode.com/username"
              />
            </div>
          </motion.div>

          {/* SECURITY SETTINGS */}
          <motion.div {...fadeIn} transition={{ delay: 0.25 }} className="bg-white rounded-2xl shadow-sm border p-8">
            <h2 className="text-lg font-semibold mb-6">Security Settings</h2>

            {/* CHANGE PASSWORD */}
            <div className="mb-10">
              <h3 className="font-semibold text-md mb-3">Change Password</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm font-medium">Current Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border rounded-lg border-gray-300"
                    onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border rounded-lg border-gray-300"
                    onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border rounded-lg border-gray-300"
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmNewPassword: e.target.value }))}
                  />
                </div>
              </div>

              <button
                type="button"
                className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg"
                onClick={async () => {
                  if (formData.newPassword !== formData.confirmNewPassword) {
                    showErrorToast("Passwords do not match");
                    return;
                  }

                  const res = await studentProfileApi.changePassword({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                  });

                  if (res.ok) {
                    showSuccessToast("Password updated successfully");
                    setFormData(prev => ({
                      ...prev,
                      currentPassword: '',
                      newPassword: '',
                      confirmNewPassword: ''
                    }));
                  }
                }}
              >
                Update Password
              </button>
            </div>

            {/* CHANGE EMAIL */}
            <div>
              <h3 className="font-semibold text-md mb-3">Change Email</h3>

              <label className="block mb-2 text-sm font-medium">New Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 border rounded-lg border-gray-300"
                onChange={(e) => setFormData(prev => ({ ...prev, newEmail: e.target.value }))}
              />

              <button
                type="button"
                className="mt-4 px-5 py-2 bg-purple-600 text-white rounded-lg"
                onClick={async () => {
                  const res = await studentProfileApi.sendEmailOtp({ newEmail: formData.newEmail });

                  if (res.ok) {
                    showSuccessToast("OTP sent to new email");
                    setFormData(prev => ({ ...prev, emailOtpSent: true }));
                  }
                }}
              >
                Send OTP
              </button>

              {/* OTP Section */}
              {formData.emailOtpSent && (
                <div className="mt-6">
                  <label className="block mb-2 text-sm font-medium">Enter OTP</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border rounded-lg border-gray-300"
                    onChange={(e) => setFormData(prev => ({ ...prev, emailOtp: e.target.value }))}
                  />

                  <button
                    type="button"
                    className="mt-4 px-5 py-2 bg-green-600 text-white rounded-lg"
                    onClick={async () => {
                      const res = await studentProfileApi.verifyEmailOtp({
                        newEmail: formData.newEmail,
                        otp: formData.emailOtp
                      });

                      if (res.ok && res.data) {
                        showSuccessToast("Email updated successfully");
                        setStudent(res.data);
                        setFormData(prev => ({
                          ...prev,
                          emailOtpSent: false,
                          emailOtp: ''
                        }));
                      }
                    }}
                  >
                    Verify & Update Email
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Buttons */}
          <motion.div {...fadeIn} transition={{ delay: 0.3 }} className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              Save Changes
            </button>
          </motion.div>

        </form>
      </div>

      {/* Cropper Modal */}
      {showCropper && (
        <CropperModal
          image={rawImage}
          onCropComplete={handleCroppedImage}
          onClose={() => setShowCropper(false)}
        />
      )}
    </div>
  );
}

/* Reusable Social Input */
function SocialInput({
  label,
  icon,
  name,
  value,
  onChange,
  error,
  placeholder
}: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>

      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>

        <input
          type="url"
          name={`social_${name}`}
          value={value}
          onChange={onChange}
          className={`w-full pl-11 pr-4 py-3 border rounded-lg 
            ${error ? 'border-red-400' : 'border-gray-300'}
            focus:ring-2 focus:ring-blue-500`}
          placeholder={placeholder}
        />
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
