import type { Metadata } from "next";
import {
  BriefcaseBusiness,
  Bug,
  Lightbulb,
  MessageSquare,
} from "lucide-react";
import ContactForm from "@/app/(site)/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact | Codey",
  description:
    "Contact Codey with questions, feedback, bug reports or collaboration enquiries.",
};

const contactReasons = [
  {
    title: "Report a problem",
    description:
      "Found a broken test case, incorrect problem statement or unexpected error?",
    icon: Bug,
    iconStyle:
      "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400",
  },
  {
    title: "Share feedback",
    description:
      "Suggest an improvement to the interface, problem set or platform experience.",
    icon: Lightbulb,
    iconStyle:
      "border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  },
  {
    title: "Ask a question",
    description:
      "Get in touch with a general question about Codey or how the platform works.",
    icon: MessageSquare,
    iconStyle:
      "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    title: "Discuss an opportunity",
    description:
      "Reach out about recruitment, collaboration or the development of Codey.",
    icon: BriefcaseBusiness,
    iconStyle:
      "border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
];

export default function ContactPage() {
  return (
    <main className="relative min-h-[calc(100dvh-4rem)] overflow-hidden px-6 py-12 sm:px-8 sm:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[4%] top-24 size-80 rounded-full bg-blue-500/10 blur-[110px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[4%] top-60 size-80 rounded-full bg-purple-500/10 blur-[110px]"
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0
          bg-[linear-gradient(to_right,rgba(100,116,139,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.10)_1px,transparent_1px)]
          bg-size-[42px_42px]
          dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)]
        "
      />

      <div className="relative mx-auto max-w-6xl">
        <header className="mx-auto max-w-2xl text-center">
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
            Get in touch
          </h1>

          <p className="mt-5 leading-8 text-gray-700 dark:text-gray-200 sm:text-lg">
            Found a problem, have an idea, or want to discuss Codey? Send a
            message using the form below.
          </p>
        </header>

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="space-y-4">
            <div className="rounded-2xl border bg-background/40 p-6 backdrop-blur-sm sm:p-8">
              <h2 className="text-xl font-semibold">What can I help with?</h2>

              <p className="mt-2 leading-7 text-muted-foreground">
                Select the most relevant subject in the form so your message
                can be understood quickly.
              </p>

              <div className="mt-7 space-y-6">
                {contactReasons.map(
                  ({ title, description, icon: Icon, iconStyle }) => (
                    <div key={title} className="flex gap-4">
                      <div
                        className={`flex size-10 shrink-0 items-center justify-center rounded-lg border ${iconStyle}`}
                      >
                        <Icon className="size-5" aria-hidden="true" />
                      </div>

                      <div>
                        <h3 className="font-medium">{title}</h3>

                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {description}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="rounded-xl border bg-background/40 p-5 text-sm leading-6 text-muted-foreground backdrop-blur-sm">
              Your email address will only be used to respond to your message.
              It will not be displayed publicly.
            </div>
          </aside>

          <ContactForm />
        </div>
      </div>
    </main>
  );
}