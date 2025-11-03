// data/mockPaymentMethods.ts

export interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit' | 'upi' | 'wallet';
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  bankName: string;
  isDefault?: boolean;
}

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'debit',
    cardNumber: 'ICICI ends with 5678',
    cardHolder: 'NITHIN ',
    expiryDate: '08/25',
    bankName: 'ICICI',
    isDefault: true,
  },
  {
    id: '2',
    type: 'credit',
    cardNumber: 'HDFC ends with 2341',
    cardHolder: 'NITHIN ',
    expiryDate: '12/26',
    bankName: 'HDFC Bank',
    isDefault: false,
  },
  {
    id: '3',
    type: 'upi',
    cardNumber: 'nithin.@okaxis',
    cardHolder: 'NITHIN ',
    expiryDate: 'No expiry',
    bankName: 'Google Pay',
    isDefault: false,
  },
  {
    id: '4',
    type: 'wallet',
    cardNumber: '****1234',
    cardHolder: 'NITHIN ',
    expiryDate: 'No expiry',
    bankName: 'Wallet Balance',
    isDefault: false,
  },
];

// Variations
export const emptyPaymentMethods: PaymentMethod[] = [];

export const singlePaymentMethod: PaymentMethod[] = [
  {
    id: '1',
    type: 'debit',
    cardNumber: 'ICICI ends with 5678',
    cardHolder: 'NITHIN ',
    expiryDate: '08/25',
    bankName: 'ICICI',
    isDefault: true,
  },
];
