import type { Metadata } from "next";
import Link from "next/link";
import {
  CONTACT_EMAIL,
  LegalSection,
  OPERATOR_NAME,
} from "../../components/LegalSection";

export const metadata: Metadata = {
  title: "Terms and Conditions | Codey",
  description: "The terms governing access to and use of Codey.",
};

const listClassName =
  "list-disc space-y-2 pl-6 marker:text-muted-foreground";

const linkClassName =
  "font-medium text-foreground underline underline-offset-4 hover:text-foreground/80";

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <article className="space-y-10">
        <header className="space-y-4 border-b pb-8">
          <p className="text-sm font-medium text-muted-foreground">
            Last updated: 30 July 2026
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Terms and Conditions
          </h1>

          <div className="space-y-4 leading-7 text-muted-foreground">
            <p>
              These Terms and Conditions (“Terms”) govern your access to and
              use of Codey, including its website, programming problems, code
              editor, code-execution features, account features, submission
              history, progress tracking and personal analytics (“Codey” or
              the “service”).
            </p>

            <p>
              Codey is a personal, non-commercial educational project
              operated by {OPERATOR_NAME}. In these Terms, “we”, “us”, “our”
              and “the operator” refer to {OPERATOR_NAME}.
            </p>

            <p>
              By creating an account or using Codey, you agree to these
              Terms. If you do not agree to them, do not use the service.
            </p>
          </div>
        </header>

        <LegalSection title="1. About Codey">
          <p>
            Codey is a programming-practice platform intended to support
            personal learning. It allows users to:
          </p>

          <ul className={listClassName}>
            <li>view programming problems, examples and hints;</li>

            <li>write and run source code;</li>

            <li>submit solutions against configured test cases;</li>

            <li>save submission history and problem progress;</li>

            <li>retrieve previously submitted code; and</li>

            <li>
              view activity statistics and personal learning analytics.
            </li>
          </ul>

          <p>
            Codey is currently provided without charge. If paid features are
            introduced in the future, any relevant prices and additional
            terms will be presented before you agree to use them.
          </p>

          <p>
            Codey is not an official examination, accreditation,
            recruitment or professional assessment service. It is an
            independent project and is not sponsored by, endorsed by or
            affiliated with LeetCode, NeetCode, Supabase, Vercel, JDoodle or
            any other third-party platform unless expressly stated.
          </p>
        </LegalSection>

        <LegalSection title="2. Eligibility">
          <p>
            Codey is not intended for children under 13. You must not create
            an account for a child under 13 or knowingly allow a child under
            13 to provide personal information through the service.
          </p>

          <p>
            If you are under 18, you should use Codey only with the
            permission and supervision of a parent, legal guardian, teacher
            or other responsible adult. If the law where you live does not
            allow you to agree to these Terms yourself, a parent or legal
            guardian must agree on your behalf.
          </p>
        </LegalSection>

        <LegalSection title="3. Accounts">
          <p>Some Codey features require an account. You must:</p>

          <ul className={listClassName}>
            <li>provide accurate account information;</li>

            <li>use an email address that you are entitled to use;</li>

            <li>keep your login credentials secure;</li>

            <li>
              not share your account or allow another person to impersonate
              you;
            </li>

            <li>
              notify us promptly if you believe your account has been
              accessed without permission; and
            </li>

            <li>
              remain responsible for activity carried out through your
              account, except where it results from a security failure for
              which we are legally responsible.
            </li>
          </ul>

          <p>
            We may require email verification or other reasonable security
            steps before allowing access to account features.
          </p>
        </LegalSection>

        <LegalSection title="4. Acceptable use">
          <p>
            You may use Codey only for lawful, personal and educational
            programming activities. You must not:
          </p>

          <ul className={listClassName}>
            <li>
              use Codey for an unlawful, fraudulent or harmful purpose;
            </li>

            <li>
              attempt to gain unauthorised access to another account,
              database, server, network or system;
            </li>

            <li>
              interfere with the availability, operation or security of
              Codey;
            </li>

            <li>
              bypass rate limits, access controls or technical restrictions;
            </li>

            <li>
              make excessive automated requests or conduct load,
              penetration or stress testing without prior permission;
            </li>

            <li>
              scrape or systematically extract Codey content or user data;
            </li>

            <li>
              introduce malware, destructive code or other harmful material;
            </li>

            <li>
              use submitted code to scan, attack, exploit or interfere with
              third-party systems;
            </li>

            <li>
              submit passwords, API keys, access tokens, private keys or
              other confidential credentials;
            </li>

            <li>
              submit content that infringes another person&apos;s
              intellectual-property, confidentiality or privacy rights;
            </li>

            <li>
              impersonate another person or create accounts in bulk; or
            </li>

            <li>use Codey to collect information about other users.</li>
          </ul>

          <p>
            We may restrict or suspend access where we reasonably believe
            these Terms have been breached or continued access presents a
            security, legal or operational risk.
          </p>
        </LegalSection>

        <LegalSection title="5. Source-code execution">
          <p>
            Code submitted through Codey may be sent to a third-party
            execution service, currently JDoodle, together with the selected
            programming language, execution instructions and relevant test
            inputs.
          </p>

          <p>
            Treat the execution environment as untrusted and temporary. Do
            not include:
          </p>

          <ul className={listClassName}>
            <li>passwords, API keys, tokens or private keys;</li>

            <li>personal, financial or confidential information;</li>

            <li>
              proprietary source code that you are not permitted to
              disclose; or
            </li>

            <li>any other secret or sensitive material.</li>
          </ul>

          <p>
            Codey is intended for programming practice and is not designed
            to process confidential or production data. Execution time,
            memory reporting and output may be limited, approximate, delayed
            or temporarily unavailable.
          </p>
        </LegalSection>

        <LegalSection title="6. Judging, results and analytics">
          <p>
            Codey compares submitted output with expected results using its
            configured test cases and judging logic. A result marked
            “accepted”, “failed”, “passed” or similar is educational feedback
            only.
          </p>

          <p>It does not guarantee that:</p>

          <ul className={listClassName}>
            <li>the solution is correct for every possible input;</li>

            <li>
              the solution is efficient, secure or suitable for production;
            </li>

            <li>the test cases cover every relevant situation;</li>

            <li>
              runtime, memory or active-time measurements are exact;
            </li>

            <li>
              the same solution will be accepted on another platform; or
            </li>

            <li>
              the problem statement, expected output or judging logic is
              error-free.
            </li>
          </ul>

          <p>
            Analytics are generated from recorded activity and may contain
            approximations, incomplete sessions or measurement errors. You
            remain responsible for reviewing and testing your own code.
          </p>
        </LegalSection>

        <LegalSection title="7. Your code and content">
          <p>
            You retain ownership of source code and other original material
            that you submit to Codey.
          </p>

          <p>
            You grant us a limited, non-exclusive licence to host, copy,
            transmit, process, display and execute that material only as
            reasonably necessary to:
          </p>

          <ul className={listClassName}>
            <li>provide the service;</li>

            <li>save and display your submissions and progress;</li>

            <li>retrieve your previously submitted code;</li>

            <li>produce your personal account analytics;</li>

            <li>
              investigate technical faults, security incidents or misuse;
              and
            </li>

            <li>
              maintain and improve the security and reliability of Codey.
            </li>
          </ul>

          <p>
            This licence does not transfer ownership of your material to us
            or give us the right to sell or publicly distribute your source
            code.
          </p>

          <p>
            The licence ends when the relevant material is deleted, subject
            to reasonable backup, security and legal-retention requirements.
            You confirm that you have the right to submit and use all
            material you provide.
          </p>
        </LegalSection>

        <LegalSection title="8. Codey content and intellectual property">
          <p>
            The Codey application, original source code, interface, design
            and branding are protected by applicable intellectual-property
            laws and any licences stated in the Codey repository.
          </p>

          <p>
            Problem statements, examples, libraries, trademarks and other
            third-party materials remain the property of their respective
            owners or licensors. These Terms do not transfer ownership of
            Codey or third-party content to you.
          </p>

          <p>
            You may use Codey content for personal learning. You may not
            sell, commercially redistribute or systematically reproduce
            substantial parts of the service unless applicable law or an
            applicable open-source licence permits it.
          </p>
        </LegalSection>

        <LegalSection title="9. Third-party services">
          <p>Codey relies on third-party services, including:</p>

          <ul className={listClassName}>
            <li>
              Supabase for authentication, database storage and related
              infrastructure;
            </li>

            <li>Vercel for website hosting and delivery; and</li>

            <li>JDoodle for remote source-code execution.</li>
          </ul>

          <p>
            Account information, submitted code and technical information
            may be processed by these providers as described in the Codey{" "}
            <Link href="/privacy" className={linkClassName}>
              Privacy Policy
            </Link>
            .
          </p>

          <p>
            These providers operate their own infrastructure and may
            experience outages or changes outside our reasonable control.
            We will not use this section to exclude responsibility that
            applicable law places on us.
          </p>
        </LegalSection>

        <LegalSection title="10. Service availability and changes">
          <p>
            Codey is a personal project and is provided without a guaranteed
            service level. We may:
          </p>

          <ul className={listClassName}>
            <li>add, remove or modify features;</li>

            <li>
              change supported programming languages, test cases or
              problems;
            </li>

            <li>impose reasonable usage or rate limits;</li>

            <li>
              temporarily suspend the service for maintenance or security;
            </li>

            <li>
              correct or remove inaccurate, unlawful or infringing content;
              or
            </li>

            <li>discontinue part or all of the service.</li>
          </ul>

          <p>
            Where reasonably practical, we will provide notice of a material
            change or discontinuation that is likely to affect access to
            stored account information.
          </p>

          <p>
            We will try to avoid unnecessary loss of stored account data,
            but you should keep your own copy of any source code or other
            information you consider important.
          </p>

          <p>
            Nothing in this section permits us to remove or restrict legal
            rights that cannot lawfully be excluded.
          </p>
        </LegalSection>

        <LegalSection title="11. Account suspension, deletion and termination">
          <p>You may stop using Codey at any time.</p>

          <p>
            You may delete your account through the account settings.
            Account deletion is irreversible and cannot be undone. The
            handling of your submissions, progress, analytics, browser
            storage and provider backups following deletion is explained in
            the{" "}
            <Link href="/privacy" className={linkClassName}>
              Privacy Policy
            </Link>
            .
          </p>

          <p>
            You may also contact{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className={linkClassName}
            >
              {CONTACT_EMAIL}
            </a>{" "}
            if you cannot access the account-deletion feature or need help
            with a deletion request.
          </p>

          <p>
            We may suspend or terminate an account where reasonably
            necessary because of:
          </p>

          <ul className={listClassName}>
            <li>a serious or repeated breach of these Terms;</li>

            <li>
              unlawful conduct or misuse of code-execution facilities;
            </li>

            <li>a threat to Codey, its users or a third party;</li>

            <li>a legal requirement; or</li>

            <li>discontinuation of the service.</li>
          </ul>

          <p>
            Where appropriate and reasonably possible, we will provide
            notice or an opportunity to correct the issue before suspending
            or terminating an account. Immediate action may be taken where
            necessary to address a serious security, legal or operational
            risk.
          </p>

          <p>
            Provisions that are intended to continue after termination,
            including intellectual-property, liability and dispute
            provisions, remain effective.
          </p>
        </LegalSection>

        <LegalSection title="12. Privacy">
          <p>
            Our collection and use of personal information are explained in
            the{" "}
            <Link href="/privacy" className={linkClassName}>
              Codey Privacy Policy
            </Link>
            .
          </p>

          <p>
            When you use code-execution features, submitted code and
            relevant execution inputs may be transmitted to third-party
            infrastructure for processing.
          </p>
        </LegalSection>

        <LegalSection title="13. Disclaimers">
          <p>
            Codey is provided on an “as available” basis as a personal
            educational project.
          </p>

          <p>We do not promise that Codey will always be:</p>

          <ul className={listClassName}>
            <li>available, uninterrupted or error-free;</li>

            <li>secure from every possible threat;</li>

            <li>
              suitable for a particular course, examination, qualification
              or employer;
            </li>

            <li>compatible with every device or browser; or</li>

            <li>
              free from inaccurate, incomplete or outdated educational
              content.
            </li>
          </ul>

          <p>
            These statements do not exclude any duty to provide the service
            with reasonable care and skill or any other legal right that
            cannot lawfully be excluded.
          </p>
        </LegalSection>

        <LegalSection title="14. Liability">
          <p>
            Nothing in these Terms excludes or limits liability for death or
            personal injury caused by negligence, fraud or fraudulent
            misrepresentation, or any other liability that cannot legally be
            excluded or limited.
          </p>

          <p>
            If we fail to comply with these Terms, we are responsible for
            loss or damage that is a foreseeable result of our breach or our
            failure to use reasonable care and skill. Loss is foreseeable
            where it was an obvious consequence or was contemplated by both
            you and us when you began using Codey.
          </p>

          <p>Subject to the protections above, we are not responsible for:</p>

          <ul className={listClassName}>
            <li>loss or damage that was not reasonably foreseeable;</li>

            <li>
              loss caused by information, code or instructions that you
              submit;
            </li>

            <li>
              loss caused by your inclusion of credentials, confidential
              information or personal information in submitted code;
            </li>

            <li>
              unauthorised account use caused by your failure to take
              reasonable care of your login credentials;
            </li>

            <li>
              outages or failures caused solely by events outside our
              reasonable control, except where applicable law makes us
              responsible; or
            </li>

            <li>
              business, commercial or professional losses where you use
              Codey primarily for personal and educational purposes.
            </li>
          </ul>

          <p>
            You should keep your own backup of important source code. We are
            not responsible for data loss caused by your failure to keep a
            reasonable backup where the loss was not caused by our breach or
            negligence.
          </p>

          <p>
            You are responsible for deciding whether to rely on any output,
            result, explanation, runtime, memory figure or statistic
            displayed by Codey.
          </p>
        </LegalSection>

        <LegalSection title="15. Changes to these Terms">
          <p>
            We may update these Terms to reflect changes to Codey, its
            service providers or applicable law. The date at the top shows
            when the Terms were most recently updated.
          </p>

          <p>
            Where reasonably practical, material changes will be
            communicated through the service before or when they take
            effect. Updated Terms apply to your subsequent use of Codey and
            will not remove rights that cannot lawfully be removed.
          </p>

          <p>
            If you do not agree to an updated version of the Terms, you
            should stop using Codey and may delete your account.
          </p>
        </LegalSection>

        <LegalSection title="16. Governing law and disputes">
          <p>
            These Terms and your use of Codey are governed by the laws of
            Scotland.
          </p>

          <p>
            If you are a consumer, you also retain any mandatory legal
            protections that apply in the country or part of the United
            Kingdom where you live and that cannot lawfully be excluded by
            these Terms.
          </p>

          <p>
            The Scottish courts will have jurisdiction over disputes
            relating to these Terms. If you are a consumer living elsewhere
            in the United Kingdom, you may also be entitled to bring
            proceedings in the courts where you live.
          </p>

          <p>
            Before beginning formal proceedings, you and the operator should
            make reasonable efforts to resolve the issue informally.
          </p>
        </LegalSection>

        <LegalSection title="17. General provisions">
          <p>
            If a court finds part of these Terms invalid or unenforceable,
            the remaining provisions continue to apply.
          </p>

          <p>
            A failure to enforce a provision immediately does not waive the
            right to enforce it later.
          </p>

          <p>
            These Terms and the Privacy Policy form the agreement governing
            your use of Codey.
          </p>
        </LegalSection>

        <LegalSection title="18. Contact">
          <div className="rounded-lg border bg-muted/30 p-5 text-foreground">
            <p>
              <span className="font-semibold">Operator:</span>{" "}
              {OPERATOR_NAME}
            </p>

            <p>
              <span className="font-semibold">Email:</span>{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className={linkClassName}
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </LegalSection>
      </article>
    </main>
  );
}