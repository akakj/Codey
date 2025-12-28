"use client";

import React, { useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { authAction, type AuthState } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircleIcon, CheckCircle2Icon, Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full mt-4 hover:cursor-pointer"
      disabled={pending}
    >
      {pending ? "Please wait…" : label}
    </Button>
  );
}

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [state, formAction] = useActionState<AuthState, FormData>(
    authAction,
    null
  );

  const isLogin = mode === "login";
  const isSignup = mode === "signup";
  const isReset = mode === "reset";

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mt-[30dvh]" suppressHydrationWarning>
      {/* Use the correct server action for the current mode */}
      <form key={mode} action={formAction} className="max-w-sm m-auto">
        <input type="hidden" name="mode" value={mode} />
        <h1 className="font-semibold text-2xl">
          {isLogin && "Welcome Back!"}
          {isSignup && "Sign up today!"}
          {isReset && "Reset password"}
        </h1>

        {isReset && (
          <p className="mt-4 border rounded-2xl p-3 text-sm bg-muted/20 dark:bg-muted/10">
            Forgotten your password? Enter your email address below, and an
            email with a reset link will be sent to you.
          </p>
        )}

        <div className="mt-6">
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Email"
            className="mt-4 w-full"
            defaultValue={state?.fields?.email ?? ""}
          />

          {!isReset && (
            <div className="relative mt-4">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                className="w-full pr-10"
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}

          <SubmitButton
            label={
              isLogin ? "Log in" : isSignup ? "Sign up" : "Send reset link"
            }
          />
        </div>

        {state?.message && (
          <Alert
            className={`mt-4 ${
              state.ok
                ? "text-black dark:text-white"
                : "text-red-800 dark:text-red-400"
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
                className={`${
                  state.ok ? "" : "text-red-800 dark:text-red-400"
                }`}
              >
                {state.message}
              </AlertDescription>
            </div>
          </Alert>
        )}

        <div className="mt-2">
          {isLogin && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMode("reset")}
                className="hover:underline hover:cursor-pointer text-blue-700 dark:text-blue-200"
              >
                Forgot password?
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="hover:underline hover:cursor-pointer text-blue-700 dark:text-blue-200 ml-auto"
              >
                Sign up
              </button>
            </div>
          )}

          {isSignup && (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="hover:underline hover:cursor-pointer text-blue-700 dark:text-blue-200"
              >
                Sign in
              </button>
            </p>
          )}

          {isReset && (
            <p>
              Remembered your password?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="hover:underline hover:cursor-pointer text-blue-700 dark:text-blue-200"
              >
                Back to login
              </button>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
