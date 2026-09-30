import type { Market } from '@/domain/entities/Market';
import type { MarketRepository } from '@/domain/repositories';
import { MARKETS } from '@/infrastructure/data/seed';

export class InMemoryMarketRepository implements MarketRepository {
  async findAll(): Promise<Market[]> {
    return [...MARKETS];
  }
}