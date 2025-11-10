"use client";

import { useEffect, useState } from "react";
import { Search, Eye, Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { showSuccessToast } from "@/utils/Toast";
import { companyApiMethods } from "@/services/APIservices/companyApiService";
import { Linkedin, Github, Globe } from "lucide-react";


interface EmployeeRequest {
    profilePicture: string;
    _id: string;
    name: string;
    email: string;
    position?: string;
    department?: string;
    joinDate?: string;
    location?: string;
    social_links?: {
        linkedin: string;
        github: string;
        portfolio: string;
    };
    status: "pending" | "approved" | "rejected";
    requestDate?: string;
}

export default function EmployeeRequestsTab() {
    const [requests, setRequests] = useState<EmployeeRequest[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeRequest | null>(null);
    const [loading, setLoading] = useState(false);

    const itemsPerPage = 5;

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await companyApiMethods.getRequestedEmployees();
            setRequests(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const filteredRequests = requests.filter((r) =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.position?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

    const handleApprove = async (id: string) => {
        setLoading(true);
        try {
            await companyApiMethods.approveEmployeeRequest(id, { status: "approve" });
            setRequests((prev) => prev.filter((r) => r._id !== id));
            showSuccessToast("Request Approved");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async (id: string) => {
        setLoading(true);
        try {
            await companyApiMethods.rejectEmployeeRequest(id, { status: "reject" });
            setRequests((prev) => prev.filter((r) => r._id !== id));
            showSuccessToast("Request Rejected");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "approved":
                return <Badge className="bg-success text-success-foreground">Approved</Badge>;
            case "rejected":
                return <Badge variant="destructive">Rejected</Badge>;
            default:
                return <Badge variant="secondary">Pending</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Search by name, email, or position..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Pending: {filteredRequests.length}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Employee Join Requests</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-8 text-center text-muted-foreground">Loading...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b bg-muted/50">
                                    <tr>
                                        <th className="text-left p-4 font-medium">Employee</th>
                                        <th className="text-left p-4 font-medium">Position</th>
                                        <th className="text-right p-4 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedRequests.map((r) => (
                                        <tr key={r._id} className="border-b hover:bg-muted/30 transition-colors">
                                            <td className="p-4">
                                                <div className="font-medium">{r.name}</div>
                                                <div className="text-sm text-muted-foreground">{r.email}</div>
                                            </td>
                                            <td className="p-4">{r.position || "Not specified"}</td>
                                            <td className="p-4 flex gap-2 justify-end">
                                                <Button variant="outline" size="sm" onClick={() => setSelectedEmployee(r)}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="bg-success hover:bg-success/90 text-success-foreground"
                                                    onClick={() => handleApprove(r._id)}
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleReject(r._id)}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="p-4 flex justify-between items-center border-t text-sm text-muted-foreground">
                            <span>
                                Page {currentPage} of {totalPages}
                            </span>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 1}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage === totalPages}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Employee Details</DialogTitle>
                    </DialogHeader>
                    {selectedEmployee && (
                        <div className="w-full">
                            {/* Header */}
                            <div className="bg-primary/10 px-6 py-5 border-b border-border flex items-center gap-4">
                                {selectedEmployee.profilePicture ? (
                                    <img
                                        src={selectedEmployee.profilePicture}
                                        alt={selectedEmployee.name}
                                        className="w-16 h-16 rounded-full object-cover border border-border shadow-sm"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                                        {selectedEmployee.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">{selectedEmployee.name}</h2>
                                    <p className="text-sm text-muted-foreground">{selectedEmployee.email}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {selectedEmployee.position || "Not specified"}
                                    </p>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-6">
                                {/* Department */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground">Department</p>
                                        <p className="text-sm font-medium text-foreground">{selectedEmployee.department || "Not specified"}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground">Position</p>
                                        <p className="text-sm font-medium text-foreground">{selectedEmployee.position || "Not specified"}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground">Location</p>
                                        <p className="text-sm font-medium text-foreground">{selectedEmployee.location || "Not specified"}</p>
                                    </div>
                                </div>


                                {/* Skills */}
                                <div className="space-y-2">
                                    <p className="text-xs font-medium text-muted-foreground">Social Links</p>

                                    <div className="flex items-center gap-4 text-gray-700">
                                        {selectedEmployee.social_links?.linkedin && (
                                            <a
                                                href={selectedEmployee.social_links.linkedin}
                                                target="_blank"
                                                className="hover:text-primary transition"
                                            >
                                                <Linkedin className="w-5 h-5" />
                                            </a>
                                        )}

                                        {selectedEmployee.social_links?.github && (
                                            <a
                                                href={selectedEmployee.social_links.github}
                                                target="_blank"
                                                className="hover:text-primary transition"
                                            >
                                                <Github className="w-5 h-5" />
                                            </a>
                                        )}

                                        {selectedEmployee.social_links?.portfolio && (
                                            <a
                                                href={selectedEmployee.social_links.portfolio}
                                                target="_blank"
                                                className="hover:text-primary transition"
                                            >
                                                <Globe className="w-5 h-5" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
