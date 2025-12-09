
export interface IAdminReportsService {
    getDashboardStats(): Promise<any>;
    exportReport(format: string): Promise<any>; // Placeholder for binary data or file path
}
