export interface Product {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly emoji: string;
  readonly unit: string;
  readonly description: string;
  readonly altitude: string;
  readonly growingGuide: readonly string[];
}