'use client';

import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, ChevronRight, ChevronLeft } from 'lucide-react';
import { z } from 'zod';

/* -------------------- ZOD SCHEMAS (UPDATED) -------------------- */
const Step1Schema = z.object({
    name: z.string().min(3, 'Company name must be at least 3 characters'),
    address: z.string().min(3, 'Address is required'),
    pincode: z.string().length(6, 'Pincode must be exactly 6 characters'),
    phone: z.string().regex(/^\d{10}$/, 'Phone must be a 10-digit number'),
});

// SAFER file validation for React/Next.js
const Step2Schema = z.object({
    certificate: z.custom<File>((v) => v instanceof File, { message: 'Certificate is required' }),
    taxId: z.custom<File>((v) => v instanceof File, { message: 'Tax ID is required' }),
});

/* -------------------- PROPS -------------------- */
interface VerificationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: {
        name: string;
        address: string;
        pincode: string;
        phone: string;
        certificate: File | null;
        taxId: File | null;
    }) => Promise<void>;
    company: any;
}

/* =======================================================
                       COMPONENT
======================================================= */
export default function VerificationModal({
    open,
    onOpenChange,
    onSubmit,
    company
}: VerificationModalProps) {
    const [step, setStep] = useState<1 | 2>(1);

    // Step 1
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [pincode, setPincode] = useState('');
    const [phone, setPhone] = useState('');
    const [errors, setErrors] = useState<Record<string, string | null>>({});

    // Step 2
    const [certificate, setCertificate] = useState<File | null>(null);
    const [taxId, setTaxId] = useState<File | null>(null);

    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (open && company) {
            setName(company.name || '');
            setAddress(company.address || '');
            setPincode(company.pincode || '');
            setPhone(company.phone || '');
        }
    }, [open, company]);

    /* -------------------- HELPERS -------------------- */

    const reset = () => {
        setStep(1);
        setName('');
        setAddress('');
        setPincode('');
        setPhone('');
        setCertificate(null);
        setTaxId(null);
        setErrors({});
    };

    // validate step 1
    const validateStep1 = () => {
        const result = Step1Schema.safeParse({ name, address, pincode, phone });

        if (!result.success) {
            const errObj: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                errObj[issue.path[0] as string] = issue.message;
            });
            setErrors(errObj);
            return false;
        }

        setErrors({});
        return true;
    };

    // validate step 2
    const validateStep2 = () => {
        const result = Step2Schema.safeParse({ certificate, taxId });

        if (!result.success) {
            const errObj: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                errObj[issue.path[0] as string] = issue.message;
            });
            setErrors(errObj);
            return false;
        }

        setErrors({});
        return true;
    };

    const goNext = () => {
        if (validateStep1()) {
            setErrors({});
            setStep(2);
        }
    };

    const goBack = () => {
        setErrors({});
        setStep(1);
    };

    const handleSubmit = async () => {
        if (!validateStep2()) return;

        setUploading(true);
        try {
            await onSubmit({
                name,
                address,
                pincode,
                phone,
                certificate,
                taxId,
            });

            reset();
            onOpenChange(false);
        } finally {
            setUploading(false);
        }
    };

    /* =======================================================
                             UI
    ======================================================= */
    return (
        <Dialog
            open={open}
            onOpenChange={(v) => {
                if (!v) reset();
                onOpenChange(v);
            }}
        >
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Verify Your Company</DialogTitle>
                </DialogHeader>

                {/* Progress Stepper */}
                <div className="flex items-center justify-center gap-2 my-4">
                    <StepCircle active={step === 1} num={1} />
                    <StepBar active={step === 2} />
                    <StepCircle active={step === 2} num={2} />
                </div>

                {/* --------------------- STEP 1 --------------------- */}
                {step === 1 && (
                    <div className="space-y-4">
                        <InputBlock
                            id="name"
                            label="Full Name of Company"
                            value={name}
                            onChange={setName}
                            error={errors.name}
                            placeholder="Humblo Tech Pvt Ltd"
                        />

                        <InputBlock
                            id="address"
                            label="Address"
                            value={address}
                            onChange={setAddress}
                            error={errors.address}
                            placeholder="Thrissur, Kerala, India"
                        />

                        <InputBlock
                            id="pincode"
                            label="Enter Pincode"
                            value={pincode}
                            onChange={setPincode}
                            error={errors.pincode}
                            placeholder="680001"
                            maxLength={6}
                        />

                        <InputBlock
                            id="phone"
                            label="Phone Number"
                            value={phone}
                            onChange={setPhone}
                            error={errors.phone}
                            placeholder="9876543210"
                            maxLength={10}
                            onlyNumbers
                        />

                        <DialogFooter>
                            <Button variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>

                            <Button onClick={goNext} className="flex items-center gap-1">
                                Next <ChevronRight size={16} />
                            </Button>
                        </DialogFooter>
                    </div>
                )}

                {/* --------------------- STEP 2 --------------------- */}
                {step === 2 && (
                    <div className="space-y-4">
                        <FileUpload
                            id="certificateFile"
                            label="Company Registration Certificate (PDF / Image)"
                            file={certificate}
                            setFile={setCertificate}
                            accept="image/*,.pdf"
                            error={errors.certificate}
                        />

                        <FileUpload
                            id="taxIdFile"
                            label="Tax ID / Business License (PDF / Image)"
                            file={taxId}
                            setFile={setTaxId}
                            accept="image/*,.pdf"
                            error={errors.taxId}
                        />

                        <DialogFooter>
                            <Button variant="outline" onClick={goBack} className="flex items-center gap-1">
                                <ChevronLeft size={16} /> Back
                            </Button>

                            <Button
                                onClick={handleSubmit}
                                disabled={uploading}
                                className="flex items-center gap-1"
                            >
                                {uploading ? 'Submitting...' : 'Submit for Review'}
                            </Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

/* =======================================================
                   STEP CIRCLE & BAR
======================================================= */
function StepCircle({ active, num }: { active: boolean; num: number }) {
    return (
        <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white 
            ${active ? 'bg-emerald-600' : 'bg-gray-300'}`}
        >
            {num}
        </div>
    );
}

function StepBar({ active }: { active: boolean }) {
    return (
        <div className="w-12 h-1 bg-gray-300">
            <div
                className={`h-full transition-all ${active ? 'w-full bg-emerald-600' : 'w-0'}`}
            />
        </div>
    );
}

/* =======================================================
                   INPUT COMPONENT (UPDATED)
======================================================= */
function InputBlock({
    id,
    label,
    value,
    onChange,
    placeholder,
    error,
    maxLength,
    onlyNumbers = false,
}: {
    id: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    error?: string | null;
    maxLength?: number;
    onlyNumbers?: boolean;
}) {
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;

        if (onlyNumbers) {
            val = val.replace(/\D/g, '');
        }

        if (maxLength && val.length > maxLength) {
            val = val.slice(0, maxLength);
        }

        onChange(val);
    };

    return (
        <div>
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                value={value}
                onChange={handleInput}
                placeholder={placeholder}
                type="text"
                inputMode={onlyNumbers ? 'numeric' : 'text'}
            />
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
    );
}

/* =======================================================
                   FILE UPLOAD (UPDATED)
======================================================= */
function FileUpload({
    id,
    label,
    file,
    setFile,
    accept,
    error,
}: {
    id: string;
    label: string;
    file: File | null;
    setFile: (f: File | null) => void;
    accept: string;
    error?: string | null;
}) {
    return (
        <div>
            <Label htmlFor={id}>{label}</Label>

            <label
                htmlFor={id}
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 mt-1"
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-xs text-gray-500">
                        {file ? file.name : 'Click to upload'}
                    </p>
                </div>
            </label>

            <input
                id={id}
                type="file"
                className="hidden"
                accept={accept}
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />

            {file && (
                <button
                    onClick={() => setFile(null)}
                    className="mt-1 text-xs text-red-600 underline"
                >
                    Remove
                </button>
            )}

            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    );
}
