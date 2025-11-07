// src/app/api/accounts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getUserFromRequest } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('accounts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ accounts: data || [] });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// src/app/api/accounts/route.ts - Simplified POST method
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { account_type, account_name, initial_balance } = await request.json();

    // Validate
    if (!account_type || !account_name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (initial_balance < 0) {
      return NextResponse.json({ error: 'Invalid initial balance' }, { status: 400 });
    }

    // Generate unique account number
    const accountNumber = `${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    
    // Create account - card will be auto-created by trigger
    const { data: account, error: accountError } = await supabaseAdmin
      .from('accounts')
      .insert({
        user_id: user.id,
        account_number: accountNumber,
        account_type,
        account_name,
        balance: initial_balance || 0,
        currency: 'USD',
        status: 'active', // This triggers card creation
      })
      .select()
      .single();

    if (accountError) {
      return NextResponse.json({ error: accountError.message }, { status: 400 });
    }

    // Card is automatically created by PostgreSQL trigger!
    return NextResponse.json({ account }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

