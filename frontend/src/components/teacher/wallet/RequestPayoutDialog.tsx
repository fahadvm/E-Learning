import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { PayoutMethod } from '@/types/payout';
import { showErrorToast, showSuccessToast } from '@/utils/Toast';
import { teacherPayoutApi } from '@/services/APIservices/teacherApiService';

interface RequestPayoutDialogProps {
    balance: number;
    onSuccess: () => void;
}

export default function RequestPayoutDialog({ balance, onSuccess }: RequestPayoutDialogProps) {
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState<PayoutMethod>(PayoutMethod.BANK_TRANSFER);
    const [bankDetails, setBankDetails] = useState({
        bankName: '',
        accountName: '',
        ifscCode: '',
    });

    const [upiId, setUpiId] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || Number(amount) <= 0) {
            showErrorToast('Please enter a valid amount');
            return;
        }
        if (Number(amount) > balance) {
            showErrorToast('Insufficient balance');
            return;
        }
        if (method === PayoutMethod.BANK_TRANSFER) {
            const { bankName, accountName, ifscCode } = bankDetails;
            if (!bankName || !accountName || !ifscCode) {
                showErrorToast("Please fill all bank details");
                return;
            }
        }

        if (method === PayoutMethod.UPI && !upiId) {
            showErrorToast("Please enter UPI ID");
            return;
        }

        setSubmitting(true);
        try {
            // Parse details
            // Ideally this should be structured JSON or form fields based on method.
            // For simplicity, we just send object with `accountDetails`.
            const payloadDetails =
                method === PayoutMethod.BANK_TRANSFER
                    ? {
                        bankName: bankDetails.bankName,
                        accountName: bankDetails.accountName,
                        ifscCode: bankDetails.ifscCode,
                    }
                    : {
                        upiId,
                    };


            await teacherPayoutApi.requestPayout({
                amount: Number(amount),
                method,
                details: payloadDetails,
            });

            showSuccessToast    ('Withdrawal request submitted!');
            setOpen(false);
            onSuccess();
            setAmount('');
            setBankDetails({
                bankName: '',
                accountName: '',
                ifscCode: '',
            });
            setUpiId('');
        } catch (error) {
            console.error(error);
            showErrorToast('Failed to submit request');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button disabled={balance <= 0} className="bg-black hover:bg-black/90">
                    Request Withdrawal
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Withdraw Funds</DialogTitle>
                    <DialogDescription>
                        Enter the amount and your payment details. Requests are processed within 2-3 business days.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                            Amount
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="col-span-3"
                                placeholder="0.00"
                                max={balance}
                            />
                            <p className="text-xs text-gray-500 mt-1">Available: ₹{balance.toFixed(2)}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="method" className="text-right">
                            Method
                        </Label>
                        <Select value={method} onValueChange={(v) => setMethod(v as PayoutMethod)}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={PayoutMethod.BANK_TRANSFER}>Bank Transfer</SelectItem>
                                <SelectItem value={PayoutMethod.UPI}>UPI</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {/* ================= PAYMENT DETAILS ================= */}
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right pt-2">Details</Label>

                        <div className="col-span-3 space-y-3">
                            {method === PayoutMethod.BANK_TRANSFER && (
                                <>
                                    <Input
                                        placeholder="Bank Name"
                                        value={bankDetails.bankName}
                                        onChange={(e) =>
                                            setBankDetails({ ...bankDetails, bankName: e.target.value })
                                        }
                                    />

                                    <Input
                                        placeholder="Account Holder Name"
                                        value={bankDetails.accountName}
                                        onChange={(e) =>
                                            setBankDetails({ ...bankDetails, accountName: e.target.value })
                                        }
                                    />

                                    <Input
                                        placeholder="IFSC Code"
                                        value={bankDetails.ifscCode}
                                        onChange={(e) =>
                                            setBankDetails({ ...bankDetails, ifscCode: e.target.value })
                                        }
                                    />
                                </>
                            )}

                            {method === PayoutMethod.UPI && (
                                <Input
                                    placeholder="UPI ID (e.g. name@upi)"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                />
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="dark" type="submit" disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Submit Request'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
