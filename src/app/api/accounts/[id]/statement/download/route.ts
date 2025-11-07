// src/app/api/accounts/[id]/statement/download/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getUserFromRequest } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const accountId = params.id;

    // ✅ Verify account ownership
    const { data: accountData, error: accountError } = await supabaseAdmin
      .from('accounts')
      .select('id, user_id, account_name, account_number, balance, currency, created_at')
      .eq('id', accountId)
      .eq('user_id', user.id)
      .single();

    if (accountError || !accountData) {
      return NextResponse.json(
        { error: 'Account not found or unauthorized' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { start_date, end_date } = body;

    // ✅ Fetch user transactions
    let transactionQuery = supabaseAdmin
      .from('transactions')
      .select(`
        id,
        user_id,
        transaction_id,
        transaction_type,
        amount,
        currency,
        status,
        description,
        category,
        created_at,
        from_account_id,
        to_account_id
      `)
      .eq('user_id', user.id)
      .or(`from_account_id.eq.${accountId},to_account_id.eq.${accountId}`);

    if (start_date) transactionQuery = transactionQuery.gte('created_at', start_date);
    if (end_date) {
      const endDateTime = new Date(end_date);
      endDateTime.setDate(endDateTime.getDate() + 1);
      transactionQuery = transactionQuery.lt('created_at', endDateTime.toISOString());
    }

    transactionQuery = transactionQuery.order('created_at', { ascending: false });

    const { data: transactions, error: transactionsError } = await transactionQuery;

    if (transactionsError) {
      console.error('Transaction fetch error:', transactionsError);
      return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 400 });
    }

    // ✅ Add direction to transactions
    const processedTransactions = (transactions || []).map(txn => ({
      ...txn,
      direction:
        txn.to_account_id === accountId
          ? 'income'
          : txn.from_account_id === accountId
          ? 'expense'
          : 'other',
    }));

    // ✅ Generate CSV
    const csvContent = generateCSV(accountData, processedTransactions, start_date, end_date);

    // ✅ Return CSV as response
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="statement-${accountId}-${Date.now()}.csv"`,
      },
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

function generateCSV(account: any, transactions: any[], startDate: string, endDate: string): string {
  const lines: string[] = [];

  // ✅ Header information
  lines.push('ACCOUNT STATEMENT');
  lines.push(`Account Name,"${account.account_name}"`);
  lines.push(`Account Number,"****${account.account_number.slice(-4)}"`);
  lines.push(`Current Balance,"${account.currency} ${account.balance.toFixed(2)}"`);
  lines.push(`Statement Date,"${new Date().toLocaleDateString()}"`);
  lines.push(`Period From,"${startDate || 'All Time'}"`);
  lines.push(`Period To,"${endDate || 'Today'}"`);
  lines.push('');

  // ✅ Transaction headers
  lines.push('Date,Description,Category,Amount,Type,Direction,Status,Reference ID');

  // ✅ Transaction data
  transactions.forEach((txn: any) => {
    const date = new Date(txn.created_at).toLocaleDateString();
    const description = (txn.description || txn.transaction_type || 'N/A').replace(/"/g, '""');
    const category = (txn.category || 'Uncategorized').replace(/"/g, '""');
    const amount = parseFloat(txn.amount.toString()).toFixed(2);
    const type = txn.transaction_type;
    const direction =
      txn.direction === 'income' ? 'Credit' :
      txn.direction === 'expense' ? 'Debit' : 'Other';
    const status = txn.status;
    const refId = txn.transaction_id;

    lines.push(
      `"${date}","${description}","${category}","${amount}","${type}","${direction}","${status}","${refId}"`
    );
  });

  // ✅ Summary section
  lines.push('');
  lines.push('SUMMARY');

  const totalCredits = transactions
    .filter(t => t.direction === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

  const totalDebits = transactions
    .filter(t => t.direction === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

  const netChange = totalCredits - totalDebits;

  lines.push(`Total Income,"${account.currency} ${totalCredits.toFixed(2)}"`);
  lines.push(`Total Expenses,"${account.currency} ${totalDebits.toFixed(2)}"`);
  lines.push(`Net Change,"${account.currency} ${netChange.toFixed(2)}"`);

  return lines.join('\n');
}
