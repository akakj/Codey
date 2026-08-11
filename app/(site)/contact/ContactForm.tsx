"use client";

import type { SubmitEvent } from "react";
import { useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  CONTACT_LIMITS,
  CONTACT_SUBJECTS,
  isContactSubject,
} from "@/lib/contact";

type SubmitStatus =
  | "idle"
  | "sending"
  | "success"
  | "error";

type Web3FormsResponse = {
  success?: boolean;
  message?: string;
};

const DEFAULT_ERROR =
  "Your message could not be sent. Please try again.";

export default function ContactForm() {
  const [message, setMessage] = useState("");
  const [status, setStatus] =
    useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] =
    useState("");
  const [formVersion, setFormVersion] =
    useState(0);

  /*
   * Prevent multiple submissions from starting before
   * React has re-rendered the disabled submit button.
   */
  const submittingRef = useRef(false);

  const isSending = status === "sending";

  function clearStatus() {
    if (
      status === "success" ||
      status === "error"
    ) {
      setStatus("idle");
      setErrorMessage("");
    }
  }

  async function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (submittingRef.current) {
      return;
    }

    const accessKey =
      process.env
        .NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
      console.error(
        "NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY is missing.",
      );

      setStatus("error");
      setErrorMessage(
        "The contact service is temporarily unavailable.",
      );

      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = String(
      formData.get("name") ?? "",
    ).trim();

    const email = String(
      formData.get("email") ?? "",
    ).trim();

    const subject = String(
      formData.get("subject") ?? "",
    ).trim();

    const submittedMessage = String(
      formData.get("message") ?? "",
    ).trim();

    if (
      name.length === 0 ||
      name.length > CONTACT_LIMITS.name
    ) {
      setStatus("error");
      setErrorMessage(
        "Please enter a valid name.",
      );
      return;
    }

    if (
      email.length === 0 ||
      email.length > CONTACT_LIMITS.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email,
      )
    ) {
      setStatus("error");
      setErrorMessage(
        "Please enter a valid email address.",
      );
      return;
    }

    if (!isContactSubject(subject)) {
      setStatus("error");
      setErrorMessage(
        "Please select a valid subject.",
      );
      return;
    }

    if (
      submittedMessage.length === 0 ||
      submittedMessage.length >
        CONTACT_LIMITS.message
    ) {
      setStatus("error");
      setErrorMessage(
        "Please enter a valid message.",
      );
      return;
    }

    submittingRef.current = true;
    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: accessKey,

            from_name: "Codey Contact",
            subject: `[Codey Contact] ${subject}`,

            name,
            email,
            contact_subject: subject,
            message: submittedMessage,
          }),
        },
      );

      const data: Web3FormsResponse | null =
        await response
          .json()
          .catch(() => null);

      if (response.status === 429) {
        throw new Error(
          "Too many messages have been sent. Please wait a few minutes and try again.",
        );
      }

      if (
        !response.ok ||
        data?.success !== true
      ) {
        throw new Error(
          data?.message ?? DEFAULT_ERROR,
        );
      }

      setMessage("");
      setStatus("success");

      /*
       * Remount the form so uncontrolled inputs,
       * including the Combobox, are reset.
       */
      setFormVersion(
        (current) => current + 1,
      );
    } catch (error: unknown) {
      setStatus("error");

      setErrorMessage(
        error instanceof Error
          ? error.message
          : DEFAULT_ERROR,
      );
    } finally {
      submittingRef.current = false;
    }
  }

  return (
    <section
      aria-labelledby="contact-form-heading"
      className="rounded-2xl border bg-background/70 p-6 shadow-sm backdrop-blur-sm sm:p-8"
    >
      <div>
        <h2
          id="contact-form-heading"
          className="text-2xl font-semibold"
        >
          Send a message
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Complete the form below. All fields
          are required.
        </p>
      </div>

      {status === "success" && (
        <div
          role="status"
          className="mt-6 flex gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400"
        >
          <CheckCircle2
            className="mt-0.5 size-5 shrink-0"
            aria-hidden="true"
          />

          <div>
            <p className="font-medium">
              Message sent
            </p>

            <p className="mt-1 leading-6">
              Your message has been sent
              successfully.
            </p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div
          role="alert"
          className="mt-6 flex gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-400"
        >
          <AlertCircle
            className="mt-0.5 size-5 shrink-0"
            aria-hidden="true"
          />

          <div>
            <p className="font-medium">
              Message not sent
            </p>

            <p className="mt-1 leading-6">
              {errorMessage}
            </p>
          </div>
        </div>
      )}

      <form
        key={formVersion}
        onSubmit={handleSubmit}
        onChange={clearStatus}
        className="mt-8 space-y-6"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium"
            >
              Name
            </label>

            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              autoComplete="name"
              maxLength={
                CONTACT_LIMITS.name
              }
              disabled={isSending}
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium"
            >
              Email address
            </label>

            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              maxLength={
                CONTACT_LIMITS.email
              }
              disabled={isSending}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="subject"
            className="text-sm font-medium"
          >
            Subject
          </label>

          <Combobox
            items={CONTACT_SUBJECTS}
            name="subject"
            disabled={isSending}
            required
          >
            <ComboboxInput
              id="subject"
              placeholder="Select a subject"
              disabled={isSending}
            />

            <ComboboxContent>
              <ComboboxEmpty>
                No items found.
              </ComboboxEmpty>

              <ComboboxList className="hover:cursor-pointer">
                {(item) => (
                  <ComboboxItem
                    key={item}
                    value={item}
                  >
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="message"
            className="text-sm font-medium"
          >
            Message
          </label>

          <Textarea
            id="message"
            name="message"
            placeholder="Describe your question, feedback or issue..."
            value={message}
            onChange={(event) => {
              setMessage(
                event.target.value,
              );
            }}
            maxLength={
              CONTACT_LIMITS.message
            }
            rows={9}
            disabled={isSending}
            required
            className="min-h-48 resize-y"
            aria-describedby="message-help message-count"
          />

          <div className="flex items-start justify-between gap-4 text-xs text-muted-foreground">
            <p id="message-help">
              Include relevant details such
              as the problem name or error
              message.
            </p>

            <p
              id="message-count"
              className="shrink-0 tabular-nums"
            >
              {message.length}/
              {CONTACT_LIMITS.message}
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse items-stretch gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="submit"
            size="lg"
            className="cursor-pointer sm:min-w-36"
            disabled={isSending}
          >
            {isSending ? (
              <>
                <Loader2
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
                Sending...
              </>
            ) : (
              <>
                <Send
                  className="size-4"
                  aria-hidden="true"
                />
                Send message
              </>
            )}
          </Button>
        </div>
      </form>
    </section>
  );
}