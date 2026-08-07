"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
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

const subjects = [
  "General question",
  "Bug or technical problem",
  "Feedback or suggestion",
  "Recruitment or collaboration",
] as const;

const MAX_MESSAGE_LENGTH = 3000;

export default function ContactForm() {
  const [message, setMessage] = useState("");
  const [showPreviewSuccess, setShowPreviewSuccess] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    /*
     * UI preview only.
     *
     * Replace this function with the API request later.
     * The browser will still validate all required fields
     * before this function runs.
     */
    setShowPreviewSuccess(true);
  }

  return (
    <section
      aria-labelledby="contact-form-heading"
      className="rounded-2xl border bg-background/70 p-6 shadow-sm backdrop-blur-sm sm:p-8"
    >
      <div>
        <h2 id="contact-form-heading" className="text-2xl font-semibold">
          Send a message
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Complete the form below. All fields are required.
        </p>
      </div>

      {showPreviewSuccess && (
        <div
          role="status"
          className="mt-6 flex gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400"
        >
          <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden="true" />

          <div>
            <p className="font-medium">UI preview submitted</p>

            <p className="mt-1 leading-6">
              No message was sent because the email API has not been connected
              yet.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>

            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              autoComplete="name"
              maxLength={100}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email address
            </label>

            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              maxLength={254}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="subject" className="text-sm font-medium">
            Subject
          </label>

          <Combobox items={subjects} name="subject" required>
            <ComboboxInput placeholder="Select a subject" />
            <ComboboxContent>
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList className="hover:cursor-pointer">
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium">
            Message
          </label>

          <Textarea
            id="message"
            name="message"
            placeholder="Describe your question, feedback or issue..."
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              setShowPreviewSuccess(false);
            }}
            maxLength={MAX_MESSAGE_LENGTH}
            rows={9}
            required
            className="min-h-48 resize-y"
            aria-describedby="message-help message-count"
          />

          <div className="flex items-start justify-between gap-4 text-xs text-muted-foreground">
            <p id="message-help">
              Include relevant details such as the problem name or error
              message.
            </p>

            <p id="message-count" className="shrink-0 tabular-nums">
              {message.length}/{MAX_MESSAGE_LENGTH}
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse items-stretch gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Button type="submit" size="lg" className="sm:min-w-36">
            <Send className="size-4" aria-hidden="true" />
            Send message
          </Button>
        </div>
      </form>
    </section>
  );
}
