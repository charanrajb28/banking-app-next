// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password, phone, full_name, date_of_birth } = await request.json();

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Create user profile
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user!.id,
        email,
        phone,
        full_name,
        date_of_birth,
      })
      .select()
      .single();

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 400 });
    }

    // Create default savings account
    const accountNumber = `ACC${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`;
    
    await supabaseAdmin
      .from('accounts')
      .insert({
        user_id: authData.user!.id,
        account_number: accountNumber,
        account_type: 'savings',
        account_name: 'Primary Savings',
        balance: 0.00,
      });

    return NextResponse.json({
      user: userData,
      session: authData.session,
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
