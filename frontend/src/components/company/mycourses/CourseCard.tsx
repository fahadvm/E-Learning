"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { formatMinutesToHours } from "@/utils/timeConverter";
import { companyApiMethods } from "@/services/APIservices/companyApiService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showErrorToast, showSuccessToast } from "@/utils/Toast";

interface BackendCourse {
  _id: string;
  title: string;
  subtitle?: string;
  teacherId: string;
  instructor?: string;
  category: string;
  coverImage: string;
  duration: number;
  totalDuration: number;
  level: string;
  status: "published" | "draft" | "blocked";
  isPublished: boolean;
  isBlocked: boolean;
  isVerified: boolean;
  language: string;
  learningOutcomes: string[];
  modules: any[];
  price: number;
  requirements: string[];
  reviews: any[];
  createdAt: string;
  updatedAt: string;
}

interface Employee {
  _id: string;
  name: string;
  email: string;
}

interface CourseCardProps {
  course: BackendCourse;
}

export const CourseCard = ({ course }: CourseCardProps) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [assigning, setAssigning] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await companyApiMethods.getAllEmployees();
        setEmployees(res.data.employees);
      } catch (err) {
        console.error(err);
        showErrorToast("Failed to fetch employees");
      }
    };
    fetchEmployees();
  }, []);

  const handleAssign = async () => {
    if (!selectedEmployee) return showErrorToast("Please select an employee");
    setShowConfirmModal(true);
  };

  const confirmAssign = async () => {
    try {
      setAssigning(true);
      await companyApiMethods.assignCourseToEmployee({
        courseId: course._id,
        employeeId: selectedEmployee!,
      });
      showSuccessToast("Course assigned successfully!");
      setSelectedEmployee(null);
      setShowConfirmModal(false);
    } catch (err) {
      console.error(err);
      showErrorToast("Failed to assign course");
    } finally {
      setAssigning(false);
    }
  };

  const getStatusColor = () => {
    if (course.status === "published") return "bg-blue-500/20 text-blue-700 border-blue-500/30";
    if (course.isBlocked) return "bg-red-500/20 text-red-700 border-red-500/30";
    return "bg-gray-500/20 text-gray-700 border-gray-500/30";
  };

  const getStatusText = () => {
    if (course.status === "published") return "Published";
    if (course.isBlocked) return "Blocked";
    return "Draft";
  };

  return (
    <>
      <Card className="group hover:shadow-hover hover:scale-105 transition-all duration-300 hover:border-primary/40 overflow-hidden">
        <div className="relative h-48 overflow-hidden">
          <img
            src={course.coverImage}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            <Badge className={`${getStatusColor()} backdrop-blur-sm`}>
              {getStatusText()}
            </Badge>
          </div>
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="backdrop-blur-sm">
              {course.level}
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-3">
          <h3 className="font-semibold text-lg text-foreground leading-tight">
            {course.title}
          </h3>
          {course.subtitle && (
            <p className="text-sm text-muted-foreground">{course.subtitle}</p>
          )}
          <div className="flex gap-5">
            <Badge variant="outline" className="w-fit">{course.category}</Badge>
            <Badge variant="outline" className="w-fit">{course.level}</Badge>
            <Badge variant="outline" className="w-fit">{course.language}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{course.modules.length} modules</span>
            <span>{formatMinutesToHours(course.totalDuration)} hours</span>
          </div>

          <Select value={selectedEmployee || ""} onValueChange={setSelectedEmployee}>
            <SelectTrigger>
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map(emp => (
                <SelectItem key={emp._id} value={emp._id}>
                  {emp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="default"
            className="w-full"
            onClick={handleAssign}
            disabled={assigning}
          >
            {assigning ? "Assigning..." : "Assign Course"}
          </Button>
        </CardContent>
      </Card>

      {/*  Custom Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Assignment</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to assign <strong>{course.title}</strong> to this employee?
          </p>
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={confirmAssign}
              disabled={assigning}
            >
              {assigning ? "Assigning..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
