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
exports.CompanyCartService = void 0;
// src/services/company/company.cart.service.ts
const inversify_1 = require("inversify");
const types_1 = require("../../core/di/types");
const ResANDError_1 = require("../../utils/ResANDError");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
let CompanyCartService = class CompanyCartService {
    constructor(_cartRepo, _wishlistRepo, _courseRepo) {
        this._cartRepo = _cartRepo;
        this._wishlistRepo = _wishlistRepo;
        this._courseRepo = _courseRepo;
    }
    getCart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cart = yield this._cartRepo.getCart(userId);
            if (!cart || cart.courses.length === 0) {
                return { courses: [], total: 0 };
            }
            const courses = cart.courses;
            const total = courses.reduce((sum, course) => { var _a; return sum + ((_a = course.price) !== null && _a !== void 0 ? _a : 0); }, 0);
            return { courses, total };
        });
    }
    addToCart(userId, courseId, accessType, seats) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this._wishlistRepo.removeFromWishlist(userId, courseId);
            const course = yield this._courseRepo.findById(courseId);
            if (!course)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.COURSE_NOT_FOUND, HttpStatuscodes_1.STATUS_CODES.NOT_FOUND);
            const price = ((_a = course.price) !== null && _a !== void 0 ? _a : 0) * seats;
            return this._cartRepo.addToCart(userId, courseId, accessType, seats, price);
        });
    }
    removeFromCart(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._cartRepo.removeFromCart(userId, courseId);
        });
    }
    clearCart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._cartRepo.clearCart(userId);
        });
    }
    updateSeat(companyId, courseId, seats) {
        return __awaiter(this, void 0, void 0, function* () {
            // Extra safety validation (frontend also checks)
            if (!Number.isFinite(seats)) {
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.INVALID_SEAT_COUNT);
            }
            if (seats < 1 || seats > 100) {
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.INVALID_SEAT_COUNT);
            }
            const updatedCart = yield this._cartRepo.updateSeats(companyId, courseId, seats);
            if (!updatedCart) {
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.CART_ITEM_NOT_FOUND);
            }
            return updatedCart;
        });
    }
};
exports.CompanyCartService = CompanyCartService;
exports.CompanyCartService = CompanyCartService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CompanyCartRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.WishlistRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.CourseRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], CompanyCartService);
