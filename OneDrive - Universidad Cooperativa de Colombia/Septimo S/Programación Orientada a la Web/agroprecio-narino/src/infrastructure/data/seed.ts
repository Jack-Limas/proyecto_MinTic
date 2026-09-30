import type { Market } from '@/domain/entities/Market';
import type { Product } from '@/domain/entities/Product';

export const PRODUCTS: readonly Product[] = [
  {
    id: 'potato',
    slug: 'papa',
    name: 'Papa',
    emoji: '🥔',
    unit: 'kg',
    description: 'Cultivo insignia de las zonas altas de Nariño.',
    altitude: '2.600 – 3.400 m s. n. m.',
    growingGuide: [
      'Prepara un suelo con buen drenaje y aporca al menos dos veces.',
      'Siembra semilla certificada y sana.',
      'Monitorea la gota en épocas de lluvia.',
      'Cosecha cuando el follaje se seque y almacena en un lugar fresco y oscuro.',
    ],
  },
  {
    id: 'coffee',
    slug: 'cafe',
    name: 'Café',
    emoji: '☕',
    unit: 'kg',
    description: 'Café de altura con perfil de taza reconocido.',
    altitude: '1.400 – 2.000 m s. n. m.',
    growingGuide: [
      'Elige variedades adaptadas a tu altitud.',
      'Fertiliza según el análisis de suelo.',
      'Cosecha únicamente cereza madura.',
      'Beneficia y seca hasta llegar al 10–12 % de humedad.',
    ],
  },
  {
    id: 'panela',
    slug: 'panela',
    name: 'Panela',
    emoji: '🍯',
    unit: 'kg',
    description: 'Endulzante artesanal derivado de la caña de azúcar.',
    altitude: '1.000 – 1.800 m s. n. m.',
    growingGuide: [
      'Cosecha la caña en su punto de madurez.',
      'Muele la caña el mismo día para evitar pérdidas.',
      'Limpia y clarifica los jugos antes de la evaporación.',
      'Bate, moldea y empaca con higiene cuando enfríe.',
    ],
  },
  {
    id: 'milk',
    slug: 'leche',
    name: 'Leche',
    emoji: '🥛',
    unit: 'L',
    description: 'Producción lechera de las zonas frías del departamento.',
    altitude: '2.500 – 3.100 m s. n. m.',
    growingGuide: [
      'Maneja pasturas en rotación.',
      'Ordeña con higiene y enfría la leche rápidamente.',
      'Mantén al día la vacunación y el control sanitario.',
      'Lleva registros de producción por animal.',
    ],
  },
];

export const MARKETS: readonly Market[] = [
  { id: 'pasto', name: 'Plaza El Potrerillo', city: 'Pasto', distanceKm: 0 },
  { id: 'ipiales', name: 'Plaza de mercado de Ipiales', city: 'Ipiales', distanceKm: 85 },
  { id: 'tuquerres', name: 'Plaza de mercado de Túquerres', city: 'Túquerres', distanceKm: 75 },
  { id: 'sandona', name: 'Plaza de mercado de Sandoná', city: 'Sandoná', distanceKm: 45 },
  { id: 'tumaco', name: 'Plaza de mercado de Tumaco', city: 'Tumaco', distanceKm: 280 },
];

export const BASE_PRICES: Readonly<Record<string, number>> = {
  potato: 1800,
  coffee: 16500,
  panela: 4200,
  milk: 1700,
};

export const MARKET_FACTORS: Readonly<Record<string, number>> = {
  pasto: 1,
  ipiales: 1.06,
  tuquerres: 0.95,
  sandona: 0.98,
  tumaco: 1.15,
};