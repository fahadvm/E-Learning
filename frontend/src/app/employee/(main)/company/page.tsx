"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Building2,
  Search,
  Check,
  X,
  Mail,
  Code,
  Briefcase,
  Loader2,
  ArrowRight,
  LogOut,
  AlertTriangle,
} from "lucide-react";
import { employeeApiMethods } from "@/services/APIservices/employeeApiService";
import { showSuccessToast, showErrorToast } from "@/utils/Toast";

// ---------------- Shared UI Components ----------------

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div
    className={`bg-white/60 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-200/50 transition duration-300 hover:shadow-xl ${className}`}
  >
    {children}
  </div>
);

const Button = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  loading = false,
}: any) => {
  const base =
    "px-4 py-2 rounded-lg font-semibold transition duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50";

  const variants: any = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    success: "bg-green-500 text-white hover:bg-green-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
    </button>
  );
};

const Input = ({ icon: Icon, ...props }: any) => (
  <div className="relative w-full">
    {Icon && (
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
    )}
    <input
      {...props}
      className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${Icon ? "pl-10" : "pl-3"
        }`}
    />
  </div>
);

const Badge = ({ children, variant = "default" }: any) => {
  const styles: any = {
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    default: "bg-indigo-100 text-indigo-800",
  };
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[variant]}`}>
      {children}
    </span>
  );
};

// ---------------- Components ----------------

const EmployeeProfileCard = ({ profile, company, status }: any) => (
  <Card>
    <div className="flex items-center space-x-4 mb-4">
      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 overflow-hidden">
        {profile?.profilePicture ? <img src={profile.profilePicture} alt="Avatar" className="w-full h-full object-cover" /> : <User className="w-8 h-8" />}
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-800">{profile?.name || "Employee"}</h2>
        <p className="text-sm text-gray-500">{profile?.position || "No Position"}</p>
      </div>
    </div>

    <div className="space-y-3 mb-4">
      <div className="flex items-center text-sm text-gray-600">
        <Mail className="w-4 h-4 mr-2 text-indigo-500" /> {profile?.email}
      </div>
      <div className="flex items-center text-sm text-gray-600">
        <Building2 className="w-4 h-4 mr-2 text-indigo-500" />{" "}
        {company ? company.name : (status === 'requested' ? "Request Pending" : "Unassigned")}
      </div>
    </div>

    <div className="flex items-center justify-between mt-auto pt-4">
      <Badge variant={status === "active" ? "success" : status === "requested" ? "warning" : "default"}>
        {status === 'active' ? "Employed" : status === 'requested' ? "Request Sent" : "Free Agent"}
      </Badge>
    </div>
    {profile?.rejectionReason && (
      <div className="mt-3 p-2 bg-red-50 text-red-600 text-xs rounded-md flex items-start">
        <AlertTriangle className="w-4 h-4 mr-2 mt-0.5" />
        <span>Recent Rejection: {profile.rejectionReason}</span>
      </div>
    )}
  </Card>
);

