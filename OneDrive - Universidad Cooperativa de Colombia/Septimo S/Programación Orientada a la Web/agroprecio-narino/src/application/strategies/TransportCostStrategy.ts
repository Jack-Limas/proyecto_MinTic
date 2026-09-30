export type TransportKind = 'per-km' | 'per-unit' | 'flat';

export interface TransportCostStrategy {
  calculate(distanceKm: number, quantity: number): number;
}

class PerKmCost implements TransportCostStrategy {
  constructor(private readonly copPerKm: number) {}

  calculate(distanceKm: number): number {
    return distanceKm * this.copPerKm;
  }
}

class PerUnitCost implements TransportCostStrategy {
  constructor(private readonly copPerUnit: number) {}

  calculate(distanceKm: number, quantity: number): number {
    return distanceKm > 0 ? quantity * this.copPerUnit : 0;
  }
}

class FlatFeeCost implements TransportCostStrategy {
  constructor(private readonly fee: number) {}

  calculate(distanceKm: number): number {
    return distanceKm > 0 ? this.fee : 0;
  }
}

export interface TransportOption {
  readonly kind: TransportKind;
  readonly label: string;
  readonly rateLabel: string;
  readonly defaultRate: number;
}

export const TRANSPORT_OPTIONS: readonly TransportOption[] = [
  { kind: 'per-km', label: 'Por kilómetro', rateLabel: 'COP por km', defaultRate: 900 },
  { kind: 'per-unit', label: 'Por unidad transportada', rateLabel: 'COP por kg/L', defaultRate: 120 },
  { kind: 'flat', label: 'Tarifa fija por viaje', rateLabel: 'COP por viaje', defaultRate: 60000 },
];

export function createTransportStrategy(kind: TransportKind, rate: number): TransportCostStrategy {
  switch (kind) {
    case 'per-km':
      return new PerKmCost(rate);
    case 'per-unit':
      return new PerUnitCost(rate);
    case 'flat':
      return new FlatFeeCost(rate);
  }
}