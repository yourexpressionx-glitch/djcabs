import jsPDF from 'jspdf';
import { InvoiceData } from '@/types/invoice';
import { formatCurrency } from './invoiceUtils';

/**
 * Helper function to generate PDF layout
 */
const generatePDFLayout = (doc: jsPDF, invoiceData: InvoiceData): void => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 12;

  // Helper functions
  const addText = (text: string, x: number, y: number, fontSize = 10, fontStyle: 'normal' | 'bold' = 'normal', align: 'left' | 'center' | 'right' = 'left') => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle);
    if (align === 'center') {
      doc.text(text, pageWidth / 2, y, { align: 'center' });
    } else if (align === 'right') {
      doc.text(text, pageWidth - 15, y, { align: 'right' });
    } else {
      doc.text(text, x, y);
    }
  };

  const addLine = (y: number, width: number = pageWidth - 20) => {
    doc.setLineWidth(0.4);
    doc.line(10, y, 10 + width, y);
  };

  // Header
  addText('DARJEELING CABS', 15, yPosition, 16, 'bold');
  yPosition += 7;
  addText('📍 Darjeeling • Sikkim • Bhutan • Nepal', 15, yPosition, 9, 'normal');
  yPosition += 5;
  addText('📧 darjeelingcabs.com@gmail.com', 15, yPosition, 9, 'normal');
  yPosition += 6;
  addLine(yPosition);
  yPosition += 5;

  // Tax Invoice title
  addText('TAX INVOICE', 15, yPosition, 12, 'bold');
  yPosition += 7;

  // Invoice Details
  addText(`Invoice No: ${invoiceData.invoiceNumber}`, 15, yPosition, 9, 'normal');
  addText(`Date: ${invoiceData.invoiceDate}`, pageWidth - 50, yPosition, 9, 'normal');
  yPosition += 5;
  addText(`Trip Date: ${invoiceData.tripDate}`, pageWidth - 50, yPosition, 9, 'normal');
  yPosition += 7;

  // Bill To Section
  addText('BILL TO:', 15, yPosition, 9, 'bold');
  yPosition += 5;
  addText(invoiceData.customerName, 15, yPosition, 9, 'bold');
  yPosition += 4;
  if (invoiceData.customerAddress) {
    addText(invoiceData.customerAddress, 15, yPosition, 8, 'normal');
    yPosition += 4;
  }
  if (invoiceData.customerCity) {
    addText(invoiceData.customerCity, 15, yPosition, 8, 'normal');
    yPosition += 4;
  }
  addText(`Phone: ${invoiceData.phoneNumber}`, 15, yPosition, 8, 'normal');
  yPosition += 4;
  addText(`Passengers: ${invoiceData.numberOfPassengers}`, 15, yPosition, 8, 'normal');
  if (invoiceData.driverName) {
    yPosition += 4;
    addText(`Driver: ${invoiceData.driverName}`, 15, yPosition, 8, 'normal');
  }
  yPosition += 8;

  addLine(yPosition);
  yPosition += 5;

  // Itinerary Table Header
  addText('ITINERARY', 15, yPosition, 9, 'bold');
  yPosition += 6;

  // Table headers
  const col1 = 15;
  const col2 = 25;
  const col3 = 75;
  const col4 = 105;
  const col5 = 135;
  const col6 = 170;

  doc.setFillColor(200, 200, 200);
  doc.rect(col1 - 3, yPosition - 4, pageWidth - 28, 6, 'F');

  addText('Day', col1, yPosition, 8, 'bold');
  addText('Destination', col3, yPosition, 8, 'bold');
  addText('Days', col4, yPosition, 8, 'bold');
  addText('Vehicle', col5, yPosition, 8, 'bold');
  addText('Rate (₹)', col6, yPosition, 8, 'bold');
  yPosition += 6;

  // Table rows
  invoiceData.dailyItinerary.forEach((day) => {
    addText(day.day.toString(), col1, yPosition, 8, 'normal');
    addText(day.destination, col3, yPosition, 8, 'normal');
    addText(day.numberOfDays.toString(), col4, yPosition, 8, 'normal');
    addText(day.vehicleType, col5, yPosition, 8, 'normal');
    addText(formatCurrency(day.rate), col6, yPosition, 8, 'bold', 'right');
    yPosition += 5;
  });

  yPosition += 2;
  addLine(yPosition);
  yPosition += 5;

  // Trip and Other Charges
  const tripTotal = invoiceData.dailyItinerary.reduce((sum, day) => sum + day.rate, 0);
  
  addText('Trip Charges', 15, yPosition, 9, 'normal');
  addText(formatCurrency(tripTotal), pageWidth - 15, yPosition, 9, 'normal', 'right');
  yPosition += 5;

  if (invoiceData.parkingCharges > 0) {
    addText('Parking', 15, yPosition, 9, 'normal');
    addText(formatCurrency(invoiceData.parkingCharges), pageWidth - 15, yPosition, 9, 'normal', 'right');
    yPosition += 5;
  }
  if (invoiceData.tollCharges > 0) {
    addText('Toll', 15, yPosition, 9, 'normal');
    addText(formatCurrency(invoiceData.tollCharges), pageWidth - 15, yPosition, 9, 'normal', 'right');
    yPosition += 5;
  }
  if (invoiceData.driverAllowance > 0) {
    addText('Driver Allowance', 15, yPosition, 9, 'normal');
    addText(formatCurrency(invoiceData.driverAllowance), pageWidth - 15, yPosition, 9, 'normal', 'right');
    yPosition += 5;
  }
  if (invoiceData.extraCharges > 0) {
    addText('Extra Charges', 15, yPosition, 9, 'normal');
    addText(formatCurrency(invoiceData.extraCharges), pageWidth - 15, yPosition, 9, 'normal', 'right');
    yPosition += 5;
  }

  yPosition += 2;
  addLine(yPosition);
  yPosition += 5;

  // Totals
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  addText('Subtotal', 15, yPosition, 9, 'bold');
  addText(formatCurrency(invoiceData.calculations.subtotal), pageWidth - 15, yPosition, 9, 'bold', 'right');
  yPosition += 5;

  if (invoiceData.discount > 0) {
    addText('Discount', 15, yPosition, 9, 'normal');
    addText(`-${formatCurrency(invoiceData.discount)}`, pageWidth - 15, yPosition, 9, 'normal', 'right');
    yPosition += 5;
  }

  doc.setFillColor(240, 240, 240);
  doc.rect(10, yPosition - 4, pageWidth - 20, 6, 'F');
  addText('Total Amount', 15, yPosition, 9, 'bold');
  addText(formatCurrency(invoiceData.calculations.totalCharges), pageWidth - 15, yPosition, 9, 'bold', 'right');
  yPosition += 6;

  if (invoiceData.advancePaid > 0) {
    addText('Advance Paid', 15, yPosition, 9, 'normal');
    addText(`-${formatCurrency(invoiceData.advancePaid)}`, pageWidth - 15, yPosition, 9, 'normal', 'right');
    yPosition += 5;
  }

  // Balance Due - Highlighted
  doc.setFillColor(200, 255, 200);
  doc.rect(10, yPosition - 4, pageWidth - 20, 8, 'F');
  doc.setFont('helvetica', 'bold');
  addText('BALANCE DUE', 15, yPosition, 10, 'bold');
  addText(formatCurrency(invoiceData.calculations.balanceDue), pageWidth - 15, yPosition, 10, 'bold', 'right');

  // Footer
  yPosition = pageHeight - 12;
  addLine(yPosition - 2);
  yPosition += 3;
  addText('Payment Method: ' + invoiceData.paymentMethod, 15, yPosition, 8, 'normal');
  yPosition += 5;
  addText('Thank you for travelling with Darjeeling Cabs!', pageWidth / 2, yPosition, 8, 'normal', 'center');
};

/**
 * Generate PDF invoice using jsPDF
 */
export const generatePDFInvoice = (invoiceData: InvoiceData): void => {
  const doc = new jsPDF();
  generatePDFLayout(doc, invoiceData);
  doc.save(`${invoiceData.invoiceNumber}.pdf`);
};

/**
 * Generate and open PDF invoice in new window for printing
 */
export const printPDFInvoice = (invoiceData: InvoiceData): void => {
  const doc = new jsPDF();
  generatePDFLayout(doc, invoiceData);

  // Open in new window for printing
  const pdfDataUri = doc.output('datauristring');
  const printWindow = window.open(pdfDataUri, '_blank');
  if (printWindow) {
    printWindow.print();
  }
};
