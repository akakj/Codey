"use client";

import React, { useActionState, useState } from "react";
import Link from "next/link";

import {
  deleteAccount,
  signOut,
  updateEmail,
} from "@/app/(site)/account/actions";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialDeleteState = {
  error: null as string | null,
};

export function AccountClient({ email }: { email: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newEmail, setNewEmail] = useState(email);
  const [message, setMessage] = useState<string | null>(null);

  const [deleteState, deleteAccountAction, isDeleting] = useActionState(
    deleteAccount,
    initialDeleteState,
  );

  async function handleSubmit(formData: FormData) {
    const result = await updateEmail(formData);

    setMessage(result.message);

    if (result.ok) {
      setIsEditing(false);
    }
  }

  return (
    <div className="flex min-h-screen items-start justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-2xl border p-6 shadow dark:border-white/10 dark:bg-white/5">
        <h2 className="mb-6 text-xl font-semibold">Account Information</h2>

        <div className="divide-y divide-black/10 dark:divide-white/10">
          {/* Email */}
          <div className="flex items-center justify-between py-4">
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">Email</div>

              {!isEditing ? (
                <div className="text-base font-medium">{email}</div>
              ) : (
                <form action={handleSubmit} className="mt-1 flex gap-2">
                  <Input
                    type="email"
                    name="email"
                    value={newEmail}
                    onChange={(event) => setNewEmail(event.target.value)}
                    className="px-2 py-1"
                    required
                  />

                  <Button
                    type="submit"
                    className="cursor-pointer px-3 py-1 text-sm"
                  >
                    Save
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setNewEmail(email);
                      setMessage(null);
                    }}
                    className="cursor-pointer px-3 py-1 text-sm"
                  >
                    Cancel
                  </Button>
                </form>
              )}

              {message && (
                <p className="mt-1 text-xs text-muted-foreground">{message}</p>
              )}
            </div>

            {!isEditing && (
              <Button
                type="button"
                variant="link"
                onClick={() => {
                  setIsEditing(true);
                  setMessage(null);
                }}
                className="cursor-pointer text-md font-normal text-blue-800 dark:text-blue-200"
              >
                Edit
              </Button>
            )}
          </div>

          {/* Password */}
          <div className="flex items-center justify-between py-4">
            <div>
              <div className="text-sm text-muted-foreground">Password</div>

              <div className="text-base font-medium">••••••••</div>
            </div>

            <Link
              href="/account/change-password"
              className="text-blue-800 hover:underline dark:text-blue-200"
            >
              Change Password
            </Link>
          </div>
        </div>

        {/* Sign out */}
        <form action={signOut} className="mt-8">
          <Button
            type="submit"
            className="w-full cursor-pointer rounded-md border px-4 py-2 text-sm font-medium"
          >
            Sign out
          </Button>
        </form>

        {/* Delete account */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="
      mt-4 w-full cursor-pointer
      border-destructive/50
      text-destructive
      hover:bg-destructive/10
      hover:text-destructive
      dark:border-destructive/40
      dark:hover:bg-destructive/10
    "
            >
              Delete Account
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete your account?</AlertDialogTitle>

              <AlertDialogDescription>
                This action cannot be undone. Your account, submissions,
                progress and other associated data will be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <form action={deleteAccountAction}>
              {deleteState.error && (
                <p role="alert" className="mb-4 text-sm text-destructive">
                  {deleteState.error}
                </p>
              )}

              <AlertDialogFooter>
                <AlertDialogCancel
                  type="button"
                  disabled={isDeleting}
                  className="cursor-pointer"
                >
                  Cancel
                </AlertDialogCancel>

                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isDeleting}
                  className="cursor-pointer"
                >
                  {isDeleting ? "Deleting account..." : "Delete account"}
                </Button>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
