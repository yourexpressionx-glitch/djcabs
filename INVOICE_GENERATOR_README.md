# DarjeelingCabs Trip Invoice Generator

A complete invoice generation system built with Next.js and Vercel serverless functions for managing taxi trip invoices without a database.

## Features

✅ **Admin Dashboard** at `/admin/invoice`  
✅ **Professional Invoice Layout** with customizable fields  
✅ **Auto-Calculation** of charges and totals  
✅ **PDF Generation** using jsPDF  
✅ **Print Invoice** functionality  
✅ **WhatsApp Share** direct integration  
✅ **Live Invoice Preview** with form  
✅ **No Database Required** - uses client-side storage  
✅ **Vercel-Ready** - serverless functions support  

## Architecture

```
src/
├── app/admin/invoice/page.tsx       # Main admin page (layout with form + preview)
├── components/
│   ├── InvoiceForm.tsx              # Form component with all fields
│   ├── InvoicePreview.tsx           # Live preview component
│   ├── PhotoCarousel.tsx            # Existing components
│   └── ...
├── lib/
│   ├── invoiceUtils.ts              # Invoice calculations & WhatsApp
│   └── pdfGenerator.ts              # PDF generation using jsPDF
└── types/
    └── invoice.ts                   # TypeScript interfaces
```

## Usage

### 1. Access Admin Panel

Navigate to: `https://yourdomain.com/admin/invoice`

### 2. Fill Invoice Form

The form has the following sections:

#### Customer Details
- Customer Name (required)
- Phone Number (required)

#### Trip Details
- Trip Date (required)
- Trip Type: Pickup, Drop, Sightseeing, Full Day, Multi Day
- Pickup Location (required)
- Drop Location (required)

#### Vehicle & Driver
- Vehicle Type: Sedan, SUV, Innova, Tempo Traveller
- Driver Name
- Number of Passengers
- Distance (km)

#### Charges (in ₹)
- Trip Price (base fare)
- Parking Charges
- Toll Charges
- Driver Allowance
- Extra Charges
- Discount

#### Payment
- Advance Paid
- Payment Method: Cash, UPI, Bank Transfer

### 3. Generate Invoice

Click **"Generate Invoice Preview"** to:
- Validate all required fields
- Calculate totals automatically
- Display live preview on the right side
- Generate unique invoice number: `DC-{timestamp}`

### 4. Actions

**Download PDF**: 
- Downloads invoice as `DC-{timestamp}.pdf`

**Print Invoice**:
- Opens print-friendly version in new window
- Ready for thermal printer or normal printer

**Send via WhatsApp**:
- Pre-fills message with trip details
- Opens WhatsApp chat with customer
- Message format:
  ```
  Hello, here is your trip invoice from DarjeelingCabs.
  
  📋 Invoice: DC-1710338834
  🚕 Trip: Siliguri → Darjeeling
  📅 Date: 12 March 2026
  💰 Amount Due: ₹4500
  🚗 Vehicle: Sedan
  📍 Distance: 85 km
  
  Thank you for travelling with DarjeelingCabs!
  ```

## Components Details

### InvoiceForm.tsx
- Handles all input and form state management
- Real-time calculation callbacks
- Event handlers for PDF and WhatsApp actions
- Accessibility features (aria-labels, htmlFor attributes)
- Responsive grid layout

### InvoicePreview.tsx
- Displays invoice in professional format
- Shows header with company details
- Customer and trip information
- Charges breakdown table
- Final totals with balance due highlighted
- Updates in real-time as form changes

### Invoice Calculations
```typescript
Subtotal = Trip Price
Total Charges = Subtotal + Parking + Toll + Driver Allowance + Extra - Discount
Balance Due = Total Charges - Advance Paid
```

### Invoice Number Format
```
DC-{timestamp}
Example: DC-1710338834
```

Uses Unix timestamp (seconds) for unique identification.

## PDF Generation

Using **jsPDF** library for client-side PDF generation:

```typescript
generatePDFInvoice(invoiceData)   // Download PDF
printPDFInvoice(invoiceData)      // Open print dialog
```

