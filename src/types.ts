export enum CurrencyEnum {
  USD = 'USD',
  CAD = 'CAD',
  EUR = 'EUR',
  GBP = 'GBP',
}

export type Product = {
  id: number;
  name: string;
  price: number;
}

export type ViewCounts = {
  [productId: string]: number
}
