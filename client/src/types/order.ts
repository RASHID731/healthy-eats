/**
 * TypeScript mirrors of the Java DTOs to keep client and server in sync.
 */

export type Address = {
  fullName: string;
  street: string;
  city: string;
  zip: string;
  country: string;
};

export type CheckoutRequest = {
  items: {
    name: string;
    priceCents: number;
    quantity: number;
  }[];
  address: Address;
};

export type Order = {
  id: number;
  paid: boolean;
  createdAt: string;
  address: Address;
  items: OrderItem[];
};

export type OrderItem = {
  name: string;
  quantity: number;
  priceCents: number;
};
