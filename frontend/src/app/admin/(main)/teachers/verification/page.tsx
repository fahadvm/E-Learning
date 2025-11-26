"use client";

import { useEffect, useState } from "react";
import {
  Search,
  BadgeCheck,
  XCircle,
  FileText,
  Filter,
} from "lucide-react";

import Link from "next/link";

import { adminApiMethods } from "@/services/APIservices/adminApiService";
import {
  ITeacherVerificationRequest,
  ITeacherVerificationListResponse,
} from "@/types/admin/teacher";

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/Table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import RejectModal from "@/components/admin/teacher/verification/reject-modal";

export default function TeacherVerificationPage() {
  const [requests, setRequests] = useState<ITeacherVerificationRequest[]>([]);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"pending">("pending");

  const [page, setPage] = useState(1);
  const limit = 10;

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchRequests = async () => {
    const res: ITeacherVerificationListResponse =
      await adminApiMethods.getUnverifiedTeachers({
        page,
        limit,
        search,
        status,
      });
    console.log("requests", res)

    setRequests(res.data.data);
    setTotal(res.data.total);
  };

  useEffect(() => {
    fetchRequests();
  }, [search, status, page]);

  const totalPages = Math.ceil(total / limit);

  const handleApprove = async (id: string) => {
    await adminApiMethods.verifyTeacher(id);
    fetchRequests();
  };

  const openRejectModal = (id: string) => {
    setSelectedId(id);
    setShowRejectModal(true);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Teacher Verification Requests</h1>
        <p className="text-sm text-slate-500">
          Approve or reject teacher profile verification requests.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            {/* SEARCH */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search teachers..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* FILTER */}
            <div className="flex gap-2">
              <div className="flex border p-1 rounded-lg gap-1">
                {["pending"].map((s) => (
                  <Button
                    key={s}
                    variant={status === s ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setStatus(s as any)}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </Button>
                ))}
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
                <TableHead>Resume</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {requests.length > 0 ? (
                requests.map((req) => (
                  <TableRow key={req._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={req.avatar} />
                          <AvatarFallback>{req.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{req.name}</p>
                          <p className="text-xs text-slate-500">{req.email}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          req.isBlocked === true
                            ? "destructive"      // blocked → red
                            : req.isBlocked === false
                              ? "success"        // active → green
                              : "secondary"      // fallback (null / undefined)
                        }
                      >
                        {req.isBlocked === true
                          ? "Blocked"
                          : req.isBlocked === false
                            ? "Active"
                            : "Unknown"}
                      </Badge>
                    </TableCell>


                    <TableCell>
                      {req.resumeUrl && (
                        <Link href={`/admin/teachers/verification/${req.resumeUrl}`}>
                          <Button variant="ghost" size="icon">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                    </TableCell>

                    <TableCell className="text-right flex justify-end gap-2">
                      {req.verificationStatus === "pending" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 text-white"
                            onClick={() => handleApprove(req._id)}
                          >
                            <BadgeCheck className="h-4 w-4 mr-1" /> Approve
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => openRejectModal(req._id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                    No verification requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reject Modal */}
      {showRejectModal && selectedId && (
        <RejectModal
          requestId={selectedId}
          onClose={() => setShowRejectModal(false)}
          onSubmit={async (reason) => {
            await adminApiMethods.rejectTeacher(selectedId, reason);
            setShowRejectModal(false);
            fetchRequests();
          }}
        />
      )}
    </div>
  );
}
