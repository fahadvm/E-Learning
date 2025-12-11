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
exports.CompanyChatService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
let CompanyChatService = class CompanyChatService {
    constructor(_chatRepo) {
        this._chatRepo = _chatRepo;
    }
    createCompanyGroup(companyId, groupName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._chatRepo.findOrCreateCompanyGroup(companyId, groupName);
        });
    }
    addEmployeeToGroup(companyId, employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield this._chatRepo.getCompanyGroupChat(companyId);
            if (group) {
                yield this._chatRepo.addParticipantToGroup(group._id, employeeId);
            }
        });
    }
    removeEmployeeFromGroup(companyId, employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield this._chatRepo.getCompanyGroupChat(companyId);
            if (group) {
                yield this._chatRepo.removeParticipantFromGroup(group._id, employeeId);
            }
        });
    }
    getCompanyGroup(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._chatRepo.getCompanyGroupChat(companyId);
        });
    }
};
exports.CompanyChatService = CompanyChatService;
exports.CompanyChatService = CompanyChatService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ChatRepository)),
    __metadata("design:paramtypes", [Object])
], CompanyChatService);
