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
exports.PayoutRepository = void 0;
const inversify_1 = require("inversify");
const Payout_1 = require("../models/Payout");
let PayoutRepository = class PayoutRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Payout_1.Payout.create(data);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Payout_1.Payout.findById(id).populate('teacherId', 'name email');
        });
    }
    findAll() {
        return __awaiter(this, arguments, void 0, function* (filter = {}, skip = 0, limit = 10) {
            return yield Payout_1.Payout.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('teacherId', 'name email');
        });
    }
    count() {
        return __awaiter(this, arguments, void 0, function* (filter = {}) {
            return yield Payout_1.Payout.countDocuments(filter);
        });
    }
    updateStatus(id, status, adminNote) {
        return __awaiter(this, void 0, void 0, function* () {
            const updates = { status, processedAt: new Date() };
            if (adminNote)
                updates.adminNote = adminNote;
            return yield Payout_1.Payout.findByIdAndUpdate(id, updates, { new: true });
        });
    }
};
exports.PayoutRepository = PayoutRepository;
exports.PayoutRepository = PayoutRepository = __decorate([
    (0, inversify_1.injectable)()
], PayoutRepository);
