"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvoicePDF = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const generateInvoicePDF = (order) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new pdfkit_1.default({ margin: 50, size: 'A4' });
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfBuffer = Buffer.concat(buffers);
                resolve(pdfBuffer);
            });
            doc.on('error', reject);
            // Header
            doc
                .fontSize(28)
                .font('Helvetica-Bold')
                .fillColor('#2563eb')
                .text('INVOICE', 50, 50);
            doc
                .fontSize(10)
                .font('Helvetica')
                .fillColor('#666666')
                .text('DevNext Learning Platform', 50, 90)
                .text('Online Education Services', 50, 105)
                .text('support@devnext.com', 50, 120);
            // Invoice Details Box
            const invoiceBoxTop = 50;
            doc
                .fontSize(10)
                .font('Helvetica-Bold')
                .fillColor('#000000')
                .text('Invoice Details', 350, invoiceBoxTop);
            doc
                .fontSize(9)
                .font('Helvetica')
                .fillColor('#666666')
                .text(`Invoice #: ${order.razorpayOrderId}`, 350, invoiceBoxTop + 20)
                .text(`Date: ${new Date(order.updatedAt).toLocaleDateString('en-IN')}`, 350, invoiceBoxTop + 35)
                .text(`Status: ${order.status.toUpperCase()}`, 350, invoiceBoxTop + 50)
                .text(`Payment Method: ${order.paymentMethod}`, 350, invoiceBoxTop + 65);
            // Horizontal line
            doc
                .strokeColor('#e5e7eb')
                .lineWidth(1)
                .moveTo(50, 160)
                .lineTo(550, 160)
                .stroke();
            // Bill To Section
            doc
                .fontSize(12)
                .font('Helvetica-Bold')
                .fillColor('#000000')
                .text('Bill To:', 50, 180);
            const student = typeof order.studentId === 'object' &&
                order.studentId !== null &&
                'name' in order.studentId
                ? {
                    name: order.studentId.name,
                    email: order.studentId.email,
                }
                : {
                    name: 'Student',
                    email: '',
                };
            doc
                .fontSize(10)
                .font('Helvetica')
                .fillColor('#666666')
                .text(student.name || 'Student', 50, 200)
                .text(student.email || '', 50, 215);
            // Table Header
            const tableTop = 260;
            doc
                .fontSize(10)
                .font('Helvetica-Bold')
                .fillColor('#ffffff')
                .rect(50, tableTop, 500, 25)
                .fill('#2563eb');
            doc
                .fillColor('#ffffff')
                .text('Course Details', 60, tableTop + 8, { width: 300 })
                .text('Duration', 370, tableTop + 8, { width: 80, align: 'center' })
                .text('Price', 460, tableTop + 8, { width: 80, align: 'right' });
            // Table Rows
            let yPosition = tableTop + 35;
            const courses = order.courses;
            courses.forEach((course, index) => {
                var _a;
                const bgColor = index % 2 === 0 ? '#f9fafb' : '#ffffff';
                const teacherName = typeof course.teacherId === 'object' &&
                    course.teacherId !== null &&
                    'name' in course.teacherId
                    ? course.teacherId.name
                    : 'Instructor';
                const duration = (_a = course.totalDuration) !== null && _a !== void 0 ? _a : 0;
                const hours = Math.floor(duration / 60);
                const minutes = duration % 60;
                const durationText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
                const price = typeof course.price === 'number'
                    ? `Rs:${course.price}`
                    : 'N/A';
                doc.rect(50, yPosition - 5, 500, 30).fill(bgColor);
                doc
                    .fontSize(10)
                    .font('Helvetica')
                    .fillColor('#000000')
                    .text(course.title, 60, yPosition, { width: 300 });
                doc
                    .fontSize(9)
                    .fillColor('#666666')
                    .text(`by ${teacherName}`, 60, yPosition + 12, { width: 300 });
                doc
                    .fontSize(9)
                    .fillColor('#666666')
                    .text(durationText, 370, yPosition + 5, { width: 80, align: 'center' });
                doc
                    .fontSize(9)
                    .fillColor('#666666')
                    .text(price, 460, yPosition + 5, { width: 80, align: 'right' });
                yPosition += 40;
            });
            // Summary Section
            yPosition += 20;
            doc
                .strokeColor('#e5e7eb')
                .lineWidth(1)
                .moveTo(350, yPosition)
                .lineTo(550, yPosition)
                .stroke();
            yPosition += 15;
            // Subtotal
            doc
                .fontSize(10)
                .font('Helvetica')
                .fillColor('#666666')
                .text('Subtotal:', 350, yPosition)
                .text(`Rs:${order.amount}`, 460, yPosition, { width: 80, align: 'right' });
            yPosition += 20;
            // // Platform Fee
            // doc
            //     .text('Platform Fee:', 350, yPosition)
            //     .text(`Rs:${order.platformFee}`, 460, yPosition, { width: 80, align: 'right' });
            // yPosition += 25;
            // Total
            doc
                .strokeColor('#e5e7eb')
                .lineWidth(1)
                .moveTo(350, yPosition)
                .lineTo(550, yPosition)
                .stroke();
            yPosition += 15;
            doc
                .fontSize(12)
                .font('Helvetica-Bold')
                .fillColor('#000000')
                .text('Total Amount:', 350, yPosition)
                .fontSize(14)
                .fillColor('#2563eb')
                .text(`Rs:${order.amount}`, 460, yPosition, { width: 80, align: 'right' });
            // Footer
            const footerY = 720;
            doc
                .strokeColor('#e5e7eb')
                .lineWidth(1)
                .moveTo(50, footerY)
                .lineTo(550, footerY)
                .stroke();
            doc
                .fontSize(9)
                .font('Helvetica')
                .fillColor('#666666')
                .text('Thank you for your purchase!', 50, footerY + 15, { align: 'center', width: 500 })
                .text('For any queries, please contact support@devnext.com', 50, footerY + 30, { align: 'center', width: 500 });
            doc.end();
        }
        catch (error) {
            reject(error);
        }
    });
};
exports.generateInvoicePDF = generateInvoicePDF;
