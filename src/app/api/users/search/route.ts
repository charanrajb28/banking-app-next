// src/app/api/users/search/route.ts - UPDATED
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, getUserFromRequest } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    const email = searchParams.get('email');

    if (!phone && !email) {
      return NextResponse.json({ error: 'Please provide phone or email' }, { status: 400 });
    }

    // Query users table without avatar_url
    let query = supabaseAdmin
      .from('users')
      .select('id, full_name, phone, email');

    if (phone) {
      query = query.eq('phone', phone);
    } else if (email) {
      query = query.eq('email', email);
    }

    const { data: users, error } = await query.limit(1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!users || users.length === 0) {
      return NextResponse.json({ 
        error: 'User not found',
        user: null 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      user: users[0],
      found: true 
    });

  } catch (error: any) {
    console.error('Search user error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
