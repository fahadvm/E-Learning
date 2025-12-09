
export interface ITransactionAdminService {
    getAllTransactions(query: any): Promise<{
        transactions: any[];
        total: number;
        page: number;
        totalPages: number;
    }>;
}
