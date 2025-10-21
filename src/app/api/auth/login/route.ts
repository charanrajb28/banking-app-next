// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // Log security event
    await supabase
      .from('security_logs')
      .insert({
        user_id: data.user.id,
        event_type: 'login',
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        success: true,
      });

    return NextResponse.json({
      user: data.user,
      session: data.session,
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
