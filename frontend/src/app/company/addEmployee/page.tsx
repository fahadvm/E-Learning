"use client";

import { useState } from "react";
import Header from "@/components/company/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { companyApiMethods } from "@/services/APIservices/companyApiService";
import { showSuccessToast, showErrorToast } from "@/utils/Toast";
import { Mail, Search, Loader2, UserPlus, ArrowLeft } from "lucide-react";
import ProfilePreview from "@/components/company/employee/ProfilePreview";
import { useRouter } from "next/navigation";

interface Employee {
    _id: string;
    name: string;
    email: string;
    position?: string;
    department?: string;
    location?: string;
    profilePicture?: string;
    status?: string;
    companyId?: string;
}

export default function AddEmployeePage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("invite");

    // Invite tab state
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteLoading, setInviteLoading] = useState(false);
    const [inviteResult, setInviteResult] = useState<Employee | null>(null);

    // Search tab state
    const [searchQuery, setSearchQuery] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<Employee[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleInviteByEmail = async () => {
        if (!inviteEmail.trim()) {
            showErrorToast("Please enter an email address");
            return;
        }

        if (!validateEmail(inviteEmail)) {
            showErrorToast("Please enter a valid email address");
            return;
        }

        try {
            setInviteLoading(true);
            const res = await companyApiMethods.inviteEmployee(inviteEmail);

            if ((res as any)?.ok) {
                showSuccessToast((res as any)?.message || "Invitation sent successfully");
                if ((res as any)?.data && (res as any)?.data._id) {
                    // Employee exists, show profile
                    setInviteResult((res as any)?.data);
                } else {
                    // Employee doesn't exist, invitation link created
                    setInviteEmail("");
                    setInviteResult(null);
                }
            }
        } catch (error: any) {
            showErrorToast(error?.response?.data?.message || "Failed to send invitation");
        } finally {
            setInviteLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            showErrorToast("Please enter a search query");
            return;
        }

        try {
            setSearchLoading(true);
            const res = await companyApiMethods.searchEmployees(searchQuery);

            if ((res as any)?.ok) {
                const employees = (res as any)?.data || [];
                // Filter out employees who already have a company
                const available = employees.filter((emp: Employee) => !emp.companyId);
                setSearchResults(available);

                if (available.length === 0) {
                    showErrorToast("No available employees found");
                }
            }
        } catch (error: any) {
            showErrorToast(error?.response?.data?.message || "Search failed");
        } finally {
            setSearchLoading(false);
        }
    };

    const handleSendInvitation = async (employee: Employee) => {
        try {
            const res = await companyApiMethods.inviteEmployee(employee.email);

            if ((res as any)?.ok) {
                showSuccessToast("Invitation sent to " + employee.name);
                setSelectedEmployee(null);
                setSearchResults([]);
                setSearchQuery("");
            }
        } catch (error: any) {
            showErrorToast(error?.response?.data?.message || "Failed to send invitation");
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="max-w-4xl mx-auto px-6 py-24 space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Add Employee</h1>
                        <p className="text-muted-foreground">
                            Invite employees to join your company
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="invite">
                            <Mail className="h-4 w-4 mr-2" />
                            Invite by Email
                        </TabsTrigger>
                        <TabsTrigger value="search">
                            <Search className="h-4 w-4 mr-2" />
                            Search Employees
                        </TabsTrigger>
                    </TabsList>

                    {/* Invite by Email Tab */}
                    <TabsContent value="invite" className="space-y-6">
                        <div className="border rounded-lg p-6 space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2">Invite by Email Address</h3>
                                <p className="text-sm text-muted-foreground">
                                    Enter the email address of the employee you want to invite
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Input
                                    type="email"
                                    placeholder="employee@example.com"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleInviteByEmail()}
                                    disabled={inviteLoading}
                                />
                                <Button
                                    onClick={handleInviteByEmail}
                                    disabled={inviteLoading || !inviteEmail.trim()}
                                >
                                    {inviteLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            <UserPlus className="h-4 w-4 mr-2" />
                                            Invite
                                        </>
                                    )}
                                </Button>
                            </div>

                            {inviteResult && (
                                <div className="mt-6">
                                    <ProfilePreview employee={inviteResult} showActions={false} />
                                    <p className="text-sm text-green-600 mt-4 text-center">
                                        ✓ Invitation sent successfully!
                                    </p>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Search Employees Tab */}
                    <TabsContent value="search" className="space-y-6">
                        <div className="border rounded-lg p-6 space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2">Search for Employees</h3>
                                <p className="text-sm text-muted-foreground">
                                    Search by name or email to find employees
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Input
                                    placeholder="Search by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                                    disabled={searchLoading}
                                />
                                <Button
                                    onClick={handleSearch}
                                    disabled={searchLoading || !searchQuery.trim()}
                                >
                                    {searchLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            <Search className="h-4 w-4 mr-2" />
                                            Search
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Search Results */}
                            {searchResults.length > 0 && (
                                <div className="mt-6 space-y-4">
                                    <h4 className="font-semibold">Search Results ({searchResults.length})</h4>
                                    <div className="space-y-3">
                                        {searchResults.map((employee) => (
                                            <div
                                                key={employee._id}
                                                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <span className="font-bold text-primary">
                                                                {employee.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold">{employee.name}</p>
                                                            <p className="text-sm text-muted-foreground">{employee.email}</p>
                                                            {employee.position && (
                                                                <p className="text-xs text-muted-foreground">{employee.position}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setSelectedEmployee(employee)}
                                                        >
                                                            View Profile
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleSendInvitation(employee)}
                                                        >
                                                            <UserPlus className="h-4 w-4 mr-1" />
                                                            Invite
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Info Box */}
                <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">How it works</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• <strong>Invite by Email:</strong> Send an invitation to an employee's email address</li>
                        <li>• <strong>Search:</strong> Find existing employees and send them an invitation</li>
                        <li>• Employees will receive a notification and can accept or decline</li>
                        <li>• You'll be notified when they respond to your invitation</li>
                    </ul>
                </div>
            </main>

            {/* Profile Preview Modal */}
            {selectedEmployee && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="max-w-md w-full">
                        <ProfilePreview employee={selectedEmployee} showActions={true}>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setSelectedEmployee(null)}
                                >
                                    Close
                                </Button>
                                <Button
                                    className="flex-1"
                                    onClick={() => handleSendInvitation(selectedEmployee)}
                                >
                                    <UserPlus className="h-4 w-4 mr-1" />
                                    Send Invitation
                                </Button>
                            </div>
                        </ProfilePreview>
                    </div>
                </div>
            )}
        </div>
    );
}
