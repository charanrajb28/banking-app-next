// src/app/api/analytics/route.ts
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

    // Calculate date ranges
    const now = new Date();
    let startDate = new Date();
    let previousStartDate = new Date();
    let previousEndDate = new Date();

    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        previousStartDate.setDate(now.getDate() - 14);
        previousEndDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        previousStartDate.setMonth(now.getMonth() - 2);
        previousEndDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        previousStartDate.setMonth(now.getMonth() - 6);
        previousEndDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        previousStartDate.setFullYear(now.getFullYear() - 2);
        previousEndDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    console.log('Fetching analytics for user:', user.id);
    console.log('Period:', period);
    console.log('Start date:', startDate.toISOString());

    // Get ALL transactions for this user (not filtered by account)
    const { data: currentTransactions, error: currentError } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString())
      .eq('status', 'completed');

    console.log('Current transactions found:', currentTransactions?.length || 0);
    console.log('Current transactions error:', currentError);

    if (currentError) {
      console.error('Error fetching current transactions:', currentError);
    }

    // Get previous period transactions
    const { data: previousTransactions } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', previousStartDate.toISOString())
      .lte('created_at', previousEndDate.toISOString())
      .eq('status', 'completed');

    console.log('Previous transactions found:', previousTransactions?.length || 0);

    // Define transaction type categories
    const spentTypes = ['withdrawal', 'payment', 'card_payment', 'transfer_out'];
    const incomeTypes = ['deposit', 'salary', 'refund', 'transfer_in', 'interest'];

    // Calculate current period metrics
    const spentTransactions = (currentTransactions || []).filter(t => 
      spentTypes.includes(t.transaction_type)
    );
    const incomeTransactions = (currentTransactions || []).filter(t => 
      incomeTypes.includes(t.transaction_type)
    );

    console.log('Spent transactions:', spentTransactions.length);
    console.log('Income transactions:', incomeTransactions.length);

    const totalSpent = spentTransactions.reduce((sum, t) => {
      const amount = parseFloat(t.amount.toString());
      console.log('Adding spent amount:', amount, 'Type:', t.transaction_type);
      return sum + amount;
    }, 0);

    const totalIncome = incomeTransactions.reduce((sum, t) => {
      const amount = parseFloat(t.amount.toString());
      console.log('Adding income amount:', amount, 'Type:', t.transaction_type);
      return sum + amount;
    }, 0);

    console.log('Total spent:', totalSpent);
    console.log('Total income:', totalIncome);

    const transactionCount = currentTransactions?.length || 0;

    // Calculate previous period metrics
    const previousSpent = (previousTransactions || [])
      .filter(t => spentTypes.includes(t.transaction_type))
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    const previousIncome = (previousTransactions || [])
      .filter(t => incomeTypes.includes(t.transaction_type))
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    // Calculate category breakdown
    const categoryMap = new Map<string, number>();
    spentTransactions.forEach(t => {
      const category = t.category || 'Other';
      const amount = parseFloat(t.amount.toString());
      categoryMap.set(category, (categoryMap.get(category) || 0) + amount);
    });

    console.log('Category breakdown:', Object.fromEntries(categoryMap));

    // Get top category
    let topCategory = { name: 'None', amount: 0, percentage: 0 };
    if (categoryMap.size > 0) {
      const [topCat, topAmount] = Array.from(categoryMap.entries())
        .sort((a, b) => b[1] - a[1])[0];
      topCategory = {
        name: topCat,
        amount: topAmount,
        percentage: totalSpent > 0 ? (topAmount / totalSpent) * 100 : 0
      };
    }

    const result = {
      totalSpent,
      totalIncome,
      netChange: totalIncome - totalSpent,
      transactionCount,
      topCategory,
      previousPeriod: {
        totalSpent: previousSpent,
        totalIncome: previousIncome
      }
    };

    console.log('Final result:', result);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
