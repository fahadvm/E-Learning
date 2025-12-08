"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Loader2,  XCircle } from "lucide-react";

interface InviteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onInvite: (email: string) => Promise<void>;
}

export default function InviteModal({ isOpen, onClose, onInvite }: InviteModalProps) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleInvite = async () => {
        if (!email.trim()) {
            setError("Email is required");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await onInvite(email);
            setEmail("");
            onClose();
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to send invitation");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setEmail("");
        setError("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-primary" />
                        Invite Employee
                    </DialogTitle>
                    <DialogDescription>
                        Enter the email address of the employee you want to invite to your company.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="employee@example.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError("");
                            }}
                            disabled={loading}
                            className={error ? "border-red-500" : ""}
                        />
                        {error && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <XCircle className="h-3 w-3" />
                                {error}
                            </p>
                        )}
                    </div>

                    <div className="bg-muted p-3 rounded-md space-y-2">
                        <p className="text-sm font-medium">What happens next?</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                            <li>• Employee will receive an invitation request</li>
                            <li>• They can accept or decline the invitation</li>
                            <li>• You'll be notified of their response</li>
                        </ul>
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
                        onClick={handleInvite}
                        disabled={loading || !email.trim()}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Mail className="h-4 w-4 mr-2" />
                                Send Invitation
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
