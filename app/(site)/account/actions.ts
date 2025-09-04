'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function updateEmail(formData: FormData) {
  const newEmail = String(formData.get('email') ?? '');
  if (!newEmail) return { ok: false, message: 'Email cannot be empty' };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ email: newEmail });

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true, message: 'Email updated. Please verify your new email.' };
}
