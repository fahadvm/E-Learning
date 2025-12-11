export interface ICompanyAnalyticsRepository {
    countEmployees(companyId: string): Promise<number>;
    getLearningRecords(companyId: string, startDate: Date, endDate?: Date): Promise<any[]>;
    getProgressRecords(companyId: string): Promise<any[]>;
    getPaidOrders(companyId: string): Promise<any[]>;
    getEmployees(companyId: string): Promise<Array<{ _id: string; name?: string; email: string }>>;
    getEmployeeLearningRecords(employeeId: string, startDate: Date): Promise<any[]>;
    getEmployeeProgress(employeeId: string): Promise<any[]>;
}
  export interface ILearningRecord {
    _id: Date;
    minutes: number;
}

export interface ILearningRecordRaw {
    _id: Date;
    totalMinutes: number;
}

export interface IEmployeeBasic {
    _id: string;
    name?: string;
    email: string;
}

export interface IEmployeeProgress {
    percentage: number;
}

export interface ICompanyOrder {
    purchasedCourses: Array<{ courseId: string }>;

}
