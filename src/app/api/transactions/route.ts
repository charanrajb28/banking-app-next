// src/app/api/transactions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getUserFromRequest } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    let query = supabaseAdmin
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) query = query.eq('status', status);
    if (type) query = query.eq('transaction_type', type);

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ transactions: data });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      from_account_id,
      to_account_id,
      amount,
      transaction_type,
      description,
      category,
    } = await request.json();

    // Validate amount
    if (amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Check balance
    const { data: fromAccount } = await supabaseAdmin
      .from('accounts')
      .select('balance')
      .eq('id', from_account_id)
      .single();

    if (fromAccount && fromAccount.balance < amount) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Generate transaction ID
    const transactionId = `TXN${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;

    // Create transaction
    const { data, error } = await supabaseAdmin
      .from('transactions')
      .insert({
        transaction_id: transactionId,
        user_id: user.id,
        from_account_id,
        to_account_id,
        amount,
        transaction_type,
        description,
        category,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Update transaction status to completed (in real app, this would be async)
    await supabaseAdmin
      .from('transactions')
      .update({ status: 'completed' })
      .eq('id', data.id);

    // Create notification
    await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: user.id,
        type: 'transaction',
        title: 'Transaction Successful',
        message: `${transaction_type} of $${amount} completed successfully`,
        category: 'transaction',
        priority: 'medium',
      });

    return NextResponse.json({ transaction: data }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
