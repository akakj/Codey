'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { validatePassword } from '@/lib/password';

export type AuthState = {
  ok: boolean;
  message: string;
  mode: 'login' | 'signup' | 'reset';
  fields?: { email?: string };
} | null;

export async function authAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const mode = (formData.get('mode') as 'login' | 'signup' | 'reset') ?? 'login';
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  const supabase = await createClient();

  if (mode === 'reset') {
    const origin = process.env.NEXT_PUBLIC_SITE_URL;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/confirm?next=/reset`,
    });

    if (error) {
      return { ok: false, message: error.message, mode, fields: { email } };
    }

    return {
      ok: true,
      message:
        'If an account exists for that email, a reset link has been sent. Please check your inbox (and spam).',
      mode,
      fields: { email },
    };
  }

  if (mode === 'signup') {

    const strength = validatePassword(password, email);
    if (!strength.ok) {
      return { ok: false, message: strength.message, mode, fields: { email } };
    }

    const origin = process.env.NEXT_PUBLIC_SITE_URL;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${origin}/auth/confirm?next=/` },
    });

    if (error) {
      return { ok: false, message: error.message, mode, fields: { email } };
    }

    return {
      ok: true,
      message:
        'A verification link was sent to your email. Please check your inbox (and spam).',
      mode,
      fields: { email },
    };
  }

  // login
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // If the email isn't confirmed yet, show a helpful message
    const msg = /confirm|verify/i.test(error.message)
      ? 'Please verify your email address before logging in. A verification link was sent to you when you signed up.'
      : error.message;

    return { ok: false, message: msg, mode, fields: { email } };
  }

  redirect('/');
}