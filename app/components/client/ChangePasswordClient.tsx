"use client";
import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { changePasswordAction, type ChangePwState } from '../../(site)/account/change-password/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon, CheckCircle2Icon } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full hover:cursor-pointer" disabled={pending}>
      {pending ? 'Saving…' : 'Change Password'}
    </Button>
  );
}

function ChangePasswordClient() {
    const [state, formAction] = useActionState<ChangePwState, FormData>(changePasswordAction, null);
    const [ showPassword, setShowPassword] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form action={formAction} className="w-sm space-y-4">
        <h1 className="text-2xl font-semibold text-center">Change Password</h1>

        <Input name="current" type={showPassword ? "text" : "password"} placeholder="Current password" required />
        <Input name="next" type={showPassword ? "text" : "password"} placeholder="New password" required />
        <Input name="confirm" type={showPassword ? "text" : "password"} placeholder="Confirm new password" required />

        <div className ="mt-2">
          <p className ="cursor-pointer"onClick = { () => setShowPassword(!showPassword) }>Show passwords</p>
        </div>

        <SubmitButton />

        {state?.message && (
          <Alert
            className={`mt-4 ${
              state.ok ? "text-black dark:text-white" : "text-red-800 dark:text-red-400"
            }`}
          >
            {state.ok ? (
              <CheckCircle2Icon className="h-5 w-5" />
            ) : (
              <AlertCircleIcon className="h-5 w-5" />
            )}
            <div>
              <AlertTitle className="font-semibold">
                {state.ok ? "Success!" : "Error!"}
              </AlertTitle>
              <AlertDescription
                className={`${state.ok ? "" : "text-red-800 dark:text-red-400"}`}
              >
                {state.message}
              </AlertDescription>
            </div>
          </Alert>
        )}

        <p className="text-center text-sm">
          <Link href="/account" className="hover:underline">Back to account</Link>
        </p>
      </form>
    </div>
  )
}

export default ChangePasswordClient;
