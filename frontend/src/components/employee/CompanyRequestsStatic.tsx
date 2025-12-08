"use client";

import { Building2, Check, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CompanyRequestsStatic() {
  const requests = [
    {
      id: "1",
      companyName: "TechVision Pvt Ltd",
      courseTitle: "React Mastery",
      seats: 50,
      requestedAt: "2025-01-12",
    },
    {
      id: "2",
      companyName: "SkillEdge Solutions",
      courseTitle: "Node.js Pro",
      seats: 30,
      requestedAt: "2025-01-10",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Company Enrollment Requests</CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-border/50">
                <th className="text-left py-3 px-2">Company</th>
                <th className="text-left py-3 px-2">Course</th>
                <th className="text-left py-3 px-2">Seats</th>
                <th className="text-left py-3 px-2">Requested</th>
                <th className="text-right py-3 px-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-b border-border/40 hover:bg-accent/10 transition-colors">
                  <td className="py-3 px-2 font-medium flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" /> {req.companyName}
                  </td>
                  <td className="py-3 px-2">{req.courseTitle}</td>
                  <td className="py-3 px-2">{req.seats}</td>
                  <td className="py-3 px-2 text-gray-500">
                    {new Date(req.requestedAt).toLocaleDateString()}
                  </td>

                  <td className="py-3 px-2 flex justify-end gap-2">
                    <Button size="sm" variant="success">
                      <Check className="h-4 w-4" />
                    </Button>

                    <Button size="sm" variant="destructive">
                      <X className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