Features:
- Professional layout with DarjeelingCabs branding
- All invoice details clearly formatted
- Table for charges breakdown
- Highlighted balance due section
- Footer with thank you message
- High-quality output for receipts

## WhatsApp Integration

Send invoices via WhatsApp without server-side processing:

```typescript
generateWhatsAppURL(phoneNumber, invoiceData)
// Returns: https://wa.me/91XXXXXXXXXX?text={encoded_message}
```

Phone number format support:
- `9876543210` ✅
- `+919876543210` ✅
- `919876543210` ✅

## Data Flow

```
User Input (Form)
    ↓
handleInputChange() - State Update
    ↓
onInvoiceGenerated() - Calculate & Validate
    ↓
generateInvoiceData() - Create Full Invoice Object
    ↓
InvoicePreview Updates / PDF Generated / WhatsApp Share
```

## Type Definitions

```typescript
interface InvoiceFormData {
  customerName: string;
  phoneNumber: string;
  pickupLocation: string;
  dropLocation: string;
  tripDate: string;
  vehicleType: 'Sedan' | 'SUV' | 'Innova' | 'Tempo Traveller';
  driverName: string;
  tripType: 'Pickup' | 'Drop' | 'Sightseeing' | 'Full Day' | 'Multi Day';
  numberOfPassengers: number;
  distance: number;
  tripPrice: number;
  parkingCharges: number;
  tollCharges: number;
  driverAllowance: number;
  extraCharges: number;
  discount: number;
  advancePaid: number;
  paymentMethod: 'Cash' | 'UPI' | 'Bank Transfer';
}

interface InvoiceData extends InvoiceFormData {
  invoiceNumber: string;
  invoiceDate: string;
  calculations: InvoiceCalculations;
}
```

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy - no configuration needed!

The application runs entirely on the client-side with no backend database requirements.

### Environment Variables
None required - this is a client-only application.

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ WhatsApp integration works

## Styling

Uses **Tailwind CSS** v4 for all styling:
- Responsive grid layout (1 column on mobile, 2 on desktop)
- Professional color scheme
- Form validation UX
- Print-optimized styles

## Security & Privacy

- ✅ No data sent to backend
- ✅ No database storage
- ✅ Client-side PDF generation
- ✅ No personal data collection
- ✅ Phone numbers only used for WhatsApp intent URL

## Customization

### Change Company Details
Edit [InvoicePreview.tsx](src/components/InvoicePreview.tsx):
```tsx
<h1 className="text-3xl font-bold text-gray-900">YourCompanyName</h1>
<p className="text-gray-600 text-sm">Your Service Description</p>
```

### Modify Invoice Number Format
Edit [invoiceUtils.ts](src/lib/invoiceUtils.ts):
```typescript
export const generateInvoiceNumber = (): string => {
  // Change format here
  return `YOUR-PREFIX-${timestamp}`;
};
```

### Add More Fields
1. Add field to [invoice.ts](src/types/invoice.ts)
2. Add input to [InvoiceForm.tsx](src/components/InvoiceForm.tsx)
3. Display in [InvoicePreview.tsx](src/components/InvoicePreview.tsx)
4. Update PDF template if needed

## Troubleshooting

### PDF Not Downloading
- Check browser popup blocker settings
- Ensure JavaScript is enabled
- Try different browser

### WhatsApp Not Opening
- Verify phone number format (10 digits for India)
- Check if WhatsApp Web is accessible from your browser
- Try opening WhatsApp directly first

### Form Not Updating Preview
- Ensure JavaScript is enabled
- Check browser console for errors
- Try refreshing the page

### Print Dialog Not Opening
- Enable popups for this site in browser settings
- Try using Ctrl+P (Cmd+P on Mac) alternatively

## Future Enhancements

- Email invoice delivery
- SMS notification
- Digital signature verification
- Recurring invoices
- Invoice history (localStorage)
- Multi-language support
- Invoice templates
- Bulk invoice generation

## License

Built for DarjeelingCabs

## Support

For issues or inquiries, contact the development team.
