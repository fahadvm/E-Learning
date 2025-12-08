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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyCartRepository = void 0;
const inversify_1 = require("inversify");
const CompanyCart_1 = require("../models/CompanyCart");
const mongoose_1 = __importDefault(require("mongoose"));
let CompanyCartRepository = class CompanyCartRepository {
    getCart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return CompanyCart_1.CompanyCart.findOne({ userId })
                .populate({
                path: 'courses.courseId',
                populate: {
                    path: 'teacherId',
                    select: 'name email'
                }
            });
        });
    }
    addToCart(userId, courseId, accessType, seats, price) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if course already exists in cart
            const cart = yield CompanyCart_1.CompanyCart.findOne({ userId });
            if (!cart) {
                // cart doesn't exist → create new document
                const newCart = yield CompanyCart_1.CompanyCart.create({
                    userId,
                    courses: [{ courseId, accessType, seats, price }]
                });
                return newCart.populate({
                    path: 'courses.courseId',
                    populate: { path: 'teacherId', select: 'name email' }
                });
            }
            const existingCourse = cart.courses.find((c) => c.courseId.toString() === courseId);
            if (existingCourse) {
                // Update values
                existingCourse.seats = seats;
                existingCourse.accessType = accessType;
                existingCourse.price = price;
            }
            else {
                // Add new course object
                cart.courses.push({
                    courseId: new mongoose_1.default.Types.ObjectId(courseId),
                    accessType,
                    seats,
                    price
                });
            }
            yield cart.save();
            return cart.populate({
                path: 'courses.courseId',
                populate: { path: 'teacherId', select: 'name email' }
            });
        });
    }
    removeFromCart(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cart = yield CompanyCart_1.CompanyCart.findOneAndUpdate({ userId }, {
                $pull: {
                    courses: { courseId: new mongoose_1.default.Types.ObjectId(courseId) }
                }
            }, { new: true });
            return (cart === null || cart === void 0 ? void 0 : cart.populate({
                path: 'courses.courseId',
                populate: { path: 'teacherId', select: 'name email' }
            })) || null;
        });
    }
    clearCart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return CompanyCart_1.CompanyCart.findOneAndUpdate({ userId }, { $set: { courses: [] } }, { new: true });
        });
    }
    updateSeats(userId, courseId, seats) {
        return __awaiter(this, void 0, void 0, function* () {
            const cart = yield CompanyCart_1.CompanyCart.findOne({ userId });
            if (!cart)
                return null;
            // Find the course in the cart
            const courseItem = cart.courses.find((c) => c.courseId.toString() === courseId);
            if (!courseItem)
                return null;
            // Calculate per-seat price from current values
            const currentSeats = courseItem.seats || 1;
            const perSeatPrice = currentSeats > 0 ? courseItem.price / currentSeats : courseItem.price;
            courseItem.seats = seats;
            courseItem.price = perSeatPrice * seats;
            yield cart.save();
            return cart.populate({
                path: 'courses.courseId',
                populate: { path: 'teacherId', select: 'name email' }
            });
        });
    }
};
exports.CompanyCartRepository = CompanyCartRepository;
exports.CompanyCartRepository = CompanyCartRepository = __decorate([
    (0, inversify_1.injectable)()
], CompanyCartRepository);
