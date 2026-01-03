export enum PayoutStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export enum PayoutMethod {
    BANK_TRANSFER = 'BANK_TRANSFER',
    UPI = 'UPI',
}

export interface IPayout {
    _id: string;
    teacherId: string | { _id: string; name: string; email: string };
    amount: number;
    status: PayoutStatus;
    method: PayoutMethod;
    details: {
        info?: string;
        [key: string]: any;
    };
    adminNote?: string;
    transactionId?: string;
    createdAt: string;
    processedAt?: string;
}

export interface WalletStats {
    balance: number;
    totalEarned: number;
    totalWithdrawn: number;
}
