import type { Metadata } from "next";
import Link from "next/link";
import {
  CONTACT_EMAIL,
  DataUseCard,
  LegalSection,
  OPERATOR_NAME,
} from "../../components/LegalSection";

export const metadata: Metadata = {
  title: "Privacy Policy | Codey",
  description:
    "How Codey collects, uses, stores and shares personal information.",
};

const listClassName =
  "list-disc space-y-2 pl-6 marker:text-muted-foreground";

const externalLinkClassName =
  "font-medium text-foreground underline underline-offset-4 hover:text-foreground/80";

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <article className="space-y-10">
        <header className="space-y-4 border-b pb-8">
          <p className="text-sm font-medium text-muted-foreground">
            Last updated: 30 July 2026
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Privacy Policy
          </h1>

          <div className="space-y-4 leading-7 text-muted-foreground">
            <p>
              This Privacy Policy explains how Codey collects, uses, stores
              and shares personal information when you use its programming
              problems, code editor, code-execution features, account
              features, submission history, progress tracking and personal
              analytics.
            </p>

            <p>
              Codey is a personal, non-commercial educational project
              operated by {OPERATOR_NAME}. In this policy, “Codey”, “we”,
              “us” and “our” refer to {OPERATOR_NAME}. For the purposes of UK
              data protection law, {OPERATOR_NAME} is the controller of the
              personal information described in this policy.
            </p>

            <p>
              For privacy questions or requests, contact{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className={externalLinkClassName}
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </div>
        </header>

        <LegalSection title="1. Information we collect">
          <p>Depending on how you use Codey, we may collect:</p>

          <ul className={listClassName}>
            <li>
              <span className="font-medium text-foreground">
                Account information:
              </span>{" "}
              your email address, Supabase authentication identifier, account
              creation date and session information.
            </li>

            <li>
              <span className="font-medium text-foreground">
                Submission information:
              </span>{" "}
              source code, selected programming language, test inputs,
              execution output, pass or fail status, failed-case details,
              runtime, memory use and submission timestamps.
            </li>

            <li>
              <span className="font-medium text-foreground">
                Progress information:
              </span>{" "}
              attempted and solved problems, submission history and related
              problem status.
            </li>

            <li>
              <span className="font-medium text-foreground">
                Activity analytics:
              </span>{" "}
              submission frequency, acceptance rates, active days, language
              usage, active time spent on problems and other statistics
              derived from your activity.
            </li>

            <li>
              <span className="font-medium text-foreground">
                Browser-stored information:
              </span>{" "}
              selected programming language, theme, locally saved editor code
              and similar preferences stored on your device.
            </li>

            <li>
              <span className="font-medium text-foreground">
                Technical information:
              </span>{" "}
              IP address, browser or device information, request timestamps,
              security events and diagnostic logs that may be processed by
              Codey&apos;s hosting, authentication and infrastructure
              providers.
            </li>

            <li>
              <span className="font-medium text-foreground">
                Communications:
              </span>{" "}
              your email address and any information you include when
              contacting the operator about support, privacy or account
              deletion.
            </li>
          </ul>

          <p>
            Codey does not ask you to provide special-category information
            such as health, biometric, religious or political information.
            Do not place personal, confidential or sensitive information in
            source code or test inputs.
          </p>
        </LegalSection>

        <LegalSection title="2. How we collect information">
          <p>We collect information:</p>

          <ul className={listClassName}>
            <li>
              directly from you when you create an account or contact us;
            </li>

            <li>
              when you run or submit code, solve problems or use account
              features;
            </li>

            <li>
              automatically when Codey records submissions, problem
              progress, activity timestamps and active time;
            </li>

            <li>
              through authentication, hosting, security and diagnostic
              processes; and
            </li>

            <li>
              from service providers that operate parts of Codey on our
              behalf.
            </li>
          </ul>
        </LegalSection>

        <LegalSection title="3. Why we use your information and our lawful bases">
          <div className="grid gap-4 sm:grid-cols-2">
            <DataUseCard
              title="Accounts and authentication"
              information="Email address, authentication identifiers and session information."
              purpose="To create your account, sign you in, keep your session secure and provide account features."
              lawfulBasis="Contract — processing is necessary to provide the account and service you request."
            />

            <DataUseCard
              title="Code execution and submissions"
              information="Source code, programming language, test inputs, execution results and submission records."
              purpose="To run code, assess submissions, show results and save submission history."
              lawfulBasis="Contract — processing is necessary to provide Codey’s core programming-practice features."
            />

            <DataUseCard
              title="Progress and personal analytics"
              information="Problem status, activity timestamps, active time and statistics derived from your activity."
              purpose="To show your learning progress, activity history and personal analytics dashboard."
              lawfulBasis="Contract — processing is necessary to provide the progress and analytics features available through your account."
            />

            <DataUseCard
              title="Security and reliability"
              information="Technical logs, request information, security events and limited account or submission information where necessary."
              purpose="To prevent misuse, protect accounts, diagnose faults and maintain Codey."
              lawfulBasis="Legitimate interests — operating a secure and reliable educational service and protecting users and infrastructure."
            />

            <DataUseCard
              title="Support and privacy requests"
              information="Contact details, communications and relevant account information."
              purpose="To answer questions, investigate issues and respond to account or data-protection requests."
              lawfulBasis="Legitimate interests — communicating with users and administering requests effectively."
            />

            <DataUseCard
              title="Legal compliance and claims"
              information="Account, contact, technical or activity information relevant to a legal issue."
              purpose="To comply with applicable law and establish, exercise or defend legal rights."
              lawfulBasis="Legal obligation where processing is required by law, or legitimate interests where processing is necessary for legal claims."
            />
          </div>

          <p>
            Where we rely on legitimate interests, we consider whether the
            processing is necessary and proportionate and whether your rights
            and interests override those interests.
          </p>
        </LegalSection>

        <LegalSection title="4. Information needed to provide Codey">
          <p>
            An email address is required to create an account and use
            features that save submissions, problem progress and personal
            analytics. If you do not provide an email address, you cannot
            create a Codey account.
          </p>

          <p>
            Source code and relevant execution inputs are required when you
            ask Codey to run or assess a solution. If you do not provide
            them, Codey cannot complete that execution or submission request.
          </p>
        </LegalSection>

        <LegalSection title="5. Code execution and sensitive information">
          <p>
            When you use Codey&apos;s run or submit features, your source
            code, selected programming language, execution instructions and
            relevant test inputs may be sent to JDoodle for remote execution.
          </p>

          <p>Do not include:</p>

          <ul className={listClassName}>
            <li>
              passwords, authentication tokens, API keys or private keys;
            </li>

            <li>personal or financial information;</li>

            <li>confidential business information;</li>

            <li>
              proprietary code that you are not permitted to disclose; or
            </li>

            <li>any other secret or sensitive material.</li>
          </ul>

          <p>
            Codey is designed for programming practice, not for processing
            confidential or production data.
          </p>
        </LegalSection>

        <LegalSection title="6. Cookies and browser storage">
          <p>
            Codey uses strictly necessary authentication cookies to keep you
            signed in, protect your session and provide account features.
          </p>

          <p>
            Codey also uses browser storage on your device to remember
            settings such as your theme, selected programming language and
            locally saved editor code. You can clear this information through
            your browser, although doing so may sign you out or remove locally
            saved preferences and code.
          </p>

          <p>
            Codey does not currently use cookies or browser storage for
            targeted advertising or cross-site tracking. If non-essential
            analytics or advertising technologies are introduced in the
            future, this policy will be updated and consent will be requested
            where required.
          </p>
        </LegalSection>

        <LegalSection title="7. Who receives your information">
          <p>
            We may share or make personal information available to the
            following service providers:
          </p>

          <ul className={listClassName}>
            <li>
              <a
                href="https://supabase.com/privacy"
                target="_blank"
                rel="noreferrer"
                className={externalLinkClassName}
              >
                Supabase
              </a>{" "}
              provides authentication, database storage and related
              infrastructure. It may process account, submission, progress
              and analytics information.
            </li>

            <li>
              <a
                href="https://vercel.com/legal/privacy-notice"
                target="_blank"
                rel="noreferrer"
                className={externalLinkClassName}
              >
                Vercel
              </a>{" "}
              hosts and delivers the website. It may process IP addresses,
              request information, browser or device information and
              technical logs.
            </li>

            <li>
              <a
                href="https://www.jdoodle.com/privacy"
                target="_blank"
                rel="noreferrer"
                className={externalLinkClassName}
              >
                JDoodle
              </a>{" "}
              provides remote source-code execution. It may process submitted
              source code, programming language information, execution
              instructions and relevant test inputs.
            </li>
          </ul>

          <p>Information may also be disclosed:</p>

          <ul className={listClassName}>
            <li>
              to professional advisers or technical support providers where
              reasonably necessary and subject to appropriate
              confidentiality obligations; or
            </li>

            <li>
              to courts, regulators, law-enforcement bodies or other
              authorities where disclosure is required by law or necessary
              to protect legal rights.
            </li>
          </ul>

          <p>
            We do not sell your personal information or share it with third
            parties for their own targeted advertising.
          </p>
        </LegalSection>

        <LegalSection title="8. International transfers">
          <p>
            Supabase, Vercel, JDoodle and their subprocessors may process
            personal information in countries outside the United Kingdom.
            Data-protection laws in those countries may differ from UK law.
          </p>

          <p>
            Where UK data protection law restricts an international
            transfer, we rely on an applicable transfer mechanism made
            available by the relevant provider, such as UK adequacy
            regulations or contractual safeguards.
          </p>

          <p>
            You may contact us for further information about safeguards
            relevant to your information.
          </p>
        </LegalSection>

        <LegalSection title="9. How long we keep information">
          <p>
            We keep personal information only for as long as reasonably
            necessary for the purposes described in this policy. In general:
          </p>

          <ul className={listClassName}>
            <li>
              account, submission, progress and analytics information is
              generally kept while your account remains active;
            </li>

            <li>
              when you delete your account or request deletion,
              account-associated information is deleted or anonymised from
              active systems unless limited information must be retained for
              security, legal or dispute-resolution purposes;
            </li>

            <li>
              browser-stored preferences and locally saved code remain on
              your device until you clear them through your browser;
            </li>

            <li>
              support and privacy communications are kept only while needed
              to respond to the request and maintain an appropriate record;
              and
            </li>

            <li>
              backups and provider logs may remain for a limited period under
              the relevant provider&apos;s backup, security and deletion
              schedules.
            </li>
          </ul>

          <p>
            We may retain anonymised or aggregated statistics that no longer
            identify you.
          </p>
        </LegalSection>

        <LegalSection title="10. Security">
          <p>
            We use reasonable technical and organisational measures intended
            to protect personal information, including authentication
            controls, restricted database access and encrypted transmission
            provided by the relevant infrastructure services.
          </p>

          <p>
            No internet service can guarantee absolute security. You are
            responsible for protecting your login credentials and avoiding
            sensitive information in submitted code and test inputs.
          </p>
        </LegalSection>

        <LegalSection title="11. Your data-protection rights">
          <p>
            Depending on the circumstances and the lawful basis used, UK data
            protection law may give you the right to:
          </p>

          <ul className={listClassName}>
            <li>request access to your personal information;</li>

            <li>
              request correction of inaccurate or incomplete information;
            </li>

            <li>
              request deletion of your information in certain circumstances;
            </li>

            <li>
              request restriction of processing in certain circumstances;
            </li>

            <li>
              receive certain information that you provided in a portable
              format;
            </li>

            <li>
              object to processing based on legitimate interests; and
            </li>

            <li>
              complain to the Information Commissioner&apos;s Office about
              how your personal information is used.
            </li>
          </ul>

          <div className="rounded-lg border-l-4 border-foreground bg-muted/40 p-5">
            <p className="font-semibold text-foreground">
              Your right to object
            </p>

            <p className="mt-2 text-muted-foreground">
              You may object to processing based on legitimate interests. We
              will stop that processing unless there are compelling
              legitimate grounds to continue or it is needed to establish,
              exercise or defend legal claims.
            </p>
          </div>

          <p>
            To exercise a right, contact{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className={externalLinkClassName}
            >
              {CONTACT_EMAIL}
            </a>
            . We may ask for information reasonably needed to verify your
            identity. Data-protection rights are not absolute and may be
            limited by applicable law.
          </p>
        </LegalSection>

        <LegalSection title="12. Automated processing">
          <p>
            Codey automatically compares program output with configured
            expected results and calculates personal learning statistics.
            These processes provide programming-practice feedback only and
            do not make decisions that produce legal or similarly significant
            effects about you.
          </p>
        </LegalSection>

        <LegalSection title="13. Children">
          <p>
            Codey is not intended for children under 13, and we do not
            knowingly collect personal information from children under 13.
            If you believe that a child under 13 has provided personal
            information, contact us so that we can investigate and, where
            appropriate, delete the information.
          </p>

          <p>
            Users under 18 should use Codey only with the permission and
            supervision described in the Terms and Conditions.
          </p>
        </LegalSection>

        <LegalSection title="14. Changes to this policy">
          <p>
            We may update this Privacy Policy when Codey&apos;s features,
            service providers or legal obligations change. The date at the
            top shows when it was last updated. Material changes may also be
            communicated through the service where reasonably practical.
          </p>
        </LegalSection>

        <LegalSection title="15. Contact and complaints">
          <div className="rounded-lg border bg-muted/30 p-5 text-foreground">
            <p>
              <span className="font-semibold">Controller:</span>{" "}
              {OPERATOR_NAME}
            </p>

            <p>
              <span className="font-semibold">Email:</span>{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className={externalLinkClassName}
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>

          <p>
            Please contact us first if you have a privacy question or
            complaint. You also have the right to complain to the UK
            Information Commissioner&apos;s Office. Information about making
            a complaint is available on the{" "}
            <a
              href="https://ico.org.uk/make-a-complaint/data-protection-complaints/"
              target="_blank"
              rel="noreferrer"
              className={externalLinkClassName}
            >
              ICO website
            </a>
            .
          </p>

          <p>
            Your use of Codey is also governed by the{" "}
            <Link href="/terms" className={externalLinkClassName}>
              Terms and Conditions
            </Link>
            .
          </p>
        </LegalSection>
      </article>
    </main>
  );
}