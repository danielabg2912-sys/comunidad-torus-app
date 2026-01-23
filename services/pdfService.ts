
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface Coordinates {
    x: number;
    y: number;
    size: number;
    page?: number;
}

export interface FormConfig {
    name: Coordinates;
    rfc: Coordinates;
    curp: Coordinates;
    date: Coordinates; // Usually needed for contracts
}

export const fillPdf = async (
    templateUrl: string,
    data: { name: string; rfc: string; curp: string },
    config: FormConfig
): Promise<Uint8Array> => {
    const existingPdfBytes = await fetch(templateUrl).then((res) => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    // Get the font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Helper to draw text
    const draw = (text: string, coords: Coordinates) => {
        const pageIndex = coords.page ?? 0;
        if (pages[pageIndex]) {
            pages[pageIndex].drawText(text, {
                x: coords.x,
                y: coords.y,
                size: coords.size,
                font: helveticaFont,
                color: rgb(0, 0, 0),
            });
        }
    };

    // Draw the fields
    draw(data.name, config.name);
    draw(data.rfc, config.rfc);
    draw(data.curp, config.curp);

    // Auto-fill date if coordinates provided
    if (config.date) {
        const now = new Date();
        const dateStr = now.toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        draw(dateStr, config.date);
    }

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
};
