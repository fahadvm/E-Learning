"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import { employeeApiMethods } from "@/services/APIservices/employeeApiService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Edit2,
  Save,
  Flame,
  LogOut,
  Building2,
  Globe,
  Github,
  Linkedin,
  Shield,
  Key,
  AtSign,
  Award,
  Calendar,
} from "lucide-react";

const CropperModal = dynamic(() => import("@/components/common/ImageCropper"), {
  ssr: false,
});

interface SocialLinks {
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

interface EmployeeProfile {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  about?: string;
  position?: string;
  department?: string;
  profilePicture?: string;
  social_links?: SocialLinks;
  joinDate?: string;
  employeeID?: string;
  streakCount?: number;
  longestStreak?: number;
  role?: string;
}

interface Company {
  name: string;
  about?: string;
  website?: string;
}

export default function EmployeeProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [editedProfile, setEditedProfile] = useState<EmployeeProfile | null>(null);

  const [showCropper, setShowCropper] = useState(false);
  const [rawImage, setRawImage] = useState<string>("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("overview");

  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileRes = await employeeApiMethods.getProfile();
        const companyRes = await employeeApiMethods.getMyCompany();

        const companyData = companyRes.data.companyId as Company | null;

        setCompany(companyData || null);
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
    if (!editedProfile) return;
    setEditedProfile({ ...editedProfile, profilePicture: img });
    setShowCropper(false);
  };

