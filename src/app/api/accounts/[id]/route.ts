// src/app/api/accounts/[id]/route.ts (update with PATCH method)
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getUserFromRequest } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('accounts')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ account: data });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { account_name, daily_limit, monthly_limit } = body;

    const updateData: any = {};
    if (account_name) updateData.account_name = account_name;
    if (daily_limit !== undefined) updateData.daily_limit = daily_limit;
    if (monthly_limit !== undefined) updateData.monthly_limit = monthly_limit;

    const { data, error } = await supabaseAdmin
      .from('accounts')
      .update(updateData)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ account: data });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if account has balance
    const { data: account } = await supabaseAdmin
      .from('accounts')
      .select('balance')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (account && parseFloat(account.balance) > 0) {
      return NextResponse.json({ 
        error: 'Cannot close account with positive balance. Please transfer funds first.' 
      }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('accounts')
      .update({ status: 'closed' })
      .eq('id', params.id)
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
