export interface DailyItinerary {
  day: number;
  destination: string;
  numberOfDays: number;
  vehicleType: 'Sedan' | 'SUV' | 'Innova' | 'Tempo Traveller';
  rate: number;
}

export interface InvoiceFormData {
  customerName: string;
  customerAddress: string;
  customerCity: string;
  phoneNumber: string;
  tripDate: string;
  driverName: string;
  numberOfPassengers: number;
  dailyItinerary: DailyItinerary[];
  parkingCharges: number;
  tollCharges: number;
  driverAllowance: number;
  extraCharges: number;
  discount: number;
  advancePaid: number;
  paymentMethod: 'Cash' | 'UPI' | 'Bank Transfer';
}

export interface InvoiceCalculations {
  subtotal: number;
  totalCharges: number;
  balanceDue: number;
}

export interface InvoiceData extends InvoiceFormData {
  invoiceNumber: string;
  invoiceDate: string;
  calculations: InvoiceCalculations;
}