const CompanyInvitationRequests = ({ invitation, onAccept, onReject, loading }: any) => {
  if (!invitation) return null;

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-5 flex items-center text-gray-800">
        <Building2 className="w-5 h-5 mr-3 text-indigo-600" />
        Company Invitation
      </h2>
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition">
        <div>
          <p className="font-semibold text-gray-800">{invitation.name}</p>
          <p className="text-sm text-gray-500 flex items-center">
            <Mail className="w-3 h-3 mr-1" /> {invitation.email}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="warning">Invited</Badge>
          <Button variant="success" className="p-2" onClick={onAccept} loading={loading}>
            <Check className="w-4 h-4" />
          </Button>
          <Button variant="danger" className="p-2" onClick={onReject} loading={loading}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

const CompanySearchCard = ({ onSearch, searching, searchResult, onSendRequest, requestLoading }: any) => {
  const [code, setCode] = useState("");

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
        <Search className="w-5 h-5 mr-3 text-indigo-600" /> Join Company via Code
      </h2>
      <p className="text-gray-600 mb-4">
        Enter a valid company code to search and request to join their organization.
      </p>
      <div className="flex gap-3 mb-4">
        <Input
          placeholder="e.g., DEVNEXT102"
          icon={Code}
          value={code}
          onChange={(e: any) => setCode(e.target.value)}
          onKeyPress={(e: any) => e.key === 'Enter' && onSearch(code)}
        />
        <Button onClick={() => onSearch(code)} loading={searching}>
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {searchResult && (
        <div className="p-4 border rounded-lg bg-gray-50 flex justify-between items-center animate-in fade-in slide-in-from-top-2">
          <div>
            <h3 className="font-bold">{searchResult.name}</h3>
            <p className="text-sm text-gray-500">{searchResult.email}</p>
            <p className="text-xs text-gray-400">{searchResult.industry}</p>
          </div>
          <Button onClick={() => onSendRequest(searchResult._id)} loading={requestLoading}>
            Request to Join
          </Button>
        </div>
      )}
    </Card>
  );
}

