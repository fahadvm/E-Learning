'use client';

import React, { useState, useEffect } from "react";

import {
    User,
    Mail,
    Phone,
    Camera,
    Shield,
    Edit3,
    Loader2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

import dynamic from "next/dynamic";
const CropperModal = dynamic(() => import('@/components/common/ImageCropper'), { ssr: false });

import { adminApiMethods } from "@/services/APIservices/adminApiService";
import { showSuccessToast } from "@/utils/Toast";

/* ------------------------ Types ------------------------ */
interface AdminProfile {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
}

export default function AdminProfilePage() {

    const [profile, setProfile] = useState<AdminProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState<{
        name: string;
        email: string; 
        phone?: string;
    }>({
        name: "",
        email: "",
        phone: "",
    });


    /* -------- Image cropper states -------- */
    const [rawImage, setRawImage] = useState<string | null>(null);
    const [showCropper, setShowCropper] = useState(false);

    /* ---------------- Load Admin Profile ---------------- */
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await adminApiMethods.getProfile();
            if (res.ok) {
                setProfile(res.data);

                setFormData({
                    name: res.data.name,
                    email: res.data.email,
                    phone: res.data.phone || "",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- Handle profile image upload ---------------- */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setRawImage(reader.result as string);
            setShowCropper(true);
        };
        reader.readAsDataURL(file);
    };

    /* ---------------- Save cropped image ---------------- */
    const handleCroppedImage = async (img: string) => {
        setShowCropper(false);

        try {
            const blob = await (await fetch(img)).blob();
            const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });

            const form = new FormData();
            form.append("avatar", file);

            const res = await adminApiMethods.updateProfile(form);

            if (res.ok) {
                showSuccessToast("Profile photo updated successfully");
                setProfile(prev => prev ? { ...prev, avatar: res.data.avatar } : null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    /* ---------------- Save profile text fields ---------------- */
    const handleSaveProfile = async () => {
        setSaving(true);

        try {
            const res = await adminApiMethods.updateProfile(formData);
            if (res.ok) {
                showSuccessToast("Profile updated");
                setProfile(res.data);
                setIsEditing(false);
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                {/* Header */}
                <header className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white shadow-xl">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl font-bold">Admin Profile</h1>
                            <Shield className="w-12 h-12 text-indigo-300" />
                        </div>
                    </div>
                </header>

                <div className="max-w-4xl mx-auto px-6 py-10">
                    <Card className="shadow-xl border-0 overflow-hidden">
                        {/* Top Section */}
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
                            <div className="flex items-center gap-6">

                                {/* Profile Image */}
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30">
                                        {profile?.avatar ? (
                                            <img src={profile.avatar} alt="Admin" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-indigo-700">
                                                <User className="w-16 h-16 text-white" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Change Image Overlay */}
                                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition cursor-pointer rounded-full">
                                        <Camera className="w-8 h-8 text-white" />
                                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                    </label>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold">{profile?.name}</h2>

                                    <p className="text-indigo-200 flex items-center gap-2 mt-1">
                                        <Mail className="w-4 h-4" />
                                        {profile?.email}
                                    </p>

                                    <div className="flex gap-3 mt-4">
                                        <Button onClick={() => setIsEditing(true)} size="sm" className="bg-white/20">
                                            <Edit3 className="w-4 h-4 mr-2" /> Edit
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Information */}
                        <div className="p-8">
                            <h3 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h3>

                            <div className="space-y-6 text-gray-700">
                                <div className="flex items-center gap-4">
                                    <User className="w-5 h-5 text-indigo-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">Full Name</p>
                                        <p className="font-medium">{profile?.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Mail className="w-5 h-5 text-indigo-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{profile?.email}</p>
                                    </div>
                                </div>

                                {profile?.phone && (
                                    <div className="flex items-center gap-4">
                                        <Phone className="w-5 h-5 text-indigo-600" />
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="font-medium">{profile.phone}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* ----------------------------------------
                Edit Profile Modal
            ------------------------------------------ */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

                        <div className="space-y-4">
                            <div>
                                <Label>Name</Label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <Label>Email</Label>
                                <Input
                                    disabled
                                    value={formData.email}
                                />
                            </div>

                            <div>
                                <Label>Phone</Label>
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>

                            <Button onClick={handleSaveProfile} disabled={saving}>
                                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* -------- Image Cropper -------- */}
            {showCropper && rawImage && (
                <CropperModal
                    image={rawImage}
                    onCropComplete={handleCroppedImage}
                    onClose={() => setShowCropper(false)}
                />
            )}
        </>
    );
}
