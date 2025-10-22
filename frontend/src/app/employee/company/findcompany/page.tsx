"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { showSuccessToast, showErrorToast } from "@/utils/Toast";
import { employeeApiMethods } from "@/services/APIservices/employeeApiService";
import { Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

interface Company {
    _id: string;
    name: string;
    email: string;
    profilePicture: string;
}

export default function FindCompanyPage() {
    const [code, setCode] = useState("");
    const debouncedCode = useDebounce(code, 500);
    const [company, setCompany] = useState<Company | null>(null);
    const [requestedCompany, setRequestedCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(false);
    const [requested, setRequested] = useState(false);
    useEffect(() => {
        const fetchRequestedCompanies = async () => {
            try {
                const res = await employeeApiMethods.getRequestedCompany();
                if (res.ok) {
                    setRequestedCompany(res.data.requestedCompanyId);
                }
            } catch (err) {
                console.error("Failed to fetch requested companies:", err);
            }
        };
        fetchRequestedCompanies();
    }, []);
    useEffect(() => {
        const search = async () => {
            if (!debouncedCode) {
                setCompany(null);
                return;
            }
            setLoading(true);
            try {
                const res = await employeeApiMethods.findCompany({ companycode: debouncedCode as string });
                console.log("get company details ", res)
                if (res.ok) {
                    setCompany(res.data);
                    setRequested(false);
                }
            } catch {
                setCompany(null);
            } finally {
                setLoading(false);
            }
        };
        search();
    }, [debouncedCode]);

    const handleRequest = async () => {
        if (company) {
            const res = await employeeApiMethods.sendCompanyRequest({ companyId: company._id });
            if (res.ok) {
                showSuccessToast("Request sent successfully!");
                setRequested(true);
            }
        }
    };

    const handleRemoveRequest = async () => {
        if (!requestedCompany) return;
        try {
            const res = await employeeApiMethods.cancelCompanyRequest({ companyId: requestedCompany._id });
            console.log("response in remove request",res)
            if (res.ok) {
                showSuccessToast("Request removed successfully!");
                setRequested(false);
                setRequestedCompany(null);
            }
        } catch (err) {
            showErrorToast("Failed to remove request");
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 rounded-2xl shadow-md bg-white">
            <h1 className="text-3xl font-bold mb-4 text-center">Find Your Company</h1>
            <p className="text-gray-600 text-center mb-6">
                Enter the <strong>company code</strong> provided by your employer to join.
            </p>

            <Input
                placeholder="Enter company code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="mb-4"
            />

            {loading && <Loader2 className="mx-auto mb-3 h-5 w-5 animate-spin text-gray-500" />}

            {company && (
                <div className="p-4 border rounded-md bg-gray-50">
                    {company.profilePicture && (
                        <img src={company.profilePicture} alt={company.profilePicture} className="w-20 h-20 rounded-full mb-4" />
                    )}
                    <h2 className="text-xl font-semibold">{company.name}</h2>
                    <p className="text-sm text-gray-600">{company.email}</p>
                    <Button className="mt-3" onClick={handleRequest} disabled={requested}>
                        {requested ? "Requested" : "Send Join Request"}
                    </Button>
                </div>
            )}
            {requestedCompany && (
                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-3">Requested Company</h2>
                    <div className="p-4 border rounded-md bg-green-50 mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {requestedCompany.profilePicture && (
                                <img src={requestedCompany.profilePicture} alt={requestedCompany.name} className="w-16 h-16 rounded-full" />
                            )}
                            <div>
                                <p className="font-medium">{requestedCompany.name}</p>
                                <p className="text-sm text-gray-600">{requestedCompany.email}</p>
                            </div>
                        </div>
                        <Button variant="destructive" onClick={handleRemoveRequest}>
                            Remove Request
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
