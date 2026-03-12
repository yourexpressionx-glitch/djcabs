export interface InvoiceFormData {
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
