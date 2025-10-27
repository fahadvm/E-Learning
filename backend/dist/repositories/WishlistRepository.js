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
exports.WishlistRepository = void 0;
const mongoose_1 = require("mongoose");
const Wishlist_1 = require("../models/Wishlist");
const inversify_1 = require("inversify");
let WishlistRepository = class WishlistRepository {
    addToWishlist(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            let wishlist = yield Wishlist_1.Wishlist.findOne({ userId });
            const courseObjectId = new mongoose_1.Types.ObjectId(courseId);
            if (wishlist) {
                if (!wishlist.courses.includes(courseObjectId)) {
                    wishlist.courses.push(courseObjectId);
                    yield wishlist.save();
                }
            }
            else {
                wishlist = yield Wishlist_1.Wishlist.create({
                    userId,
                    courses: [courseId],
                });
            }
            return wishlist;
        });
    }
    getWishlist(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Wishlist_1.Wishlist.findOne({ userId }).populate('courses').lean();
        });
    }
    removeFromWishlist(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const wishlist = yield Wishlist_1.Wishlist.findOneAndUpdate({ userId }, { $pull: { courses: courseId } }, { new: true }).populate('courses');
            return (wishlist === null || wishlist === void 0 ? void 0 : wishlist.toObject()) || null;
        });
    }
};
exports.WishlistRepository = WishlistRepository;
exports.WishlistRepository = WishlistRepository = __decorate([
    (0, inversify_1.injectable)()
], WishlistRepository);
