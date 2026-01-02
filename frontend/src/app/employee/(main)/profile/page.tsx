"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

// External Services/Utilities
import { employeeApiMethods } from "@/services/APIservices/employeeApiService";
import { showSuccessToast, showErrorToast } from "@/utils/Toast";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Lucide Icons
import {
  User, Mail, Phone, MapPin, Briefcase, Edit2, Save,
  Flame, LogOut, Building2, Globe, Github, Linkedin,
  Shield, Key, AtSign, Award, Calendar, Loader2
} from "lucide-react";

// Import centralized types
import { StatCardProps, InfoCardProps, ContactFieldProps, SocialFieldProps, SettingsButtonProps } from "@/types/employee/employeeTypes";

// Dynamically imported component
const CropperModal = dynamic(() => import("@/components/common/ImageCropper"), { ssr: false });

// --- Interface Definitions ---
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

// --- Helper Components ---
function SectionTitle({ title }: { title: string }) {
  return <h3 className="text-lg font-semibold border-b pb-2">{title}</h3>;
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="bg-slate-50 rounded-lg p-4 text-center">
      <div className="flex justify-center mb-2">{icon}</div>
      <p className="text-xs text-slate-600">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}

function InfoCard({ icon, title, value, subtitle, link }: InfoCardProps) {
  const content = (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-slate-100 rounded-lg">{icon}</div>
      <div>
        <p className="text-xs text-slate-500">{title}</p>
        <p className="font-medium">{value}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );

  return link ? (
    <a href={link} target="_blank" rel="noopener noreferrer" className="block p-4 border rounded-lg hover:bg-slate-50">
      {content}
    </a>
  ) : (
    <div className="p-4 border rounded-lg">{content}</div>
  );
}

function ContactField({ icon, label, value, editable, onChange, error }: ContactFieldProps) {
  return (
    <div>
      <Label className="flex items-center gap-2 text-sm">
        {icon} {label}
      </Label>
      {editable ? (
        <>
          <Input value={value || ""} onChange={(e) => onChange(e.target.value)} className="mt-1" />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </>
      ) : (
        <p className="mt-1 text-sm text-slate-700">{value || "Not provided"}</p>
      )}
    </div>
  );
}

function SocialField({ icon, platform, url, editable, onChange, error }: SocialFieldProps) {
  return (
    <div>
      <Label className="flex items-center gap-2 text-sm">
        {icon} {platform}
      </Label>
      {editable ? (
        <>
          <Input
            value={url || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`https://${platform.toLowerCase()}.com/in/yourname`}
            className="mt-1"
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </>
      ) : url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm mt-1 block hover:underline">
          {url}
        </a>
      ) : (
        <p className="text-sm text-slate-400 mt-1">Not added</p>
      )}
    </div>
  );
}

function SettingsButton({ icon, label, description, onClick }: SettingsButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 border rounded-lg hover:bg-slate-50 transition flex items-center gap-4"
    >
      <div className="p-2 bg-slate-100 rounded-lg">{icon}</div>
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </button>
  );
}

