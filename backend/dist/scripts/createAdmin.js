"use strict";
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
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Admin_1 = require("../models/Admin");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function createAdmin() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect(process.env.MONGODB_URI || '');
        const existing = yield Admin_1.Admin.findOne({ email: 'admin@devnext.com' });
        if (existing) {
            console.log('Admin already exists');
            process.exit(0);
        }
        const hashedPassword = yield bcryptjs_1.default.hash('admin123', 10);
        const admin = new Admin_1.Admin({
            email: 'admin@devnext.com',
            password: hashedPassword,
            role: 'admin',
        });
        yield admin.save();
        console.log('Admin created successfully');
        process.exit(0);
    });
}
createAdmin();
