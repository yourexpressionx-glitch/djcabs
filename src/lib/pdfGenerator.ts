import jsPDF from 'jspdf';
import { InvoiceData } from '@/types/invoice';
import { formatCurrency } from './invoiceUtils';

/**
 * Generate PDF invoice using jsPDF
 */
export const generatePDFInvoice = (invoiceData: InvoiceData): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 15;

  // Helper function to add text
  const addText = (text: string, x: number, y: number, fontSize = 10, fontStyle: 'normal' | 'bold' = 'normal') => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle);
    doc.text(text, x, y);
  };

  // Helper function to add a line
  const addLine = (y: number) => {
    doc.setLineWidth(0.5);
    doc.line(10, y, pageWidth - 10, y);
  };

  // Header
  addText('DarjeelingCabs', 14, yPosition, 20, 'bold');
  yPosition += 8;
  addText('Taxi & Tour Services', 14, yPosition, 11, 'normal');
  yPosition += 5;
  addText('Darjeeling • Sikkim • Bhutan • Nepal', 14, yPosition, 9, 'normal');
  yPosition += 8;

  addLine(yPosition);
  yPosition += 6;

  // Invoice Details (Right side)
  const rightX = pageWidth - 80;
  addText(`Invoice #: ${invoiceData.invoiceNumber}`, rightX, yPosition, 10, 'bold');
  addText(`Issue Date: ${invoiceData.invoiceDate}`, rightX, yPosition + 6, 9, 'normal');
  addText(`Trip Date: ${invoiceData.tripDate}`, rightX, yPosition + 12, 9, 'normal');

  yPosition += 20;

  // Customer Details Section
  addText('CUSTOMER DETAILS', 14, yPosition, 11, 'bold');
  yPosition += 7;
  addText(`Name: ${invoiceData.customerName}`, 14, yPosition, 9, 'normal');
  yPosition += 5;
  addText(`Phone: ${invoiceData.phoneNumber}`, 14, yPosition, 9, 'normal');
  yPosition += 8;

  // Trip Details Section
  addText('TRIP DETAILS', 14, yPosition, 11, 'bold');
  yPosition += 7;

  const tripDetails = [
    ['Trip Type:', invoiceData.tripType],
    ['Vehicle Type:', invoiceData.vehicleType],
    ['Driver:', invoiceData.driverName],
    ['Passengers:', invoiceData.numberOfPassengers.toString()],
    ['Distance:', `${invoiceData.distance} km`],
    ['From:', invoiceData.pickupLocation],
    ['To:', invoiceData.dropLocation],
  ];

  tripDetails.forEach(([label, value]) => {
    addText(label, 14, yPosition, 9, 'normal');
    addText(value, 50, yPosition, 9, 'normal');
    yPosition += 5;
  });

  yPosition += 5;
  addLine(yPosition);
  yPosition += 8;

  // Charges Table Header
  addText('CHARGES', 14, yPosition, 11, 'bold');
  yPosition += 8;

  const columnX1 = 14;
  const columnX2 = pageWidth - 40;

  addText('Description', columnX1, yPosition, 10, 'bold');
  addText('Amount', columnX2, yPosition, 10, 'bold');
  yPosition += 6;

  // Charges Table
  const charges = [
    ['Base Fare', formatCurrency(invoiceData.tripPrice)],
    ['Toll Charges', formatCurrency(invoiceData.tollCharges)],
    ['Parking Charges', formatCurrency(invoiceData.parkingCharges)],
    ['Driver Allowance', formatCurrency(invoiceData.driverAllowance)],
    ['Extra Charges', formatCurrency(invoiceData.extraCharges)],
    ['Discount', `-${formatCurrency(invoiceData.discount)}`],
  ];

  charges.forEach(([description, amount]) => {
    addText(description, columnX1, yPosition, 9, 'normal');
    addText(amount, columnX2, yPosition, 9, 'normal');
    yPosition += 5;
  });

  yPosition += 3;
  addLine(yPosition);
  yPosition += 6;

  // Totals Section
  addText('Subtotal (All Charges)', columnX1, yPosition, 10, 'bold');
  addText(formatCurrency(invoiceData.calculations.subtotal), columnX2, yPosition, 10, 'bold');
  yPosition += 7;

  if (invoiceData.discount > 0) {
    addText('Discount', columnX1, yPosition, 10, 'bold');
    addText(`-${formatCurrency(invoiceData.discount)}`, columnX2, yPosition, 10, 'bold');
    yPosition += 7;
  }

  addLine(yPosition);
  yPosition += 4;
  addText('Total Amount', columnX1, yPosition, 11, 'bold');
  addText(formatCurrency(invoiceData.calculations.totalCharges), columnX2, yPosition, 11, 'bold');
  yPosition += 8;

  if (invoiceData.advancePaid > 0) {
    addText('Advance Paid', columnX1, yPosition, 10, 'bold');
    addText(`-${formatCurrency(invoiceData.advancePaid)}`, columnX2, yPosition, 10, 'bold');
    yPosition += 7;
  }

  // Highlight Balance Due
  doc.setFillColor(200, 255, 200);
  doc.rect(columnX1 - 2, yPosition - 4, pageWidth - 24, 8, 'F');
  addText('Balance Due', columnX1, yPosition, 11, 'bold');
  addText(formatCurrency(invoiceData.calculations.balanceDue), columnX2, yPosition, 11, 'bold');
  yPosition += 10;

  // Payment Method
  addLine(yPosition);
  yPosition += 6;
  addText(`Payment Method: ${invoiceData.paymentMethod}`, 14, yPosition, 9, 'normal');

  // Footer
  yPosition = pageHeight - 15;
  addLine(yPosition);
  yPosition += 6;
  addText('Thank you for travelling with DarjeelingCabs!', pageWidth / 2, yPosition, 9, 'normal');
  doc.text(' ', pageWidth / 2, yPosition + 4, { align: 'center' });

  // Download PDF
  doc.save(`${invoiceData.invoiceNumber}.pdf`);
};

