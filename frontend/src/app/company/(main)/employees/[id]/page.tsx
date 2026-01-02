"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/company/Header";
import { companyApiMethods } from "@/services/APIservices/companyApiService";
import { Loader2, ArrowLeft, User, BookOpen, BarChart3 } from "lucide-react";
import { Employee } from "@/types/company/companyTypes";
import { AssignedLearningPath } from "@/types/employee/employeeTypes";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showErrorToast } from "@/utils/Toast";

// Components
import EmployeeProfileTab from "@/components/company/employee/EmployeeProfileTab";
import EmployeeLearningPathsTab from "@/components/company/employee/EmployeeLearningPathsTab";
import EmployeeProgressTab, { CourseProgress } from "@/components/company/employee/EmployeeProgressTab";
import AssignLearningPathModal from "@/components/company/employee/AssignLearningPathModal";

export default function EmployeeDetailsPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();

    const [employee, setEmployee] = useState<Employee | null>(null);
    const [assignedPaths, setAssignedPaths] = useState<AssignedLearningPath[]>([]);
    const [progress, setProgress] = useState<CourseProgress[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [empRes, pathsRes, progressRes] = await Promise.all([
                companyApiMethods.getEmployeeById(id),
                companyApiMethods.getAssignedLearningPaths(id),
                companyApiMethods.getEmployeeProgress(id),
            ]);

            if (empRes?.data) setEmployee(empRes.data);
            if (pathsRes?.data) setAssignedPaths(pathsRes.data);
            if (progressRes?.data) setProgress(progressRes.data);
        } catch (err) {
            showErrorToast("Failed to fetch employee details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
                <p className="text-xl mb-4">Employee not found</p>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden">
            {/* Background Decor */}
            <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-primary/10 to-slate-900" />
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="relative z-20">
                <Header />

                <main className="max-w-7xl mx-auto px-6 py-28 space-y-8">
                    {/* Top Actions */}
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.back()}
                            className="text-white hover:bg-white/10"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{employee.name}</h1>
                            <p className="text-gray-400">Employee Details & Learning Activity</p>
                        </div>
                    </div>

                    {/* Main Content Tabs */}
                    <Tabs defaultValue="profile" className="w-full">
                        <TabsList
                            className="
      bg-white/10 
      border border-white/10 
      p-1 
      rounded-xl 
      mb-8

      flex 
      gap-1
      overflow-x-auto 
      whitespace-nowrap

      sm:overflow-visible 
      sm:justify-center
    "
                        >
                            <TabsTrigger
                                value="profile"
                                className="
        rounded-lg 
        data-[state=active]:bg-primary 
        data-[state=active]:text-white 
        flex items-center gap-2 
        px-4 sm:px-6
        text-sm sm:text-base
        shrink-0
      "
                            >
                                <User className="w-4 h-4" />
                                <span className="hidden sm:inline">Profile</span>
                            </TabsTrigger>

                            <TabsTrigger
                                value="learning-paths"
                                className="
        rounded-lg 
        data-[state=active]:bg-primary 
        data-[state=active]:text-white 
        flex items-center gap-2 
        px-4 sm:px-6
        text-sm sm:text-base
        shrink-0
      "
                            >
                                <BookOpen className="w-4 h-4" />
                                <span className="hidden sm:inline">Learning Paths</span>
                            </TabsTrigger>

                            <TabsTrigger
                                value="progress"
                                className="
        rounded-lg 
        data-[state=active]:bg-primary 
        data-[state=active]:text-white 
        flex items-center gap-2 
        px-4 sm:px-6
        text-sm sm:text-base
        shrink-0
      "
                            >
                                <BarChart3 className="w-4 h-4" />
                                <span className="hidden sm:inline">Current Progress</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile">
                            <EmployeeProfileTab employee={employee} onUpdate={fetchData} />
                        </TabsContent>

                        <TabsContent value="learning-paths">
                            <EmployeeLearningPathsTab
                                assignedPaths={assignedPaths}
                                onAssignClick={() => setIsAssignModalOpen(true)}
                            />
                        </TabsContent>

                        <TabsContent value="progress">
                            <EmployeeProgressTab
                                progress={progress}
                                assignedPaths={assignedPaths}
                            />
                        </TabsContent>
                    </Tabs>

                </main>
            </div>

            {/* Assignment Modal */}
            <AssignLearningPathModal
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                employeeId={id}
                assignedPathIds={assignedPaths.map(p => p.learningPathId?._id).filter(Boolean)}
                onSuccess={fetchData}
            />
        </div>
    );
}