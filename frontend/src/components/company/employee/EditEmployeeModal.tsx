"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { companyApiMethods } from "@/services/APIservices/companyApiService";
import { showErrorToast, showSuccessToast } from "@/utils/Toast";
import { Loader2 } from "lucide-react";

interface EditEmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    employee: any;
    onSuccess: () => void;
}

export default function EditEmployeeModal({
    isOpen,
    onClose,
    employee,
    onSuccess,
}: EditEmployeeModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        position: "",
        department: "",
        location: "",

    });

    useEffect(() => {
        if (employee) {
            setFormData({
                position: employee.position || "",
                department: employee.department || "",
                location: employee.location || "",
            });
        }
    }, [employee]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await companyApiMethods.updateEmployee(employee._id, formData);
            showSuccessToast("Employee updated successfully");
            onSuccess();
            onClose();
        } catch (error) {
            showErrorToast("Failed to update employee");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-slate-900 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Edit Employee Details</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    

                    <div className="space-y-2">
                        <Label htmlFor="position">Position</Label>
                        <Input
                            id="position"
                            value={formData.position}
                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                            className="bg-white/5 border-white/10"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                            id="department"
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            className="bg-white/5 border-white/10"
                        />
                    </div>
               
                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="bg-white/5 border-white/10"
                        />
                    </div>
                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-white">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
