import type { PriceRecord } from '@/domain/entities/PriceRecord';
import type { PriceRepository } from '@/domain/repositories';
import { BASE_PRICES, MARKET_FACTORS, MARKETS, PRODUCTS } from '@/infrastructure/data/seed';

const BUCKET_MS = 30_000;

function pseudoRandom(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 1000) / 1000;
}

/**
 * Simulates a live price feed: prices are stable inside a 30 second window
 * and change deterministically when the window changes.
 */
export class InMemoryPriceRepository implements PriceRepository {
  constructor(private readonly now: () => number = Date.now) {}

  async findAll(): Promise<PriceRecord[]> {
    const timestamp = this.now();
    const bucket = Math.floor(timestamp / BUCKET_MS);
    const observedAt = new Date(timestamp).toISOString();

    return PRODUCTS.flatMap((product) =>
      MARKETS.map((market) => {
        const base = BASE_PRICES[product.id] * MARKET_FACTORS[market.id];
        const variation = 0.9 + pseudoRandom(`${product.id}:${market.id}:${bucket}`) * 0.2;
        return {
          productId: product.id,
          marketId: market.id,
          pricePerUnit: Math.round((base * variation) / 10) * 10,
          observedAt,
        };
      }),
    );
  }
}