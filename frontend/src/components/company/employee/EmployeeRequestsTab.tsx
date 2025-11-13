"use client";

import { useEffect, useState } from "react";
import { Search, Linkedin, Github, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { showSuccessToast } from "@/utils/Toast";
import { companyApiMethods } from "@/services/APIservices/companyApiService";

interface EmployeeRequest {
  profilePicture: string;
  _id: string;
  name: string;
  email: string;
  position?: string;
  department?: string;
  location?: string;
  social_links?: {
    linkedin: string;
    github: string;
    portfolio: string;
  };
  status: "pending" | "approved" | "rejected";
}

export default function EmployeeRequestsTab() {
  const [requests, setRequests] = useState<EmployeeRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeRequest | null>(null);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 5;
  const [page, setPage] = useState(1);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await companyApiMethods.getRequestedEmployees();
      setRequests(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filtered = requests.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const approve = async (id: string) => {
    await companyApiMethods.approveEmployeeRequest(id, { status: "approve" });
    setRequests((prev) => prev.filter((r) => r._id !== id));
    showSuccessToast("Request Approved");
  };

  const reject = async (id: string) => {
    await companyApiMethods.rejectEmployeeRequest(id, { status: "reject" });
    setRequests((prev) => prev.filter((r) => r._id !== id));
    showSuccessToast("Request Rejected");
  };

  const avatar = (name: string) =>
    name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Search */}
      <Input
        placeholder="Search requests..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setPage(1);
        }}
        className="max-w-sm bg-black/40 border-accent/20 text-accent-foreground placeholder:text-white/70"
      />

      {/* Table */}
      <div className="glow-border rounded-xl bg-black/40 backdrop-blur-sm p-6 overflow-x-auto">
        {loading ? (
          <p className="text-center text-white/70 py-10">Loading...</p>
        ) : paginated.length === 0 ? (
          <p className="text-center text-white/70 py-10">No pending requests.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-black/30">
              <tr>
                {["Name", "Position", "Actions"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 font-semibold text-accent/90">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginated.map((emp) => (
                <tr
                  key={emp._id}
                  className="border-b border-accent/10 hover:bg-black/30 transition"
                >
                  <td className="px-6 py-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                      {avatar(emp.name)}
                    </div>
                    <div>
                      <p className="font-medium text-white">{emp.name}</p>
                      <p className="text-xs text-white/70">{emp.email}</p>
                    </div>
                  </td>

                  <td className="px-6 py-3 text-white">
                    {emp.position || "Not specified"}
                  </td>

                  <td className="px-6 py-3 flex gap-3 justify-end">
                    <Button
                      variant="ghost"
                      className="text-accent hover:text-accent/80"
                      onClick={() => setSelectedEmployee(emp)}
                    >
                      View
                    </Button>

                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white px-3"
                      onClick={() => approve(emp._id)}
                    >
                      Approve
                    </Button>

                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white px-3"
                      onClick={() => reject(emp._id)}
                    >
                      Reject
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pt-6 flex justify-between items-center text-sm text-white/70">
            <span>Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
                Prev
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
        <DialogContent className="bg-black/60 backdrop-blur-xl border border-accent/30">
          <DialogHeader>
            <DialogTitle className="text-accent">Employee Details</DialogTitle>
          </DialogHeader>

          {selectedEmployee && (
            <div className="space-y-4 text-white">
              <div className="flex items-center gap-4">
                {selectedEmployee.profilePicture ? (
                  <img
                    src={selectedEmployee.profilePicture}
                    className="w-16 h-16 rounded-full object-cover border border-accent/30"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xl font-bold">
                    {avatar(selectedEmployee.name)}
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-bold">{selectedEmployee.name}</h2>
                  <p className="text-sm text-white/70">{selectedEmployee.email}</p>
                  <p className="text-xs text-white/50">{selectedEmployee.position || "Not specified"}</p>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-4">
                {selectedEmployee.social_links?.linkedin && (
                  <a href={selectedEmployee.social_links.linkedin} target="_blank" className="hover:text-accent">
                    <Linkedin />
                  </a>
                )}
                {selectedEmployee.social_links?.github && (
                  <a href={selectedEmployee.social_links.github} target="_blank" className="hover:text-accent">
                    <Github />
                  </a>
                )}
                {selectedEmployee.social_links?.portfolio && (
                  <a href={selectedEmployee.social_links.portfolio} target="_blank" className="hover:text-accent">
                    <Globe />
                  </a>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
