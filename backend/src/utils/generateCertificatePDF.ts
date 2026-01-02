import PDFDocument from 'pdfkit';

export const generateCertificatePDF = (data:{ studentName:string, courseName:string, certificateNumber:string }) => {
  return new Promise<Buffer>((resolve) => {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });
    const chunks: Buffer[] = [];

    doc.fontSize(30).text('Certificate of Completion', { align: 'center' });
    doc.moveDown();
    doc.fontSize(20).text('This certificate is awarded to', { align: 'center' });
    doc.moveDown();
    doc.fontSize(32).text(data.studentName, { align: 'center' });
    doc.moveDown();
    doc.fontSize(20).text('for successfully completing the course', { align: 'center' });
    doc.moveDown();
    doc.fontSize(26).text(data.courseName, { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Certificate No: ${data.certificateNumber}`, { align: 'center' });

    doc.end();

    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
  });
};