const CurrentCompanyDetails = ({ company, onLeave }: any) => (
  <Card>
    <div className="flex justify-between items-start mb-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="w-6 h-6 text-indigo-600" />
          {company.name}
        </h2>
        <p className="text-gray-500">{company.industry}</p>
      </div>
      {company.profilePicture && (
        <img src={company.profilePicture} alt={company.name} className="w-16 h-16 rounded-lg object-cover" />
      )}
    </div>

    <div className="space-y-4 mb-6">
      <div className="flex gap-2">
        <Badge>{company.activePlan || "Standard Plan"}</Badge>
        {company.isVerified && <Badge variant="success">Verified</Badge>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-semibold text-gray-700">Contact</p>
          <p className="text-gray-600">{company.email}</p>
          <p className="text-gray-600">{company.phone || "N/A"}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Location</p>
          <p className="text-gray-600">{company.address || "N/A"}</p>
        </div>
      </div>
    </div>

    <div className="pt-4 border-t">
      <Button variant="danger" className="w-full sm:w-auto" onClick={onLeave}>
        <LogOut className="w-4 h-4 mr-2" />
        Leave Company
      </Button>
    </div>
  </Card>
)

const RequestStatusCard = ({ requestedCompany, onCancel }: any) => (
  <Card>
    <h2 className="text-xl font-semibold mb-4 text-gray-800">Pending Request</h2>
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
      <p className="text-yellow-800">
        You have requested to join <strong>{requestedCompany.name}</strong>.
        Waiting for approval.
      </p>
    </div>
    <Button variant="danger" onClick={onCancel}>
      Cancel Request
    </Button>
  </Card>
)

// ---------------- Main Page ----------------

export default function EmployeeCompanyPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  // States: 'active', 'requested', 'invited', 'none'
  const [status, setStatus] = useState<string>("none");

  const [company, setCompany] = useState<any>(null);
  const [requestedCompany, setRequestedCompany] = useState<any>(null);
  const [invitation, setInvitation] = useState<any>(null);

  // Search State
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const profileRes = await employeeApiMethods.getProfile();
      // @ts-ignore
      const p = profileRes.data;
      console.log("profile:", p)
      console.log("profileof invitedBy:", p.invitedBy)
      setProfile(p);

      // Check for Company
      if (p.companyId) {
        const companyRes = await employeeApiMethods.getMyCompany();
        // @ts-ignore
        if (companyRes.data) {
          // @ts-ignore
          setCompany(companyRes.data.companyId); // Populate puts it in companyId field usually, or assumes structure
          setStatus("active");
          setLoading(false);
          return;
        }
      }

      // Check for Request
      if (p.requestedCompanyId) {
        const reqRes = await employeeApiMethods.getRequestedCompany();
        // @ts-ignore
        if (reqRes.data && reqRes.data.requestedCompanyId) {
          // @ts-ignore
          setRequestedCompany(reqRes.data.requestedCompanyId);
          setStatus("requested");
          setLoading(false);
          return;
        }
      }

      // Check for Invitation
      if (p.invitedBy) {

        const inviteRes = await employeeApiMethods.getInvitation();
        // @ts-ignore
        if (inviteRes.data) {
          // @ts-ignore
          setInvitation(inviteRes.data);
          setStatus("invited");
          setLoading(false);
          return;
        }
      }

      setStatus("none");

    } catch (error) {
      console.error("Error fetching data", error);
      showErrorToast("Failed to load company data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (code: string) => {
    if (!code) return;
    setSearching(true);
    setSearchResult(null);
    try {
      const res = await employeeApiMethods.findCompany({ companycode: code });
      // @ts-ignore
      if (res.data) {
        // @ts-ignore
        setSearchResult(res.data);
      }
    } catch (error: any) {
      showErrorToast(error?.response?.data?.message || "Company not found");
    } finally {
      setSearching(false);
    }
  }

  const handleSendRequest = async (companyId: string) => {
    setActionLoading(true);
    try {
      await employeeApiMethods.sendCompanyRequest({ companyId });
      showSuccessToast("Request sent successfully");
      fetchData(); // Refresh state
    } catch (error: any) {
      showErrorToast(error?.response?.data?.message || "Failed to send request");
    } finally {
      setActionLoading(false);
    }
  }

  const handleAcceptInvite = async () => {
    setActionLoading(true);
    try {
      await employeeApiMethods.acceptInvite();
      showSuccessToast("Invitation accepted!");
      fetchData();
    } catch (error: any) {
      showErrorToast(error?.response?.data?.message || "Failed to accept");
    } finally {
      setActionLoading(false);
    }
  }

  const handleRejectInvite = async () => {
    setActionLoading(true);
    try {
      await employeeApiMethods.rejectInvite();
      showSuccessToast("Invitation rejected");
      fetchData();
    } catch (error: any) {
      showErrorToast(error?.response?.data?.message || "Failed to reject");
    } finally {
      setActionLoading(false);
    }
  }

  const handleCancelRequest = async () => {
    if (!confirm("Are you sure you want to cancel the request?")) return;
    try {
      await employeeApiMethods.cancelCompanyRequest();
      showSuccessToast("Request cancelled");
      fetchData();
    } catch (error: any) {
      showErrorToast(error?.response?.data?.message || "Failed to cancel");
    }
  }

  const handleLeaveCompany = async () => {
    if (!confirm("Are you sure you want to leave this company?")) return;
    try {
      await employeeApiMethods.leaveCompany();
      showSuccessToast("You have left the company");
      fetchData();
    } catch (error: any) {
      showErrorToast(error?.response?.data?.message || "Failed to leave");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 relative">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-r from-indigo-100 via-blue-100 to-white opacity-50"></div>

      <div className="relative max-w-7xl mx-auto">
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Profile */}
          <div className="lg:col-span-1">
            <EmployeeProfileCard profile={profile} company={company} status={status} />
          </div>

          {/* Right Column: Actions */}
          <div className="lg:col-span-2 space-y-8">

            {status === 'active' && company && (
              <CurrentCompanyDetails company={company} onLeave={handleLeaveCompany} />
            )}

            {status === 'requested' && requestedCompany && (
              <RequestStatusCard requestedCompany={requestedCompany} onCancel={handleCancelRequest} />
            )}

            {status === 'invited' && invitation && (
              <CompanyInvitationRequests
                invitation={invitation}
                onAccept={handleAcceptInvite}
                onReject={handleRejectInvite}
                loading={actionLoading}
              />
            )}

            {status === 'none' && (
              <CompanySearchCard
                onSearch={handleSearch}
                searching={searching}
                searchResult={searchResult}
                onSendRequest={handleSendRequest}
                requestLoading={actionLoading}
              />
            )}

          </div>
        </main>
      </div>

    </div>
  );
}
