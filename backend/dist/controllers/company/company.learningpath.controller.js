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
exports.CompanyLearningPathController = void 0;
// src/controllers/company/company.learningpath.controller.ts
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
let CompanyLearningPathController = class CompanyLearningPathController {
    constructor(_service) {
        this._service = _service;
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const companyId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!companyId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            console.log(req.body);
            const created = yield this._service.create(companyId, req.body);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.CREATED, ResponseMessages_1.MESSAGES.CREATED_SUCCESS, true, created);
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const companyId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!companyId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const list = yield this._service.getAll(companyId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.FETCHED_SUCCESS, true, list);
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const companyId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { learningPathId } = req.params;
            if (!companyId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            if (!learningPathId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ID_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const item = yield this._service.getOne(learningPathId, companyId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.FETCHED_SUCCESS, true, item);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const companyId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { learningPathId } = req.params;
            if (!companyId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            if (!learningPathId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ID_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const updated = yield this._service.update(learningPathId, companyId, req.body);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.UPDATED_SUCCESS, true, updated);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const companyId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { learningPathId } = req.params;
            if (!companyId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            if (!learningPathId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ID_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            yield this._service.delete(learningPathId, companyId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.DELETED_SUCCESS, true, null);
        });
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const companyId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!companyId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const { page = "1", limit = "10", search = "" } = req.query;
            const data = yield this._service.listCompanyLearningPaths(companyId, Number(page), Number(limit), String(search || ""));
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.LEARNING_PATHS_FETCHED, true, data);
        });
    }
    // GET /company/learning-paths/assigned/:employeeId
    listAssigned(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const companyId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!companyId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const { employeeId } = req.params;
            if (!employeeId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ID_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const items = yield this._service.listAssignedLearningPaths(companyId, employeeId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.LEARNING_PATHS_FETCHED, true, items);
        });
    }
    // POST /company/learning-paths/assign
    assign(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const companyId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!companyId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const { employeeId, learningPathId } = req.body;
            if (!employeeId || !learningPathId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ID_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const progress = yield this._service.assignLearningPath(companyId, employeeId, learningPathId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.LEARNING_PATH_ASSIGNED, true, progress);
        });
    }
    // DELETE /company/learning-paths/unassign
    unassign(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            console.log("controller for delete is working");
            const companyId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!companyId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const { employeeId, learningPathId } = req.query;
            if (!employeeId || !learningPathId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ID_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const empId = employeeId;
            const lpId = learningPathId;
            yield this._service.unassignLearningPath(companyId, empId, lpId);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.LEARNING_PATH_UNASSIGNED, true, null);
        });
    }
};
exports.CompanyLearningPathController = CompanyLearningPathController;
exports.CompanyLearningPathController = CompanyLearningPathController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CompanyLearningPathService)),
    __metadata("design:paramtypes", [Object])
], CompanyLearningPathController);
