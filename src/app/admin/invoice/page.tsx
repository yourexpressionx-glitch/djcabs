'use client';

import React, { useState } from 'react';
import { InvoiceForm } from '@/components/InvoiceForm';
import { InvoicePreview } from '@/components/InvoicePreview';
import { InvoiceData } from '@/types/invoice';

export default function AdminInvoicePage() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);

  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">DarjeelingCabs Admin Panel</h1>
          <p className="text-gray-600">Generate and manage trip invoices</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Form */}
          <div className="bg-white p-8 rounded-lg shadow-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Invoice Generator</h2>
            <InvoiceForm onInvoiceGenerated={setInvoiceData} />
          </div>

          {/* Right Side - Preview */}
          <div className="max-h-[90vh]">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Invoice Preview</h2>
            <InvoicePreview invoiceData={invoiceData} />
          </div>
        </div>
      </div>
    </main>
  );
}
