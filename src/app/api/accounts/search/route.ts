// src/app/api/accounts/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getUserFromRequest } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    const accountNumber = searchParams.get('account_number');

    if (!phone && !accountNumber) {
      return NextResponse.json({ error: 'Phone number or account number is required' }, { status: 400 });
    }

    let users: any[] = [];

    if (phone) {
      // Search by phone
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('id, full_name, phone')
        .eq('phone', phone);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      users = data || [];
    } else if (accountNumber) {
      // Search by account number
      const { data: accounts, error } = await supabaseAdmin
        .from('accounts')
        .select('*, users!inner(id, full_name, phone)')
        .eq('account_number', accountNumber)
        .eq('status', 'active');

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      if (accounts && accounts.length > 0) {
        return NextResponse.json({
          accounts: accounts.map(acc => ({
            ...acc,
            user: acc.users
          }))
        });
      }

      return NextResponse.json({ accounts: [] });
    }

    if (users.length === 0) {
      return NextResponse.json({ accounts: [] });
    }

    // Get active accounts for found users
    const userIds = users.map(u => u.id);
    const { data: accounts, error: accountError } = await supabaseAdmin
      .from('accounts')
      .select('*')
      .in('user_id', userIds)
      .eq('status', 'active');

    if (accountError) {
      return NextResponse.json({ error: accountError.message }, { status: 400 });
    }

    // Combine accounts with user info
    const accountsWithUsers = accounts?.map(account => {
      const accountUser = users.find(u => u.id === account.user_id);
      return {
        ...account,
        user: accountUser
      };
    });

    return NextResponse.json({ accounts: accountsWithUsers || [] });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
