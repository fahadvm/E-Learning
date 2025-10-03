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
    create(student) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Employee_1.Employee.create(student);
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Employee_1.Employee.findOne({ email });
        });
    }
    updateByEmail(email, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return Employee_1.Employee.findOneAndUpdate({ email }, { $set: updateData }, { new: true }).lean().exec();
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Employee_1.Employee.find();
        });
    }
    findById(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('employeeId from repository ', employeeId);
            return yield Employee_1.Employee.findById(employeeId);
        });
    }
    findByCompanyId(companyId_1, skip_1, limit_1, search_1) {
        return __awaiter(this, arguments, void 0, function* (companyId, skip, limit, search, sortField = 'createdAt', sortOrder = 'desc') {
            const query = {
                companyId,
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                ]
            };
            const sort = {};
            sort[sortField] = sortOrder === 'asc' ? 1 : -1;
            return yield Employee_1.Employee.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit);
        });
    }
    getEmployeesByCompany(companyId, skip, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                companyId,
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                ]
            };
            return yield Employee_1.Employee.find(query)
                .skip(skip)
                .limit(limit);
        });
    }
    countEmployeesByCompany(companyId, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { companyId };
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                ];
            }
            return yield Employee_1.Employee.countDocuments(query);
        });
    }
    updateEmployeeById(employeeId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Employee_1.Employee.findByIdAndUpdate(employeeId, data, { new: true });
        });
    }
    blockEmployee(employeeId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Employee_1.Employee.findByIdAndUpdate(employeeId, { isBlocked: status }, { new: true });
        });
    }
    findByGoogleId(googleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Employee_1.Employee.findOne({ googleId }).lean().exec();
        });
    }
};
exports.EmployeeRepository = EmployeeRepository;
exports.EmployeeRepository = EmployeeRepository = __decorate([
    (0, inversify_1.injectable)()
], EmployeeRepository);
