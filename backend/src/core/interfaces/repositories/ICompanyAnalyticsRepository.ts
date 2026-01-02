export interface ICompanyAnalyticsRepository {
    countEmployees(companyId: string): Promise<number>;
    getLearningRecords(
        companyId: string,
        startDate: Date,
        endDate?: Date
    ): Promise<ILearningRecord[]>;
    getProgressRecords(companyId: string): Promise<IEmployeeProgress[]>;
    getPaidOrders(companyId: string): Promise<ICompanyOrder[]>;
    getEmployees(companyId: string): Promise<IEmployeeBasic[]>;
    getEmployeeLearningRecords(
        employeeId: string,
        startDate: Date
    ): Promise<ILearningRecordRaw[]>;
    getEmployeeProgress(employeeId: string): Promise<IEmployeeProgress[]>;
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
