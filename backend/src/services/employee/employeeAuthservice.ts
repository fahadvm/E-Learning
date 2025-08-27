import { injectable, inject } from 'inversify';
import { IEmployeeAuthService } from '../../core/interfaces/services/employee/IEmployeeAuthService';
import { IEmployeeRepository } from '../../core/interfaces/repositories/IEmployeeRepository';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '../../utils/JWTtoken';

@injectable()
export class EmployeeAuthService implements IEmployeeAuthService {
    constructor(
        @inject('EmployeeRepository') private employeeRepo: IEmployeeRepository
    ) {}

    async login(email: string, password: string): Promise<{
        token: string;
        refreshToken: string;
        user: {
            id: string;
            role: string;
            email: string;
            name: string;
        };
    }> {
        const employee = await this.employeeRepo.findByEmail(email);
        if (!employee)
            throwError('This email is invalid', STATUS_CODES.BAD_REQUEST);

        if (employee.password) {
            const match = await bcrypt.compare(password, employee.password);
            if (!match)
                throwError('Wrong password', STATUS_CODES.BAD_REQUEST);
        }

        
        if (employee.blocked)
            throwError('Account is blocked', STATUS_CODES.FORBIDDEN);

       
        // if (!employee.isVerified)
        //     throwError("Please verify your email", STATUS_CODES.UNAUTHORIZED);

        const token = generateAccessToken(employee.id, 'employee');
        const refreshToken = generateRefreshToken(employee.id, 'employee');

        return {
            token,
            refreshToken,
            user: {
                id: employee.id,
                role: 'employee',
                email: employee.email,
                name: employee.name,
            },
        };
    }
}
