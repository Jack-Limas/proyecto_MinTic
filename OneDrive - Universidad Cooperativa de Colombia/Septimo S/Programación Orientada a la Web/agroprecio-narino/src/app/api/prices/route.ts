import { NextResponse } from 'next/server';
import { priceService } from '@/lib/container';

export const dynamic = 'force-dynamic';

export async function GET() {
  const quotes = await priceService.getQuotes();
  return NextResponse.json({ generatedAt: new Date().toISOString(), quotes });
}