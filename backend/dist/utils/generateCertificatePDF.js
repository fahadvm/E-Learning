"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCertificatePDF = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const generateCertificatePDF = (data) => {
    return new Promise((resolve) => {
        const doc = new pdfkit_1.default({ size: "A4", layout: "landscape" });
        const chunks = [];
        doc.fontSize(30).text("Certificate of Completion", { align: "center" });
        doc.moveDown();
        doc.fontSize(20).text(`This certificate is awarded to`, { align: "center" });
        doc.moveDown();
        doc.fontSize(32).text(data.studentName, { align: "center" });
        doc.moveDown();
        doc.fontSize(20).text(`for successfully completing the course`, { align: "center" });
        doc.moveDown();
        doc.fontSize(26).text(data.courseName, { align: "center" });
        doc.moveDown();
        doc.fontSize(14).text(`Certificate No: ${data.certificateNumber}`, { align: "center" });
        doc.end();
        doc.on("data", (c) => chunks.push(c));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
    });
};
exports.generateCertificatePDF = generateCertificatePDF;
