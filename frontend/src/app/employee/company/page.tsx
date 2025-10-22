"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { employeeApiMethods } from "@/services/APIservices/employeeApiService";
import { showSuccessToast, showErrorToast } from "@/utils/Toast";
import Loader from "@/components/common/Loader";
import Header from "@/components/employee/Header";

type CompanyStatus = "joined" | "notJoined" | "pendingRequest";

interface Company {
  _id: string;
  name: string;
  companyCode: string;
  profilePicture?: string;
  description?: string;
  email: string;
  phone: string;
  employees: number[];
  createdAt: string;
  plan: string;
}

interface Course {
  _id?: string;
  title: string;
  status: "not-started" | "in-progress" | "completed";
  progress: number;
}

export default function MyCompanyPage() {
  const [loading, setLoading] = useState(true);
  const [companyStatus, setCompanyStatus] = useState<CompanyStatus>("notJoined");
  const [company, setCompany] = useState<Company | null>(null);
  const [assignedCourses, setAssignedCourses] = useState<Course[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState<Company | null>(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // 🔹 Fetch company info on mount
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await employeeApiMethods.getMyCompany();
        console.log("response.data.company", response.data)
        if (response?.data) {
          setCompany(response.data.companyId);
          setAssignedCourses(response.data || []);
          setCompanyStatus("joined");
        } else if (response?.data === "pending") {
          setCompanyStatus("pendingRequest");
        } else {
          setCompanyStatus("notJoined");
        }
      } catch (err) {
        console.error(err);
        showErrorToast("Unable to fetch company data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  // 🔹 Cancel pending join request
  const handleCancelRequest = async () => {
    try {
      await employeeApiMethods.cancelCompanyRequest();
      showSuccessToast("Join request cancelled successfully.");
      setCompanyStatus("notJoined");
      setSearchResult(null);
      setSearchValue("");
    } catch {
      showErrorToast("Failed to cancel join request.");
    }
  };

  // 🔹 Search company by code
  const handleSearchCompany = async () => {
    if (!searchValue.trim()) return;
    setIsSearching(true);
    try {
      const response = await employeeApiMethods.findCompany({ companycode: searchValue });
      if (response?.data) {
        setSearchResult(response.data);
      } else {
        setSearchResult(null);
        showErrorToast("No company found with that code.");
      }
    } catch {
      showErrorToast("Failed to search for company.");
    } finally {
      setIsSearching(false);
    }
  };

  // 🔹 Send join request
  const handleSendJoinRequest = async () => {
    if (!searchResult) return;
    setIsSendingRequest(true);
    try {
      await employeeApiMethods.sendCompanyRequest({ companyId: searchResult._id });
      showSuccessToast("Join request sent successfully.");
      setCompanyStatus("pendingRequest");
      setSearchResult(null);
    } catch {
      showErrorToast("Failed to send join request.");
    } finally {
      setIsSendingRequest(false);
    }
  };

  // 🔹 Leave company
  const handleLeaveCompany = async () => {
    try {
      await employeeApiMethods.leaveCompany();
      showSuccessToast("You have left the company.");
      setCompanyStatus("notJoined");
      setCompany(null);
      setAssignedCourses([]);
      setShowLeaveModal(false);
    } catch {
      showErrorToast("Failed to leave company.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader loadingTexts="Loading company data..." />
      </div>
    );
  }

  return (
    <>
      <Header/>
    <div className="p-6 space-y-8 pt-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">My Company</h1>
        <p className="text-gray-500">
          {companyStatus === "joined"
            ? `You are part of ${company?.name}.`
            : companyStatus === "pendingRequest"
              ? "Your join request is pending."
              : "Join your company to access internal learning resources."}
        </p>
      </div>

      {companyStatus === "joined" && company && (
        <>
          <Card className="shadow-md">
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <CardTitle>Company Details</CardTitle>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowLeaveModal(true)}
              >
                Leave Company
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-4">
                <img
                  src={company.profilePicture || "/images/default-company.png"}
                  alt="Company logo"
                  className="w-20 h-20 rounded-full object-cover border"
                />
                <div>
                  <h2 className="text-2xl font-semibold">{company.name}</h2>
                  <p className="text-sm text-gray-500">
                    {company.description || "No description available."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 text-sm">
                <p><strong>Company Code:</strong> {company.companyCode}</p>
                <p><strong>Email:</strong> {company.email}</p>
                <p><strong>Contact:</strong> {company.phone}</p>
                <p><strong>Employees:</strong> {company.employees.length}</p>
                <p><strong>Joined:</strong> {new Date(company.createdAt).toDateString()}</p>
                <p><strong>Subscription Plan:</strong> No plan</p>
              </div>
            </CardContent>
          </Card>

          {/* Assigned Courses */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Assigned Courses</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {assignedCourses.length > 0 ? (
                assignedCourses.map((course, index) => (
                  <div key={course._id || index} className="border rounded-lg p-4 space-y-2">
                    <h3 className="font-semibold">{course.title}</h3>
                    <Progress value={course.progress} />
                    <p className="text-sm text-gray-500">
                      Status: {course.status.replace("-", " ")}
                    </p>
                    <Button variant="outline" className="w-full">
                      View Course
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic text-center">
                  No assigned courses yet. You’ll see them here once your company assigns some.
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* ✅ CASE 2 — Not Joined */}
      {companyStatus === "notJoined" && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Join a Company</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Input
                placeholder="Enter company code..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <Button onClick={handleSearchCompany} disabled={isSearching}>
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>

            {searchResult && (
              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-semibold">{searchResult.name}</h3>
                <p className="text-sm text-gray-500">{searchResult.email}</p>
                <Button onClick={handleSendJoinRequest} disabled={isSendingRequest}>
                  {isSendingRequest ? "Sending..." : "Send Join Request"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ✅ CASE 3 — Pending Request */}
      {companyStatus === "pendingRequest" && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Join Request Pending</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-500">
              You have already sent a join request. Please wait for approval.
            </p>
            <Button variant="destructive" onClick={handleCancelRequest}>
              Cancel Request
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 🧭 Leave Company Confirmation Modal */}
      <Dialog open={showLeaveModal} onOpenChange={setShowLeaveModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Company?</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to leave{" "}
            <strong>{company?.name}</strong>? This action cannot be undone.
          </p>
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowLeaveModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLeaveCompany}>
              Confirm Leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
}
