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
exports.CompanyLeaderboardController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
let CompanyLeaderboardController = class CompanyLeaderboardController {
    constructor(_leaderboardService) {
        this._leaderboardService = _leaderboardService;
    }
    getLeaderboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const companyId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            console.log("getting controller of  leaderboard ");
            if (!companyId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const leaderboard = yield this._leaderboardService.getTop50(companyId);
            console.log("top 50 leaderboard ", leaderboard);
            return (0, ResANDError_1.sendResponse)(res, 200, "SUCCESS", true, { leaderboard });
        });
    }
    search(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            console.log("search controller of  leaderboard ");
            const companyId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!companyId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.UNAUTHORIZED, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            const { name } = req.query;
            const result = yield this._leaderboardService.searchEmployee(companyId, name);
            return (0, ResANDError_1.sendResponse)(res, 200, "SUCCESS", true, result);
        });
    }
};
exports.CompanyLeaderboardController = CompanyLeaderboardController;
exports.CompanyLeaderboardController = CompanyLeaderboardController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CompanyLeaderboardService)),
    __metadata("design:paramtypes", [Object])
], CompanyLeaderboardController);
