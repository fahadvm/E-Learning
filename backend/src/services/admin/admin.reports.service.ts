
import { injectable, inject } from "inversify";
import { IAdminReportsService } from "../../core/interfaces/services/admin/IAdminReportsService";
import { TYPES } from "../../core/di/types";
import { IAdminReportsRepository } from "../../core/interfaces/repositories/admin/IAdminReportsRepository";

@injectable()
export class AdminReportsService implements IAdminReportsService {
    constructor(
        @inject(TYPES.AdminReportsRepository) private _reportsRepo: IAdminReportsRepository
    ) { }

    async getDashboardStats(): Promise<any> {
        const stats = await this._reportsRepo.getDashboardStats();
        const monthlyRevenue = await this._reportsRepo.getMonthlyRevenue(new Date().getFullYear());
        const userDistribution = await this._reportsRepo.getUserDistribution();
        const topCourses = await this._reportsRepo.getTopCourses(5);
        const companyRevenue = await this._reportsRepo.getCompanyRevenue();
        const activeTeachers = await this._reportsRepo.getMostActiveTeachers(5);
        const dailyTrend = await this._reportsRepo.getDailyTrend(7);

        return {
            stats,
            monthlyRevenue,
            userDistribution,
            topCourses,
            companyRevenue,
            activeTeachers,
            dailyTrend
        };
    }

    async exportReport(format: string): Promise<any> {
        // Implementation for export will be handled here or in controller
        // depending on library usage. Logic: fetch all data -> generate PDF/CSV
        throw new Error("Method not implemented.");
    }
}
