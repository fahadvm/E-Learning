"use client";

import { useEffect, useState } from "react";
import { companyApiMethods } from "@/services/APIservices/companyApiService";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { employeeApiMethods } from "@/services/APIservices/employeeApiService";

interface CompanyRequest {
  company: { name: string; logo?: string; code: string };
  status: "pending" | "approved" | "rejected";
  reason?: string;
}

export default function MyCompanyPage() {
  const [data, setData] = useState<CompanyRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    employeeApiMethods
      .getMyCompany()
      .then((res) => { console.log("My Company Response:", res); 
      console.log("My Company Data:", res.data); setData(res.data)})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

  if (!data.companyId) {
    return (
      <div className="text-center p-10">
        <p className="text-gray-600 mb-4">You haven’t requested to join a company yet.</p>
        <Button onClick={() => (window.location.href = "/employee/company/findcompany")}>
          Find a Company
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <div className="flex flex-col items-center text-center bg-white rounded-xl shadow-md p-6">
        {data.companyId.logo && (
          <img src={data.companyId.logo} alt={data.companyId.name} className="w-20 h-20 rounded-full mb-4" />
        )}
        <h2 className="text-2xl font-bold">{data.companyId.name}</h2>
        <p className="text-sm text-gray-500">Code: {data.companyId.code}</p>

        {/* Status */}
        <div className="mt-4">
          {data.status === "pending" && (
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">Waiting for company approval</span>
          )}
          {data.status === "approved" && (
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">You’re now part of this company</span>
          )}
          {data.status === "rejected" && (
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">Request rejected</span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 space-x-3">
          {data.status === "approved" && (
            <Button onClick={() => (window.location.href = "/student/company-courses")}>View Company Courses</Button>
          )}
          {data.status === "rejected" && (
            <Button variant="outline" onClick={() => (window.location.href = "/student/find-company")}>
              Search Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
