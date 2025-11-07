// src/app/api/accounts/[id]/transactions/route.ts
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

    const accountId = params.id;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    // Shared select columns
    const selectColumns = `
      id,
      user_id,
      transaction_id,
      transaction_type,
      amount,
      currency,
      status,
      description,
      category,
      payment_method,
      created_at,
      from_account_id,
      to_account_id,
      from_account:accounts!transactions_from_account_id_fkey (
        id,
        account_name,
        account_number
      ),
      to_account:accounts!transactions_to_account_id_fkey (
        id,
        account_name,
        account_number
      )
    `;

    // Expense (from_account_id === accountId and transaction.user_id === user.id)
    let expenseQuery = supabaseAdmin
      .from('transactions')
      .select(selectColumns)
      .eq('from_account_id', accountId)
      .eq('user_id', user.id);

    // Income (to_account_id === accountId and transaction.user_id === user.id)
    let incomeQuery = supabaseAdmin
      .from('transactions')
      .select(selectColumns)
      .eq('to_account_id', accountId)
      .eq('user_id', user.id);

    // Optional date filters
    if (startDate) {
      expenseQuery = expenseQuery.gte('created_at', startDate);
      incomeQuery = incomeQuery.gte('created_at', startDate);
    }
    if (endDate) {
      const endDateTime = new Date(endDate);
      endDateTime.setDate(endDateTime.getDate() + 1);
      expenseQuery = expenseQuery.lt('created_at', endDateTime.toISOString());
      incomeQuery = incomeQuery.lt('created_at', endDateTime.toISOString());
    }

    // Pagination and sorting
    expenseQuery = expenseQuery.order('created_at', { ascending: false }).range(offset, offset + limit - 1);
    incomeQuery = incomeQuery.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    // Execute both
    const [{ data: expenses, error: expenseError }, { data: incomes, error: incomeError }] = await Promise.all([
      expenseQuery,
      incomeQuery,
    ]);

    if (expenseError || incomeError) {
      console.error('Transaction fetch error:', expenseError || incomeError);
      return NextResponse.json(
        { error: expenseError?.message || incomeError?.message },
        { status: 400 }
      );
    }

    // Add direction label
    const expenseTransactions = (expenses || []).map(t => ({
      ...t,
      transaction_direction: 'expense',
    }));

    const incomeTransactions = (incomes || []).map(t => ({
      ...t,
      transaction_direction: 'income',
    }));

    // Combine, remove duplicates, sort by date
    const allTransactions = [...expenseTransactions, ...incomeTransactions];
    const uniqueTransactions = Array.from(new Map(allTransactions.map(t => [t.id, t])).values());
    uniqueTransactions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({
      transactions: uniqueTransactions,
      count: uniqueTransactions.length,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
