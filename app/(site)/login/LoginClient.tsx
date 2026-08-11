"use client";

import React, { useActionState, useState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { AlertCircleIcon, CheckCircle2Icon, Eye, EyeOff } from "lucide-react";

import { authAction, type AuthState } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="mt-4 w-full cursor-pointer"
      disabled={pending}
    >
      {pending ? "Please wait…" : label}
    </Button>
  );
}

export default function LoginClient() {
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [showPassword, setShowPassword] = useState(false);

  const [state, formAction] = useActionState<AuthState, FormData>(
    authAction,
    null,
  );

  const isLogin = mode === "login";
  const isSignup = mode === "signup";
  const isReset = mode === "reset";

  return (
    <div
      className="
        min-h-dvh
        px-2 sm:px-4
        pt-[25dvh]
        bg-[linear-gradient(to_right,rgba(100,116,139,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.10)_1px,transparent_1px)]
        bg-size-[42px_42px]
        dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)]
      "
    >
      <form
        key={mode}
        action={formAction}
        className="
    mx-auto
    w-full
    max-w-md
    min-h-80
    rounded-2xl
    border
    bg-card
    px-6
    py-8
    shadow-2xl
    sm:max-w-sm
    sm:min-h-0
    sm:p-6
  "
      >
        <input type="hidden" name="mode" value={mode} />

        <h1 className="text-2xl font-semibold">
          {isLogin && "Welcome Back!"}
          {isSignup && "Sign up today!"}
          {isReset && "Reset password"}
        </h1>

        {isReset && (
          <p className="mt-4 rounded-2xl border bg-muted/20 p-3 text-sm dark:bg-muted/10">
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
                className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 cursor-pointer"
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

          {!isReset && (
            <p className="mt-3 text-center text-sm text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-2 hover:text-foreground"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="underline underline-offset-2 hover:text-foreground"
              >
                Privacy Policy
              </Link>
              .
            </p>
          )}
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
                className={state.ok ? "" : "text-red-800 dark:text-red-400"}
              >
                {state.message}
              </AlertDescription>
            </div>
          </Alert>
        )}

        <div className="mt-3">
          {isLogin && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMode("reset")}
                className="cursor-pointer text-blue-700 hover:underline dark:text-blue-200"
              >
                Forgot password?
              </button>

              <button
                type="button"
                onClick={() => setMode("signup")}
                className="ml-auto cursor-pointer text-blue-700 hover:underline dark:text-blue-200"
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
                className="cursor-pointer text-blue-700 hover:underline dark:text-blue-200"
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
                className="cursor-pointer text-blue-700 hover:underline dark:text-blue-200"
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
