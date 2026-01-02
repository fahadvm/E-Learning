"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const logger_1 = __importDefault(require("./logger"));
if (!process.env.REDIS_URL) {
    throw new Error('REDIS_URL is not defined in environment variables');
}
exports.redis = new ioredis_1.default(process.env.REDIS_URL, {
    tls: {}, // REQUIRED for Upstash
    lazyConnect: false,
    maxRetriesPerRequest: null,
});
exports.redis.on('connect', () => {
    logger_1.default.info('✅ Redis connected');
});
exports.redis.on('error', (err) => {
    logger_1.default.error('❌ Redis error:', err);
});
