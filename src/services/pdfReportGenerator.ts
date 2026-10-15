import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface GeneratePdfOptions {
  filename?: string;
  onProgress?: (progress: number) => void;
}

/**
 * Captures an HTML element and renders it into a multi-page high-resolution PDF Blob.
 */
export async function createPdfBlobFromElement(
  element: HTMLElement,
  options: GeneratePdfOptions = {}
): Promise<Blob> {
  options.onProgress?.(10);

  // Capture canvas with scale 2 for crisp 300dpi-equivalent print resolution
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#FFFFFF',
    windowWidth: element.scrollWidth,
    onclone: clonedDoc => {
      // Ensure all print-hidden items are hidden in the clone as well
      const noPrintElements = clonedDoc.querySelectorAll('.no-print');
      noPrintElements.forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });
    }
  });

  options.onProgress?.(60);

  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  // Add first page
  pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
  heightLeft -= pdfHeight;

  // Add additional pages if content spans beyond a single A4 page
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;
  }

  options.onProgress?.(90);

  const blob = pdf.output('blob');
  options.onProgress?.(100);

  return blob;
}

/**
 * Captures an HTML element, renders it to a PDF, and triggers a file download.
 */
export async function generatePdfFromElement(
  element: HTMLElement,
  options: GeneratePdfOptions = {}
): Promise<void> {
  const filename = options.filename || `MDA_Monitoring_Summary_${new Date().toISOString().split('T')[0]}.pdf`;
  const blob = await createPdfBlobFromElement(element, options);
  
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
}
