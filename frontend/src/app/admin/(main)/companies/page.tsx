"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Eye,
  Ban,
  Building2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

import { ICompany, ICompanyListResponse } from "@/types/admin/company";
import { adminApiMethods } from "@/services/APIservices/adminApiService";

export default function CompanyListPage() {
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "blocked">("all");

  // Fetch companies (replace dummy data)
  const fetchCompanies = async () => {
    try {
      const response: ICompanyListResponse = await adminApiMethods.getCompanies({
        search,
        status,
      });

      console.log("response of company list:", response)

      setCompanies(response.data.companies);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [search, status]);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Companies</h1>
          <p className="text-sm text-slate-500">
            Manage corporate clients and subscriptions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/admin/companies/verification`}>
            <Button>Verify</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            {/* SEARCH */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search companies..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* FILTER */}
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
            </div>

          </div>
        </CardHeader>

        {/* TABLE */}
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {companies.length > 0 ? (
                companies.map((company) => (
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
                          <p className="text-xs text-slate-500">{company.email}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-slate-600">
                      {company.industry}
                    </TableCell>

                    <TableCell>
                      <Badge variant={company.isBlocked ? "destructive" : "success"}>
                        {company.isBlocked ? "blocked" : "active"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className="bg-slate-50">
                        {company.activePlan ? company.activePlan : "free"}
                      </Badge>
                    </TableCell>

                    <TableCell>{company.employees?company.employees.length : 0}</TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Link href={`/admin/companies/${company._id}`}>
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
                    className="text-center p-6 text-slate-500"
                  >
                    No companies found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
