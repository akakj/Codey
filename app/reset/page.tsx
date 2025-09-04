"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2Icon, AlertCircleIcon } from "lucide-react";
import type { ResetState } from "./actions";
import { updatePasswordAction } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full mt-4 hover:cursor-pointer" disabled={pending}>
      {pending ? "Resetting Password…" : "Reset Password"}
    </Button>
  );
}

export default function ResetPasswordPage() {
  const [state, formAction] = useActionState<ResetState, FormData>(
    updatePasswordAction,
    null
  );

  const [ showPassword, setShowPassword ] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form className="w-full max-w-sm" action={formAction}>
        <h1 className="text-2xl font-semibold text-center">Reset password</h1>

        <div className="mt-4">
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="New password"
            required
            className="w-full mt-4"
          />
          <Input
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Confirm password"
            required
            className="w-full mt-4"
          />
          <SubmitButton />
        </div>

        <div className ="mt-2">
          <p className ="cursor-pointer"onClick = { () => setShowPassword(!showPassword) }>Show passwords</p>
        </div>

        {state && (
          <Alert className="mt-4">
            {state.ok ? (
              <CheckCircle2Icon className="h-5 w-5" />
            ) : (
              <AlertCircleIcon className="h-5 w-5" />
            )}
            <div>
              <AlertTitle className="font-semibold">
                {state.ok ? "Success!" : "Error!"}
              </AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </div>
          </Alert>
        )}
      </form>
    </div>
  );
}
