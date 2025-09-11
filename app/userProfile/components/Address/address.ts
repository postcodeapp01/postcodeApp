export type Address = {
  id: string;
  name: string;
  label: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phone?: string;
  lat?: number;
  lng?: number;
  // frontend-friendly: boolean. Map backend numeric flags to boolean at fetch-time.
  isDefault?: boolean;
};
export type address = {
  id: string;
  name: string;
  label: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phone?: string;
  lat?: number;
  lng?: number;
  // frontend-friendly: boolean. Map backend numeric flags to boolean at fetch-time.
  isDefault?: boolean;
};
