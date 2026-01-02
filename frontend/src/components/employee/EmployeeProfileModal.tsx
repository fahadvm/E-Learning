"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EmployeeProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Record<string, string> | null;
  missingFields?: string[];
  onSubmit: (updatedData: Record<string, string>) => Promise<void>;
}

export function EmployeeProfileModal({
  open,
  onOpenChange,
  employee,
  missingFields = [],
  onSubmit,
}: EmployeeProfileModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    department: "",
    position: "",
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || "",
        phone: employee.phone || "",
        location: employee.location || "",
        department: employee.department || "",
        position: employee.position || "",
      });
    }
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveProfile = async () => {
    await onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
          {missingFields.length > 0 && (
            <DialogDescription className="text-red-600">
              Please fill the required fields before joining a company.
            </DialogDescription>
          )}
        </DialogHeader>

        {missingFields.length > 0 && (
          <ul className="list-disc pl-6 text-sm text-red-600 mb-3 space-y-1">
            {missingFields.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        )}

        <div className="space-y-3 mt-2">
          {["name", "phone", "location", "department", "position"].map((field) => (
            <input
              key={field}
              name={field}
              value={(formData as Record<string, string>)[field]}
              onChange={handleChange}
              placeholder={field[0].toUpperCase() + field.slice(1)}
              className="w-full border rounded px-3 py-2"
            />
          ))}
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-black text-white" onClick={saveProfile}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
