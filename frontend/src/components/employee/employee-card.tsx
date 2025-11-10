"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { employeeApiMethods } from "@/services/APIservices/employeeApiService";

interface EmployeeCardProps {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  employeeId?: string;
  department?: string;
  position?: string;
  profilePicture?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  onProfileUpdate?: (updatedData: Partial<EmployeeCardProps>) => void;
}

// -------------------------
// MAIN EMPLOYEE CARD
// -------------------------
export function EmployeeCard(props: EmployeeCardProps) {
  const [employeeData, setEmployeeData] = useState(props);
  const [editOpen, setEditOpen] = useState(false);

  const handleProfileUpdate = async (updatedData: Partial<EmployeeCardProps>) => {
    try {
      await employeeApiMethods.editProfile(updatedData);

      // Instantly update local state (no reload)
      setEmployeeData((prev) => ({
        ...prev,
        ...updatedData,
      }));

      props.onProfileUpdate?.(updatedData);
      setEditOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-lg mx-auto bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200"
      >
        {/* Header */}
        <div className="bg-blue-800/70 text-white p-6 flex items-center gap-4">
          <img
            src={employeeData.profilePicture || "/images/profile.jpg"}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-2 border-white"
          />
          <div>
            <h2 className="text-2xl font-bold">{employeeData.name}</h2>
            <p className="text-sm text-blue-100">
              Employee ID: {employeeData.employeeId || "N/A"}
            </p>
            <div className="flex gap-4 text-xs text-blue-100 mt-2">
              <p>Department: {employeeData.department || "-"}</p>
              <p>Position: {employeeData.position || "-"}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-blue-700">Contact Information</h3>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-center gap-2">
                <Mail size={18} /> {employeeData.email}
              </p>
              {employeeData.phone && (
                <p className="flex items-center gap-2">
                  <Phone size={18} /> {employeeData.phone}
                </p>
              )}
              {employeeData.location && (
                <p className="flex items-center gap-2">
                  <MapPin size={18} /> {employeeData.location}
                </p>
              )}
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-blue-700">Social Media</h3>
            <div className="flex items-center gap-8 text-gray-700">
              {employeeData.linkedin && (
                <a
                  href={employeeData.linkedin}
                  target="_blank"
                  className="hover:text-blue-800/70"
                >
                  <Linkedin size={28} />
                </a>
              )}
              {employeeData.github && (
                <a
                  href={employeeData.github}
                  target="_blank"
                  className="hover:text-blue-800/70"
                >
                  <Github size={28} />
                </a>
              )}
              {employeeData.portfolio && (
                <a
                  href={employeeData.portfolio}
                  target="_blank"
                  className="hover:text-blue-800/70"
                >
                  <Globe size={28} />
                </a>
              )}
            </div>
          </div>

          {/* Update Profile Button */}
          <button
            className="w-full bg-blue-800/70 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={() => setEditOpen(true)}
          >
            Update Profile
          </button>
        </div>
      </motion.div>

      {/* Edit Modal */}
      {editOpen && (
        <EmployeeProfileModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          employee={employeeData}
          onSubmit={handleProfileUpdate}
        />
      )}
    </>
  );
}

// -------------------------
// INLINE MODAL COMPONENT
// -------------------------
interface EmployeeProfileModalProps {
  open: boolean;
  onClose: () => void;
  employee: EmployeeCardProps;
  onSubmit: (updatedData: Partial<EmployeeCardProps>) => void;
}

function EmployeeProfileModal({
  open,
  onClose,
  employee,
  onSubmit,
}: EmployeeProfileModalProps) {
  const [formData, setFormData] = useState({
    name: employee.name || "",
    phone: employee.phone || "",
    location: employee.location || "",
    department: employee.department || "",
    position: employee.position || "",
    linkedin: employee.linkedin || "",
    github: employee.github || "",
    portfolio: employee.portfolio || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone))
      newErrors.phone = "Enter a valid 10-digit phone number";
    if (formData.linkedin && !/^https?:\/\/.+/.test(formData.linkedin))
      newErrors.linkedin = "Enter a valid LinkedIn URL";
    if (formData.github && !/^https?:\/\/.+/.test(formData.github))
      newErrors.github = "Enter a valid GitHub URL";
    if (formData.portfolio && !/^https?:\/\/.+/.test(formData.portfolio))
      newErrors.portfolio = "Enter a valid portfolio URL";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1 text-blue-700">
              Full Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1 text-blue-700">
              Phone
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="10-digit number"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>

          {/* location */}
          <div>
            <label className="block text-sm font-medium mb-1 text-blue-700">
              location
            </label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium mb-1 text-blue-700">
              Department
            </label>
            <input
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium mb-1 text-blue-700">
              Position
            </label>
            <input
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-800/70 text-white rounded-md hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
