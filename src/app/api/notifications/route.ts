// src/app/api/notifications/route.ts - UPDATED WITH LOGGING
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getUserFromRequest } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    console.log('Getting notifications for user:', user?.id);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Query notifications
    const { data: notifications, error } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    console.log('Notifications found:', notifications?.length || 0);
    console.log('Query error:', error);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ 
      notifications: notifications || [],
      count: notifications?.length || 0
    });

  } catch (error: any) {
    console.error('Notifications API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
