// src/app/api/analytics/categories/route.ts
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

    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    console.log('Fetching category data for user:', user.id);

    // Fetch ALL transactions (both income and expenses)
    const { data: transactions, error } = await supabaseAdmin
      .from('transactions')
      .select('amount, category, transaction_type')
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString())
      .eq('status', 'completed');

    console.log('Category transactions found:', transactions?.length || 0);

    if (error) {
      console.error('Query error:', error);
      return NextResponse.json({ categories: [] });
    }

    // Define transaction types
    const expenseTypes = ['withdrawal', 'payment', 'card_payment', 'transfer_out'];
    const incomeTypes = ['deposit', 'salary', 'refund', 'transfer_in', 'interest'];

    // Separate and group by category
    const expenseMap = new Map<string, number>();
    const incomeMap = new Map<string, number>();
    let totalExpense = 0;
    let totalIncome = 0;

    (transactions || []).forEach(t => {
      const category = (t.category || 'Other').toLowerCase();
      const amount = parseFloat(t.amount.toString());
      
      if (expenseTypes.includes(t.transaction_type)) {
        expenseMap.set(category, (expenseMap.get(category) || 0) + amount);
        totalExpense += amount;
      } else if (incomeTypes.includes(t.transaction_type)) {
        incomeMap.set(category, (incomeMap.get(category) || 0) + amount);
        totalIncome += amount;
      }
    });

    console.log('Expense categories:', Object.fromEntries(expenseMap));
    console.log('Income categories:', Object.fromEntries(incomeMap));

    // Convert to arrays
    const expenses = Array.from(expenseMap.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
        type: 'expense' as const
      }))
      .sort((a, b) => b.amount - a.amount);

    const income = Array.from(incomeMap.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalIncome > 0 ? (amount / totalIncome) * 100 : 0,
        type: 'income' as const
      }))
      .sort((a, b) => b.amount - a.amount);

    // Combine all categories
    const categories = [...expenses, ...income];

    console.log('Final categories count:', categories.length);

    return NextResponse.json({ categories });

  } catch (error: any) {
    console.error('Categories API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
