"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";

interface RejectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    employeeName: string;
    employeeEmail: string;
    loading?: boolean;
}

export default function RejectModal({
    isOpen,
    onClose,
    onConfirm,
    employeeName,
    employeeEmail,
    loading = false
}: RejectModalProps) {
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = () => {
        if (!reason.trim()) {
            setError("Please provide a reason for rejection");
            return;
        }

        if (reason.trim().length < 10) {
            setError("Reason must be at least 10 characters");
            return;
        }

        onConfirm(reason);
        setReason("");
        setError("");
    };

    const handleClose = () => {
        setReason("");
        setError("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        Reject Employee Request
                    </DialogTitle>
                    <DialogDescription>
                        Please provide a reason for rejecting this employee request.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Employee Details:</p>
                        <div className="bg-muted p-3 rounded-md space-y-1">
                            <p className="text-sm font-semibold">{employeeName}</p>
                            <p className="text-sm text-muted-foreground">{employeeEmail}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="reason" className="text-sm font-medium">
                            Rejection Reason <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            id="reason"
                            placeholder="Please explain why this request is being rejected..."
                            value={reason}
                            onChange={(e) => {
                                setReason(e.target.value);
                                setError("");
                            }}
                            className="min-h-[120px]"
                            disabled={loading}
                        />
                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Minimum 10 characters required
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleSubmit}
                        disabled={loading || !reason.trim()}
                    >
                        {loading ? "Rejecting..." : "Reject Request"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
