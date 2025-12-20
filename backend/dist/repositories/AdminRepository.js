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
exports.AdminRepository = void 0;
// repositories/student/StudentRepository.ts
const inversify_1 = require("inversify");
const Admin_1 = require("../models/Admin");
const BaseRepository_1 = require("./BaseRepository");
let AdminRepository = class AdminRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Admin_1.Admin);
    }
    update(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            return Admin_1.Admin.findByIdAndUpdate(id, updates, { new: true }).lean().exec();
        });
    }
    updatePassword(id, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Admin_1.Admin.findByIdAndUpdate(id, { password: hashedPassword }).exec();
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield Admin_1.Admin.create(data);
            return admin.toObject();
        });
    }
    updateEmail(id, newEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Admin_1.Admin.findByIdAndUpdate(id, { email: newEmail }).exec();
        });
    }
};
exports.AdminRepository = AdminRepository;
exports.AdminRepository = AdminRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], AdminRepository);
