import { PDFDocument, StandardFonts } from 'pdf-lib';

export async function downloadDocument(text: string) {
    const pdfDocument = await PDFDocument.create();
    const timesNewRomanFont = await pdfDocument.embedFont(StandardFonts.TimesRoman)

    const page = pdfDocument.addPage();
    page.drawText(text);
    return await pdfDocument.save();
}