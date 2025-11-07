// src/app/api/transactions/transfer/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getUserFromRequest } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { from_account_id, to_account_id, amount, description, category } = await request.json();

    // Validate
    if (!from_account_id || !to_account_id || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    if (from_account_id === to_account_id) {
      return NextResponse.json({ error: 'Cannot transfer to the same account' }, { status: 400 });
    }

    // Check from account belongs to user
    const { data: fromAccount, error: fromError } = await supabaseAdmin
      .from('accounts')
      .select('*')
      .eq('id', from_account_id)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (fromError || !fromAccount) {
      return NextResponse.json({ error: 'Invalid source account' }, { status: 400 });
    }

    // Check balance
    if (parseFloat(fromAccount.balance) < amount) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Check to account exists and is active
    const { data: toAccount, error: toError } = await supabaseAdmin
      .from('accounts')
      .select('*')
      .eq('id', to_account_id)
      .eq('status', 'active')
      .single();

    if (toError || !toAccount) {
      return NextResponse.json({ error: 'Invalid destination account' }, { status: 400 });
    }

    // Get sender details for notification
    const { data: senderData } = await supabaseAdmin
      .from('users')
      .select('full_name, phone, email')
      .eq('id', user.id)
      .single();

    // Generate transaction ID
    const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();

    console.log('Processing transfer:', {
      from: from_account_id,
      to: to_account_id,
      amount,
      transactionId
    });

    // Create TWO transaction records (double-entry)
    // 1. Debit from source account
    const { error: debitError } = await supabaseAdmin
      .from('transactions')
      .insert({
        transaction_id: transactionId,
        user_id: user.id,
        from_account_id,
        to_account_id,
        transaction_type: 'transfer_out',
        amount,
        currency: fromAccount.currency,
        status: 'completed',
        description: description || 'Fund transfer',
        category: category || 'transfer',
        created_at: now
      });

    if (debitError) {
      console.error('Debit error:', debitError);
      return NextResponse.json({ error: debitError.message }, { status: 400 });
    }

    // 2. Credit to destination account
    const { error: creditError } = await supabaseAdmin
      .from('transactions')
      .insert({
        transaction_id: transactionId,
        user_id: toAccount.user_id,
        from_account_id,
        to_account_id,
        transaction_type: 'transfer_in',
        amount,
        currency: toAccount.currency,
        status: 'completed',
        description: description || 'Fund transfer received',
        category: category || 'transfer',
        created_at: now
      });

    if (creditError) {
      console.error('Credit error:', creditError);
      return NextResponse.json({ error: creditError.message }, { status: 400 });
    }

    // Update balances atomically
    const { error: updateFromError } = await supabaseAdmin
      .from('accounts')
      .update({ 
        balance: parseFloat(fromAccount.balance) - amount,
        updated_at: now
      })
      .eq('id', from_account_id);

    if (updateFromError) {
      console.error('Update from error:', updateFromError);
      return NextResponse.json({ error: 'Failed to update source account' }, { status: 400 });
    }

    const { error: updateToError } = await supabaseAdmin
      .from('accounts')
      .update({ 
        balance: parseFloat(toAccount.balance) + amount,
        updated_at: now
      })
      .eq('id', to_account_id);

    if (updateToError) {
      console.error('Update to error:', updateToError);
      return NextResponse.json({ error: 'Failed to update destination account' }, { status: 400 });
    }

    // Create notifications for both sender and receiver
    console.log('Creating notifications...');

    // Notification for sender (money sent)
    const { error: senderNotifError } = await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: user.id,
        type: 'transfer',
        title: 'Money Sent Successfully',
        message: `You sent ${amount} USD to ${toAccount.account_name}. Transaction ID: ${transactionId}`,
        data: {
          transactionId,
          amount,
          senderAccountNumber: fromAccount.account_number,
          senderAccountName: fromAccount.account_name,
          receiverAccountNumber: toAccount.account_number,
          receiverAccountName: toAccount.account_name,
          transactionType: 'transfer_out',
          timestamp: now
        },
        status: 'unread'
      });

    if (senderNotifError) {
      console.error('Sender notification error:', senderNotifError);
    }

    // Notification for receiver (money received)
    const { error: receiverNotifError } = await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: toAccount.user_id,
        type: 'transfer',
        title: 'Money Received',
        message: `You received ${amount} USD from ${senderData?.full_name || 'a user'} to your ${toAccount.account_name} account. Transaction ID: ${transactionId}`,
        data: {
          transactionId,
          amount,
          senderName: senderData?.full_name,
          senderPhone: senderData?.phone,
          senderEmail: senderData?.email,
          senderAccountNumber: fromAccount.account_number,
          senderAccountName: fromAccount.account_name,
          receiverAccountNumber: toAccount.account_number,
          receiverAccountName: toAccount.account_name,
          transactionType: 'transfer_in',
          timestamp: now
        },
        status: 'unread'
      });

    if (receiverNotifError) {
      console.error('Receiver notification error:', receiverNotifError);
    }

    console.log('Transfer completed successfully');

    return NextResponse.json({ 
      transaction: {
        transaction_id: transactionId,
        amount,
        status: 'completed'
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Transfer API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
