// src/core/dto/employee/employeeProfileDto.ts
import { IEmployee } from '../../../models/Employee';

export const employeeProfileDto = (employee: IEmployee) => ({
  _id: employee._id.toString(),
  name: employee.name,
  email: employee.email,
  companyId: employee.companyId.toString(),
  coursesAssigned: employee.coursesAssigned?.map(courseId => courseId.toString()) || [],
  position: employee.position,
  isBlocked: employee.isBlocked,
  subscription: employee.subscription,
  NoEmployees: employee.NoEmployees,
});
