"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shared_auth_route_1 = __importDefault(require("./sharedRoute/shared.auth.route"));
const shared_notification_route_1 = __importDefault(require("./sharedRoute/shared.notification.route"));
const shared_ai_route_1 = __importDefault(require("./sharedRoute/shared.ai.route"));
const sharedRoutes = (0, express_1.Router)();
sharedRoutes.use('/auth', shared_auth_route_1.default);
sharedRoutes.use('/notification', shared_notification_route_1.default);
sharedRoutes.use('/ai', shared_ai_route_1.default);
exports.default = sharedRoutes;
