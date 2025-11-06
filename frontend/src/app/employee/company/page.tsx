"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { employeeApiMethods } from "@/services/APIservices/employeeApiService"
import { IEmployee, useEmployee } from "@/context/employeeContext"
import { EmployeeCard } from "@/components/employee/employee-card"
import { CompanySearch } from "@/components/employee/company-search"
import { CompanyCard } from "@/components/employee/company-card"
import { CompanyHero } from "@/components/employee/company-hero"
import { TeamGrid } from "@/components/employee/team-grid"
import { CompanyProfileModal } from "@/components/employee/company-profile-modal"
import { ConfirmationDialog } from "@/components/employee/confirmation-dialog"
import { LoadingState } from "@/components/employee/loading-state"
import { NotificationAlert } from "@/components/employee/notification-alert"

type UserCompanyState = "no-company" | "has-company" | "loading"
type JoinRequestStatus = "none" | "requested" | "approved"

interface SocialLinks {
  linkedin?: string
  twitter?: string
  instagram?: string
}

interface ICompany {
  _id?: string
  isVerified: boolean
  isBlocked: boolean
  role: string
  about: string
  profilePicture: string
  location: string
  companyCode: string
  phone: string
  website: string
  social_links: SocialLinks
  name: string
  email: string
  password: string
  courses: string
  employees: any[]
  employeesCount?: number
  isPremium: boolean
  createdAt: Date
  updatedAt: Date
}

interface Notification {
  id: string
  title: string
  message: string
  type: "success" | "error" | "info"
}

