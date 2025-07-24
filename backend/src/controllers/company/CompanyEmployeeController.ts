
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { ICompanyEmployeeService } from "../../core/interfaces/services/company/ICompanyEmployeeService";
import { STATUS_CODES } from "../../utils/HttpStatuscodes";
import { handleControllerError, sendResponse, throwError } from "../../utils/ResANDError";

@injectable()
export class CompanyEmployeeController {
  constructor(
    @inject("CompanyEmployeeService")
    private employeeService: ICompanyEmployeeService
  ) {}

  // POST /api/company/add-employee
  async addEmployee(req: Request, res: Response) {
    try {
      console.log("trying to adding")
      const { companyId, name, email,  coursesAssigned ,position } = req.body;

      // Validate required fields
      if (!companyId || !name || !email ) {
        throwError(
          "Company ID, name, email, and password are required",
          STATUS_CODES.BAD_REQUEST
        );
      }

      const employee = await this.employeeService.addEmployee({
        companyId,
        name,
        email,
        coursesAssigned,
        position
      });

      sendResponse(
        res,
        STATUS_CODES.CREATED,
        "Employee added successfully",
        true,
        employee
      );
    } catch (err) {
      handleControllerError(res, err);
    }
  }

  // GET /api/company/employees/:companyId
  async getAllEmployees(req: Request, res: Response) {
    try {
      const { page = 1, limit = 5 } = req.query;

      const companyId = req.params.companyId;
      if (!companyId) {
        throwError("Company ID is required", STATUS_CODES.BAD_REQUEST);
      }

      const employees = await this.employeeService.getAllEmployees(companyId, Number(page), Number(limit));

      sendResponse(res, STATUS_CODES.OK, "Employees fetched successfully", true, employees);
    } catch (err) {
      handleControllerError(res, err);
    }
  }

  // GET /api/company/employee/:id
  async getEmployeeById(req: Request, res: Response) {
    try {
      const employeeId = req.params.id;
      if (!employeeId) {
        throwError("Employee ID is required", STATUS_CODES.BAD_REQUEST);
      }

      const employee = await this.employeeService.getEmployeeById(employeeId);

      if (!employee) {
        throwError("Employee not found", STATUS_CODES.NOT_FOUND);
      }

      sendResponse(res, STATUS_CODES.OK, "Employee fetched successfully", true, employee);
    } catch (err) {
      handleControllerError(res, err);
    }
  }

  async blockEmployee(req: Request, res: Response) {
  const { id } = req.params;
  const { status } = req.body; 

  await this.employeeService.blockEmployee(id, status);
  res.status(200).json({
    success: true,
    message: `Employee ${status ? "blocked" : "unblocked"} successfully`,
  });
}

}