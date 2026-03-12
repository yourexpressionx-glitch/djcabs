import { InvoiceFormData, InvoiceCalculations, InvoiceData } from '@/types/invoice';

/**
 * Generate invoice number based on timestamp
 * Format: DC-{timestamp}
 */
export const generateInvoiceNumber = (): string => {
  const timestamp = Math.floor(Date.now() / 1000);
  return `DC-${timestamp}`;
};

/**
 * Calculate invoice totals
 */
export const calculateInvoice = (data: InvoiceFormData): InvoiceCalculations => {
  // Subtotal = sum of all charges (before discount)
  const subtotal =
    data.tripPrice +
    data.parkingCharges +
    data.tollCharges +
    data.driverAllowance +
    data.extraCharges;

  // Total after discount
  const totalCharges = subtotal - data.discount;

  // Balance due = total - advance paid
  const balanceDue = totalCharges - data.advancePaid;

  return {
    subtotal,
    totalCharges,
    balanceDue,
  };
};

/**
 * Generate complete invoice data
 */
export const generateInvoiceData = (formData: InvoiceFormData): InvoiceData => {
  const invoiceNumber = generateInvoiceNumber();
  const invoiceDate = new Date().toLocaleDateString('en-IN');
  const calculations = calculateInvoice(formData);

  return {
    ...formData,
    invoiceNumber,
    invoiceDate,
    calculations,
  };
};

/**
 * Format currency in Indian Rupees
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Generate WhatsApp message for invoice
 */
export const generateWhatsAppMessage = (invoiceData: InvoiceData): string => {
  const tripRoute = `${invoiceData.pickupLocation} → ${invoiceData.dropLocation}`;
  const amount = formatCurrency(invoiceData.calculations.balanceDue);
  const invoiceNumber = invoiceData.invoiceNumber;

  const message = `Hello, here is your trip invoice from DarjeelingCabs.

📋 Invoice: ${invoiceNumber}
🚕 Trip: ${tripRoute}
📅 Date: ${invoiceData.invoiceDate}
💰 Amount Due: ${amount}
🚗 Vehicle: ${invoiceData.vehicleType}
📍 Distance: ${invoiceData.distance} km

Thank you for travelling with DarjeelingCabs!`;

  return message;
};

/**
 * Generate WhatsApp share URL
 */
export const generateWhatsAppURL = (phoneNumber: string, invoiceData: InvoiceData): string => {
  const message = generateWhatsAppMessage(invoiceData);
  const encodedMessage = encodeURIComponent(message);
  // Remove +91 prefix if exists and ensure valid format
  const cleanPhone = phoneNumber.replace(/^\+?91/, '').replace(/\D/g, '');
  return `https://wa.me/91${cleanPhone}?text=${encodedMessage}`;
};
