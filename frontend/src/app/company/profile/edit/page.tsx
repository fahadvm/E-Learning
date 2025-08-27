"use client";

import { useState, useEffect } from "react";
import { useCompany } from "@/context/companyContext";
import { useRouter } from "next/navigation";
import { Mail, Phone, Globe, Linkedin, Instagram, Twitter, Upload } from "lucide-react";
import Header from "@/componentssss/company/Header";
import { companyApiMethods } from "@/services/APImethods/companyAPImethods";
import { showSuccessToast } from "@/utils/Toast";
export default function EditCompanyProfile() {
  const { company, setCompany } = useCompany();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    about: "",
    social_links: {
      linkedin: "",
      instagram: "",
      twitter: "",
    },
    profilePicture: "",
  });

  const [loading, setLoading] = useState(false);

  // Populate existing data
  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        email: company.email || "",
        phone: company.phone || "",
        website: company.website || "",
        about: company.about || "",
        social_links: {
          linkedin: company.social_links?.linkedin || "",
          instagram: company.social_links?.instagram || "",
          twitter: company.social_links?.twitter || "",
        },
        profilePicture: company.profilePicture || "",
      });
    }
  }, [company]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  // Image upload preview
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profilePicture: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("form data when updaating profile :",formData)
      const res = await companyApiMethods.updateCompanyProfile(formData);
      setCompany(res.data);
      if(res.ok){
        showSuccessToast(res.message)
        router.push("/company/profile");
      }
    } catch (error) {
      console.error("Error updating company profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!company) {
    return <div className="text-center mt-10 text-gray-500">Loading profile...</div>;
  }

  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-screen px-4 sm:px-6 py-10 mt-10">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6">Edit Company Profile</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Profile Picture */}
            <div className="flex items-center gap-4">
              <img
                src={formData.profilePicture || "/gallery/avatar.jpg"}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border"
              />
              <label className="cursor-pointer bg-gray-100 px-3 py-2 rounded-md border text-sm flex items-center gap-2">
                <Upload size={16} /> Upload
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>

            {/* Company Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Company Name"
                value={formData.name}
                onChange={handleChange}
                className="border rounded-md p-2 w-full"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Company Email"
                value={formData.email}
                onChange={handleChange}
                className="border rounded-md p-2 w-full"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="border rounded-md p-2 w-full"
              />
              <input
                type="text"
                name="website"
                placeholder="Website"
                value={formData.website}
                onChange={handleChange}
                className="border rounded-md p-2 w-full"
              />
            </div>

            {/* About */}
            <textarea
              name="about"
              placeholder="About Company"
              value={formData.about}
              onChange={handleChange}
              className="border rounded-md p-2 w-full h-24"
            />

            {/* Social Links */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Linkedin size={16} />
                <input
                  type="text"
                  name="social_links.linkedin"
                  placeholder="LinkedIn"
                  value={formData.social_links.linkedin}
                  onChange={handleChange}
                  className="border rounded-md p-2 w-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <Instagram size={16} />
                <input
                  type="text"
                  name="social_links.instagram"
                  placeholder="Instagram"
                  value={formData.social_links.instagram}
                  onChange={handleChange}
                  className="border rounded-md p-2 w-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <Twitter size={16} />
                <input
                  type="text"
                  name="social_links.twitter"
                  placeholder="Twitter"
                  value={formData.social_links.twitter}
                  onChange={handleChange}
                  className="border rounded-md p-2 w-full"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
