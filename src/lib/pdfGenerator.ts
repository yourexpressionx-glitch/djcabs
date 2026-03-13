import jsPDF from 'jspdf';
import { InvoiceData } from '@/types/invoice';
import { formatCurrency } from './invoiceUtils';

/**
 * Convert image to base64
 */
const imageToBase64 = async (imagePath: string): Promise<string> => {
  try {
    const response = await fetch(imagePath);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error loading image:', error);
    return '';
  }
};

/**
 * Helper function to generate professional PDF layout matching preview design
 */
const generateProfessionalPDF = (doc: jsPDF, invoiceData: InvoiceData, logoBase64?: string): void => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = margin;

  // Helper functions
  const addText = (text: string, x: number, y: number, fontSize = 11, fontStyle: 'normal' | 'bold' = 'normal', color = [0, 0, 0]) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(text, x, y);
  };

  const addLine = (y: number, startX = margin, endX = pageWidth - margin, width = 0.5) => {
    doc.setLineWidth(width);
    doc.setDrawColor(220, 220, 220);
    doc.line(startX, y, endX, y);
  };

  // ===== HEADER SECTION (Centered) =====
  doc.setFillColor(255, 255, 255);

  // Logo
  if (logoBase64) {
    try {
      const logoWidth = 20;
      const logoX = (pageWidth - logoWidth) / 2;
      doc.addImage(logoBase64, 'PNG', logoX, yPosition, logoWidth, 15);
      yPosition += 18;
    } catch (error) {
      console.error('Error adding logo:', error);
    }
  }

  // Company Name
  addText('DARJEELING CABS', pageWidth / 2, yPosition, 20, 'bold', [0, 0, 0]);
  doc.setTextColor(0, 0, 0);
  doc.textAlign = 'center';
  
  yPosition += 7;
  addText('📍 Darjeeling • Sikkim • Bhutan • Nepal', pageWidth / 2, yPosition, 8, 'normal', [0, 0, 0]);
  yPosition += 4;
  addText('📧 darjeelingcabs.com@gmail.com', pageWidth / 2, yPosition, 8, 'normal', [0, 0, 0]);
  yPosition += 5;

  // TAX INVOICE label
  addText('TAX INVOICE', pageWidth / 2, yPosition, 14, 'bold', [0, 100, 0]);
  yPosition += 8;

  // Border line
  addLine(yPosition, margin, pageWidth - margin, 1);
  yPosition += 4;

  // ===== INVOICE DETAILS =====
  doc.setTextAlign = 'left';
  addText(`Invoice No: ${invoiceData.invoiceNumber}`, margin, yPosition, 9, 'bold', [0, 0, 0]);
  
  const rightX = pageWidth - 50;
  addText(`Trip Date: ${invoiceData.tripDate}`, rightX, yPosition, 9, 'bold', [0, 0, 0]);
  
  yPosition += 4;
  addText(`Date: ${invoiceData.invoiceDate}`, margin, yPosition, 8, 'normal', [0, 0, 0]);
  yPosition += 5;

  // Border
  addLine(yPosition, margin, pageWidth - margin, 0.5);
  yPosition += 4;

  // ===== CUSTOMER DETAILS =====
  addText('BILL TO:', margin, yPosition, 9, 'bold', [0, 0, 0]);
  yPosition += 4;
  addText(invoiceData.customerName, margin, yPosition, 10, 'bold', [0, 0, 0]);
  yPosition += 4;

  doc.setFontSize(8);
  if (invoiceData.customerAddress) {
    doc.text(invoiceData.customerAddress, margin, yPosition);
    yPosition += 3;
  }
  if (invoiceData.customerCity) {
    doc.text(invoiceData.customerCity, margin, yPosition);
    yPosition += 3;
  }
  doc.text(`📱 ${invoiceData.phoneNumber}`, margin, yPosition);
  yPosition += 3;
  doc.text(`Passengers: ${invoiceData.numberOfPassengers}`, margin, yPosition);
  yPosition += 3;
  if (invoiceData.driverName) {
    doc.text(`Driver: ${invoiceData.driverName}`, margin, yPosition);
    yPosition += 3;
  }

  yPosition += 2;
  addLine(yPosition, margin, pageWidth - margin, 0.5);
  yPosition += 4;

  // ===== ITINERARY TABLE =====
  addText('ITINERARY', margin, yPosition, 9, 'bold', [0, 0, 0]);
  yPosition += 4;

  // Table header
  const col1X = margin;
  const col2X = margin + 12;
  const col3X = margin + 50;
  const col4X = margin + 85;
  const col5X = pageWidth - margin - 25;

  doc.setTextColor(255, 255, 255);
  doc.setFillColor(100, 100, 100);
  doc.rect(col1X - 1, yPosition - 3, pageWidth - 2 * margin + 2, 5, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Day', col1X, yPosition);
  doc.text('Destination', col2X, yPosition);
  doc.text('Days', col4X, yPosition);
  doc.text('Vehicle', col4X + 20, yPosition);
  doc.text('Rate (₹)', col5X, yPosition);

  yPosition += 5;

  // Table rows
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  
  invoiceData.dailyItinerary.forEach((day, idx) => {
    // Alternate row background
    if (idx % 2 === 0) {
      doc.setFillColor(245, 245, 245);
      doc.rect(col1X - 1, yPosition - 2.5, pageWidth - 2 * margin + 2, 4, 'F');
    }

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    
    // Draw borders
    doc.setDrawColor(200, 200, 200);
    doc.rect(col1X - 1, yPosition - 2.5, pageWidth - 2 * margin + 2, 4);

    doc.text(day.day.toString(), col1X, yPosition);
    doc.text(day.destination, col2X, yPosition);
    doc.text(day.numberOfDays.toString(), col4X, yPosition);
    doc.text(day.vehicleType, col4X + 20, yPosition);
    
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(day.rate), col5X, yPosition);
    
    yPosition += 4;
  });

  yPosition += 3;
  addLine(yPosition, margin, pageWidth - margin, 0.5);
  yPosition += 4;

  // ===== ADDITIONAL CHARGES =====
  addText('ADDITIONAL CHARGES', margin, yPosition, 9, 'bold', [0, 0, 0]);
  yPosition += 4;

  const tripTotal = invoiceData.dailyItinerary.reduce((sum, day) => sum + day.rate, 0);
  const rightColX = pageWidth - margin - 45;
  const labelX = margin;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Trip Charges', labelX, yPosition);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(tripTotal), rightColX, yPosition);
  yPosition += 3;

  if (invoiceData.parkingCharges > 0) {
    doc.setFont('helvetica', 'normal');
    doc.text('Parking', labelX, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(invoiceData.parkingCharges), rightColX, yPosition);
    yPosition += 3;
  }

  if (invoiceData.tollCharges > 0) {
    doc.setFont('helvetica', 'normal');
    doc.text('Toll', labelX, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(invoiceData.tollCharges), rightColX, yPosition);
    yPosition += 3;
  }

  if (invoiceData.driverAllowance > 0) {
    doc.setFont('helvetica', 'normal');
    doc.text('Driver Allowance', labelX, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(invoiceData.driverAllowance), rightColX, yPosition);
    yPosition += 3;
  }

  if (invoiceData.extraCharges > 0) {
    doc.setFont('helvetica', 'normal');
    doc.text('Extra Charges', labelX, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(invoiceData.extraCharges), rightColX, yPosition);
    yPosition += 3;
  }

  yPosition += 3;
  addLine(yPosition, margin, pageWidth - margin, 0.5);
  yPosition += 4;

  // ===== TOTALS SECTION =====
  doc.setFontSize(9);
  
  // Subtotal
  doc.setFillColor(240, 240, 240);
  doc.rect(labelX - 2, yPosition - 2.5, pageWidth - 2 * margin + 2, 4, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Subtotal', labelX, yPosition);
  doc.text(formatCurrency(invoiceData.calculations.subtotal), rightColX, yPosition);
  yPosition += 4;

  // Discount (if any)
  if (invoiceData.discount > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 50, 50);
    doc.text('Discount', labelX, yPosition);
    doc.text(`-${formatCurrency(invoiceData.discount)}`, rightColX, yPosition);
    yPosition += 4;
  }

  // Total Amount
  doc.setFillColor(240, 240, 240);
  doc.rect(labelX - 2, yPosition - 2.5, pageWidth - 2 * margin + 2, 4, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Total Amount', labelX, yPosition);
  doc.text(formatCurrency(invoiceData.calculations.totalCharges), rightColX, yPosition);
  yPosition += 4;

  // Advance Paid (if any)
  if (invoiceData.advancePaid > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(50, 100, 200);
    doc.text('Advance Paid', labelX, yPosition);
    doc.text(`-${formatCurrency(invoiceData.advancePaid)}`, rightColX, yPosition);
    yPosition += 4;
  }

  // ===== BALANCE DUE (Green Highlighted) =====
  doc.setFillColor(200, 230, 200);
  doc.setDrawColor(100, 180, 100);
  doc.setLineWidth(2);
  doc.rect(labelX - 2, yPosition - 2.5, pageWidth - 2 * margin + 2, 5, 'FD');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 100, 0);
  doc.text('BALANCE DUE', labelX, yPosition + 0.5);
  doc.text(formatCurrency(invoiceData.calculations.balanceDue), rightColX, yPosition + 0.5);
  
  // ===== FOOTER =====
  yPosition = pageHeight - 15;
  addLine(yPosition, margin, pageWidth - margin, 0.5);
  yPosition += 3;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(0, 0, 0);
  doc.textAlign = 'center';
  doc.text('Thank you for travelling with Darjeeling Cabs!', pageWidth / 2, yPosition);
  
  yPosition += 4;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Payment Method: ${invoiceData.paymentMethod}`, pageWidth / 2, yPosition);
};

/**
 * Generate PDF invoice using jsPDF
 */
export const generatePDFInvoice = async (invoiceData: InvoiceData): Promise<void> => {
  const doc = new jsPDF();
  
  // Load logo
  let logoBase64 = '';
  try {
    logoBase64 = await imageToBase64('/images/logo.png');
  } catch (error) {
    console.warn('Logo not loaded, continuing without it');
  }
  
  generateProfessionalPDF(doc, invoiceData, logoBase64);
  doc.save(`${invoiceData.invoiceNumber}.pdf`);
};

/**
 * Generate and open PDF invoice in new window for printing
 */
export const printPDFInvoice = async (invoiceData: InvoiceData): Promise<void> => {
  const doc = new jsPDF();
  
  // Load logo
  let logoBase64 = '';
  try {
    logoBase64 = await imageToBase64('/images/logo.png');
  } catch (error) {
    console.warn('Logo not loaded, continuing without it');
  }
  
  generateProfessionalPDF(doc, invoiceData, logoBase64);

  // Open in new window for printing
  const pdfDataUri = doc.output('datauristring');
  const printWindow = window.open(pdfDataUri, '_blank');
  if (printWindow) {
    printWindow.print();
  }
};