// --- Main Component ---
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

  const [emailModal, setEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({ newEmail: "", otp: "" });
  const [showOtpField, setShowOtpField] = useState(false);
  const [timer, setTimer] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  // Password modal
  const [passwordModal, setPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [modalLoading, setModalLoading] = useState(false);

  const router = useRouter();

  // ⏱ OTP Timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileRes, companyRes] = await Promise.all([
          employeeApiMethods.getProfile(),
          employeeApiMethods.getMyCompany(),
        ]);

        const companyData = companyRes.data.companyId as Company | null;

        setCompany(companyData || null);
        setProfile(profileRes.data);
        setEditedProfile(profileRes.data);
      } catch (err) {
        showErrorToast("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // IMAGE HANDLER
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

  // SAVE PROFILE
  const validate = () => {
    if (!editedProfile) return false;
    const newErrors: Record<string, string> = {};

    if (!editedProfile.name?.trim()) newErrors.name = "Name is required";
    if (editedProfile.phone && !/^\d{10}$/.test(editedProfile.phone)) {
      newErrors.phone = "Enter valid 10-digit phone";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!editedProfile || !validate()) return;

    try {
      const res = await employeeApiMethods.editProfile(editedProfile);
      setProfile(res.data);
      setEditedProfile(res.data);
      setIsEditing(false);
      showSuccessToast("Profile updated!");
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to update";
      showErrorToast(errorMessage);
    }
  };

  // CHANGE EMAIL HANDLER
  const handleChangeEmail = async () => {
    if (!showOtpField) {
      if (!emailForm.newEmail) return showErrorToast("Enter new email");

      setModalLoading(true);
      try {
        await employeeApiMethods.sendEmailOtp({ newEmail: emailForm.newEmail });
        showSuccessToast("OTP sent!");
        setShowOtpField(true);
        setTimer(60);
      } catch (err: unknown) {
        const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to send OTP";
        showErrorToast(errorMessage);
      } finally {
        setModalLoading(false);
      }
    } else {
      if (!emailForm.otp) return showErrorToast("Enter OTP");

      setModalLoading(true);
      try {
        const res = await employeeApiMethods.verifyEmailOtp({
          newEmail: emailForm.newEmail,
          otp: emailForm.otp,
        });
        if (res.ok) {
          showSuccessToast("Email updated!");
          setEmailModal(false);
          setProfile((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              email: emailForm.newEmail,
            };
          });
          setEmailForm({ newEmail: "", otp: "" });
          setShowOtpField(false);
        }
      } catch (err: unknown) {
        const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "OTP verification failed";
        showErrorToast(errorMessage);
      } finally {
        setModalLoading(false);
      }
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      await employeeApiMethods.sendEmailOtp({ newEmail: emailForm.newEmail });
      showSuccessToast("OTP resent!");
      setTimer(60);
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to resend OTP";
      showErrorToast(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  // CHANGE PASSWORD
  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword)
      return showErrorToast("All fields required");

    if (passwordForm.newPassword !== passwordForm.confirmPassword)
      return showErrorToast("Passwords mismatch");

    if (passwordForm.newPassword.length < 6)
      return showErrorToast("Password must be ≥ 6 characters");

    setModalLoading(true);
    try {
      const res = await employeeApiMethods.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      if (res.ok) {
        showSuccessToast("Password updated successfully!");
      }
      setPasswordModal(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to change";
      showErrorToast(errorMessage);
    } finally {
      setModalLoading(false);
    }
  };

  // LOGOUT
  const handleLogout = async () => {
    try {
      await employeeApiMethods.logout();
      localStorage.clear();
      router.push("/employee/login");
    } catch (error) {
      console.error(error);
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
          {/* LEFT SIDEBAR */}
          <aside className="lg:col-span-4">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">

              {/* Avatar */}
              <div className="flex flex-col items-center text-center gap-4">
                <div className="relative">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <img
                      src={isEditing ? editedProfile.profilePicture || "/gallery/avatar.jpg" : profile.profilePicture || "/gallery/avatar.jpg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-blue-700">
                      <Edit2 className="w-4 h-4" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageChange} />
                    </label>
                  )}
                </div>

                <div className="space-y-2">
                  {isEditing ? (
                    <>
                      <Input
                        value={editedProfile.name}
                        onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                        className="text-center text-lg font-semibold"
                      />
                      {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                    </>
                  ) : (
                    <h1 className="text-xl font-bold">{profile.name}</h1>
                  )}
                  <p className="text-sm text-slate-600">{profile.email}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <StatCard icon={<Flame className="w-5 h-5 text-orange-500" />} label="Streak" value={`${profile.streakCount || 0} days`} />
                <StatCard icon={<Award className="w-5 h-5 text-emerald-500" />} label="Best" value={`${profile.longestStreak || 0} days`} />
              </div>

              {/* About */}
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">About</p>
                {isEditing ? (
                  <textarea
                    value={editedProfile.about || ""}
                    onChange={(e) => setEditedProfile({ ...editedProfile, about: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm resize-none h-24"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-sm text-slate-700">
                    {profile.about || "No bio added yet."}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4 border-t">
                {isEditing ? (
                  <div className="flex gap-3">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="flex-1">
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Save Changes?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Your profile will be updated.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleSave}>Save</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <Button variant="outline" onClick={() => {
                      setEditedProfile(profile);
                      setErrors({});
                      setIsEditing(false);
                    }}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button variant="default" className="w-full" onClick={() => setIsEditing(true)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}

                <Button variant="destructive" className="w-full" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6 space-y-6">
                  <SectionTitle title="Profile Overview" />
                  <div className="grid gap-4 md:grid-cols-2">
                    <InfoCard icon={<Mail />} title="Email" value={profile.email} />
                    <InfoCard icon={<Calendar />} title="Joined" value={profile.joinDate ? new Date(profile.joinDate).toLocaleDateString() : "N/A"} />
                    <InfoCard icon={<Shield />} title="Employee ID" value={profile.employeeID || "Not set"} />
                    {company && <InfoCard icon={<Building2 />} title="Company" value={company.name} subtitle={company.about} link={company.website} />}
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="mt-6 space-y-6">
                  <SectionTitle title="Contact & Social Links" />
                  <div className="grid gap-4 md:grid-cols-2">
                    <ContactField icon={<Phone />} label="Phone" value={editedProfile.phone} editable={isEditing} onChange={(v: string) => setEditedProfile({ ...editedProfile, phone: v })} error={errors.phone} />
                    <ContactField icon={<MapPin />} label="Location" value={editedProfile.location} editable={isEditing} onChange={(v: string) => setEditedProfile({ ...editedProfile, location: v })} />

                    <SocialField icon={<Linkedin />} platform="LinkedIn" url={editedProfile.social_links?.linkedin} editable={isEditing} onChange={(v: string) => setEditedProfile({ ...editedProfile, social_links: { ...editedProfile.social_links, linkedin: v } })} error={errors.linkedin} />
                    <SocialField icon={<Github />} platform="GitHub" url={editedProfile.social_links?.github} editable={isEditing} onChange={(v: string) => setEditedProfile({ ...editedProfile, social_links: { ...editedProfile.social_links, github: v } })} error={errors.github} />
                    <SocialField icon={<Globe />} platform="Portfolio" url={editedProfile.social_links?.portfolio} editable={isEditing} onChange={(v: string) => setEditedProfile({ ...editedProfile, social_links: { ...editedProfile.social_links, portfolio: v } })} error={errors.portfolio} />
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="mt-6 space-y-6">
                  <SectionTitle title="Account Settings" />
                  <div className="space-y-4">
                    <SettingsButton
                      icon={<Key className="w-5 h-5" />}
                      label="Change Password"
                      description="Update your account password"
                      onClick={() => setPasswordModal(true)}
                    />
                    <SettingsButton
                      icon={<AtSign className="w-5 h-5" />}
                      label="Change Email"
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

      {/* Cropper Modal */}
      {showCropper && rawImage && (
        <CropperModal
          image={rawImage}
          onCropComplete={handleCroppedImage}
          onClose={() => setShowCropper(false)}
        />
      )}

      {/* 🔥 Change Email Modal */}
      <Dialog open={emailModal} onOpenChange={setEmailModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Email Address</DialogTitle>
            <DialogDescription>Enter your new email to receive OTP.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Email Field */}
            <div>
              <Label htmlFor="newEmail">New Email</Label>
              <Input
                id="newEmail"
                type="email"
                disabled={showOtpField}
                value={emailForm.newEmail}
                onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                placeholder="newemail@example.com"
              />
            </div>

            {/* OTP Field */}
            {showOtpField && (
              <div>
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  value={emailForm.otp}
                  onChange={(e) => setEmailForm({ ...emailForm, otp: e.target.value })}
                  placeholder="Enter 6-digit OTP"
                />

                {/* Timer + Resend */}
                <div className="flex items-center justify-between mt-2 text-sm">
                  {timer > 0 ? (
                    <p className="text-blue-600">Resend OTP in {timer}s</p>
                  ) : (
                    <button
                      onClick={handleResendOtp}
                      disabled={resendLoading}
                      className="text-blue-600 hover:underline"
                    >
                      {resendLoading ? "Sending..." : "Resend OTP"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEmailModal(false);
              setEmailForm({ newEmail: "", otp: "" });
              setShowOtpField(false);
            }}>
              Cancel
            </Button>

            <Button onClick={handleChangeEmail} disabled={modalLoading}>
              {modalLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {showOtpField ? "Verify & Update" : "Send OTP"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 🔐 Change Password Modal */}
      <Dialog open={passwordModal} onOpenChange={setPasswordModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Make sure your password is strong.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordModal(false)}>Cancel</Button>
            <Button onClick={handleChangePassword} disabled={modalLoading}>
              {modalLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
