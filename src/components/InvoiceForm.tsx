'use client';

import React, { useState, useCallback } from 'react';
import { InvoiceFormData, InvoiceData, DailyItinerary } from '@/types/invoice';
import { generateInvoiceData } from '@/lib/invoiceUtils';
import { generatePDFInvoice, printPDFInvoice } from '@/lib/pdfGenerator';
import { generateWhatsAppURL } from '@/lib/invoiceUtils';

interface InvoiceFormProps {
  onInvoiceGenerated: (invoiceData: InvoiceData) => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ onInvoiceGenerated }) => {
  const [formData, setFormData] = useState<InvoiceFormData>({
    customerName: '',
    customerAddress: '',
    customerCity: '',
    phoneNumber: '',
    tripDate: '',
    driverName: '',
    numberOfPassengers: 1,
    dailyItinerary: [
      { day: 1, destination: '', numberOfDays: 1, vehicleType: 'Sedan', vehicleNumber: '', rate: 0 }
    ],
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
          ['numberOfPassengers', 'parkingCharges', 'tollCharges', 'driverAllowance', 'extraCharges', 'discount', 'advancePaid'].includes(name)
            ? parseFloat(value) || 0
            : value,
      }));
    },
    []
  );

  const handleDayChange = useCallback(
    (dayIndex: number, field: keyof DailyItinerary, value: any) => {
      setFormData((prev) => {
        const newItinerary = [...prev.dailyItinerary];
        if (field === 'day' || field === 'numberOfDays' || field === 'rate') {
          newItinerary[dayIndex] = { ...newItinerary[dayIndex], [field]: parseFloat(value) || 0 };
        } else {
          newItinerary[dayIndex] = { ...newItinerary[dayIndex], [field]: value };
        }
        return { ...prev, dailyItinerary: newItinerary };
      });
    },
    []
  );

  const handleAddDay = useCallback(() => {
    setFormData((prev) => {
      const nextDay = prev.dailyItinerary.length + 1;
      return {
        ...prev,
        dailyItinerary: [
          ...prev.dailyItinerary,
          { day: nextDay, destination: '', numberOfDays: 1, vehicleType: 'Sedan', vehicleNumber: '', rate: 0 }
        ]
      };
    });
  }, []);

  const handleRemoveDay = useCallback((dayIndex: number) => {
    setFormData((prev) => {
      const newItinerary = prev.dailyItinerary
        .filter((_, idx) => idx !== dayIndex)
        .map((day, idx) => ({ ...day, day: idx + 1 }));
      return { ...prev, dailyItinerary: newItinerary };
    });
  }, []);

  const handleGeneratePreview = useCallback(() => {
    const requiredFields = formData.customerName && formData.phoneNumber && formData.tripDate && 
                          formData.dailyItinerary.every(d => d.destination && d.rate > 0);
    if (!requiredFields) {
      alert('Please fill in all required fields (name, phone, date, and at least one destination with rate)');
      return;
    }

    const invoiceData = generateInvoiceData(formData);
    onInvoiceGenerated(invoiceData);
  }, [formData, onInvoiceGenerated]);

  const handleDownloadPDF = useCallback(async () => {
    const invoiceData = generateInvoiceData(formData);
    await generatePDFInvoice(invoiceData);
  }, [formData]);

  const handlePrintPDF = useCallback(async () => {
    const invoiceData = generateInvoiceData(formData);
    await printPDFInvoice(invoiceData);
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
    <form className="space-y-6 max-w-3xl">
      {/* Section: Customer Details */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Customer Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
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
            <label htmlFor="customerAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              id="customerAddress"
              type="text"
              name="customerAddress"
              value={formData.customerAddress}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Street address"
              aria-label="Customer Address"
            />
          </div>
          <div>
            <label htmlFor="customerCity" className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              id="customerCity"
              type="text"
              name="customerCity"
              value={formData.customerCity}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="City"
              aria-label="Customer City"
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
        </div>
      </div>

      {/* Section: Daily Itinerary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Daily Itinerary</h3>
          <button
            type="button"
            onClick={handleAddDay}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded transition"
          >
            + Add Day
          </button>
        </div>
        
        {formData.dailyItinerary.map((day, idx) => (
          <div key={idx} className="mb-4 p-3 border border-gray-300 rounded-lg bg-white">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                <input
                  type="number"
                  value={day.day}
                  onChange={(e) => handleDayChange(idx, 'day', e.target.value)}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  aria-label={`Day ${idx + 1}`}
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={day.destination}
                  onChange={(e) => handleDayChange(idx, 'destination', e.target.value)}
                  placeholder="e.g., Darjeeling"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  aria-label={`Destination Day ${idx + 1}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. of Days</label>
                <input
                  type="number"
                  value={day.numberOfDays}
                  onChange={(e) => handleDayChange(idx, 'numberOfDays', e.target.value)}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  aria-label={`Number of Days ${idx + 1}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                <select
                  value={day.vehicleType}
                  onChange={(e) => handleDayChange(idx, 'vehicleType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                  aria-label={`Vehicle Type Day ${idx + 1}`}
                >
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Innova">Innova</option>
                  <option value="Tempo Traveller">Tempo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle #</label>
                <input
                  type="text"
                  value={day.vehicleNumber || ''}
                  onChange={(e) => handleDayChange(idx, 'vehicleNumber', e.target.value)}
                  placeholder="e.g., DL-01-AB-1234"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  aria-label={`Vehicle Number Day ${idx + 1}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rate (₹) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  value={day.rate}
                  onChange={(e) => handleDayChange(idx, 'rate', e.target.value)}
                  min="0"
                  step="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  aria-label={`Rate Day ${idx + 1}`}
                />
              </div>
              <div>
                {formData.dailyItinerary.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveDay(idx)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition h-10 w-full"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Section: Other Charges */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Other Charges (₹)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
      </div>

      {/* Section: Payment */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Payment</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">Discount (₹)</label>
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
          <div>
            <label htmlFor="advancePaid" className="block text-sm font-medium text-gray-700 mb-1">Advance Paid (₹)</label>
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
