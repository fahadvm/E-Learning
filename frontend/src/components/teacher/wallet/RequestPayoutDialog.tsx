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
import { toast } from 'react-toastify';
import { teacherPayoutApi } from '@/services/APIservices/teacherApiService';
import { Textarea } from '@/components/ui/textarea';

interface RequestPayoutDialogProps {
    balance: number;
    onSuccess: () => void;
}

export default function RequestPayoutDialog({ balance, onSuccess }: RequestPayoutDialogProps) {
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState<PayoutMethod>(PayoutMethod.BANK_TRANSFER);
    const [details, setDetails] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || Number(amount) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }
        if (Number(amount) > balance) {
            toast.error('Insufficient balance');
            return;
        }
        if (!details) {
            toast.error('Please provide payment details');
            return;
        }

        setSubmitting(true);
        try {
            // Parse details
            // Ideally this should be structured JSON or form fields based on method.
            // For simplicity, we just send object with `accountDetails`.
            const payloadDetails = {
                info: details,
                // We could expand this to specific fields like IBAN, IFSC etc.
            };

            await teacherPayoutApi.requestPayout({
                amount: Number(amount),
                method,
                details: payloadDetails,
            });

            toast.success('Withdrawal request submitted!');
            setOpen(false);
            onSuccess();
            setAmount('');
            setDetails('');
        } catch (error) {
            console.error(error);
            toast.error('Failed to submit request');
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
                            <p className="text-xs text-gray-500 mt-1">Available: ${balance.toFixed(2)}</p>
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
                                <SelectItem value={PayoutMethod.PAYPAL}>PayPal</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="details" className="text-right pt-2">
                            Details
                        </Label>
                        <Textarea
                            id="details"
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            className="col-span-3"
                            placeholder={
                                method === PayoutMethod.BANK_TRANSFER
                                    ? "Bank Name, Account Number, IFSC/Sort Code"
                                    : method === PayoutMethod.UPI
                                        ? "UPI ID (e.g. name@upi)"
                                        : "PayPal Email"
                            }
                        />
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
