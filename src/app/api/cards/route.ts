// src/app/api/cards/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getUserFromRequest } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all cards for user's accounts
    const { data: cards, error } = await supabaseAdmin
      .from('cards')
      .select(`
        *,
        account:account_id (
          id,
          account_name,
          account_type,
          balance,
          currency
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Calculate monthly spending for each card
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const cardsWithSpending = await Promise.all(
      (cards || []).map(async (card) => {
        const { data: transactions } = await supabaseAdmin
          .from('transactions')
          .select('amount')
          .eq('from_account_id', card.account_id)
          .gte('created_at', firstDayOfMonth)
          .in('transaction_type', ['withdrawal', 'payment', 'card_payment']);

        const spentThisMonth = transactions?.reduce(
          (sum, t) => sum + parseFloat(t.amount.toString()),
          0
        ) || 0;

        return {
          ...card,
          spentThisMonth
        };
      })
    );

    return NextResponse.json({ cards: cardsWithSpending });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
