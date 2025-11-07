// src/app/api/notifications/send-request/route.ts - UPDATED
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getUserFromRequest } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      recipientId, 
      amount, 
      description, 
      recipientPhone, 
      recipientEmail,
      recipientAccountNumber,
      recipientAccountId 
    } = await request.json();

    console.log('Creating payment request notification:', {
      recipientId,
      amount,
      description,
      recipientAccountNumber
    });

    if (!recipientId || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get sender details from users table
    const { data: senderData, error: senderError } = await supabaseAdmin
      .from('users')
      .select('full_name, phone, email')
      .eq('id', user.id)
      .single();

    console.log('Sender data:', senderData);

    if (senderError) {
      console.error('Error fetching sender:', senderError);
    }

    // Get recipient account details
    const { data: recipientAccount } = await supabaseAdmin
      .from('accounts')
      .select('account_number, account_name')
      .eq('id', recipientAccountId)
      .single();

    // Create notification
    const notificationData = {
      user_id: recipientId,
      type: 'payment_request',
      title: `Payment Request from ${senderData?.full_name || 'A User'}`,
      message: `${senderData?.full_name || 'A User'} is requesting ${amount} USD${description ? `: ${description}` : ''}. Payment should be received in account ${recipientAccount?.account_number}`,
      data: {
        requesterId: user.id,
        requesterName: senderData?.full_name,
        requesterPhone: senderData?.phone,
        requesterEmail: senderData?.email,
        amount,
        description,
        recipientAccountNumber: recipientAccount?.account_number,
        recipientAccountName: recipientAccount?.account_name,
        recipientAccountId: recipientAccountId,
        timestamp: new Date().toISOString()
      },
      status: 'unread'
    };

    console.log('Creating notification with data:', notificationData);

    const { data: notification, error: notificationError } = await supabaseAdmin
      .from('notifications')
      .insert(notificationData)
      .select()
      .single();

    console.log('Created notification:', notification);

    if (notificationError) {
      console.error('Error creating notification:', notificationError);
      return NextResponse.json({ error: notificationError.message }, { status: 400 });
    }

    return NextResponse.json({ 
      notification,
      message: 'Payment request sent successfully' 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Send notification error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
