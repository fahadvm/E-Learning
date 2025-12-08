"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearTokens = exports.setTokensInCookies = exports.refreshAccessToken = exports.decodeToken = exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET_KEY = process.env.JWT_SECRET || 'yourAccessSecret';
const REFRESH_KEY = process.env.REFRESH_SECRET || 'yourRefreshSecret';
const ACCESS_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_IN = '7d';
const generateAccessToken = (id, role) => {
    const payload = { id, role };
    return jsonwebtoken_1.default.sign(payload, SECRET_KEY, { expiresIn: ACCESS_EXPIRES_IN });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (id, role) => {
    const payload = { id, role };
    return jsonwebtoken_1.default.sign(payload, REFRESH_KEY, { expiresIn: REFRESH_EXPIRES_IN });
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, SECRET_KEY);
    }
    catch (_a) {
        return null;
    }
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, REFRESH_KEY);
    }
    catch (_a) {
        return null;
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
const decodeToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.decode(token);
        console.log("decoding details is ", decoded);
        return decoded;
    }
    catch (_a) {
        return null;
    }
};
exports.decodeToken = decodeToken;
const refreshAccessToken = (refreshToken) => {
    const decoded = (0, exports.verifyRefreshToken)(refreshToken);
    if (!decoded)
        return null;
    const newAccessToken = (0, exports.generateAccessToken)(decoded.id, decoded.role);
    const newRefreshToken = (0, exports.generateRefreshToken)(decoded.id, decoded.role);
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};
exports.refreshAccessToken = refreshAccessToken;
const setTokensInCookies = (res, accessToken, refreshToken) => {
    res.cookie('token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};
exports.setTokensInCookies = setTokensInCookies;
const clearTokens = (res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
    return res.status(200).json({ ok: true, msg: 'Logged out successfully', req: true });
};
exports.clearTokens = clearTokens;
