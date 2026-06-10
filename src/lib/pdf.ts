import { PDFDocument, StandardFonts } from 'pdf-lib';

export async function downloadDocument(text: string) {
    const pdfDocument = await PDFDocument.create();
    const timesNewRomanFont = await pdfDocument.embedFont(StandardFonts.TimesRoman);

    const page = pdfDocument.addPage();
    const { height } = page.getSize();
    page.drawText(text, {
        x: 5,
        y: height - 25,
        size: 20,
        font: timesNewRomanFont
    });
    return await pdfDocument.save();
}