  const validate = () => {
    if (!editedProfile) return false;

    const newErrors: Record<string, string> = {};

    if (!editedProfile.name?.trim()) newErrors.name = "Name is required";

    if (editedProfile.phone && !/^\d{10}$/.test(editedProfile.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    const isValidUrl = (url: string) => /^https?:\/\/.+$/.test(url);

    if (editedProfile.social_links?.linkedin && !isValidUrl(editedProfile.social_links.linkedin)) {
      newErrors.linkedin = "Enter a valid LinkedIn URL";
    }

    if (editedProfile.social_links?.github && !isValidUrl(editedProfile.social_links.github)) {
      newErrors.github = "Enter a valid GitHub URL";
    }

    if (editedProfile.social_links?.portfolio && !isValidUrl(editedProfile.social_links.portfolio)) {
      newErrors.portfolio = "Enter a valid portfolio URL";
    }

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
      window.location.reload();
    } catch (error: any) {
      console.error("Failed to leave company:", error);
      alert(error?.response?.data?.message || "Error leaving company");
    }
  };

  const handleSave = async () => {
    if (!editedProfile) return;
    if (!validate()) return;

    try {
      const profileRes = await employeeApiMethods.editProfile(editedProfile);
      setProfile(profileRes.data);
      setEditedProfile(profileRes.data);
      setIsEditing(false);
    } catch (err) {
      console.log("Save error:", err);
    }
  };

  if (loading || !profile || !editedProfile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Profile Sidebar */}
          <aside className="lg:col-span-4">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
              {/* Avatar + name */}
              <div className="flex flex-col items-center text-center gap-4">
                <div className="relative">
                  <div className="w-28 h-28 rounded-full overflow-hidden border border-slate-200 bg-slate-100">
                    <img
                      src={
                        isEditing
                          ? editedProfile.profilePicture || "/gallery/avatar.jpg"
                          : profile.profilePicture || "/gallery/avatar.jpg"
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white shadow cursor-pointer">
                      <Edit2 className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfileImageChange}
                      />
                    </label>
                  )}
                </div>

                <div className="w-full space-y-1">
                  {isEditing ? (
                    <>
                      <Input
                        value={editedProfile.name}
                        onChange={(e) =>
                          setEditedProfile({ ...editedProfile, name: e.target.value })
                        }
                        className="text-lg font-semibold text-center"
                        placeholder="Your name"
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500 mt-1 text-center">
                          {errors.name}
                        </p>
                      )}
                    </>
                  ) : (
                    <h1 className="text-lg font-semibold text-slate-900">{profile.name}</h1>
                  )}

                  <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
                    <Mail className="w-3 h-3" />
                    {profile.email}
                  </p>

                  {profile.position && (
                    <p className="text-xs text-slate-600 flex items-center justify-center gap-1 mt-1">
                      <Briefcase className="w-3 h-3" />
                      {profile.position}
                      {company?.name && <span className="text-slate-400">· {company.name}</span>}
                    </p>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  label="Current streak"
                  icon={<Flame className="w-4 h-4 text-orange-500" />}
                  value={`${profile.streakCount || 0} days`}
                />
                <StatCard
                  label="Best streak"
                  icon={<Award className="w-4 h-4 text-emerald-500" />}
                  value={`${profile.longestStreak || 0} days`}
                />
              </div>

              {/* About */}
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">About</p>
                {isEditing ? (
                  <textarea
                    value={editedProfile.about || ""}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, about: e.target.value })
                    }
                    rows={3}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-400 resize-none"
                    placeholder="Briefly describe your professional journey..."
                  />
                ) : (
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {profile.about ||
                      "No summary added yet. Share a short overview of your experience and strengths."}
                  </p>
                )}
              </div>





              {/* Actions */}
              <div className="space-y-3">
                {isEditing ? (
                  <div className="flex gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="flex-1 gap-2" size="sm">
                          <Save className="w-4 h-4" />
                          Save changes
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Save changes?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Your profile details will be updated across the platform.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleSave}>
                            Confirm & Save
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setEditedProfile(profile);
                        setErrors({});
                        setIsEditing(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-center"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit profile
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center text-red-600 border-red-200 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </Button>
              </div>
            </div>


          </aside>

          {/* RIGHT: Main Content / Tabs */}
          <main className="lg:col-span-8">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="flex w-full justify-start gap-1 rounded-lg bg-slate-50 p-1 border border-slate-200">
                  <TabsTrigger
                    value="overview"
                    className="px-3 py-1.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm rounded-md"
                  >
                    <User className="w-3 h-3 mr-1" />
                    Overview
                  </TabsTrigger>

                  <TabsTrigger
                    value="contact"
                    className="px-3 py-1.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm rounded-md"
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    Contact
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="px-3 py-1.5 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm rounded-md"
                  >
                    <Key className="w-3 h-3 mr-1" />
                    Settings
                  </TabsTrigger>
                </TabsList>

                {/* OVERVIEW */}
                <TabsContent value="overview" className="mt-6 space-y-6">
                  <SectionTitle title="Profile overview" />
                  <div className="grid gap-4 md:grid-cols-2">
                    <EmployeeInfoCard
                      icon={<Mail className="w-4 h-4 text-slate-500" />}
                      title="Email"
                      value={profile.email}
                      description="Primary contact email"
                    />
                    <EmployeeInfoCard
                      icon={<Calendar className="w-4 h-4 text-slate-500" />}
                      title="Join date"
                      value={
                        profile.joinDate
                          ? new Date(profile.joinDate).toLocaleDateString()
                          : "Not available"
                      }
                      description="Date you joined the platform"
                    />
                    <EmployeeInfoCard
                      icon={<Shield className="w-4 h-4 text-slate-500" />}
                      title="Employee ID"
                      value={profile.employeeID || "Not assigned"}
                      description="Unique identifier in the organization"
                    />
                    {company && (
                      <EmployeeInfoCard
                        icon={<Building2 className="w-4 h-4 text-slate-500" />}
                        title="Company"
                        value={company.name}
                        description={
                          company.about
                            ? company.about.length > 100
                              ? company.about.slice(0, 100) + "..."
                              : company.about
                            : "No company description available."
                        }
                        link={company.website}
                      />
                    )}
                  </div>
                </TabsContent>



                {/* CONTACT */}
                <TabsContent value="contact" className="mt-6 space-y-6">
                  <SectionTitle title="Contact & social" />
                  <div className="grid gap-4 md:grid-cols-2">
                    <ContactInfoField
                      icon={<Phone className="w-4 h-4 text-slate-500" />}
                      label="Phone number"
                      value={editedProfile.phone}
                      editable={isEditing}
                      onChange={(v) => setEditedProfile({ ...editedProfile, phone: v })}
                      error={errors.phone}
                    />
                    <ContactInfoField
                      icon={<MapPin className="w-4 h-4 text-slate-500" />}
                      label="Location"
                      value={editedProfile.location}
                      editable={isEditing}
                      onChange={(v) => setEditedProfile({ ...editedProfile, location: v })}
                    />

                    <SocialLinkField
                      icon={<Linkedin className="w-4 h-4" />}
                      platform="LinkedIn"
                      url={editedProfile.social_links?.linkedin}
                      editable={isEditing}
                      onChange={(v) =>
                        setEditedProfile({
                          ...editedProfile,
                          social_links: {
                            ...editedProfile.social_links,
                            linkedin: v,
                          },
                        })
                      }
                      error={errors.linkedin}
                    />
                    <SocialLinkField
                      icon={<Github className="w-4 h-4" />}
                      platform="GitHub"
                      url={editedProfile.social_links?.github}
                      editable={isEditing}
                      onChange={(v) =>
                        setEditedProfile({
                          ...editedProfile,
                          social_links: {
                            ...editedProfile.social_links,
                            github: v,
                          },
                        })
                      }
                      error={errors.github}
                    />
                    <SocialLinkField
                      icon={<Globe className="w-4 h-4" />}
                      platform="Portfolio"
                      url={editedProfile.social_links?.portfolio}
                      editable={isEditing}
                      onChange={(v) =>
                        setEditedProfile({
                          ...editedProfile,
                          social_links: {
                            ...editedProfile.social_links,
                            portfolio: v,
                          },
                        })
                      }
                      error={errors.portfolio}
                    />
                  </div>
                </TabsContent>

                {/* SETTINGS */}
                <TabsContent value="settings" className="mt-6 space-y-6">
                  <SectionTitle title="Account settings" />
                  <div className="grid gap-4 md:grid-cols-2">
                    <SettingsButton
                      icon={<Key className="w-4 h-4" />}
                      label="Change password"
                      description="Update your account password"
                    />
                    <SettingsButton
                      icon={<AtSign className="w-4 h-4" />}
                      label="Change email"
                      description="Update your primary email address"
                      onClick={() => setEmailModal(true)}
                    />
                    
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </main>
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

    

    
  );

  
}

