export interface PriceRecord {
  readonly productId: string;
  readonly marketId: string;
  readonly pricePerUnit: number;
  readonly observedAt: string;
}