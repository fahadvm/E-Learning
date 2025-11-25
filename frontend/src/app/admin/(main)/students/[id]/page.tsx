"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Shield,
  Ban,
  Unlock,
  MoreVertical,
  BookOpen,
  CreditCard,
} from "lucide-react";

import { adminApiMethods } from "@/services/APIservices/adminApiService";
import { IStudentDetails } from "@/types/admin/student";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function StudentDetailsPage() {
  const params = useParams();
  const studentId = params.id as string;

  const [student, setStudent] = useState<IStudentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);


  // Fetch student
  const fetchStudent = async () => {
    try {
      const data = await adminApiMethods.getStudentById(studentId);
      console.log("data:",data)
      setStudent(data.data);
    } catch (error) {
      console.log("Failed to fetch student:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      setStatusLoading(true);

      let updatedStudent: IStudentDetails | null = null;

      if (student?.status === "active") {
        updatedStudent = await adminApiMethods.blockStudent(id);
      } else {
        updatedStudent = await adminApiMethods.unblockStudent(id);
      }

      if (updatedStudent) {
        setStudent((prev) =>
          prev ? { ...prev, status: updatedStudent.status } : prev
        );
      }
    } catch (error) {
      console.error("Failed to update student status:", error);
    } finally {
      setStatusLoading(false);
    }
  };


  useEffect(() => {
    fetchStudent();
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-slate-500 text-lg">Loading student details...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold text-slate-900">Student Not Found</h2>
        <p className="text-slate-500 mb-4">This student does not exist.</p>
        <Link href="/admin/students">
          <Button>Back to Students</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/students">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
              {student.name}

              <Badge
                variant={
                  student.status === "active" ? "success" : "destructive"
                }
              >
                {student.status}
              </Badge>

              {student.verified && (
                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                  Verified
                </Badge>
              )}
            </h1>

          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            disabled={statusLoading}
            variant={student.status === "active" ? "destructive" : "default"}
            className={
              student.status !== "active"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : ""
            }
            onClick={() => handleToggleStatus(student._id)}
          >
            {statusLoading ? (
              "Please wait..."
            ) : student.status === "active" ? (
              <>
                <Ban className="h-4 w-4 mr-2" />
                Block Student
              </>
            ) : (
              <>
                <Unlock className="h-4 w-4 mr-2" />
                Unblock Student
              </>
            )}
          </Button>


          <Button variant="outline" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* GRID */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT COLUMN */}
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col items-center pb-6 border-b border-slate-100">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={student.avatar} />
                  <AvatarFallback className="text-2xl">
                    {student.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <h3 className="text-lg font-semibold">{student.name}</h3>
                <p className="text-sm text-slate-500">Student</p>
              </div>

              <div className="space-y-4 pt-6 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span>{student.email}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span>{student.phone}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>Joined {student.joinDate}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-slate-400" />
                  <span>
                    {student.verified ? "Verified Account" : "Unverified"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm italic text-slate-600">
                {student.notes || "No Plan added."}
              </p>

            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6 lg:col-span-2">
          {/* STATS */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                  <BookOpen className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-sm text-slate-500">Enrolled Courses</p>
                  <h3 className="text-2xl font-bold">
                    {student.coursesEnrolled}
                  </h3>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                  <CreditCard className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-sm text-slate-500">Total Spent</p>
                  <h3 className="text-2xl font-bold">
                    ₹{student.totalSpent.toFixed(2)}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* COURSE PROGRESS */}
          <Card>
            <CardHeader>
              <CardTitle>Course Progress</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                {student.coursesProgress.map((course) => (
                  <div key={course.courseId} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{course.courseId}</span>
                      <span>{Math.round(course.percentage)}%</span>
                    </div>

                    <div className="h-2 bg-slate-100 rounded-full">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${course.percentage}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Last accessed: {course.lastAccessed}</span>
                      <span
                        className={
                          course.percentage === 100
                            ? "text-green-600 font-medium"
                            : ""
                        }
                      >
                        { course.percentage === 100
                          ? "Completed"
                          : "In Progress"}
                      </span>
                    </div>
                  </div>
                ))}

                {student.courses.length === 0 && (
                  <p className="text-sm text-slate-500">No courses enrolled.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* PURCHASE HISTORY */}
          <Card>
            <CardHeader>
              <CardTitle>Purchase History</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 h-10">Date</th>
                      <th className="px-4 h-10">Course</th>
                      <th className="px-4 h-10">Amount</th>
                      <th className="px-4 h-10">Status</th>
                      <th className="px-4 h-10">Invoice</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200">
                    {student.purchases.map((p) => (
                      <tr key={p.id}>
                        <td className="p-4">{p.date}</td>
                        <td className="p-4 font-medium">{p.courseName}</td>
                        <td className="p-4">₹{p.amount.toFixed(2)}</td>
                        <td className="p-4">
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            {p.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Button
                            variant="link"
                            size="sm"
                            className="text-blue-600 p-0"
                          >
                            {p.invoiceId}
                          </Button>
                        </td>
                      </tr>
                    ))}

                    {student.purchases.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center p-6 text-slate-500">
                          No purchases found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
