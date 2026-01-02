"use client";

import { useEffect, useState } from "react";
import { companyApiMethods } from "@/services/APIservices/companyApiService";
import { showSuccessToast, showErrorToast } from "@/utils/Toast";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, User, Loader2 } from "lucide-react";
import RejectModal from "./RejectModal";
import ProfilePreview from "./ProfilePreview";

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
  invitedAt?: string;
}

export default function EmployeeRequestsTab() {
  const [requests, setRequests] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showProfilePreview, setShowProfilePreview] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await companyApiMethods.getRequestedEmployees();
      setRequests(res?.data || []);
    } catch (error) {
      showErrorToast((error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (employeeId: string) => {
    try {
      setActionLoading(employeeId);
      const res = await companyApiMethods.approveEmployeeRequest(employeeId);
      if ((res as { ok: boolean }).ok) {
        showSuccessToast((res as { message: string }).message || "Employee request approved");
        await fetchRequests();
      }
    } catch (error) {
      showErrorToast((error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to approve request");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!selectedEmployee) return;

    try {
      setActionLoading(selectedEmployee._id);
      const res = await companyApiMethods.rejectEmployeeRequest(selectedEmployee._id, reason);
      if ((res as { ok: boolean }).ok) {
        showSuccessToast((res as { message: string }).message || "Employee request rejected");
        setShowRejectModal(false);
        setSelectedEmployee(null);
        await fetchRequests();
      }
    } catch (error) {
      showErrorToast((error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to reject request");
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewProfile = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowProfilePreview(true);
  };

  const getAvatar = (name: string) =>
    name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "??";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No pending employee requests</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {requests.map((employee) => (
          <div
            key={employee._id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Employee Info */}
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {getAvatar(employee.name)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{employee.name}</h3>
                  <p className="text-sm text-muted-foreground">{employee.email}</p>
                  {employee.position && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {employee.position}
                      {employee.department && ` • ${employee.department}`}
                    </p>
                  )}
                  {employee.invitedAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Requested: {new Date(employee.invitedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewProfile(employee)}
                >
                  View Profile
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleApprove(employee._id)}
                  disabled={actionLoading === employee._id}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {actionLoading === employee._id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </>
                  )}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRejectClick(employee)}
                  disabled={actionLoading === employee._id}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reject Modal */}
      {selectedEmployee && (
        <RejectModal
          isOpen={showRejectModal}
          onClose={() => {
            setShowRejectModal(false);
            setSelectedEmployee(null);
          }}
          onConfirm={handleRejectConfirm}
          employeeName={selectedEmployee.name}
          employeeEmail={selectedEmployee.email}
          loading={actionLoading === selectedEmployee._id}
        />
      )}

      {/* Profile Preview Modal */}
      {selectedEmployee && showProfilePreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full">
            <ProfilePreview employee={selectedEmployee} showActions={true}>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowProfilePreview(false)}
                >
                  Close
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setShowProfilePreview(false);
                    handleApprove(selectedEmployee._id);
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    setShowProfilePreview(false);
                    handleRejectClick(selectedEmployee);
                  }}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
            </ProfilePreview>
          </div>
        </div>
      )}
    </>
  );
}
