import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportPdf(element: HTMLElement, filename = 'resume.pdf') {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pageWidth = 210;
  const pageHeight = pageWidth * (canvas.height / canvas.width);

  const pdf = new jsPDF('p', 'mm', 'a4');
  pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
  pdf.save(filename);
}
