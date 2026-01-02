import { ITransaction } from '../../../../models/Transaction';

export interface ITransactionAdminService {
    getAllTransactions(query: {
        page?: number;
        limit?: number;
        search?: string;
        startDate?: string;
        endDate?: string;
        status?: string;
    }): Promise<{
        transactions: ITransaction[];
        total: number;
        page: number;
        totalPages: number;
    }>;
}
