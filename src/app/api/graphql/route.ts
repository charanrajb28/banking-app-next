// src/app/api/graphql/route.ts
import { handler } from '@/lib/apollo-server';

export async function GET(request: Request) {
  return handler(request);
}

export async function POST(request: Request) {
  return handler(request);
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
