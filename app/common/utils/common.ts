import { addressProps } from "../../address/AddressList";

export const concatAddress = (address: addressProps): string => {
    const {
        houseNumber,
        addressLine1,
        addressLine2,
        city,
        pincode,
        state
      } = address;
    const parts = [houseNumber, addressLine1, addressLine2, city, state].filter(Boolean);
    const addressLine = parts.join(', ');
    const pin = pincode ? ` - ${pincode}` : '';

    return `${addressLine}${pin}`;
}