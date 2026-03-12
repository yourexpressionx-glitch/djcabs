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

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg h-full overflow-auto">
      {/* Header with Logo */}
      <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
        <div className="flex justify-center mb-4">
          <img 
            src="/images/logo.png" 
            alt="DarjeelingCabs Logo" 
            className="h-16 w-auto"
          />
        </div>
        <h1 className="text-3xl font-bold text-black">DarjeelingCabs</h1>
        <p className="text-black text-sm font-medium">Taxi & Tour Services</p>
        <p className="text-black text-xs">Darjeeling • Sikkim • Bhutan • Nepal</p>
      </div>

      {/* Invoice Details */}
      <div className="flex justify-between mb-8">
        <div></div>
        <div className="text-right text-sm">
          <p className="font-bold text-lg text-black">
            Invoice #{invoiceData.invoiceNumber}
          </p>
          <p className="text-black">Issue Date: {invoiceData.invoiceDate}</p>
          <p className="text-black">Trip Date: {invoiceData.tripDate}</p>
        </div>
      </div>

      {/* Customer Details */}
      <div className="mb-8">
        <h2 className="font-bold text-sm text-black mb-3">CUSTOMER DETAILS</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-black font-semibold">Name</p>
            <p className="font-semibold text-black">{invoiceData.customerName}</p>
          </div>
          <div>
            <p className="text-black font-semibold">Phone</p>
            <p className="font-semibold text-black">{invoiceData.phoneNumber}</p>
          </div>
        </div>
      </div>

      {/* Trip Details */}
      <div className="mb-8 pb-6 border-b border-gray-200">
        <h2 className="font-bold text-sm text-black mb-3">TRIP DETAILS</h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-black font-semibold">Trip Type:</span>
            <span className="font-semibold text-black">{invoiceData.tripType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-black font-semibold">Vehicle:</span>
            <span className="font-semibold text-black">{invoiceData.vehicleType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-black font-semibold">Driver:</span>
            <span className="font-semibold text-black">{invoiceData.driverName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-black font-semibold">Passengers:</span>
            <span className="font-semibold text-black">{invoiceData.numberOfPassengers}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-black font-semibold">Distance:</span>
            <span className="font-semibold text-black">{invoiceData.distance} km</span>
          </div>
          <div className="flex justify-between">
            <span className="text-black font-semibold">Payment:</span>
            <span className="font-semibold text-black">{invoiceData.paymentMethod}</span>
          </div>
          <div className="col-span-2 flex justify-between mt-2">
            <span className="text-black font-semibold">From:</span>
            <span className="font-semibold text-right text-black">{invoiceData.pickupLocation}</span>
          </div>
          <div className="col-span-2 flex justify-between">
            <span className="text-black font-semibold">To:</span>
            <span className="font-semibold text-right text-black">{invoiceData.dropLocation}</span>
          </div>
        </div>
      </div>

      {/* Charges */}
      <div className="mb-8">
        <h2 className="font-bold text-sm text-black mb-3">CHARGES</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-black">Base Fare</span>
            <span className="font-semibold text-black">{formatCurrency(invoiceData.tripPrice)}</span>
          </div>
          {invoiceData.tollCharges > 0 && (
            <div className="flex justify-between">
              <span className="text-black">Toll Charges</span>
              <span className="font-semibold text-black">{formatCurrency(invoiceData.tollCharges)}</span>
            </div>
          )}
          {invoiceData.parkingCharges > 0 && (
            <div className="flex justify-between">
              <span className="text-black">Parking Charges</span>
              <span className="font-semibold text-black">{formatCurrency(invoiceData.parkingCharges)}</span>
            </div>
          )}
          {invoiceData.driverAllowance > 0 && (
            <div className="flex justify-between">
              <span className="text-black">Driver Allowance</span>
              <span className="font-semibold text-black">{formatCurrency(invoiceData.driverAllowance)}</span>
            </div>
          )}
          {invoiceData.extraCharges > 0 && (
            <div className="flex justify-between">
              <span className="text-black">Extra Charges</span>
              <span className="font-semibold text-black">{formatCurrency(invoiceData.extraCharges)}</span>
            </div>
          )}
          {invoiceData.discount > 0 && (
            <div className="flex justify-between text-red-600">
              <span>Discount</span>
              <span className="font-semibold">-{formatCurrency(invoiceData.discount)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Totals */}
      <div className="border-t-2 border-gray-300 pt-4 space-y-2">
        <div className="flex justify-between text-sm font-semibold text-black">
          <span>Subtotal (All Charges)</span>
          <span>{formatCurrency(invoiceData.calculations.subtotal)}</span>
        </div>
        {invoiceData.discount > 0 && (
          <div className="flex justify-between text-sm text-red-600 font-semibold">
            <span>Discount</span>
            <span>-{formatCurrency(invoiceData.discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm font-bold text-black border-t border-gray-300 pt-2">
          <span>Total Amount</span>
          <span>{formatCurrency(invoiceData.calculations.totalCharges)}</span>
        </div>
        {invoiceData.advancePaid > 0 && (
          <div className="flex justify-between text-sm text-black">
            <span>Advance Paid</span>
            <span className="text-blue-600 font-semibold">-{formatCurrency(invoiceData.advancePaid)}</span>
          </div>
        )}
        <div className="flex justify-between bg-green-50 p-3 rounded font-bold text-lg border-2 border-green-200">
          <span className="text-black">Balance Due</span>
          <span className="text-green-700">
            {formatCurrency(invoiceData.calculations.balanceDue)}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-gray-300 mt-6 pt-4 text-center">
        <p className="text-xs text-black font-medium">
          Thank you for travelling with DarjeelingCabs!
        </p>
      </div>
    </div>
  );
};
