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
exports.CompanyWishlistService = void 0;
const types_1 = require("../../core/di/types");
const inversify_1 = require("inversify");
const ResANDError_1 = require("../../utils/ResANDError");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
let CompanyWishlistService = class CompanyWishlistService {
    constructor(_wishlistRepo) {
        this._wishlistRepo = _wishlistRepo;
    }
    addCourse(companyId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!companyId || !courseId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.INVALID_INPUT, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const wishlist = yield this._wishlistRepo.getWishlist(companyId);
            if (wishlist === null || wishlist === void 0 ? void 0 : wishlist.courses.some(c => c._id.toString() === courseId))
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.WISHLIST_ALREADY_EXISTS, HttpStatuscodes_1.STATUS_CODES.CONFLICT);
            return ((yield this._wishlistRepo.addToWishlist(companyId, courseId)) ||
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.WISHLIST_ADD_FAIL, HttpStatuscodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
        });
    }
    listWishlist(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!companyId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.INVALID_INPUT, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            const wishlist = yield this._wishlistRepo.getWishlist(companyId);
            if (!wishlist || wishlist.courses.length === 0)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.WISHLIST_EMPTY, HttpStatuscodes_1.STATUS_CODES.CONFLICT);
            return wishlist;
        });
    }
    removeCourse(companyId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!companyId || !courseId)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.INVALID_INPUT, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
            console.log(companyId, courseId);
            const wishlist = yield this._wishlistRepo.getWishlist(companyId);
            if (!wishlist)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            if (!wishlist.courses.some(c => c._id.toString() === courseId))
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COURSE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            return ((yield this._wishlistRepo.removeFromWishlist(companyId, courseId)) ||
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.WISHLIST_REMOVE_FAIL, HttpStatuscodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR));
        });
    }
};
exports.CompanyWishlistService = CompanyWishlistService;
exports.CompanyWishlistService = CompanyWishlistService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.WishlistRepository)),
    __metadata("design:paramtypes", [Object])
], CompanyWishlistService);
