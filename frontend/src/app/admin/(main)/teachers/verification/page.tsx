"use client";

import { useEffect, useState } from "react";
import { adminApiMethods } from "@/services/APIservices/adminApiService";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileText, CheckCircle, XCircle } from "lucide-react";

export default function GenericVerificationPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const { toast } = useToast();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await adminApiMethods.getUnverifiedTeachers({ page: 1, limit: 100, status: 'pending' });
      // Depending on API structure, adjust access:
      setTeachers(res.data.data.data || res.data.data || []);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to fetch verification requests", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await adminApiMethods.verifyTeacher(id);
      toast({ title: "Success", description: "Teacher verified successfully" });
      fetchRequests();
    } catch (error) {
      toast({ title: "Error", description: "Failed to verify teacher", variant: "destructive" });
    }
  };

  const handleReject = async () => {
    if (!rejectingId || !rejectReason.trim()) return;
    try {
      await adminApiMethods.rejectTeacher(rejectingId, rejectReason);
      toast({ title: "Success", description: "Teacher rejected successfully" });
      setRejectingId(null);
      setRejectReason("");
      fetchRequests();
    } catch (error) {
      toast({ title: "Error", description: "Failed to reject teacher", variant: "destructive" });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Teacher Verification Requests</h1>
      </div>

      <div className="bg-white rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Teacher</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex justify-center items-center gap-2 text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading requests...
                  </div>
                </TableCell>
              </TableRow>
            ) : teachers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                  No pending verification requests found.
                </TableCell>
              </TableRow>
            ) : (
              teachers.map((t) => (
                <TableRow key={t._id}>
                  <TableCell>
                    <div className="font-medium">{t.name}</div>
                    <div className="text-sm text-slate-500">{t.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-slate-600 max-w-[200px] truncate">
                      {t.about || "No bio provided"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {t.resumeUrl ? (
                      <a
                        href={t.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        <FileText className="h-4 w-4" /> View Resume
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">No resume</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() => handleApprove(t._id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => setRejectingId(t._id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!rejectingId} onOpenChange={(open) => !open && setRejectingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Verification</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">Reason for Rejection</label>
            <Textarea
              placeholder="Please explain why the verification is being rejected..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectingId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={!rejectReason.trim()}>
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
