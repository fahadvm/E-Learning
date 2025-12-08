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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminProfileService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const bcrypt_1 = __importDefault(require("bcrypt"));
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
let AdminProfileService = class AdminProfileService {
    constructor(_adminRepo) {
        this._adminRepo = _adminRepo;
    }
    getProfile(adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield this._adminRepo.findById(adminId);
            if (!admin)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ADMIN_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return admin;
        });
    }
    updateProfile(adminId, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const allowedFields = ['name', 'email', 'phone', 'avatar'];
            const filteredUpdates = {};
            for (const key of allowedFields) {
                if (updates[key] !== undefined) {
                    filteredUpdates[key] = updates[key];
                }
            }
            if (Object.keys(filteredUpdates).length === 0) {
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.PROFILE_UPDATE_FAILED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            const updatedAdmin = yield this._adminRepo.update(adminId, filteredUpdates);
            if (!updatedAdmin)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.PROFILE_UPDATE_FAILED);
            return updatedAdmin;
        });
    }
    changePassword(adminId, currentPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield this._adminRepo.findById(adminId);
            if (!admin)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ADMIN_NOT_FOUND);
            const isMatch = yield bcrypt_1.default.compare(currentPassword, admin.password);
            if (!isMatch)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.PASSWORD_INCORRECT, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            if (currentPassword === newPassword) {
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.NEW_PASSWORD_SAME_AS_OLD, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            }
            const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
            yield this._adminRepo.updatePassword(adminId, hashedPassword);
        });
    }
};
exports.AdminProfileService = AdminProfileService;
exports.AdminProfileService = AdminProfileService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.AdminRepository)),
    __metadata("design:paramtypes", [Object])
], AdminProfileService);
