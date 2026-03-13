'use client';

import React from 'react';
import { InvoiceData } from '@/types/invoice';
import { formatCurrency } from '@/lib/invoiceUtils';

interface InvoicePreviewProps {
  invoiceData: InvoiceData | null;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoiceData }) => {
  if (!invoiceData) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg h-full flex items-center justify-center">
        <p className="text-gray-400 text-center">Fill in the form to preview invoice</p>
      </div>
    );
  }

  const tripTotal = invoiceData.dailyItinerary.reduce((sum, day) => sum + (day.rate || 0), 0);

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg h-full overflow-auto">
      {/* Header with Logo */}
      <div className="text-center mb-4 pb-3 border-b-2 border-gray-300">
        <div className="flex justify-center mb-2">
          <img 
            src="/images/logo.png" 
            alt="DarjeelingCabs Logo" 
            className="h-12 w-auto"
          />
        </div>
        <h1 className="text-xl font-bold text-black">DARJEELING CABS</h1>
        <p className="text-black text-xs">Dawa Lama Dukpa</p>
        <div className="mt-1">
          <p className="text-black font-bold text-sm">TAX INVOICE</p>
        </div>
      </div>

      {/* Company Details */}
      <div className="mb-4 pb-3 border-b border-gray-300 text-xs">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-black">
            <p className="font-semibold">Darjeeling Cabs</p>
            <p>Jorebunglow near the forest office</p>
            <p>Darjeeling, West Bengal - 734102</p>
          </div>
          <div className="text-black text-right">
            <p>M: +91 7407616130 (WhatsApp)</p>
            <p>M: +91 9382480285 (Calling)</p>
            <p>Phone: 0353-3559491</p>
            <p>Email: darjeelingcabs.com@gmail.com</p>
            <p>Website: www.darjeelingcabs.com</p>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="flex justify-between mb-4 text-xs">
        <div>
          <p className="text-black font-semibold">Invoice No: {invoiceData.invoiceNumber}</p>
          <p className="text-black">Date: {invoiceData.invoiceDate}</p>
        </div>
        <div className="text-right">
          <p className="text-black font-semibold">Trip Date: {invoiceData.tripDate}</p>
        </div>
      </div>

      {/* Customer Details Section */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h3 className="font-bold text-xs text-black mb-2 uppercase">Bill To:</h3>
        <p className="text-black font-semibold">{invoiceData.customerName}</p>
        {invoiceData.customerAddress && <p className="text-black text-xs">{invoiceData.customerAddress}</p>}
        {invoiceData.customerCity && <p className="text-black text-xs">{invoiceData.customerCity}</p>}
        <p className="text-black text-xs">📱 {invoiceData.phoneNumber}</p>
        <p className="text-black text-xs mt-1">Passengers: {invoiceData.numberOfPassengers}</p>
        {invoiceData.driverName && <p className="text-black text-xs">Driver: {invoiceData.driverName}</p>}
      </div>

      {/* Daily Itinerary Table */}
      <div className="mb-6">
        <h3 className="font-bold text-xs text-black mb-2 uppercase">Itinerary</h3>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 p-2 text-left text-black font-bold">Day</th>
              <th className="border border-gray-400 p-2 text-left text-black font-bold">Destination</th>
              <th className="border border-gray-400 p-2 text-center text-black font-bold">Days</th>
              <th className="border border-gray-400 p-2 text-left text-black font-bold">Vehicle</th>
              <th className="border border-gray-400 p-2 text-left text-black font-bold">Vehicle #</th>
              <th className="border border-gray-400 p-2 text-right text-black font-bold">Rate (₹)</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.dailyItinerary.map((day, idx) => (
              <tr key={idx} className="border border-gray-300">
                <td className="border border-gray-300 p-2 text-black text-center font-semibold">{day.day}</td>
                <td className="border border-gray-300 p-2 text-black">{day.destination}</td>
                <td className="border border-gray-300 p-2 text-black text-center">{day.numberOfDays}</td>
                <td className="border border-gray-300 p-2 text-black">{day.vehicleType}</td>
                <td className="border border-gray-300 p-2 text-black">{day.vehicleNumber}</td>
                <td className="border border-gray-300 p-2 text-black text-right font-semibold">{formatCurrency(day.rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Other Charges */}
      <div className="mb-6">
        <h3 className="font-bold text-xs text-black mb-2 uppercase">Additional Charges</h3>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-black">Trip Charges</span>
            <span className="text-black font-semibold">{formatCurrency(tripTotal)}</span>
          </div>
          {invoiceData.parkingCharges > 0 && (
            <div className="flex justify-between">
              <span className="text-black">Parking</span>
              <span className="text-black font-semibold">{formatCurrency(invoiceData.parkingCharges)}</span>
            </div>
          )}
          {invoiceData.tollCharges > 0 && (
            <div className="flex justify-between">
              <span className="text-black">Toll</span>
              <span className="text-black font-semibold">{formatCurrency(invoiceData.tollCharges)}</span>
            </div>
          )}
          {invoiceData.driverAllowance > 0 && (
            <div className="flex justify-between">
              <span className="text-black">Driver Allowance</span>
              <span className="text-black font-semibold">{formatCurrency(invoiceData.driverAllowance)}</span>
            </div>
          )}
          {invoiceData.extraCharges > 0 && (
            <div className="flex justify-between">
              <span className="text-black">Extra Charges</span>
              <span className="text-black font-semibold">{formatCurrency(invoiceData.extraCharges)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Totals */}
      <div className="border-t-2 border-gray-400 pt-3 space-y-2">
        <div className="flex justify-between text-sm font-semibold text-black bg-gray-100 p-2">
          <span>Subtotal</span>
          <span>{formatCurrency(invoiceData.calculations.subtotal)}</span>
        </div>
        {invoiceData.discount > 0 && (
          <div className="flex justify-between text-sm text-red-600 font-semibold p-2">
            <span>Discount</span>
            <span>-{formatCurrency(invoiceData.discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm font-bold text-black bg-gray-100 p-2">
          <span>Total Amount</span>
          <span>{formatCurrency(invoiceData.calculations.totalCharges)}</span>
        </div>
        {invoiceData.advancePaid > 0 && (
          <div className="flex justify-between text-sm text-blue-600 font-semibold p-2">
            <span>Advance Paid</span>
            <span>-{formatCurrency(invoiceData.advancePaid)}</span>
          </div>
        )}
        <div className="flex justify-between bg-green-100 p-3 rounded font-bold text-base border-2 border-green-400">
          <span className="text-black">Balance Due</span>
          <span className="text-green-700">
            {formatCurrency(invoiceData.calculations.balanceDue)}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-gray-300 mt-6 pt-4 text-center text-xs">
        <p className="text-black font-medium">
          Thank you for travelling with Darjeeling Cabs!
        </p>
        <p className="text-gray-600 text-xs mt-1">Payment Method: {invoiceData.paymentMethod}</p>
      </div>
    </div>
  );
};
