"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.NotificationService = void 0;
// src/services/teacher/TeacherNotificationService.ts
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const socket_1 = require("../../config/socket");
let NotificationService = class NotificationService {
    constructor(_notificationRepository, _employeeRepository) {
        this._notificationRepository = _notificationRepository;
        this._employeeRepository = _employeeRepository;
    }
    getUserNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.INVALID_ID, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const notifications = yield this._notificationRepository.findByUserId(userId);
            return notifications;
        });
    }
    markAsRead(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!notificationId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.NOTIFICATION_ID_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const updatedNotification = yield this._notificationRepository.markAsRead(notificationId);
            if (!updatedNotification) {
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.NOTIFICATION_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            }
            return updatedNotification;
        });
    }
    createNotification(userId, title, message, type, userRole, link) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._notificationRepository.createNotification(userId, title, message, type, userRole, link);
            // Emit notification via Socket
            (0, socket_1.emitToUser)(userId, 'receive_notification', {
                title,
                message,
                type,
                link,
                userRole,
                createdAt: new Date()
            });
        });
    }
    checkInactivityNotifications(days) {
        return __awaiter(this, void 0, void 0, function* () {
            const inactiveEmployees = yield this._employeeRepository.findInactiveEmployees(days);
            // Group by company
            const groupedByCompany = {};
            inactiveEmployees.forEach(emp => {
                if (emp.companyId) {
                    const cid = emp.companyId.toString();
                    if (!groupedByCompany[cid])
                        groupedByCompany[cid] = [];
                    groupedByCompany[cid].push(emp);
                }
            });
            for (const [companyId, employees] of Object.entries(groupedByCompany)) {
                const names = employees.map(e => e.name || e.email).join(', ');
                const message = employees.length > 3
                    ? `${employees.length} employees have been inactive for over ${days} days.`
                    : `The following employees have been inactive for over ${days} days: ${names}.`;
                yield this.createNotification(companyId, 'Employee Inactivity Alert', message, 'inactivity', 'company', '/company/employees');
            }
        });
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.NotificationRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.EmployeeRepository)),
    __metadata("design:paramtypes", [Object, Object])
], NotificationService);
