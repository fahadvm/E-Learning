"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeRepository = void 0;
const inversify_1 = require("inversify");
const Employee_1 = require("../models/Employee");
let EmployeeRepository = class EmployeeRepository {
    create(employee) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Employee_1.Employee.create(employee);
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Employee_1.Employee.findOne({ email }).lean().exec();
        });
    }
    updateByEmail(email, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Employee_1.Employee.findOneAndUpdate({ email }, { $set: updateData }, { new: true })
                .lean()
                .exec();
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Employee_1.Employee.find().lean().exec();
        });
    }
    findById(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Employee_1.Employee.findById(employeeId).lean().exec();
        });
    }
    findByCompanyId(companyId_1, skip_1, limit_1, search_1) {
        return __awaiter(this, arguments, void 0, function* (companyId, skip, limit, search, sortField = 'createdAt', sortOrder = 'desc') {
            const query = {
                companyId,
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            };
            const sort = {};
            sort[sortField] = sortOrder === 'asc' ? 1 : -1;
            return yield Employee_1.Employee.find(query).sort(sort).skip(skip).limit(limit).lean().exec();
        });
    }
    getEmployeesByCompany(companyId, skip, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                companyId,
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            };
            return yield Employee_1.Employee.find(query).skip(skip).limit(limit).lean().exec();
        });
    }
    countEmployeesByCompany(companyId, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { companyId };
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ];
            }
            return yield Employee_1.Employee.countDocuments(query);
        });
    }
    updateById(employeeId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Employee_1.Employee.findByIdAndUpdate(employeeId, data, { new: true }).lean().exec();
        });
    }
    updateCancelRequestById(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Employee_1.Employee.findByIdAndUpdate(employeeId, {
                status: 'notRequest',
                $unset: { requestedCompanyId: '' },
            });
        });
    }
    // async updateRemoveCompanyById(employeeId: string, data: Partial<IEmployee>): Promise<IEmployee | null> {
    //     return await Employee.updateById(employeeId, {
    //         status: "notRequest",
    //         $unset: { requestedCompanyId: "" },
    //     });
    // }
    blockEmployee(employeeId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Employee_1.Employee.findByIdAndUpdate(employeeId, { isBlocked: status }, { new: true })
                .lean()
                .exec();
        });
    }
    findByGoogleId(googleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Employee_1.Employee.findOne({ googleId }).lean().exec();
        });
    }
    findCompanyByEmployeeId(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Employee_1.Employee.findById(employeeId).populate('companyId').lean().exec();
        });
    }
    findRequestedCompanyByEmployeeId(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Employee_1.Employee.findById(employeeId).populate('requestedCompanyId').lean().exec();
        });
    }
    findRequestedEmployees(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('companyId:', companyId);
            return yield Employee_1.Employee.find({
                requestedCompanyId: companyId,
                status: 'pending',
            });
        });
    }
    findEmployeeAndApprove(companyId, employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('employee id from repository ', companyId, employeeId);
            return yield Employee_1.Employee.findByIdAndUpdate(employeeId, {
                status: 'approved',
                companyId,
                $unset: { requestedCompanyId: '' },
            });
        });
    }
    findEmployeeAndReject(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Employee_1.Employee.findByIdAndUpdate(employeeId, {
                status: 'notRequested',
                $unset: { requestedCompanyId: '' },
            });
        });
    }
};
exports.EmployeeRepository = EmployeeRepository;
exports.EmployeeRepository = EmployeeRepository = __decorate([
    (0, inversify_1.injectable)()
], EmployeeRepository);
