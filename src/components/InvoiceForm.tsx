'use client';

import React, { useState, useCallback } from 'react';
import { InvoiceFormData, InvoiceData } from '@/types/invoice';
import { generateInvoiceData } from '@/lib/invoiceUtils';
import { generatePDFInvoice, printPDFInvoice } from '@/lib/pdfGenerator';
import { generateWhatsAppURL } from '@/lib/invoiceUtils';

interface InvoiceFormProps {
  onInvoiceGenerated: (invoiceData: InvoiceData) => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ onInvoiceGenerated }) => {
  const [formData, setFormData] = useState<InvoiceFormData>({
    customerName: '',
    phoneNumber: '',
    pickupLocation: '',
    dropLocation: '',
    tripDate: '',
    vehicleType: 'Sedan',
    driverName: '',
    tripType: 'Pickup',
    numberOfPassengers: 1,
    distance: 0,
    tripPrice: 0,
    parkingCharges: 0,
    tollCharges: 0,
    driverAllowance: 0,
    extraCharges: 0,
    discount: 0,
    advancePaid: 0,
    paymentMethod: 'Cash',
  });

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]:
          ['numberOfPassengers', 'distance', 'tripPrice', 'parkingCharges', 'tollCharges', 'driverAllowance', 'extraCharges', 'discount', 'advancePaid'].includes(name)
            ? parseFloat(value) || 0
            : value,
      }));
    },
    []
  );

  const handleGeneratePreview = useCallback(() => {
    // Validate required fields
    if (!formData.customerName || !formData.phoneNumber || !formData.pickupLocation || !formData.dropLocation || !formData.tripDate) {
      alert('Please fill in all required fields');
      return;
    }

    const invoiceData = generateInvoiceData(formData);
    onInvoiceGenerated(invoiceData);
  }, [formData, onInvoiceGenerated]);

  const handleDownloadPDF = useCallback(() => {
    const invoiceData = generateInvoiceData(formData);
    generatePDFInvoice(invoiceData);
  }, [formData]);

  const handlePrintPDF = useCallback(() => {
    const invoiceData = generateInvoiceData(formData);
    printPDFInvoice(invoiceData);
  }, [formData]);

  const handleWhatsAppShare = useCallback(() => {
    if (!formData.phoneNumber) {
      alert('Please enter phone number');
      return;
    }
    const invoiceData = generateInvoiceData(formData);
    const whatsappURL = generateWhatsAppURL(formData.phoneNumber, invoiceData);
    window.open(whatsappURL, '_blank');
  }, [formData]);

  return (
    <form className="space-y-6 max-w-2xl">
      {/* Section: Customer Details */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Customer Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name <span className="text-red-500">*</span>
            </label>
            <input
              id="customerName"
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Enter customer name"
              aria-label="Customer Name"
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="phoneNumber"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="10 digit mobile number"
              aria-label="Phone Number"
            />
          </div>
        </div>
      </div>

      {/* Section: Trip Details */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Trip Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tripDate" className="block text-sm font-medium text-gray-700 mb-1">
              Trip Date <span className="text-red-500">*</span>
            </label>
            <input
              id="tripDate"
              type="date"
              name="tripDate"
              value={formData.tripDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              aria-label="Trip Date"
            />
          </div>
          <div>
            <label htmlFor="tripType" className="block text-sm font-medium text-gray-700 mb-1">Trip Type</label>
            <select
              id="tripType"
              name="tripType"
              value={formData.tripType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              aria-label="Trip Type"
            >
              <option value="Pickup">Pickup</option>
              <option value="Drop">Drop</option>
              <option value="Sightseeing">Sightseeing</option>
              <option value="Full Day">Full Day</option>
              <option value="Multi Day">Multi Day</option>
            </select>
          </div>
          <div>
            <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-1">
              Pickup Location <span className="text-red-500">*</span>
            </label>
            <input
              id="pickupLocation"
              type="text"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="e.g., Siliguri"
              aria-label="Pickup Location"
            />
          </div>
          <div>
            <label htmlFor="dropLocation" className="block text-sm font-medium text-gray-700 mb-1">
              Drop Location <span className="text-red-500">*</span>
            </label>
            <input
              id="dropLocation"
              type="text"
              name="dropLocation"
              value={formData.dropLocation}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="e.g., Darjeeling"
              aria-label="Drop Location"
            />
          </div>
        </div>
      </div>

      {/* Section: Vehicle & Driver */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Vehicle & Driver</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
            <select
              id="vehicleType"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              aria-label="Vehicle Type"
            >
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Innova">Innova</option>
              <option value="Tempo Traveller">Tempo Traveller</option>
            </select>
          </div>
          <div>
            <label htmlFor="driverName" className="block text-sm font-medium text-gray-700 mb-1">Driver Name</label>
            <input
              id="driverName"
              type="text"
              name="driverName"
              value={formData.driverName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Enter driver name"
              aria-label="Driver Name"
            />
          </div>
          <div>
            <label htmlFor="numberOfPassengers" className="block text-sm font-medium text-gray-700 mb-1">Number of Passengers</label>
            <input
              id="numberOfPassengers"
              type="number"
              name="numberOfPassengers"
              value={formData.numberOfPassengers}
              onChange={handleInputChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              aria-label="Number of Passengers"
            />
          </div>
          <div>
            <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">Distance (km)</label>
            <input
              id="distance"
              type="number"
              name="distance"
              value={formData.distance}
              onChange={handleInputChange}
              min="0"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              aria-label="Distance"
            />
          </div>
        </div>
      </div>

      {/* Section: Charges */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Charges (₹)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tripPrice" className="block text-sm font-medium text-gray-700 mb-1">Trip Price</label>
            <input
              id="tripPrice"
              type="number"
              name="tripPrice"
              value={formData.tripPrice}
              onChange={handleInputChange}
              min="0"
              step="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              aria-label="Trip Price"
            />
          </div>
          <div>
            <label htmlFor="parkingCharges" className="block text-sm font-medium text-gray-700 mb-1">Parking Charges</label>
            <input
              id="parkingCharges"
              type="number"
              name="parkingCharges"
              value={formData.parkingCharges}
              onChange={handleInputChange}
              min="0"
              step="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              aria-label="Parking Charges"
            />
          </div>
          <div>
            <label htmlFor="tollCharges" className="block text-sm font-medium text-gray-700 mb-1">Toll Charges</label>
            <input
              id="tollCharges"
              type="number"
              name="tollCharges"
              value={formData.tollCharges}
              onChange={handleInputChange}
              min="0"
              step="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              aria-label="Toll Charges"
            />
          </div>
          <div>
            <label htmlFor="driverAllowance" className="block text-sm font-medium text-gray-700 mb-1">Driver Allowance</label>
            <input
              id="driverAllowance"
              type="number"
              name="driverAllowance"
              value={formData.driverAllowance}
              onChange={handleInputChange}
              min="0"
              step="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              aria-label="Driver Allowance"
            />
          </div>
          <div>
            <label htmlFor="extraCharges" className="block text-sm font-medium text-gray-700 mb-1">Extra Charges</label>
            <input
              id="extraCharges"
              type="number"
              name="extraCharges"
              value={formData.extraCharges}
              onChange={handleInputChange}
              min="0"
              step="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              aria-label="Extra Charges"
            />
          </div>
          <div>
            <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
            <input
              id="discount"
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleInputChange}
              min="0"
              step="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              aria-label="Discount"
            />
          </div>
        </div>
      </div>

      {/* Section: Payment */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Payment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="advancePaid" className="block text-sm font-medium text-gray-700 mb-1">Advance Paid</label>
            <input
              id="advancePaid"
              type="number"
              name="advancePaid"
              value={formData.advancePaid}
              onChange={handleInputChange}
              min="0"
              step="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              aria-label="Advance Paid"
            />
          </div>
          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              aria-label="Payment Method"
            >
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 pt-6">
        <button
          type="button"
          onClick={handleGeneratePreview}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition"
        >
          Generate Invoice Preview
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            📥 Download PDF
          </button>
          <button
            type="button"
            onClick={handlePrintPDF}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            🖨️ Print Invoice
          </button>
        </div>
        <button
          type="button"
          onClick={handleWhatsAppShare}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition"
        >
          💬 Send via WhatsApp
        </button>
      </div>
    </form>
  );
};
