// src/app/api/analytics/spending/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getUserFromRequest } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month';

    const now = new Date();
    let startDate = new Date();
    let groupBy = 'day';

    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        groupBy = 'day';
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        groupBy = 'day';
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        groupBy = 'week';
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        groupBy = 'month';
        break;
    }

    console.log('Fetching spending data for user:', user.id);
    console.log('Start date:', startDate.toISOString());

    // Fetch ALL spent transactions for user
    const { data: transactions, error } = await supabaseAdmin
      .from('transactions')
      .select('amount, created_at, transaction_type')
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString())
      .eq('status', 'completed')
      .in('transaction_type', ['withdrawal', 'payment', 'card_payment', 'transfer_out'])
      .order('created_at', { ascending: true });

    console.log('Spending transactions found:', transactions?.length || 0);
    console.log('Error:', error);

    if (error) {
      console.error('Query error:', error);
      return NextResponse.json({ data: [] });
    }

    // Group by date
    const grouped = new Map<string, number>();
    (transactions || []).forEach(t => {
      const date = new Date(t.created_at);
      let key: string;
      
      if (groupBy === 'day') {
        key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (groupBy === 'week') {
        const weekNum = Math.ceil(date.getDate() / 7);
        key = `Week ${weekNum}`;
      } else {
        key = date.toLocaleDateString('en-US', { month: 'short' });
      }
      
      const amount = parseFloat(t.amount.toString());
      grouped.set(key, (grouped.get(key) || 0) + amount);
    });

    const data = Array.from(grouped.entries()).map(([date, amount]) => ({
      date,
      amount
    }));

    console.log('Grouped spending data:', data);

    return NextResponse.json({ data });

  } catch (error: any) {
    console.error('Spending API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
