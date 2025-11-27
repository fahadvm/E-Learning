"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Ban,
  Unlock,
  Building2,
  Users,
  CreditCard,
  Layers,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  ICompanyDetails,
  ICompanyEmployee,
} from "@/types/admin/company";
import { adminApiMethods } from "@/services/APIservices/adminApiService";

export default function CompanyDetailsPage() {
  const params = useParams();
  const companyId = params.id as string;

  const [company, setCompany] = useState<ICompanyDetails | null>(null);
  const [employees, setEmployees] = useState<ICompanyEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);

  const fetchCompany = async () => {
    try {
      const response = await adminApiMethods.getCompanyById(companyId);
      console.log("data details", response)
      setCompany(response.data.company);
      setEmployees(response.data.employees);
    } catch (error) {
      console.error("Failed to fetch company:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!company) return;

    try {
      setStatusLoading(true);

      const updated =
        company.status === "active"
          ? await adminApiMethods.blockCompany(companyId)
          : await adminApiMethods.unblockCompany(companyId);

      setCompany((prev) => (prev ? { ...prev, status: updated.status } : prev));
    } catch (error) {
      console.error("Failed to update company status:", error);
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, [companyId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-slate-500 text-lg">Loading company details...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold text-slate-900">Company Not Found</h2>
        <p className="text-slate-500 mb-4">This company does not exist.</p>
        <Link href="/admin/companies">
          <Button>Back to Companies</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/companies">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
              {company.name}

              <Badge
                variant={company.status === "active" ? "success" : "destructive"}
              >
                {company.status}
              </Badge>
            </h1>

            <p className="text-sm text-slate-500">ID: {company._id}</p>
          </div>
        </div>

        <Button
          disabled={statusLoading}
          variant={company.status === "active" ? "destructive" : "default"}
          className={
            company.status !== "active"
              ? "bg-green-600 hover:bg-green-700 text-white"
              : ""
          }
          onClick={handleToggleStatus}
        >
          {statusLoading ? (
            "Please wait..."
          ) : company.status === "active" ? (
            <>
              <Ban className="h-4 w-4 mr-2" /> Block Company
            </>
          ) : (
            <>
              <Unlock className="h-4 w-4 mr-2" /> Unblock Company
            </>
          )}
        </Button>
      </div>

      {/* GRID */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT COLUMN */}
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Company Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center pb-6 border-b border-slate-100">
                <Avatar className="h-24 w-24 mb-4 rounded-xl">
                  <AvatarImage src={company.profilePicture} />
                  <AvatarFallback className="rounded-xl">
                    <Building2 className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>

                <h3 className="text-lg font-semibold">{company.name}</h3>
                <p className="text-sm text-slate-500">{company.industry}</p>
              </div>

              <div className="space-y-4 pt-6 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span>{company.email}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span>{company.phone}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>Joined {company.joinDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SUBSCRIPTION CARD */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span>Plan</span>
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {company.activePlan ? company.activePlan : "Free"}
                  </Badge>
                </div>

                <div className="flex justify-between">
                  <span>Status</span>
                  <Badge
                    variant={

                      "success"
                    }
                  >
                    {company.activePlan ? company.subscriptionStatus : "active"}
                  </Badge>
                </div>

                <div className="flex justify-between">
                  <span>Expires</span>
                  <span className="font-medium">
                    {company.activePlan ? company.subscriptionExpiry : "Unlimited"}
                  </span>
                </div>

                {/* CREDITS */}
                {/* <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Credits Remaining</h4>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">
                          Subscription Credits
                        </span>
                        <span className="font-medium">
                          {company.credits.subscription}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: "75%" }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">Course Credits</span>
                        <span className="font-medium">
                          {company.credits.course}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full">
                        <div
                          className="h-full bg-purple-600 rounded-full"
                          style={{ width: "50%" }}
                        />
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN — EMPLOYEES */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Employees</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 h-10">Name</th>
                      <th className="px-4 h-10">Status</th>
                      <th className="px-4 h-10">Courses</th>
                      <th className="px-4 h-10">Credits Used</th>
                      <th className="px-4 h-10">Last Active</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {employees.map((emp) => (
                      <tr key={emp._id} className="hover:bg-slate-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={emp.avatar} />
                              <AvatarFallback>
                                {emp.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{emp.name}</div>
                              <p className="text-xs text-slate-500">
                                {emp.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <Badge
                            variant={
                              emp.status === "active" ? "success" : "destructive"
                            }
                          >
                            {emp.status}
                          </Badge>
                        </td>

                        <td className="p-4">
                          {emp.coursesCompleted} / {emp.coursesAssigned}
                        </td>

                        <td className="p-4">{emp.creditsUsed}</td>

                        <td className="p-4 text-xs text-slate-500">
                          {emp.lastActive}
                        </td>
                      </tr>
                    ))}

                    {employees.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-6 text-center text-slate-500"
                        >
                          No employees found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          {/* PURCHASE HISTORY */}
     
        </div>
      </div>
    </div>
  );
}
