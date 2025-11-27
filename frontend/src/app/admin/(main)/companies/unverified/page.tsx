"use client";

import { useEffect, useState } from "react";
import { Search, Check, X, Ban, Building2 } from "lucide-react";

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
} from "@/components/ui/table";

import { adminApiMethods } from "@/services/APIservices/adminApiService";
import {
  ICompanyVerification,
  ICompanyVerificationResponse,
} from "@/types/admin/company";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function CompanyVerificationPage() {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<ICompanyVerification[]>([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<ICompanyVerification | null>(null);

  // Fetch Pending Verification Requests
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data: ICompanyVerificationResponse =
        await adminApiMethods.UnVerifiedCompanies(page, search);

      setCompanies(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [page, search]);

  // Approve Single Company
  const handleApprove = async (id: string) => {
    await adminApiMethods.verifyCompany(id);
    fetchCompanies();
  };

  // Reject Single Company (opens dialog)
  const handleReject = (company: ICompanyVerification) => {
    setSelectedCompany(company);
    setRejectDialogOpen(true);
  };

  // Confirm Reject
  const confirmReject = async () => {
    if (!selectedCompany) return;

    await adminApiMethods.rejectCompany(selectedCompany._id, rejectReason);

    setRejectDialogOpen(false);
    setRejectReason("");
    setSelectedCompany(null);
    fetchCompanies();
  };

  // Approve All
  const handleApproveAll = async () => {
    await adminApiMethods.approveAllCompanies();
    fetchCompanies();
  };

  // Reject All
  const handleRejectAll = async () => {
    await adminApiMethods.rejectAllCompanies("Rejected by admin");
    fetchCompanies();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Company Verification Requests
          </h1>
          <p className="text-sm text-slate-500">
            Review, approve, or reject company verification submissions.
          </p>
        </div>
      </div>

      <Card>
        {/* Filters */}
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search companies..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRejectAll}>
                Reject All
              </Button>
              <Button onClick={handleApproveAll}>
                Approve All
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {companies.map((company) => (
                <TableRow key={company._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="rounded-lg">
                        <AvatarImage src={company.logo} />
                        <AvatarFallback className="rounded-lg">
                          <Building2 className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-slate-900">
                          {company.name}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-slate-600">{company.email}</TableCell>
                  <TableCell className="text-slate-600">{company.industry}</TableCell>

                  <TableCell>
                    <Badge variant="secondary">{company.verificationStatus}</Badge>
                  </TableCell>

                  <TableCell>
                    <a
                      href={company.documentUrl}
                      target="_blank"
                      className="text-blue-600 underline text-sm"
                    >
                      View Document
                    </a>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => handleApprove(company._id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleReject(company)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {companies.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                    No verification requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-end items-center gap-2 mt-4">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>

            <span className="text-sm text-slate-600">
              Page {page} of {totalPages}
            </span>

            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reject Reason Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Verification</DialogTitle>
          </DialogHeader>

          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmReject}>
              Reject
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
