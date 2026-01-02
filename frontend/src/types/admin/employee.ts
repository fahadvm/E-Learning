export interface IAdminEmployee {
    _id: string;
    name: string;
    email: string;
    employeeID?: string;
    department?: string;
    position?: string;
    companyId: string;
    companyName?: string;
    isBlocked: boolean;
    profilePicture?: string;
    createdAt: string;
    coursesAssigned?: string[];
}

export interface IAdminEmployeeDTO {
    _id: string;
    name: string;
    email: string;
    employeeID?: string;
    department?: string;
    position?: string;
    companyId: string;
    companyName?: string;
    isBlocked: boolean;
    profilePicture?: string;
    createdAt: string;
}

export interface IAdminEmployeeListResponse {
    ok: boolean;
    message: string;
    data: {
        data: IAdminEmployee[];
        total: number;
        totalPages: number;
    };
}
