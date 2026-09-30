import { PriceService } from '@/application/services/PriceService';
import { InMemoryMarketRepository } from '@/infrastructure/repositories/InMemoryMarketRepository';
import { InMemoryPriceRepository } from '@/infrastructure/repositories/InMemoryPriceRepository';
import { InMemoryProductRepository } from '@/infrastructure/repositories/InMemoryProductRepository';

export const priceService = new PriceService(
  new InMemoryProductRepository(),
  new InMemoryMarketRepository(),
  new InMemoryPriceRepository(),
);