export default function CompanyPage() {

  const [userState, setUserState] = useState<UserCompanyState>("loading")
  const [joinRequestStatus, setJoinRequestStatus] = useState<JoinRequestStatus>("none")
  const [companyData, setCompanyData] = useState<ICompany | null>(null)
  const [companyFullData, setCompanyFullData] = useState<ICompany | null>(null)
  const [employee, setEmployee] = useState<IEmployee | null>(null)
  const [employees, setEmployees] = useState<any[]>([])

  const [companyCode, setCompanyCode] = useState("")
  const [searchError, setSearchError] = useState<string | null>(null)

  const [companyProfileOpen, setCompanyProfileOpen] = useState(false)
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false)
  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false)

  const [isSearching, setIsSearching] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [isCompanyLoading, setIsCompanyLoading] = useState(false)

  const [notification, setNotification] = useState<Notification | null>(null)
  const requiredFields = ["name", "phone", "location", "department", "position"]


  const showNotification = (title: string, message: string, type: "success" | "error" | "info" = "info") => {
    const id = Date.now().toString()
    setNotification({ id, title, message, type })
  }

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setUserState("loading")
        const res = await employeeApiMethods.getMyCompany()

        if (res?.data?.status === "approved") {
          const company = res.data.companyId
          setCompanyData(company)
          setEmployees(company.employees || [])
          setUserState("has-company")
          setJoinRequestStatus("approved")
        } else if (res?.data?.status === "requested") {
          const company = res.data.requestedCompanyId
          setCompanyData(company)
          setEmployees(company.employees || [])
          setJoinRequestStatus("requested")
          setUserState("no-company")
        } else {
          setUserState("no-company")
          setJoinRequestStatus("none")
        }
      } catch {
        setUserState("no-company")
      }
    }

    const fetchEmployee = async () => {
      try {
        const res = await employeeApiMethods.getProfile();
        setEmployee(res.data);
      } catch (err) {
        console.log("Profile fetch error:", err);
      };
    }
    fetchEmployee()
    fetchCompanyData()
  }, [])

  const handleSearch = async (code: string) => {
    if (joinRequestStatus === "requested" && companyData?.name) {
      showNotification(
        "Request Already Sent",
        `You've already requested ${companyData.name}. Cancel your request to connect with another company.`,
        "info",
      )
      return
    }

    setIsSearching(true)
    setSearchError(null)

    try {
      const res = await employeeApiMethods.findCompany({ companycode: code })
      if (res?.data) {
        setCompanyData(res.data)
        setEmployees(res.data.employees || [])
      } else {
        setSearchError("Company not found.")
      }
    } catch {
      setSearchError("Error searching company.")
    } finally {
      setIsSearching(false)
    }
  }

  const handleJoinRequest = async () => {
    if (!companyData?._id) return

    const missingFields = []
    if (!employee?.name) missingFields.push("Name")
    if (!employee?.phone) missingFields.push("Phone")
    if (!employee?.location) missingFields.push("Location")
    if (!employee?.department) missingFields.push("Department")
    if (!employee?.position) missingFields.push("Position")

    if (missingFields.length > 0) {
      showNotification(
        "Complete Your Profile",
        `Please fill the following fields before joining a company: ${missingFields.join(", ")}`,
        "error"
      )
      return
    }

    setIsActionLoading(true)
    try {
      await employeeApiMethods.sendCompanyRequest({ companyId: companyData?._id })
      setJoinRequestStatus("requested")
      showNotification("Request Sent", "Your join request is pending approval.", "success")
    } catch {
      showNotification("Error", "Failed to send join request.", "error")
    } finally {
      setIsActionLoading(false)
    }
  }


  const handleCancelRequest = async () => {
    setIsActionLoading(true)
    try {
      await employeeApiMethods.cancelCompanyRequest()
      setJoinRequestStatus("none")
      setCompanyData(null)
      showNotification("Cancelled", "Your join request has been cancelled.", "success")
    } finally {
      setIsActionLoading(false)
      setConfirmCancelOpen(false)
    }
  }

  const handleEmployeeUpdate = (updatedData: Partial<IEmployee>) => {
    setEmployee((prev) => ({
      ...prev!,
      ...updatedData,
    }));
  };

  const handleLeaveCompany = async () => {
    setIsActionLoading(true)
    try {
      await employeeApiMethods.leaveCompany()
      setUserState("no-company")
      setJoinRequestStatus("none")
      setCompanyData(null)
      showNotification("Left Company", "You have successfully left the company.", "success")
    } catch {
      showNotification("Error", "Failed to leave company.", "error")
    } finally {
      setIsActionLoading(false)
      setConfirmLeaveOpen(false)
    }
  }

  const openCompanyProfile = async () => {
    setCompanyProfileOpen(true)
    setIsCompanyLoading(true)
    try {
      const res = await employeeApiMethods.getMyCompany()
      if (res.data.status === "requested") {
        setCompanyFullData(res?.data.requestedCompanyId)
      } else if (res.data.status === "approved") {
        setCompanyFullData(res?.data.companyId)
      }
    } finally {
      setIsCompanyLoading(false)
    }
  }

  if (userState === "loading") {
    return <LoadingState message="Loading company data..." />
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0 bg-grid-pattern" />
      </div>

      <div className="relative">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-[30%_70%] gap-8 md:gap-12"
          >
            {/* Employee Card */}
            <EmployeeCard
              name={employee?.name || "Unknown"}
              email={employee?.email || "-"}
              phone={employee?.phone || "-"}
              address={employee?.location || "-"}
              employeeId={employee?.employeeID || "N/A"}
              department={employee?.department || "-"}
              position={employee?.position || "-"}
              profilePicture={employee?.profilePicture || "/images/profile.jpg"}
              linkedin={employee?.social_links?.linkedin}
              github={employee?.social_links?.github}
              portfolio={employee?.social_links?.portfolio}
              onProfileUpdate={handleEmployeeUpdate}
            />

            <AnimatePresence mode="wait">
              {/* No Company State */}
              {userState === "no-company" && (
                <motion.div
                  key="no-company"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-8"
                >
                  <CompanySearch onSearch={handleSearch} isSearching={isSearching} error={searchError} />

                  {companyData && (
                    <CompanyCard
                      name={companyData.name}
                      code={companyData.companyCode}
                      employeeCount={employees.length}
                      onViewProfile={openCompanyProfile}
                      onJoinRequest={handleJoinRequest}
                      onCancelRequest={() => setConfirmCancelOpen(true)}
                      status={joinRequestStatus}
                      isLoading={isActionLoading}
                    />
                  )}
                </motion.div>
              )}

              {/* Has Company State */}
              {userState === "has-company" && companyData && (
                <motion.div
                  key="has-company"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-12"
                >
                  <CompanyHero
                    name={companyData.name}
                    memberCount={companyData.employeesCount || employees.length}
                    onViewProfile={openCompanyProfile}
                    onLeave={() => setConfirmLeaveOpen(true)}
                    isLoading={isActionLoading}
                  />

                  {employees.length > 0 && <TeamGrid members={employees} />}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Modals & Dialogs */}
      <CompanyProfileModal
        open={companyProfileOpen}
        onOpenChange={setCompanyProfileOpen}
        company={companyFullData}
        isLoading={isCompanyLoading}
      />

      <ConfirmationDialog
        open={confirmCancelOpen}
        onOpenChange={setConfirmCancelOpen}
        title="Cancel Join Request?"
        description={`Are you sure you want to cancel your request to join ${companyData?.name}? You can search for them again later.`}
        onConfirm={handleCancelRequest}
        confirmText="Cancel Request"
        cancelText="Keep Request"
        isDangerous={true}
        isLoading={isActionLoading}
      />

      <ConfirmationDialog
        open={confirmLeaveOpen}
        onOpenChange={setConfirmLeaveOpen}
        title="Leave Company?"
        description={`Are you sure you want to leave ${companyData?.name}? You'll lose access to team collaboration features.`}
        onConfirm={handleLeaveCompany}
        confirmText="Leave Company"
        cancelText="Stay"
        isDangerous={true}
        isLoading={isActionLoading}
      />

      {/* Notification */}
      {notification && (
        <NotificationAlert
          title={notification.title}
          message={notification.message}
          type={notification.type}
          autoClose={true}
          duration={4000}
          onClose={() => setNotification(null)}
        />
      )}
    </main>
  )
}
