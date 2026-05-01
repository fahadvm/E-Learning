"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Plus, Mail, Lock, ShieldCheck } from "lucide-react";
import { adminApiMethods } from "@/services/APIservices/adminApiService";
import { showSuccessToast, showErrorToast } from "@/utils/Toast";

const addAdminSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[@$!%*?&]/, "Must contain at least one special character (@$!%*?&)"),
});

type AddAdminFormValues = z.infer<typeof addAdminSchema>;

export default function AddAdminPage() {
  const [loading, setLoading] = useState(false);
  const [newAdmins, setNewAdmins] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddAdminFormValues>({
    resolver: zodResolver(addAdminSchema),
  });

  const onSubmit = async (data: AddAdminFormValues) => {
    try {
      setLoading(true);
      const res = await adminApiMethods.addNewAdmin({
        email: data.email,
        password: data.password,
      });
      
      if (res?.ok && res?.data) {
        showSuccessToast("Admin created successfully");
        setNewAdmins((prev) => [res.data, ...prev]);
        reset();
      }
    } catch (error: any) {
      showErrorToast(error?.response?.data?.message || "Failed to create new admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
            Add New Admin
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Create a new admin account to help manage DevNext.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Admin Credentials</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  {...register("email")}
                  className={`pl-10 w-full p-2.5 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                    errors.email ? "border-red-500 focus:ring-red-200" : "border-slate-300 focus:ring-blue-100 focus:border-blue-500"
                  }`}
                  placeholder="admin@devnext.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  {...register("password")}
                  className={`pl-10 w-full p-2.5 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                    errors.password ? "border-red-500 focus:ring-red-200" : "border-slate-300 focus:ring-blue-100 focus:border-blue-500"
                  }`}
                  placeholder="Secure password"
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password.message}</p>}
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Password must be at least 8 characters, containing 1 uppercase, 1 number, and 1 special character.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 flex justify-center items-center gap-2 bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all font-medium shadow-sm hover:shadow"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
              {loading ? "Creating..." : "Create Admin"}
            </button>
          </form>
        </div>

        {/* List Section */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit min-h-[300px]">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Recently Added Admins</h2>
          {newAdmins.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-slate-400">
              <ShieldCheck className="h-12 w-12 mb-3 opacity-20" />
              <p className="text-sm font-medium">No admins created in this session.</p>
              <p className="text-xs mt-1 opacity-70">New admins will appear here</p>
            </div>
          ) : (
            <div className="space-y-3 mt-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {newAdmins.map((admin, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 border border-slate-100 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shadow-sm border border-blue-200">
                      {admin.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{admin.email}</p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Role: Admin</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-green-100 text-green-700 rounded-full border border-green-200">
                    Active
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
