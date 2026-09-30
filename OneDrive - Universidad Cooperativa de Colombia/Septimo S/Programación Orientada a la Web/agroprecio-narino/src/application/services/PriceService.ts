import type { Market } from '@/domain/entities/Market';
import type { PriceQuote } from '@/domain/entities/PriceQuote';
import type { Product } from '@/domain/entities/Product';
import type { MarketRepository, PriceRepository, ProductRepository } from '@/domain/repositories';

export interface QuoteFilter {
  readonly city?: string;
  readonly productSlug?: string;
}

export interface BulletinEntry {
  readonly product: Product;
  readonly best: PriceQuote;
  readonly lowest: PriceQuote;
  readonly average: number;
}

export class PriceService {
  constructor(
    private readonly products: ProductRepository,
    private readonly markets: MarketRepository,
    private readonly prices: PriceRepository,
  ) {}

  getCatalog(): Promise<Product[]> {
    return this.products.findAll();
  }

  getProductBySlug(slug: string): Promise<Product | null> {
    return this.products.findBySlug(slug);
  }

  async getSlugs(): Promise<string[]> {
    const catalog = await this.products.findAll();
    return catalog.map((product) => product.slug);
  }

  getMarkets(): Promise<Market[]> {
    return this.markets.findAll();
  }

  async getQuotes(filter: QuoteFilter = {}): Promise<PriceQuote[]> {
    const [products, markets, records] = await Promise.all([
      this.products.findAll(),
      this.markets.findAll(),
      this.prices.findAll(),
    ]);
    const productById = new Map(products.map((product) => [product.id, product]));
    const marketById = new Map(markets.map((market) => [market.id, market]));
    const city = filter.city?.toLowerCase();

    return records
      .flatMap((record): PriceQuote[] => {
        const product = productById.get(record.productId);
        const market = marketById.get(record.marketId);
        if (!product || !market) return [];
        return [
          {
            productSlug: product.slug,
            productName: product.name,
            emoji: product.emoji,
            unit: product.unit,
            marketName: market.name,
            city: market.city,
            distanceKm: market.distanceKm,
            pricePerUnit: record.pricePerUnit,
            observedAt: record.observedAt,
          },
        ];
      })
      .filter(
        (quote) =>
          (!city || quote.city.toLowerCase() === city) &&
          (!filter.productSlug || quote.productSlug === filter.productSlug),
      )
      .sort(
        (a, b) => a.productName.localeCompare(b.productName) || b.pricePerUnit - a.pricePerUnit,
      );
  }

  async getBulletin(): Promise<BulletinEntry[]> {
    const [catalog, quotes] = await Promise.all([this.products.findAll(), this.getQuotes()]);

    return catalog.flatMap((product): BulletinEntry[] => {
      const list = quotes.filter((quote) => quote.productSlug === product.slug);
      if (list.length === 0) return [];
      const sorted = [...list].sort((a, b) => b.pricePerUnit - a.pricePerUnit);
      const total = list.reduce((sum, quote) => sum + quote.pricePerUnit, 0);
      return [
        {
          product,
          best: sorted[0],
          lowest: sorted[sorted.length - 1],
          average: Math.round(total / list.length),
        },
      ];
    });
  }
}