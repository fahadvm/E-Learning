"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Search,
  Eye,
  Ban,
  CheckCircle,
  Filter,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

import { adminApiMethods } from "@/services/APIservices/adminApiService";
import { ITeacher, ITeacherListResponse } from "@/types/admin/teacher";

export default function TeacherListPage() {
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [total, setTotal] = useState<number>(0);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "blocked">("all");

  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchTeachers = async () => {
    try {
      const res: ITeacherListResponse = await adminApiMethods.getTeachers({
        page,
        limit,
        search,
        status,
      });
      console.log("response:", res)

      setTeachers(res.data.data);
      setTotal(res.data.total);
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [search, status, page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Teachers</h1>
          <p className="text-sm text-slate-500">Manage course creators and instructors.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/teachers/verification`}>
            <Button>Verify</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">

            {/* SEARCH */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                className="pl-10"
                placeholder="Search teachers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* FILTER */}
            <div className="flex gap-2">
              <div className="border rounded-lg p-1 flex gap-2">
                <Button variant={status === "all" ? "secondary" : "ghost"} size="sm" onClick={() => setStatus("all")}>
                  All
                </Button>
                <Button variant={status === "active" ? "secondary" : "ghost"} size="sm" onClick={() => setStatus("active")}>
                  Active
                </Button>
                <Button variant={status === "blocked" ? "secondary" : "ghost"} size="sm" onClick={() => setStatus("blocked")}>
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
                <TableHead>Teacher</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Courses</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Earnings</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {teachers.length > 0 ? (
                teachers.map((teacher) => (
                  <TableRow key={teacher._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={teacher.avatar} />
                          <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                        </Avatar>

                        <div>
                          <div className="font-medium flex items-center gap-1">
                            {teacher.name}
                            {teacher.verified && <CheckCircle className="h-4 w-4 text-blue-600" />}
                          </div>
                          <p className="text-xs text-slate-500">{teacher.email}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant={teacher.isBlocked ? "destructive" : "success"}>
                        {teacher.isBlocked ? "blocked" : "active"}
                      </Badge>
                    </TableCell>

                    <TableCell>{teacher.totalCourses}</TableCell>
                    <TableCell>{teacher.totalStudents}</TableCell>
                    <TableCell>₹{teacher.totalEarnings.toLocaleString()}</TableCell>

                    <TableCell className="text-right">
                      <Link href={`/admin/teachers/${teacher._id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>

                      <Button variant="ghost" size="icon" className="text-red-600">
                        <Ban className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                    No teachers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

          </Table>

          {/* PAGINATION */}
          <div className="flex justify-between items-center pt-4">
            <p className="text-sm text-slate-500">
              Showing {teachers.length} of {total}
            </p>
            <div className="flex gap-2">
              <Button disabled={page === 1} variant="outline" onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <Button disabled={page === totalPages} variant="outline" onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