/**
 * Generate and open PDF invoice in new window for printing
 */
export const printPDFInvoice = (invoiceData: InvoiceData): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 15;

  // Helper function to add text
  const addText = (text: string, x: number, y: number, fontSize = 10, fontStyle: 'normal' | 'bold' = 'normal') => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle);
    doc.text(text, x, y);
  };

  // Helper function to add a line
  const addLine = (y: number) => {
    doc.setLineWidth(0.5);
    doc.line(10, y, pageWidth - 10, y);
  };

  // Header
  addText('DarjeelingCabs', 14, yPosition, 20, 'bold');
  yPosition += 8;
  addText('Taxi & Tour Services', 14, yPosition, 11, 'normal');
  yPosition += 5;
  addText('Darjeeling • Sikkim • Bhutan • Nepal', 14, yPosition, 9, 'normal');
  yPosition += 8;

  addLine(yPosition);
  yPosition += 6;

  // Invoice Details (Right side)
  const rightX = pageWidth - 80;
  addText(`Invoice #: ${invoiceData.invoiceNumber}`, rightX, yPosition, 10, 'bold');
  addText(`Issue Date: ${invoiceData.invoiceDate}`, rightX, yPosition + 6, 9, 'normal');
  addText(`Trip Date: ${invoiceData.tripDate}`, rightX, yPosition + 12, 9, 'normal');

  yPosition += 20;

  // Customer Details Section
  addText('CUSTOMER DETAILS', 14, yPosition, 11, 'bold');
  yPosition += 7;
  addText(`Name: ${invoiceData.customerName}`, 14, yPosition, 9, 'normal');
  yPosition += 5;
  addText(`Phone: ${invoiceData.phoneNumber}`, 14, yPosition, 9, 'normal');
  yPosition += 8;

  // Trip Details Section
  addText('TRIP DETAILS', 14, yPosition, 11, 'bold');
  yPosition += 7;

  const tripDetails = [
    ['Trip Type:', invoiceData.tripType],
    ['Vehicle Type:', invoiceData.vehicleType],
    ['Driver:', invoiceData.driverName],
    ['Passengers:', invoiceData.numberOfPassengers.toString()],
    ['Distance:', `${invoiceData.distance} km`],
    ['From:', invoiceData.pickupLocation],
    ['To:', invoiceData.dropLocation],
  ];

  tripDetails.forEach(([label, value]) => {
    addText(label, 14, yPosition, 9, 'normal');
    addText(value, 50, yPosition, 9, 'normal');
    yPosition += 5;
  });

  yPosition += 5;
  addLine(yPosition);
  yPosition += 8;

  // Charges Table Header
  addText('CHARGES', 14, yPosition, 11, 'bold');
  yPosition += 8;

  const columnX1 = 14;
  const columnX2 = pageWidth - 40;

  addText('Description', columnX1, yPosition, 10, 'bold');
  addText('Amount', columnX2, yPosition, 10, 'bold');
  yPosition += 6;

  // Charges Table
  const charges = [
    ['Base Fare', formatCurrency(invoiceData.tripPrice)],
    ['Toll Charges', formatCurrency(invoiceData.tollCharges)],
    ['Parking Charges', formatCurrency(invoiceData.parkingCharges)],
    ['Driver Allowance', formatCurrency(invoiceData.driverAllowance)],
    ['Extra Charges', formatCurrency(invoiceData.extraCharges)],
    ['Discount', `-${formatCurrency(invoiceData.discount)}`],
  ];

  charges.forEach(([description, amount]) => {
    addText(description, columnX1, yPosition, 9, 'normal');
    addText(amount, columnX2, yPosition, 9, 'normal');
    yPosition += 5;
  });

  yPosition += 3;
  addLine(yPosition);
  yPosition += 6;

  // Totals Section
  addText('Subtotal (All Charges)', columnX1, yPosition, 10, 'bold');
  addText(formatCurrency(invoiceData.calculations.subtotal), columnX2, yPosition, 10, 'bold');
  yPosition += 7;

  if (invoiceData.discount > 0) {
    addText('Discount', columnX1, yPosition, 10, 'bold');
    addText(`-${formatCurrency(invoiceData.discount)}`, columnX2, yPosition, 10, 'bold');
    yPosition += 7;
  }

  addLine(yPosition);
  yPosition += 4;
  addText('Total Amount', columnX1, yPosition, 11, 'bold');
  addText(formatCurrency(invoiceData.calculations.totalCharges), columnX2, yPosition, 11, 'bold');
  yPosition += 8;

  if (invoiceData.advancePaid > 0) {
    addText('Advance Paid', columnX1, yPosition, 10, 'bold');
    addText(`-${formatCurrency(invoiceData.advancePaid)}`, columnX2, yPosition, 10, 'bold');
    yPosition += 7;
  }

  // Highlight Balance Due
  doc.setFillColor(200, 255, 200);
  doc.rect(columnX1 - 2, yPosition - 4, pageWidth - 24, 8, 'F');
  addText('Balance Due', columnX1, yPosition, 11, 'bold');
  addText(formatCurrency(invoiceData.calculations.balanceDue), columnX2, yPosition, 11, 'bold');
  yPosition += 10;

  // Payment Method
  addLine(yPosition);
  yPosition += 6;
  addText(`Payment Method: ${invoiceData.paymentMethod}`, 14, yPosition, 9, 'normal');

  // Footer
  yPosition = pageHeight - 15;
  addLine(yPosition);
  yPosition += 6;
  addText('Thank you for travelling with DarjeelingCabs!', pageWidth / 2, yPosition, 9, 'normal');
  doc.text(' ', pageWidth / 2, yPosition + 4, { align: 'center' });

  // Open in new window for printing
  const pdfDataUri = doc.output('datauristring');
  const printWindow = window.open(pdfDataUri, '_blank');
  if (printWindow) {
    printWindow.print();
  }
};
