import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-toastify';
import { adminApiMethods } from '@/services/APIservices/adminApiService';

interface RejectPayoutDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    payoutId: string | null;
    onSuccess: () => void;
}

export default function RejectPayoutDialog({ open, onOpenChange, payoutId, onSuccess }: RejectPayoutDialogProps) {
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReject = async () => {
        if (!payoutId) return;
        if (!reason) {
            toast.error('Please provide a reason for rejection.');
            return;
        }

        setLoading(true);
        try {
            await adminApiMethods.rejectPayout(payoutId, reason);
            toast.success('Payout rejected.');
            onSuccess();
            onOpenChange(false);
            setReason('');
        } catch (error) {
            console.error(error);
            toast.error('Failed to reject payout.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reject Withdrawal Request</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to reject this request? The amount will be refunded to the teacher's wallet.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Textarea
                        placeholder="Reason for rejection..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleReject} disabled={loading}>
                        {loading ? 'Rejecting...' : 'Confirm Rejection'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
