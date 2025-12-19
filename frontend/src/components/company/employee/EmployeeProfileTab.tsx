"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, User, Briefcase, Calendar, Phone, MapPin, ShieldCheck, ShieldAlert } from "lucide-react";

interface EmployeeProfileTabProps {
    employee: {
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
}

export default function EmployeeProfileTab({ employee }: EmployeeProfileTabProps) {
    const getAvatar = (name: string) =>
        name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="md:col-span-1 bg-white/5 border-white/10 text-white">
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
        </div>
    );
}
