"use client";

import { useEffect, useState } from "react";
import { employeeApiMethods } from "@/services/APIservices/employeeApiService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User, Mail, Phone, MapPin, Briefcase, Edit2, Save, Flame, Link, FileText, LogOut,
  Building2, Globe, Github, Linkedin, Twitter, Instagram, Shield, Key, AtSign
} from "lucide-react";
import dynamic from "next/dynamic";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";


const CropperModal = dynamic(() => import("@/components/common/ImageCropper"), { ssr: false });

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [editedProfile, setEditedProfile] = useState<any>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [rawImage, setRawImage] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileRes = await employeeApiMethods.getProfile();
        const companyRes = await employeeApiMethods.getMyCompany();
        const companyData = companyRes.data.companyId;
        setCompany(companyData);
        setProfile(profileRes.data);
        setEditedProfile(profileRes.data);
      } catch (err) {
        console.log("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setEditedProfile({ ...editedProfile, profilePicture: img });
    setShowCropper(false);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!editedProfile.name?.trim()) newErrors.name = "Name is required";
    if (!editedProfile.phone || !/^\d{10}$/.test(editedProfile.phone))
      newErrors.phone = "Enter a valid 10-digit phone number";

    const isValidUrl = (url: string) => /^https?:\/\/.+$/.test(url);
    if (editedProfile.social_links?.linkedin && !isValidUrl(editedProfile.social_links.linkedin))
      newErrors.linkedin = "Enter a valid LinkedIn URL";
    if (editedProfile.social_links?.github && !isValidUrl(editedProfile.social_links.github))
      newErrors.github = "Enter a valid GitHub URL";
    if (editedProfile.social_links?.portfolio && !isValidUrl(editedProfile.social_links.portfolio))
      newErrors.portfolio = "Enter a valid portfolio URL";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogout = async () => {
    try {
      await employeeApiMethods.logout();
      localStorage.clear();
      router.push("/employee/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const handleLeaveCompany = async () => {
    try {
      await employeeApiMethods.leaveCompany();
      alert("You have left the company successfully");
      window.location.reload(); // or redirect to dashboard
    } catch (error: any) {
      console.error("Failed to leave company:", error);
      alert(error?.response?.data?.message || "Error leaving company");
    }
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      const profileRes = await employeeApiMethods.editProfile(editedProfile);
      setProfile(profileRes.data);
      setIsEditing(false);
    } catch (err) {
      console.log("Save error:", err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-6">
      <p className="text-lg text-slate-600 animate-pulse">Loading your profile...</p>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto p-6 lg:p-12 space-y-10">

          {/* Hero Header Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="flex items-start gap-6">
                <div className="relative group">
                  <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden ring-4 ring-slate-100 shadow-md">
                    <img
                      src={isEditing ? editedProfile.profilePicture : profile.profilePicture || "/placeholder-user.png"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isEditing && (
                    <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Edit2 className="w-6 h-6 text-white" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageChange} />
                    </label>
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  {isEditing ? (
                    <div className="space-y-3">
                      <Input
                        value={editedProfile.name}
                        onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                        className="text-2xl lg:text-3xl font-bold h-12"
                        placeholder="Your Name"
                      />
                      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                      <Input
                        value={editedProfile.about}
                        onChange={(e) => setEditedProfile({ ...editedProfile, about: e.target.value })}
                        placeholder="A short bio about yourself..."
                        className="text-base text-slate-600"
                      />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">{profile.name}</h1>
                      <p className="text-slate-600 max-w-2xl">{profile.about || "No bio added yet."}</p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Streak Badges */}
                <div className="flex gap-6 text-center">
                  <div className="bg-orange-50 px-4 py-3 rounded-xl">
                    <p className="text-2xl font-bold text-orange-600 flex items-center gap-1">
                      {profile.streakCount || 0} <Flame className="w-5 h-5" />
                    </p>
                    <p className="text-xs text-slate-600">Current</p>
                  </div>
                  <div className="bg-emerald-50 px-4 py-3 rounded-xl">
                    <p className="text-2xl font-bold text-emerald-600">{profile.longestStreak || 0}</p>
                    <p className="text-xs text-slate-600">Longest</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {isEditing ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="lg" className="gap-2 shadow-sm">
                          <Save className="w-4 h-4" /> Save
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Save Changes?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will update your personal profile information.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleSave}>Confirm</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} size="lg" variant="outline" className="gap-2">
                      <Edit2 className="w-4 h-4" /> Edit
                    </Button>
                  )}
                  <Button
                    size="lg"
                    variant="destructive"
                    className="gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-14 rounded-xl bg-slate-100 p-1.5">
              <TabsTrigger value="personal" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <User className="w-4 h-4 mr-2" /> Personal
              </TabsTrigger>
              <TabsTrigger value="company" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Building2 className="w-4 h-4 mr-2" /> Company
              </TabsTrigger>
            </TabsList>

            {/* Personal Info */}
            <TabsContent value="personal" className="mt-8">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 lg:p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoField icon={<Mail />} label="Email" value={profile.email} />
                  <InfoField
                    icon={<Phone />}
                    label="Phone"
                    value={editedProfile.phone}
                    editable={isEditing}
                    onChange={(v) => setEditedProfile({ ...editedProfile, phone: v })}
                    error={errors.phone}
                  />
                  <InfoField
                    icon={<MapPin />}
                    label="Location"
                    value={editedProfile.location}
                    editable={isEditing}
                    onChange={(v) => setEditedProfile({ ...editedProfile, location: v })}
                  />
                  <InfoField
                    icon={<Briefcase />}
                    label="Department"
                    value={editedProfile.department}
                    editable={isEditing}
                    onChange={(v) => setEditedProfile({ ...editedProfile, department: v })}
                  />
                  <InfoField
                    icon={<Briefcase />}
                    label="Position"
                    value={editedProfile.position}
                    editable={isEditing}
                    onChange={(v) => setEditedProfile({ ...editedProfile, position: v })}
                  />
                  <InfoField icon={<Shield />} label="Employee ID" value={profile.employeeID} />
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Link className="w-5 h-5" /> Social Presence
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <SocialField
                      icon={<Linkedin />}
                      label="LinkedIn"
                      value={editedProfile.social_links?.linkedin}
                      editable={isEditing}
                      onChange={(v) => setEditedProfile({
                        ...editedProfile,
                        social_links: { ...editedProfile.social_links, linkedin: v },
                      })}
                      error={errors.linkedin}
                    />
                    <SocialField
                      icon={<Github />}
                      label="GitHub"
                      value={editedProfile.social_links?.github}
                      editable={isEditing}
                      onChange={(v) => setEditedProfile({
                        ...editedProfile,
                        social_links: { ...editedProfile.social_links, github: v },
                      })}
                      error={errors.github}
                    />
                    <SocialField
                      icon={<Globe />}
                      label="Portfolio"
                      value={editedProfile.social_links?.portfolio}
                      editable={isEditing}
                      onChange={(v) => setEditedProfile({
                        ...editedProfile,
                        social_links: { ...editedProfile.social_links, portfolio: v },
                      })}
                      error={errors.portfolio}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button variant="outline" className="gap-2">
                    <Key className="w-4 h-4" /> Change Password
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <AtSign className="w-4 h-4" /> Change Email
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Company Info - STATIC */}
            <TabsContent value="company" className="mt-8">
              {company ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 lg:p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoField icon={<Building2 />} label="Company Name" value={company.name} />
                    <InfoField icon={<Mail />} label="Email" value={company.email} />
                    <InfoField icon={<Phone />} label="Phone" value={company.phone} />
                    <InfoField icon={<Globe />} label="Website" value={company.website} />
                    <InfoField icon={<MapPin />} label="Address" value={company.address} />
                    <InfoField icon={<FileText />} label="Company Code" value={company.companyCode} />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> About Company
                    </label>
                    <p className="text-slate-600 bg-slate-50 p-4 rounded-lg">
                      {company.about || "No description provided."}
                    </p>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <Link className="w-5 h-5" /> Company Socials
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <SocialField icon={<Linkedin />} label="LinkedIn" value={company.social_links?.linkedin} />
                      <SocialField icon={<Twitter />} label="Twitter" value={company.social_links?.twitter} />
                      <SocialField icon={<Instagram />} label="Instagram" value={company.social_links?.instagram} />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="gap-2">
                          <LogOut className="w-4 h-4" /> Leave Company
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Leave Company?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will remove you from the company and revoke access to its learning paths.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleLeaveCompany}>Yes, Leave</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
                  <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-10 h-10 text-slate-400" />
                  </div>
                  <p className="text-slate-600">You are not currently assigned to any company.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {showCropper && rawImage && (
        <CropperModal image={rawImage} onCropComplete={handleCroppedImage} onClose={() => setShowCropper(false)} />
      )}
    </>
  );
}

// Reusable Info Field
function InfoField({ icon, label, value, editable = false, onChange, error }: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  editable?: boolean;
  onChange?: (v: string) => void;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
        {icon} {label}
      </label>
      {editable ? (
        <div>
          <Input
            value={value || ""}
            onChange={(e) => onChange?.(e.target.value)}
            className="h-11"
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      ) : (
        <p className="text-slate-900 font-medium">{value || "Not provided"}</p>
      )}
    </div>
  );
}

// Reusable Social Field
function SocialField({ icon, label, value, editable = false, onChange, error }: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  editable?: boolean;
  onChange?: (v: string) => void;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
        {icon} {label}
      </label>
      {editable ? (
        <div>
          <Input
            value={value || ""}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={`https://${label.toLowerCase()}.com/...`}
            className="h-11"
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      ) : (
        <a
          href={value || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-slate-900 font-medium hover:underline ${!value && "text-slate-400"}`}
        >
          {value || "Not linked"}
        </a>
      )}
    </div>
  );
}