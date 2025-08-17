"use client";

import React, { useState } from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

export type ProfileType = "student" | "employee" | "company";

interface TabConfig {
  id: string;
  label: string;
  render: () => React.ReactNode;
}

interface ProfilePageProps<T> {
  profileType: ProfileType;
  profileData: T;
  editableFields: (keyof T)[];
  tabs: TabConfig[];
}

export function ProfilePage<T extends Record<string, any>>({
  profileType,
  profileData,
  editableFields,
  tabs,
}: ProfilePageProps<T>) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<T>({ ...profileData });
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(profileData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow overflow-hidden">
        {/* Cover */}
        <div className="h-48 bg-gradient-to-r from-purple-400 to-indigo-500 relative">
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <img
              src={formData.logo || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
          </div>
        </div>

        {/* Name + Info */}
        <div className="pt-20 pb-4 text-center">
          <h1 className="text-xl font-bold">{formData.name}</h1>
          <p className="text-gray-500 capitalize">{profileType} profile</p>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200 flex justify-center space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 text-sm font-medium ${
                activeTab === tab.id
                  ? "border-b-2 border-purple-500 text-purple-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "details" && (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h2 className="font-semibold text-gray-700 mb-4">
                {profileType.charAt(0).toUpperCase() + profileType.slice(1)}{" "}
                Details
              </h2>
              {isEditing ? (
                <div className="space-y-3">
                  {editableFields.map((field) => (
                    <input
                      key={String(field)}
                      type="text"
                      name={String(field)}
                      value={formData[field] || ""}
                      onChange={handleInputChange}
                      className="w-full border rounded p-2"
                    />
                  ))}
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                      <CheckIcon className="w-4 h-4 inline mr-1" /> Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      <XMarkIcon className="w-4 h-4 inline mr-1" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {editableFields.map((field) => (
                    <p key={String(field)}>
                      <strong>{String(field)}:</strong> {formData[field]}
                    </p>
                  ))}
                 

                 
                </div>
              )}
            </div>
          )}

          {tabs.find((t) => t.id === activeTab)?.render()}
        </div>
      </div>
    </div>
  );
}