/* ========== SMALL COMPONENTS ========== */

function SidebarInfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs text-slate-500">{label}</span>
      </div>
      <span className="text-xs font-medium text-slate-800 text-right truncate">
        {value}
      </span>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-200 pb-2">
      {title}
    </h2>
  );
}

function EmployeeInfoCard({
  icon,
  title,
  value,
  description,
  link,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description?: string;
  link?: string;
}) {
  const content = (
    <>
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
        {icon}
        <span>{title}</span>
      </div>
      <p className="text-sm font-medium text-slate-900 truncate">{value}</p>
      {description && (
        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{description}</p>
      )}
    </>
  );

  return (
    <div className="rounded-md border border-slate-200 bg-white px-4 py-3">
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:text-blue-600"
        >
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}

function ContactInfoField({
  icon,
  label,
  value,
  editable = false,
  onChange,
  error,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  editable?: boolean;
  onChange?: (v: string) => void;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-600 flex items-center gap-2">
        {icon}
        {label}
      </label>
      {editable ? (
        <div>
          <Input
            value={value || ""}
            onChange={(e) => onChange?.(e.target.value)}
            className="h-9 text-sm"
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
      ) : (
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
          {value || "Not provided"}
        </div>
      )}
    </div>
  );
}

function SocialLinkField({
  icon,
  platform,
  url,
  editable = false,
  onChange,
  error,
}: {
  icon: React.ReactNode;
  platform: string;
  url?: string;
  editable?: boolean;
  onChange?: (v: string) => void;
  error?: string;
}) {
  const placeholder = `https://${platform.toLowerCase()}.com/...`;

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-600 flex items-center gap-2">
        {icon}
        {platform}
      </label>
      {editable ? (
        <div>
          <Input
            value={url || ""}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className="h-9 text-sm"
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
      ) : (
        <a
          href={url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className={`block rounded-md border px-3 py-2 text-sm transition ${url
            ? "border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300"
            : "border-dashed border-slate-200 text-slate-400"
            }`}
        >
          {url ? `${platform} profile` : `Add ${platform} link`}
        </a>
      )}
    </div>
  );
}

function SettingsButton({
  icon,
  label,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <button className="flex w-full items-start gap-3 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm hover:border-slate-300">
      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
        {icon}
      </div>
      <div>
        <p className="font-medium text-slate-900">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
    </button>
  );
}
