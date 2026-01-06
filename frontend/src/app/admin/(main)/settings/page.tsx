'use client';

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
    UserPlus,
    Lock,
    Mail,
    User,
    Edit,
    Save,
    X,
    Loader2,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { adminApiMethods } from "@/services/APIservices/adminApiService";
import { showErrorToast, showSuccessToast } from "@/utils/Toast";
import { UpdateAdminProfileDTO } from "@/types/admin/adminTypes";

interface AdminProfile {
    _id: string;
    name?: string;
    email: string;
    phone?: string;
    bio?: string;
    role: string;
    isSuperAdmin?: boolean;
    createdAt?: string;
}

export default function AdminSettingsPage() {
    const [profile, setProfile] = useState<AdminProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);

    // Profile edit state
    const [profileForm, setProfileForm] = useState<UpdateAdminProfileDTO>({
        name: '',
        phone: '',
        bio: '',
    });

    // Change password state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordLoading, setPasswordLoading] = useState(false);

    // Change email state
    const [emailForm, setEmailForm] = useState({
        newEmail: '',
        otp: ''
    });
    const [emailLoading, setEmailLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    // Add admin state
    const [addAdminForm, setAddAdminForm] = useState({
        email: '',
        password: '',
        name: ''
    });
    const [addAdminLoading, setAddAdminLoading] = useState(false);

    // Fetch profile on mount
    useEffect(() => {
        fetchProfile();
    }, []);

    // Resend timer countdown
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await adminApiMethods.getProfile();
            if (response.data) {
                setProfile(response.data);
                setProfileForm({
                    name: response.data.name || '',
                    phone: response.data.phone || '',
                    bio: response.data.bio || ''
                });
            }
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to fetch profile';
            showErrorToast(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const response = await adminApiMethods.updateProfile(profileForm);
            if (response.ok) {
                showSuccessToast('Profile updated successfully');
                setProfile(response.data);
                setEditMode(false);
            }
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update profile';
            showErrorToast(errorMessage);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate password
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            showErrorToast('Passwords do not match');
            return;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(passwordForm.newPassword)) {
            showErrorToast('Password must be at least 8 characters with 1 uppercase, 1 number, and 1 special character');
            return;
        }

        try {
            setPasswordLoading(true);
            const response = await adminApiMethods.changePassword(passwordForm);
            if (response.ok) {
                showSuccessToast('Password changed successfully');
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to change password';
            showErrorToast(errorMessage);
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleRequestEmailChange = async () => {
        if (!emailForm.newEmail) {
            showErrorToast('Please enter a new email');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailForm.newEmail)) {
            showErrorToast('Invalid email format');
            return;
        }

        try {
            setEmailLoading(true);
            const response = await adminApiMethods.requestEmailChange({ newEmail: emailForm.newEmail });
            if (response.ok) {
                showSuccessToast('OTP sent to new email address');
                setOtpSent(true);
                setResendTimer(60);
            }
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to send OTP';
            showErrorToast(errorMessage);
        } finally {
            setEmailLoading(false);
        }
    };

    const handleVerifyEmailChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!emailForm.otp || emailForm.otp.length !== 6) {
            showErrorToast('Please enter a valid 6-digit OTP');
            return;
        }

        try {
            setEmailLoading(true);
            const response = await adminApiMethods.verifyEmailChange({
                newEmail: emailForm.newEmail,
                otp: emailForm.otp
            });
            if (response.ok) {
                showSuccessToast('Email updated successfully');
                setEmailForm({ newEmail: '', otp: '' });
                setOtpSent(false);
                fetchProfile(); // Refresh profile
            }
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to verify OTP';
            showErrorToast(errorMessage);
        } finally {
            setEmailLoading(false);
        }
    };

    const handleAddNewAdmin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!addAdminForm.email || !addAdminForm.password) {
            showErrorToast('Email and password are required');
            return;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(addAdminForm.password)) {
            showErrorToast('Password must be at least 8 characters with 1 uppercase, 1 number, and 1 special character');
            return;
        }

        try {
            setAddAdminLoading(true);
            const response = await adminApiMethods.addNewAdmin(addAdminForm);
            if (response.ok) {
                showSuccessToast('Admin created successfully');
                setAddAdminForm({ email: '', password: '', name: '' });
            }
        } catch (error: unknown) {
            console.log(error);
            const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to add admin';
            showErrorToast(errorMessage);
        } finally {
            setAddAdminLoading(false);
        }
    };

    if (loading) {
        return (
            <main className="container mx-auto min-h-screen bg-gray-50 p-6 md:p-10 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </main>
        );
    }

    return (
        <main className="container mx-auto min-h-screen bg-gray-50 p-6 md:p-10 space-y-8">

            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
                <p className="text-gray-500 mt-1">
                    Manage admin access, profile and security settings
                </p>
            </div>

            {/* ================= PROFILE ================= */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-orange-600" />
                        <CardTitle>Profile</CardTitle>
                    </div>
                    {!editMode ? (
                        <Button size="sm" variant="outline" onClick={() => setEditMode(true)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => {
                                setEditMode(false);
                                setProfileForm({
                                    name: profile?.name || '',
                                    phone: profile?.phone || '',
                                    bio: profile?.bio || ''
                                });
                            }}>
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </Button>
                            <Button size="sm" onClick={handleUpdateProfile}>
                                <Save className="w-4 h-4 mr-2" />
                                Save
                            </Button>
                        </div>
                    )}
                </CardHeader>
                <CardContent className="space-y-4">
                    {!editMode ? (
                        <div className="space-y-2 text-sm text-gray-700">
                            <p><span className="font-medium">Name:</span> {profile?.name || 'Not set'}</p>
                            <p><span className="font-medium">Email:</span> {profile?.email}</p>
                            <p><span className="font-medium">Phone:</span> {profile?.phone || 'Not set'}</p>
                            <p><span className="font-medium">Bio:</span> {profile?.bio || 'Not set'}</p>
                            <p><span className="font-medium">Role:</span> {profile?.isSuperAdmin ? 'Super Admin' : 'Admin'}</p>
                            <p><span className="font-medium">Joined:</span> {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <Label>Name</Label>
                                <Input
                                    value={profileForm.name}
                                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div>
                                <Label>Phone</Label>
                                <Input
                                    value={profileForm.phone}
                                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                    placeholder="Enter your phone number"
                                />
                            </div>
                            <div>
                                <Label>Bio</Label>
                                <Textarea
                                    value={profileForm.bio}
                                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                                    placeholder="Tell us about yourself"
                                    rows={3}
                                />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ================= ADD ADMIN (Super Admin Only) ================= */}
            {profile?.isSuperAdmin && (
                <Card>
                    <CardHeader className="flex flex-row items-center gap-3">
                        <UserPlus className="w-5 h-5 text-blue-600" />
                        <CardTitle>Add New Admin</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddNewAdmin} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Name (Optional)</Label>
                                    <Input
                                        value={addAdminForm.name}
                                        onChange={(e) => setAddAdminForm({ ...addAdminForm, name: e.target.value })}
                                        placeholder="Admin name"
                                    />
                                </div>
                                <div>
                                    <Label>Email *</Label>
                                    <Input
                                        type="email"
                                        value={addAdminForm.email}
                                        onChange={(e) => setAddAdminForm({ ...addAdminForm, email: e.target.value })}
                                        placeholder="admin@example.com"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Password *</Label>
                                <Input
                                    type="password"
                                    value={addAdminForm.password}
                                    onChange={(e) => setAddAdminForm({ ...addAdminForm, password: e.target.value })}
                                    placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special char"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Must contain at least 8 characters, 1 uppercase letter, 1 number, and 1 special character
                                </p>
                            </div>
                            <Button type="submit" disabled={addAdminLoading}>
                                {addAdminLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Add Admin
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* ================= SECURITY TABS ================= */}
            <Card>
                <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="password" className="w-full">
                        <TabsList className="grid grid-cols-2 w-full">
                            <TabsTrigger value="password">
                                <Lock className="w-4 h-4 mr-2" />
                                Change Password
                            </TabsTrigger>
                            <TabsTrigger value="email">
                                <Mail className="w-4 h-4 mr-2" />
                                Change Email
                            </TabsTrigger>
                        </TabsList>

                        {/* Change Password Tab */}
                        <TabsContent value="password" className="space-y-4 mt-4">
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div>
                                    <Label>Current Password</Label>
                                    <Input
                                        type="password"
                                        value={passwordForm.currentPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                        placeholder="Enter current password"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>New Password</Label>
                                    <Input
                                        type="password"
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                        placeholder="Enter new password"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Confirm New Password</Label>
                                    <Input
                                        type="password"
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                        placeholder="Confirm new password"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Must contain at least 8 characters, 1 uppercase letter, 1 number, and 1 special character
                                    </p>
                                </div>
                                <Button type="submit" variant="secondary" disabled={passwordLoading}>
                                    {passwordLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Password'
                                    )}
                                </Button>
                            </form>
                        </TabsContent>

                        {/* Change Email Tab */}
                        <TabsContent value="email" className="space-y-5 mt-4">
                            {/* Current Email */}
                            <div>
                                <Label>Current Email</Label>
                                <Input disabled value={profile?.email || ''} />
                            </div>

                            {/* New Email */}
                            <div>
                                <Label>New Email</Label>
                                <Input
                                    type="email"
                                    value={emailForm.newEmail}
                                    onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                                    placeholder="newadmin@devnext.com"
                                    disabled={otpSent}
                                />
                            </div>

                            {/* Send OTP */}
                            {!otpSent ? (
                                <Button
                                    variant="outline"
                                    className="w-fit"
                                    onClick={handleRequestEmailChange}
                                    disabled={emailLoading || !emailForm.newEmail}
                                >
                                    {emailLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send OTP'
                                    )}
                                </Button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    <span className="text-sm text-green-600">OTP sent successfully</span>
                                    {resendTimer > 0 ? (
                                        <span className="text-xs text-gray-500 ml-2">Resend in {resendTimer}s</span>
                                    ) : (
                                        <Button
                                            variant="link"
                                            size="sm"
                                            onClick={handleRequestEmailChange}
                                            disabled={emailLoading}
                                        >
                                            Resend OTP
                                        </Button>
                                    )}
                                </div>
                            )}

                            {/* OTP Input */}
                            {otpSent && (
                                <form onSubmit={handleVerifyEmailChange} className="space-y-4">
                                    <div>
                                        <Label>Enter OTP</Label>
                                        <Input
                                            value={emailForm.otp}
                                            onChange={(e) => setEmailForm({ ...emailForm, otp: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                                            placeholder="6-digit OTP"
                                            maxLength={6}
                                            required
                                        />
                                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            OTP expires in 5 minutes
                                        </p>
                                    </div>

                                    {/* Verify Button */}
                                    <div className="flex gap-2">
                                        <Button type="submit" variant="secondary" disabled={emailLoading}>
                                            {emailLoading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Verifying...
                                                </>
                                            ) : (
                                                'Verify & Update Email'
                                            )}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setOtpSent(false);
                                                setEmailForm({ newEmail: '', otp: '' });
                                                setResendTimer(0);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

        </main>
    );
}
