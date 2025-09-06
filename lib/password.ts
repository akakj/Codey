export function validatePassword(pwd: string, email: string) {
  const emailLocal = email.split('@')[0]?.toLowerCase() ?? '';

  if (/\s/.test(pwd)) return { ok: false, message: 'Password cannot contain spaces.' };
  if (!/[A-Za-z]/.test(pwd)) return { ok: false, message: 'Password should include at least one letter.' };
  if (!/[0-9]/.test(pwd)) return { ok: false, message: 'Password should include at least one number.' };
  if (emailLocal && pwd.toLowerCase().includes(emailLocal))
    return { ok: false, message: 'Password should not contain your email/username.' };

  return { ok: true, message: '' };
}