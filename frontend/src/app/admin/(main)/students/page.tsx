"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Eye,
  Ban,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

import { adminApiMethods } from "@/services/APIservices/adminApiService";
import { IStudent, IStudentListResponse } from "@/types/admin/student";

export default function StudentList() {
  const [students, setStudents] = useState<IStudent[]>([]);
  const [total, setTotal] = useState<number>(0);

  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<"all" | "active" | "blocked">("all");

  const [page, setPage] = useState<number>(1);
  const limit = 10;

  const fetchStudents = async () => {
    try {
      const response: IStudentListResponse = await adminApiMethods.getStudents({
        page,
        limit,
        search,
        status,
      });

      console.log("response: ",response)

      setStudents(response.data.data);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, search, status]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Students</h1>
        <p className="text-sm text-slate-500">
          Manage and view all registered students.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
            
            {/* SEARCH */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search students..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* FILTER BUTTONS */}
            <div className="flex items-center gap-2">
              <div className="border border-slate-200 bg-white rounded-lg p-1 flex gap-2">
                <Button
                  variant={status === "all" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setStatus("all")}
                >
                  All
                </Button>
                <Button
                  variant={status === "active" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setStatus("active")}
                >
                  Active
                </Button>
                <Button
                  variant={status === "blocked" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setStatus("blocked")}
                >
                  Blocked
                </Button>
              </div>

              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

          </div>
        </CardHeader>

        {/* TABLE */}
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Courses</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {students.length > 0 ? (
                students.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback>
                            {student.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-xs text-slate-500">
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={student.isBlocked ? "destructive" : "success"}
                      >
                        {student.isBlocked ? "blocked" : "active"}
                      </Badge>
                    </TableCell>

                    <TableCell>{student.joinDate}</TableCell>
                    <TableCell>{student.coursesCount}</TableCell>
                    <TableCell>₹{student.totalSpent.toFixed(2)}</TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/students/${student._id}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center p-8 text-slate-500"
                  >
                    No students found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* PAGINATION */}
          <div className="flex justify-between items-center pt-4">
            <p className="text-sm text-slate-600">
              Showing {students.length} of {total}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4 mr-2" /> Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
