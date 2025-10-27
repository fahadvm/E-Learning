"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
// Define custom log levels (optional)
const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4,
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'blue',
    },
};
// Apply colors
(0, winston_1.addColors)(customLevels.colors);
const logger = (0, winston_1.createLogger)({
    levels: customLevels.levels,
    level: 'debug',
    format: winston_1.format.combine(winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.format.colorize({ all: true }), winston_1.format.printf(({ level, message }) => ` [${level}]: ${message}`)),
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston_1.transports.File({ filename: 'logs/combined.log' }),
    ],
});
exports.default = logger;
