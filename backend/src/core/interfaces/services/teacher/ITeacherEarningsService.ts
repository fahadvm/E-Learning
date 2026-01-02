import { ITransaction } from '../../../../models/Transaction';
import { IPaginationResponse } from '../../../dtos/teacher/TeacherDTO';

export interface IEarningsStats {
    balance: number;
    totalEarned: number;
    totalWithdrawn: number;
}

export interface ITeacherEarningsService {
    getEarningsHistory(
        teacherId: string,
        filters: {
            page: number;
            limit: number;
            type?: string;
            startDate?: string;
            endDate?: string;
        }
    ): Promise<IPaginationResponse<ITransaction>>;

    getEarningsStats(teacherId: string): Promise<IEarningsStats>;
}
