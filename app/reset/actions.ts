'use server';

import { createClient } from '@/utils/supabase/server';

export type ResetState = { ok: boolean; message: string } | null;

export async function updatePasswordAction(
  _prev: ResetState,
  formData: FormData
): Promise<ResetState> {
  const password = String(formData.get('password') ?? '');
  const confirm  = String(formData.get('confirmPassword') ?? '');

  if (password !== confirm) {
    return { ok: false, message: 'Passwords do not match.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) return { ok: false, message: error.message };

  // Optional: choose where to send them next
  return { ok: true, message: 'Password updated. You can now sign in with your new password.' };
}
