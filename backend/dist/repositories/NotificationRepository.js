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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const Notification_1 = require("../models/Notification");
const socket_1 = require("../config/socket");
class NotificationRepository {
    createNotification(userId, title, message, type, userRole, link) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = yield Notification_1.Notification.create({ userId, title, message, type, userRole, link });
            // Emit real-time notification to the user
            (0, socket_1.emitToUser)(userId, 'receive_notification', {
                title,
                message,
                type,
                link,
                id: notification._id.toString(),
                createdAt: notification.createdAt
            });
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Notification_1.Notification.find({ userId }).sort({ createdAt: -1 });
        });
    }
    markAsRead(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Notification_1.Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
        });
    }
}
exports.NotificationRepository = NotificationRepository;
