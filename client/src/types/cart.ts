/**
 * TypeScript mirrors of the Java DTOs to keep client and server in sync.
 */

export type CartItemDTO = {
  productId: number;
  name: string;
  imageUrl: string;
  unitPriceCents: number;
  quantity: number;
  lineTotalCents: number;
};

export type CartDTO = {
  items: CartItemDTO[];
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
};
