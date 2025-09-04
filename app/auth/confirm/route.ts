import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: Request) {
  const url = new URL(req.url);

  // New (recommended) PKCE flow
  const code = url.searchParams.get('code');

  // Legacy/custom flow (only if your email template uses token_hash)
  const token_hash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type') as
    | 'email'
    | 'recovery'
    | 'email_change'
    | 'invite'
    | null;

  const next = url.searchParams.get('next') ?? '/';
  const supabase = await createClient();

  // 1) PKCE — exchange the short-lived code for a session cookie
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, url));
    }
    return NextResponse.redirect(
      new URL(`/error?reason=${encodeURIComponent(error.message)}`, url)
    );
  }

  // 2) Legacy OTP — verify the token hash
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) {
      return NextResponse.redirect(new URL(next, url));
    }
    return NextResponse.redirect(
      new URL(`/error?reason=${encodeURIComponent(error.message)}`, url)
    );
  }

  // If neither parameter is present
  return NextResponse.redirect(
    new URL('/error?reason=missing_code_or_token', url)
  );
}
