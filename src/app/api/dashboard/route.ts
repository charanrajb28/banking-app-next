// src/app/api/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getUserFromRequest } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all active accounts for user
    const { data: accounts, error: accountsError } = await supabaseAdmin
      .from('accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (accountsError) {
      return NextResponse.json({ error: accountsError.message }, { status: 400 });
    }

    // Calculate total balance
    const totalBalance = (accounts || []).reduce(
      (sum, account) => sum + parseFloat(account.balance.toString()),
      0
    );

    return NextResponse.json({
      accounts: accounts || [],
      totalBalance,
      accountCount: (accounts || []).length
    });

  } catch (error: any) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
