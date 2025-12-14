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
import Image from "next/image";

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

            if ((res)?.ok) {
                showSuccessToast((res)?.message || "Invitation sent successfully");
                if ((res)?.data && (res)?.data._id) {
                    // Employee exists, show profile
                    setInviteResult((res)?.data);
                } else {
                    // Employee doesn't exist, invitation link created
                    setInviteEmail("");
                    setInviteResult(null);
                }
            } else {
                // fallback message
                showErrorToast((res)?.message || "Failed to send invitation");
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

            if ((res)?.ok) {
                const employees = (res)?.data || [];
                // Filter out employees who already have a company
                const available = employees.filter((emp: Employee) => !emp.companyId);
                setSearchResults(available);

                if (available.length === 0) {
                    showErrorToast("No available employees found");
                }
            } else {
                showErrorToast((res)?.message || "Search failed");
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

            if ((res)?.ok) {
                showSuccessToast("Invitation sent to " + employee.name);
                setSelectedEmployee(null);
                setSearchResults([]);
                setSearchQuery("");
            } else {
                showErrorToast((res)?.message || "Failed to send invitation");
            }
        } catch (error: any) {
            showErrorToast(error?.response?.data?.message || "Failed to send invitation");
        }
    };

    // Background element reused across pages
    const Background = () => (
        <>
            <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-primary/20 to-slate-900" />
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
                {/* subtle stars */}
                {[...Array(60)].map((_, i) => (
                    <div
                        key={i}
                        className="fixed w-px h-px bg-white/50 animate-pulse"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 8}s`,
                        }}
                    />
                ))}
            </div>
        </>
    );

    return (
        <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden">
            {/* Gradient Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-primary/20 to-slate-900" />
            <div className="fixed inset-0">
                <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

                {[...Array(80)].map((_, i) => (
                    <div
                        key={i}
                        className="fixed w-px h-px bg-white/70 animate-pulse"
                        style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 8}s` }}
                    />
                ))}
            </div>

            <div className="relative z-10">
                <Header />

                <main className="max-w-4xl mx-auto px-6 py-24 space-y-8">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>

                        <div>
                            <h1 className="text-3xl font-bold">Add Employee</h1>
                            <p className="text-gray-300">Invite team members to join your company</p>
                        </div>
                    </div>

                    {/* Main Card */}
                    <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-1 bg-transparent p-1 rounded-lg mb-4">
                                <TabsTrigger value="invite" className="rounded-lg">
                                    <div className="inline-flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-primary" />
                                        <span className="font-semibold">Invite by Email</span>
                                    </div>
                                </TabsTrigger>
                                {/* <TabsTrigger value="search" className="rounded-lg">
                                    <div className="inline-flex items-center gap-2">
                                        <Search className="h-4 w-4 text-primary" />
                                        <span className="font-semibold">Search Employees</span>
                                    </div>
                                </TabsTrigger> */}
                            </TabsList>

                            {/* Invite Tab */}
                            <TabsContent value="invite" className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                    <div className="md:col-span-2 space-y-3">
                                        <h3 className="text-lg font-semibold">Invite by Email</h3>
                                        <p className="text-sm text-gray-400">
                                            Enter the employee's email. If they exist in the system you'll see their profile — otherwise we'll send an invitation link.
                                        </p>

                                        <div className="flex gap-3 mt-3">
                                            <Input
                                                type="email"
                                                placeholder="employee@example.com"
                                                value={inviteEmail}
                                                onChange={(e) => setInviteEmail(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && handleInviteByEmail()}
                                                disabled={inviteLoading}
                                                className="bg-white/3 border-white/8 text-white placeholder-gray-400"
                                            />
                                            <Button
                                                onClick={handleInviteByEmail}
                                                disabled={inviteLoading || !inviteEmail.trim()}
                                                className="flex items-center gap-2 bg-primary"
                                            >
                                                {inviteLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                                                <span>Invite</span>
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="md:col-span-1">
                                        <div className="p-4 rounded-lg bg-white/3 border border-white/6">
                                            <h4 className="text-sm font-semibold mb-2">Quick tips</h4>
                                            <ul className="text-sm text-gray-400 space-y-1">
                                                <li>• Invitations are delivered via email</li>
                                                <li>• Existing users will be linked to your company</li>
                                                <li>• You can resend invitations from the requests tab</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {inviteResult && (
                                    <div className="mt-4">
                                        <div className="rounded-lg bg-white/3 border border-white/6 p-4 flex items-start gap-4">
                                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                                {inviteResult.profilePicture ? (
                                                    <Image src={inviteResult.profilePicture} alt={inviteResult.name} width={80} height={80} className="object-cover" />
                                                ) : (
                                                    <div className="text-2xl font-bold text-white">
                                                        {inviteResult.name?.slice(0, 2).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div>
                                                        <div className="text-lg font-semibold">{inviteResult.name}</div>
                                                        <div className="text-sm text-gray-300">{inviteResult.email}</div>
                                                        {inviteResult.position && <div className="text-sm text-gray-400 mt-1">{inviteResult.position}</div>}
                                                    </div>
                                                    <div>
                                                        <Button onClick={() => handleSendInvitation(inviteResult)} className="bg-primary">
                                                            <UserPlus className="h-4 w-4 mr-2" /> Send Invite
                                                        </Button>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-green-400 mt-3">Invitation flow initiated. The user will receive an email shortly.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </TabsContent>

                            {/* Search Tab */}
                            <TabsContent value="search" className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                    <div className="md:col-span-2">
                                        <h3 className="text-lg font-semibold">Search Employees</h3>
                                        <p className="text-sm text-gray-400">Find existing users by name or email and invite them to your company.</p>

                                        <div className="flex gap-3 mt-3">
                                            <Input
                                                placeholder="Search by name or email..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                                disabled={searchLoading}
                                                className="bg-white/3 border-white/8 text-white placeholder-gray-400"
                                            />
                                            <Button onClick={handleSearch} disabled={searchLoading || !searchQuery.trim()} className="bg-primary">
                                                {searchLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                                <span className="ml-2">Search</span>
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="md:col-span-1">
                                        <div className="p-4 rounded-lg bg-white/3 border border-white/6">
                                            <h4 className="text-sm font-semibold mb-2">Filtering</h4>
                                            <p className="text-sm text-gray-400">Search excludes users already assigned to a company.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Results */}
                                {searchResults.length > 0 ? (
                                    <div className="mt-4 grid gap-3">
                                        {searchResults.map((employee) => (
                                            <div key={employee._id} className="p-4 rounded-lg bg-white/3 border border-white/6 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                                        {employee.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold">{employee.name}</div>
                                                        <div className="text-sm text-gray-300">{employee.email}</div>
                                                        {employee.position && <div className="text-xs text-gray-400">{employee.position}</div>}
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => setSelectedEmployee(employee)} className="border-white/10">
                                                        View Profile
                                                    </Button>

                                                    <Button size="sm" onClick={() => handleSendInvitation(employee)} className="bg-primary">
                                                        <UserPlus className="h-4 w-4 mr-1" /> Invite
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="mt-6 text-center text-gray-400">No search results yet</div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Info Box */}
                    <div className="rounded-lg bg-white/3 border border-white/6 p-4 text-sm text-gray-300">
                        <h4 className="font-semibold mb-2">How it works</h4>
                        <ul className="space-y-1">
                            <li>• Invite by email: sends an invitation link to join your company.</li>
                            <li>• Search & invite: find existing users and send an invitation.</li>
                            <li>• Invited users can accept or decline; you'll be notified in requests.</li>
                        </ul>
                    </div>
                </main>

                {/* Profile Preview Modal */}
                {selectedEmployee && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedEmployee(null)} />
                        <div className="relative max-w-xl w-full rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-xl z-10">
                            <ProfilePreview employee={selectedEmployee} showActions={false}>
                                <div className="mt-4 flex gap-3">
                                    <Button variant="outline" className="flex-1" onClick={() => setSelectedEmployee(null)}>
                                        Close
                                    </Button>
                                    <Button className="flex-1 bg-primary" onClick={() => handleSendInvitation(selectedEmployee)}>
                                        <UserPlus className="h-4 w-4 mr-1" /> Send Invitation
                                    </Button>
                                </div>
                            </ProfilePreview>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
