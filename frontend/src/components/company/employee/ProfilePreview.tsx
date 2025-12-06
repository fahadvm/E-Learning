"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Briefcase, Calendar, User } from "lucide-react";

interface Employee {
    _id: string;
    name: string;
    email: string;
    position?: string;
    department?: string;
    location?: string;
    profilePicture?: string;
    status?: string;
    createdAt?: string;
}

interface ProfilePreviewProps {
    employee: Employee;
    showActions?: boolean;
    children?: React.ReactNode;
}

export default function ProfilePreview({ employee, showActions = true, children }: ProfilePreviewProps) {
    const getInitials = (name: string) => {
        return name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "??";
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case "approved":
                return "bg-green-500";
            case "pending":
                return "bg-yellow-500";
            case "rejected":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-lg">Employee Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Profile Picture & Name */}
                <div className="flex items-center gap-4">
                    <div className="relative">
                        {employee.profilePicture ? (
                            <img
                                src={employee.profilePicture}
                                alt={employee.name}
                                className="w-16 h-16 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-xl font-bold text-primary">
                                    {getInitials(employee.name)}
                                </span>
                            </div>
                        )}
                        {employee.status && (
                            <div
                                className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(
                                    employee.status
                                )}`}
                            />
                        )}
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg">{employee.name}</h3>
                        {employee.status && (
                            <Badge variant="outline" className="mt-1">
                                {employee.status}
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium">{employee.email}</span>
                    </div>

                    {employee.position && (
                        <div className="flex items-center gap-2 text-sm">
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Position:</span>
                            <span className="font-medium">{employee.position}</span>
                        </div>
                    )}

                    {employee.department && (
                        <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Department:</span>
                            <span className="font-medium">{employee.department}</span>
                        </div>
                    )}

                    {employee.location && (
                        <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Location:</span>
                            <span className="font-medium">{employee.location}</span>
                        </div>
                    )}

                    {employee.createdAt && (
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Joined:</span>
                            <span className="font-medium">
                                {new Date(employee.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                {showActions && children && (
                    <div className="pt-4 border-t">
                        {children}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
