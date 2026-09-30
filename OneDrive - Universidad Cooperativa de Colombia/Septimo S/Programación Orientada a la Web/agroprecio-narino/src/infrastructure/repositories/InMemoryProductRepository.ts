import type { Product } from '@/domain/entities/Product';
import type { ProductRepository } from '@/domain/repositories';
import { PRODUCTS } from '@/infrastructure/data/seed';

export class InMemoryProductRepository implements ProductRepository {
  async findAll(): Promise<Product[]> {
    return [...PRODUCTS];
  }

  async findBySlug(slug: string): Promise<Product | null> {
    return PRODUCTS.find((product) => product.slug === slug) ?? null;
  }
}