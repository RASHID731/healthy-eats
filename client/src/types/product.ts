/**
 * TypeScript mirror of the Java DTO to keep client and server in sync.
 */

export type Product = {
  id: number;
  name: string;
  priceCents: number;
  imageUrl: string;
  categoryId: number;
  unit: string;
};
