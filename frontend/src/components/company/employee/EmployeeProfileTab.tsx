"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, User, Briefcase, Calendar, Phone, MapPin, ShieldCheck, ShieldAlert, Edit, Ban, CheckCircle, Trash, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditEmployeeModal from "./EditEmployeeModal";
import ConfirmationDialog from "@/reusable/ConfirmationDialog";
import { companyApiMethods } from "@/services/APIservices/companyApiService";
import { showSuccessToast, showErrorToast } from "@/utils/Toast";

import { useRouter } from "next/navigation";

interface EmployeeProfileTabProps {
    employee: {
        _id: string;
        name: string;
        email: string;
        employeeID?: string;
        department?: string;
        position?: string;
        status?: string;
        isBlocked?: boolean;
        createdAt?: string;
        phone?: string;
        location?: string;
        profilePicture?: string;
    };
    onUpdate: () => void;
}

export default function EmployeeProfileTab({ employee, onUpdate }: EmployeeProfileTabProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const router = useRouter();

    const getAvatar = (name: string) =>
        name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    const toggleBlockEmployee = async () => {
        setActionLoading(true);
        try {
            const res = await companyApiMethods.blockEmployee(employee._id, { status: !employee.isBlocked });
            if ((res as any)?.ok) {
                showSuccessToast(`Employee ${!employee.isBlocked ? "blocked" : "unblocked"} successfully`);
                onUpdate();
            }
        } catch (err) {
            showErrorToast("Failed to update employee status");
        } finally {
            setActionLoading(false);
        }
    };

    const handleRemoveEmployee = async () => {
        setActionLoading(true);
        try {
            const res = await companyApiMethods.removeEmployee(employee._id);
            if ((res as any)?.ok) {
                showSuccessToast("Employee removed from company");
                router.push("/company/employees");
            }
        } catch (err) {
            showErrorToast("Failed to remove employee");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="md:col-span-1 bg-white/5 border-white/10 text-white overflow-hidden">
                    <CardHeader className="flex flex-col items-center">
                        {employee.profilePicture ? (
                            <img
                                src={employee.profilePicture}
                                alt={employee.name}
                                className="w-24 h-24 rounded-full ring-4 ring-primary/30 object-cover"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary ring-4 ring-primary/30">
                                {getAvatar(employee.name)}
                            </div>
                        )}
                        <CardTitle className="mt-4 text-2xl font-bold">{employee.name}</CardTitle>
                        <p className="text-gray-400">{employee.position || "No Position"}</p>
                        <div className="mt-2">
                            {employee.isBlocked ? (
                                <Badge variant="destructive" className="flex items-center gap-1">
                                    <ShieldAlert className="w-3 h-3" /> Blocked
                                </Badge>
                            ) : (
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3" /> Active
                                </Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardFooter className="flex flex-col gap-2 p-6 bg-white/5 border-t border-white/10">
                        <Button
                            className="w-full flex items-center gap-2"
                            onClick={() => setIsEditModalOpen(true)}
                        >
                            <Edit className="w-4 h-4" /> Edit Profile
                        </Button>
                        <div className="grid grid-cols-2 gap-2 w-full">
                            <Button
                                variant="outline"
                                className="border-white/10 bg-white/5 hover:bg-white/10 text-white"
                                onClick={toggleBlockEmployee}
                                disabled={actionLoading}
                            >
                                {actionLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : employee.isBlocked ? (
                                    <>
                                        <CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Unblock
                                    </>
                                ) : (
                                    <>
                                        <Ban className="w-4 h-4 mr-2 text-red-400" /> Block
                                    </>
                                )}
                            </Button>
                            <ConfirmationDialog
                                title="Remove Employee"
                                description="Are you sure you want to remove this employee? This action cannot be undone."
                                confirmText="Remove"
                                onConfirm={handleRemoveEmployee}
                                triggerButton={
                                    <Button
                                        variant="outline"
                                        className="w-full border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400"
                                        disabled={actionLoading}
                                    >
                                        <Trash className="w-4 h-4 mr-2" /> Remove
                                    </Button>
                                }
                            />
                        </div>
                    </CardFooter>
                </Card>

                {/* Details Card */}
                <Card className="md:col-span-2 bg-white/5 border-white/10 text-white">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Personal & Account Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 font-medium uppercase tracking-wider flex items-center gap-1">
                                <Mail className="w-3 h-3" /> Email Address
                            </label>
                            <p className="text-sm font-medium">{employee.email}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 font-medium uppercase tracking-wider flex items-center gap-1">
                                <User className="w-3 h-3" /> Employee ID
                            </label>
                            <p className="text-sm font-medium">{employee.employeeID || "N/A"}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 font-medium uppercase tracking-wider flex items-center gap-1">
                                <Briefcase className="w-3 h-3" /> Department
                            </label>
                            <p className="text-sm font-medium">{employee.department || "N/A"}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 font-medium uppercase tracking-wider flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> Date Joined
                            </label>
                            <p className="text-sm font-medium">
                                {employee.createdAt ? new Date(employee.createdAt).toLocaleDateString() : "N/A"}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 font-medium uppercase tracking-wider flex items-center gap-1">
                                <Phone className="w-3 h-3" /> Contact Details
                            </label>
                            <p className="text-sm font-medium">{employee.phone || "No phone number"}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 font-medium uppercase tracking-wider flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> Location
                            </label>
                            <p className="text-sm font-medium">{employee.location || "N/A"}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <EditEmployeeModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                employee={employee}
                onSuccess={onUpdate}
            />
        </div>
    );
}
