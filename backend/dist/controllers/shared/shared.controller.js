"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedController = void 0;
const inversify_1 = require("inversify");
const ResANDError_1 = require("../../utils/ResANDError");
const JWTtoken_1 = require("../../utils/JWTtoken");
const HttpStatuscodes_1 = require("../../utils/HttpStatuscodes");
const ResponseMessages_1 = require("../../utils/ResponseMessages");
const logger_1 = __importDefault(require("../../utils/logger"));
let SharedController = class SharedController {
    constructor() {
        this.refreshToken = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const tokens = (0, JWTtoken_1.refreshAccessToken)(req.cookies.refreshToken);
            if (!tokens)
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.TOKEN_INVALID, HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            (0, JWTtoken_1.setTokensInCookies)(res, tokens.accessToken, tokens.refreshToken);
            (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.TOKEN_REFRESHED, true);
        });
        this.uploadFile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.file)
                    (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.FILE_REQUIRED, HttpStatuscodes_1.STATUS_CODES.BAD_REQUEST);
                const { uploadToCloudinary } = yield Promise.resolve().then(() => __importStar(require('../../utils/upload')));
                const url = yield uploadToCloudinary(req.file.buffer, 'chat-uploads', 'auto');
                (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.FILE_UPLOADED_SUCCESSFULLY, true, { url });
            }
            catch (error) {
                logger_1.default.error(error);
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.FILE_UPLOAD_FAILED, HttpStatuscodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR);
            }
        });
        this.getIceConfig = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Default to public STUN server
                const iceServers = [
                    { urls: 'stun:stun.l.google.com:19302' },
                ];
                // If TURN credentials are in environment variables, add them
                if (process.env.TURN_URL && process.env.TURN_USERNAME && process.env.TURN_CREDENTIAL) {
                    iceServers.push({
                        urls: process.env.TURN_URL,
                        username: process.env.TURN_USERNAME,
                        credential: process.env.TURN_CREDENTIAL
                    });
                }
                (0, ResANDError_1.sendResponse)(res, HttpStatuscodes_1.STATUS_CODES.OK, ResponseMessages_1.MESSAGES.ICE_CONFIG_FETCHED, true, iceServers);
            }
            catch (error) {
                logger_1.default.error(error);
                (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.FAILED, HttpStatuscodes_1.STATUS_CODES.INTERNAL_SERVER_ERROR);
            }
        });
    }
};
exports.SharedController = SharedController;
exports.SharedController = SharedController = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], SharedController);
