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
 * Helper function to generate professional PDF layout
 */
const generateProfessionalPDF = (doc: jsPDF, invoiceData: InvoiceData, logoBase64?: string): void => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;
  let yPosition = margin;

  // Color definitions
  const primaryColor = [25, 118, 210]; // Blue
  const accentColor = [76, 175, 80]; // Green
  const darkGray = [33, 33, 33];
  const lightGray = [240, 240, 240];
  const borderGray = [200, 200, 200];

  // Helper functions
  const addText = (text: string, x: number, y: number, fontSize = 10, fontStyle: 'normal' | 'bold' = 'normal', color = darkGray) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(text, x, y);
  };

  const addLine = (y: number, startX = margin, endX = pageWidth - margin, width = 0.5, color = borderGray) => {
    doc.setLineWidth(width);
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.line(startX, y, endX, y);
  };

  const addRect = (x: number, y: number, width: number, height: number, color: number[], fillOnly = true) => {
    doc.setFillColor(color[0], color[1], color[2]);
    if (fillOnly) {
      doc.rect(x, y, width, height, 'F');
    } else {
      doc.setDrawColor(color[0], color[1], color[2]);
      doc.rect(x, y, width, height);
    }
  };

  // ===== HEADER SECTION =====
  // Blue header background
  addRect(0, 0, pageWidth, 40, primaryColor);

  // Add logo if available
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', margin + 1, 2, 8, 8);
    } catch (error) {
      console.error('Error adding logo:', error);
    }
  }

  // Company name (offset for logo)
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  const logoOffset = logoBase64 ? 10 : 2;
  doc.text('DARJEELING CABS', margin + logoOffset, 8);

  // Company tagline
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Premium Taxi & Tour Services', margin + logoOffset, 14);
  doc.text('Darjeeling • Sikkim • Bhutan • Nepal', margin + logoOffset, 18);

  // Invoice type on the right
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('TAX INVOICE', pageWidth - margin - 45, 12);

  yPosition = 43;

  // ===== INVOICE INFO SECTION =====
  // Left side - Invoice details
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('INVOICE DETAILS', margin, yPosition);
  yPosition += 5;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(8);
  doc.text(`Invoice #: ${invoiceData.invoiceNumber}`, margin, yPosition);
  yPosition += 4;
  doc.text(`Date: ${invoiceData.invoiceDate}`, margin, yPosition);
  yPosition += 4;
  doc.text(`Trip Date: ${invoiceData.tripDate}`, margin, yPosition);

  // Right side - Company info
  const rightX = pageWidth - margin - 70;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('COMPANY INFO', rightX, 43);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(8);
  doc.text('darjeelingcabs.com@gmail.com', rightX, 48);

  yPosition = 57;
  addLine(yPosition, margin, pageWidth - margin, 0.4);

  // ===== BILL TO SECTION =====
  yPosition += 4;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('BILL TO:', margin, yPosition);

  yPosition += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text(invoiceData.customerName, margin, yPosition);

  yPosition += 4;
  doc.setFont('helvetica', 'normal');
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
  doc.text(`👥 Passengers: ${invoiceData.numberOfPassengers}`, margin, yPosition);
  if (invoiceData.driverName) {
    yPosition += 3;
    doc.text(`🚗 Driver: ${invoiceData.driverName}`, margin, yPosition);
  }

  yPosition += 6;
  addLine(yPosition, margin, pageWidth - margin, 0.4);

  // ===== ITINERARY TABLE =====
  yPosition += 4;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('ITINERARY', margin, yPosition);

  yPosition += 5;

  // Table header with blue background
  const col1 = margin;
  const col2 = margin + 12;
  const col3 = margin + 50;
  const col4 = margin + 75;
  const col5 = margin + 105;
  const col6 = pageWidth - margin - 25;

  addRect(col1 - 1, yPosition - 3, pageWidth - 2 * margin + 2, 5, primaryColor);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Day', col1, yPosition);
  doc.text('Destination', col2, yPosition);
  doc.text('Days', col4, yPosition);
  doc.text('Vehicle', col5, yPosition);
  doc.text('Rate', col6, yPosition);

  yPosition += 5;

  // Table rows
  let rowColor = true;
  invoiceData.dailyItinerary.forEach((day, idx) => {
    // Alternate row background
    if (rowColor) {
      addRect(col1 - 1, yPosition - 3, pageWidth - 2 * margin + 2, 4, lightGray);
    }

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);

    doc.text(day.day.toString(), col1, yPosition);
    doc.text(day.destination, col2, yPosition);
    doc.text(day.numberOfDays.toString(), col4, yPosition);
    doc.text(day.vehicleType, col5, yPosition);

    // Right-aligned rate
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(day.rate), col6, yPosition, { align: 'right' });

    yPosition += 4;
    rowColor = !rowColor;
  });

  yPosition += 2;
  addLine(yPosition, margin, pageWidth - margin, 0.5);

  // ===== CHARGES SECTION =====
  yPosition += 4;

  const tripTotal = invoiceData.dailyItinerary.reduce((sum, day) => sum + day.rate, 0);
  const chargesX = pageWidth - margin - 55;
  const chargesLabelX = chargesX - 40;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);

  doc.text('Trip Charges', chargesLabelX, yPosition);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(tripTotal), chargesX, yPosition, { align: 'right' });
  yPosition += 3;

  if (invoiceData.parkingCharges > 0) {
    doc.setFont('helvetica', 'normal');
    doc.text('Parking', chargesLabelX, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(invoiceData.parkingCharges), chargesX, yPosition, { align: 'right' });
    yPosition += 3;
  }

  if (invoiceData.tollCharges > 0) {
    doc.setFont('helvetica', 'normal');
    doc.text('Toll', chargesLabelX, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(invoiceData.tollCharges), chargesX, yPosition, { align: 'right' });
    yPosition += 3;
  }

  if (invoiceData.driverAllowance > 0) {
    doc.setFont('helvetica', 'normal');
    doc.text('Driver Allowance', chargesLabelX, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(invoiceData.driverAllowance), chargesX, yPosition, { align: 'right' });
    yPosition += 3;
  }

  if (invoiceData.extraCharges > 0) {
    doc.setFont('helvetica', 'normal');
    doc.text('Extra Charges', chargesLabelX, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(invoiceData.extraCharges), chargesX, yPosition, { align: 'right' });
    yPosition += 3;
  }

  yPosition += 2;
  addLine(yPosition, chargesLabelX - 5, pageWidth - margin, 0.4);

  // ===== TOTALS SECTION =====
  yPosition += 3;

  // Subtotal
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text('Subtotal:', chargesLabelX, yPosition);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(invoiceData.calculations.subtotal), chargesX, yPosition, { align: 'right' });
  yPosition += 4;

  // Discount (if any)
  if (invoiceData.discount > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(220, 53, 69); // Red
    doc.text('Discount:', chargesLabelX, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text(`-${formatCurrency(invoiceData.discount)}`, chargesX, yPosition, { align: 'right' });
    yPosition += 4;
  }

  // Total Amount (gray background)
  addRect(chargesLabelX - 5, yPosition - 2.5, pageWidth - chargesLabelX + 5, 4, lightGray);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(9);
  doc.text('Total Amount:', chargesLabelX, yPosition);
  doc.text(formatCurrency(invoiceData.calculations.totalCharges), chargesX, yPosition, { align: 'right' });
  yPosition += 4;

  // Advance Paid (if any)
  if (invoiceData.advancePaid > 0) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(52, 168, 224); // Light blue
    doc.text('Advance Paid:', chargesLabelX, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text(`-${formatCurrency(invoiceData.advancePaid)}`, chargesX, yPosition, { align: 'right' });
    yPosition += 4;
  }

  // ===== BALANCE DUE (HIGHLIGHTED) =====
  addRect(chargesLabelX - 5, yPosition - 2.5, pageWidth - chargesLabelX + 5, 6, accentColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('BALANCE DUE:', chargesLabelX, yPosition + 0.5);
  doc.text(formatCurrency(invoiceData.calculations.balanceDue), chargesX, yPosition + 0.5, { align: 'right' });

  // ===== FOOTER =====
  yPosition = pageHeight - 20;

  addLine(yPosition - 2, margin, pageWidth - margin, 0.5);

  yPosition += 2;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text(`Payment Method: ${invoiceData.paymentMethod}`, margin, yPosition);

  yPosition += 4;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Thank you for travelling with Darjeeling Cabs!', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 3;
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text('For inquiries: darjeelingcabs.com@gmail.com', pageWidth / 2, yPosition, { align: 'center' });
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

  // ===== INVOICE INFO SECTION =====
  // Left side - Invoice details
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('INVOICE DETAILS', margin, yPosition);
  yPosition += 5;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(8);
  doc.text(`Invoice #: ${invoiceData.invoiceNumber}`, margin, yPosition);
  yPosition += 4;
  doc.text(`Date: ${invoiceData.invoiceDate}`, margin, yPosition);
  yPosition += 4;
  doc.text(`Trip Date: ${invoiceData.tripDate}`, margin, yPosition);

  // Right side - Company info
  const rightX = pageWidth - margin - 70;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('COMPANY INFO', rightX, 38);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(8);
  doc.text('darjeelingcabs.com@gmail.com', rightX, 43);

  yPosition = 52;
  addLine(yPosition, margin, pageWidth - margin, 0.4);

  // ===== BILL TO SECTION =====
  yPosition += 4;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('BILL TO:', margin, yPosition);

  yPosition += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text(invoiceData.customerName, margin, yPosition);

  yPosition += 4;
  doc.setFont('helvetica', 'normal');
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
  doc.text(`👥 Passengers: ${invoiceData.numberOfPassengers}`, margin, yPosition);
  if (invoiceData.driverName) {
    yPosition += 3;
    doc.text(`🚗 Driver: ${invoiceData.driverName}`, margin, yPosition);
  }

  yPosition += 6;
  addLine(yPosition, margin, pageWidth - margin, 0.4);

  // ===== ITINERARY TABLE =====
  yPosition += 4;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('ITINERARY', margin, yPosition);

  yPosition += 5;

  // Table header with blue background
  const col1 = margin;
  const col2 = margin + 12;
  const col3 = margin + 50;
  const col4 = margin + 75;
  const col5 = margin + 105;
  const col6 = pageWidth - margin - 25;

  addRect(col1 - 1, yPosition - 3, pageWidth - 2 * margin + 2, 5, primaryColor);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Day', col1, yPosition);
  doc.text('Destination', col2, yPosition);
  doc.text('Days', col4, yPosition);
  doc.text('Vehicle', col5, yPosition);
  doc.text('Rate', col6, yPosition);

  yPosition += 5;

  // Table rows
  let rowColor = true;
  invoiceData.dailyItinerary.forEach((day, idx) => {
    // Alternate row background
    if (rowColor) {
      addRect(col1 - 1, yPosition - 3, pageWidth - 2 * margin + 2, 4, lightGray);
    }

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);

    doc.text(day.day.toString(), col1, yPosition);
    doc.text(day.destination, col2, yPosition);
    doc.text(day.numberOfDays.toString(), col4, yPosition);
    doc.text(day.vehicleType, col5, yPosition);

    // Right-aligned rate
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(day.rate), col6, yPosition, { align: 'right' });

    yPosition += 4;
    rowColor = !rowColor;
  });

  yPosition += 2;
  addLine(yPosition, margin, pageWidth - margin, 0.5);

  // ===== CHARGES SECTION =====
  yPosition += 4;

  const tripTotal = invoiceData.dailyItinerary.reduce((sum, day) => sum + day.rate, 0);
  const chargesX = pageWidth - margin - 55;
  const chargesLabelX = chargesX - 40;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);

  doc.text('Trip Charges', chargesLabelX, yPosition);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(tripTotal), chargesX, yPosition, { align: 'right' });
  yPosition += 3;

  if (invoiceData.parkingCharges > 0) {
    doc.setFont('helvetica', 'normal');
    doc.text('Parking', chargesLabelX, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(invoiceData.parkingCharges), chargesX, yPosition, { align: 'right' });
    yPosition += 3;
  }

  if (invoiceData.tollCharges > 0) {
    doc.setFont('helvetica', 'normal');
    doc.text('Toll', chargesLabelX, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(invoiceData.tollCharges), chargesX, yPosition, { align: 'right' });
    yPosition += 3;
  }

  if (invoiceData.driverAllowance > 0) {
    doc.setFont('helvetica', 'normal');
    doc.text('Driver Allowance', chargesLabelX, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(invoiceData.driverAllowance), chargesX, yPosition, { align: 'right' });
    yPosition += 3;
  }

  if (invoiceData.extraCharges > 0) {
    doc.setFont('helvetica', 'normal');
    doc.text('Extra Charges', chargesLabelX, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(invoiceData.extraCharges), chargesX, yPosition, { align: 'right' });
    yPosition += 3;
  }

  yPosition += 2;
  addLine(yPosition, chargesLabelX - 5, pageWidth - margin, 0.4);

  // ===== TOTALS SECTION =====
  yPosition += 3;

  // Subtotal
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text('Subtotal:', chargesLabelX, yPosition);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(invoiceData.calculations.subtotal), chargesX, yPosition, { align: 'right' });
  yPosition += 4;

  // Discount (if any)
  if (invoiceData.discount > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(220, 53, 69); // Red
    doc.text('Discount:', chargesLabelX, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text(`-${formatCurrency(invoiceData.discount)}`, chargesX, yPosition, { align: 'right' });
    yPosition += 4;
  }

  // Total Amount (gray background)
  addRect(chargesLabelX - 5, yPosition - 2.5, pageWidth - chargesLabelX + 5, 4, lightGray);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(9);
  doc.text('Total Amount:', chargesLabelX, yPosition);
  doc.text(formatCurrency(invoiceData.calculations.totalCharges), chargesX, yPosition, { align: 'right' });
  yPosition += 4;

  // Advance Paid (if any)
  if (invoiceData.advancePaid > 0) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(52, 168, 224); // Light blue
    doc.text('Advance Paid:', chargesLabelX, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text(`-${formatCurrency(invoiceData.advancePaid)}`, chargesX, yPosition, { align: 'right' });
    yPosition += 4;
  }

  // ===== BALANCE DUE (HIGHLIGHTED) =====
  addRect(chargesLabelX - 5, yPosition - 2.5, pageWidth - chargesLabelX + 5, 6, accentColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('BALANCE DUE:', chargesLabelX, yPosition + 0.5);
  doc.text(formatCurrency(invoiceData.calculations.balanceDue), chargesX, yPosition + 0.5, { align: 'right' });

  // ===== FOOTER =====
  yPosition = pageHeight - 20;

  addLine(yPosition - 2, margin, pageWidth - margin, 0.5);

  yPosition += 2;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text(`Payment Method: ${invoiceData.paymentMethod}`, margin, yPosition);

  yPosition += 4;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Thank you for travelling with Darjeeling Cabs!', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 3;
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text('For inquiries: darjeelingcabs.com@gmail.com', pageWidth / 2, yPosition, { align: 'center' });
};

/**
 * Generate PDF invoice using jsPDF
 */
export const generatePDFInvoice = (invoiceData: InvoiceData): void => {
  const doc = new jsPDF();
  generateProfessionalPDF(doc, invoiceData);
  doc.save(`${invoiceData.invoiceNumber}.pdf`);
};

/**
 * Generate and open PDF invoice in new window for printing
 */
export const printPDFInvoice = (invoiceData: InvoiceData): void => {
  const doc = new jsPDF();
  generateProfessionalPDF(doc, invoiceData);

  // Open in new window for printing
  const pdfDataUri = doc.output('datauristring');
  const printWindow = window.open(pdfDataUri, '_blank');
  if (printWindow) {
    printWindow.print();
  }
};
