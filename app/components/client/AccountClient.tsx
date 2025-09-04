'use client';
import React, { useState } from 'react';
import Link from 'next/link';;
import { signOut, updateEmail } from '@/app/(site)/account/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AccountClient({ email }: { email: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newEmail, setNewEmail] = useState(email);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const res = await updateEmail(formData);
    setMessage(res.message);
    if (res.ok) {
      setIsEditing(false);
    }
  }

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-2xl border darK:border-white/10 dark:bg-white/5 p-6 shadow">
        <h2 className="text-xl font-semibold mb-6">Account Information</h2>

        <div className="divide-y divide-black/10 dark:divide-white/10">
          {/* Row: Email */}
          <div className="flex items-center justify-between py-4">
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">Email</div>
              {!isEditing ? (
                <div className="text-base font-medium">{email}</div>
              ) : (
                <form action={handleSubmit} className="flex gap-2 mt-1">
                  <Input
                    type="email"
                    name="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="px-2 py-1"
                    required
                  />
                  <Button
                    type="submit"
                    className="px-3 py-1 text-sm hover:cursor-pointer"
                  >
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setNewEmail(email);
                    }}
                    className="px-3 py-1 text-sm hover:cursor-pointer"
                  >
                    Cancel
                  </Button>
                </form>
              )}
              {message && (
                <p className="text-xs text-muted-foreground mt-1">{message}</p>
              )}
            </div>

            {!isEditing && (
              <Button
              variant="link"
                onClick={() => setIsEditing(true)}
                className="text-blue-800 dark:text-blue-200 hover:cursor-pointer text-md font-normal"
              >
                Edit
              </Button>
            )}
          </div>

          {/* Row: Password */}
          <div className="flex items-center justify-between py-4">
            <div>
              <div className="text-sm text-muted-foreground">Password</div>
              <div className="text-base font-medium">••••••••</div>
            </div>
            <Link href="/account/change-password" className="text-blue-800 dark:text-blue-200 hover:underline">
              Change Password
            </Link>
          </div>
        </div>

        <form action={signOut} className="mt-8">
          <Button
            type="submit"
            className="w-full rounded-md px-4 py-2 text-sm font-medium border hover:cursor-pointer"
          >
            Sign out
          </Button>
        </form>
      </div>
    </div>
  );
}