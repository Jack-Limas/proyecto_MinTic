export interface PriceQuote {
  readonly productSlug: string;
  readonly productName: string;
  readonly emoji: string;
  readonly unit: string;
  readonly marketName: string;
  readonly city: string;
  readonly distanceKm: number;
  readonly pricePerUnit: number;
  readonly observedAt: string;
}