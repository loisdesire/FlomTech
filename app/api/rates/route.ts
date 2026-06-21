import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { FALLBACK_RATES } from '@/lib/constants';

export const dynamic = 'force-dynamic';

// Public read-only endpoint — no auth required.
// Returns cached exchange rates for the currency converter tool.
export async function GET() {
  try {
    const admin = createAdminClient();
    const { data: cache } = await admin
      .from('exchange_rate_cache')
      .select('rates, fetched_at')
      .eq('id', 1)
      .single();

    if (cache?.rates) {
      const age = Date.now() - new Date(cache.fetched_at).getTime();
      return NextResponse.json({ rates: cache.rates, live: age < 3600_000 });
    }
  } catch { /* fall through */ }

  return NextResponse.json({ rates: FALLBACK_RATES, live: false });
}
