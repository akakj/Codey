import type { Metadata } from "next";

import { LegalDocument } from "@/app/components/LegalDocument";

export const metadata: Metadata = {
  title: "Terms and Conditions | Codey",
  description: "The terms and conditions for using Codey.",
};

const termsContent = String.raw`
# Terms and Conditions #

**Last updated: 28 July 2026**

These Terms and Conditions (“Terms”) govern your access to and use of Codey, including its website, coding problems, code editor, code-execution features, account features and analytics (“Codey” or the “Service”).

Codey is a personal, non-commercial educational project operated by **[FULL LEGAL NAME]** (“the operator”, “we”, “us” or “our”).

By creating an account or using Codey, you agree to these Terms. If you do not agree to them, you must not use the Service.

## 1. About Codey

Codey is an educational programming-practice platform. It allows users to:

* view programming problems;
* write and run source code;
* submit solutions against test cases;
* save submission history and problem progress;
* retrieve previous submissions; and
* view statistics and analytics based on their activity.

Codey is provided for personal learning, practice and portfolio-demonstration purposes. It is not an official examination, accreditation, recruitment or professional assessment service.

Codey is an independent project and is not sponsored by, endorsed by or affiliated with LeetCode, NeetCode, Supabase, JDoodle or any other third-party platform unless expressly stated.

## 2. Eligibility

You must be at least 18 years old to use Codey independently.

A person under 18 may use Codey only with the permission and supervision of a parent, legal guardian, teacher or other responsible adult who agrees to these Terms on their behalf.

Codey is not intended for children under 13. You must not create an account for a child under 13 or allow a child under 13 to provide personal information through the Service.

## 3. Accounts

Some features require an account.

When creating or using an account, you must:

* provide accurate information;
* use an email address that you are entitled to use;
* keep your login credentials secure;
* avoid sharing your account with another person; and
* notify us promptly if you believe that your account has been accessed without permission.

You are responsible for activity carried out through your account unless it results from a security failure for which we are legally responsible.

We may require email verification before allowing access to account features.

## 4. Acceptable use

You may use Codey only for lawful educational and personal programming activities.

You must not:

* use Codey for an unlawful or fraudulent purpose;
* attempt to gain unauthorised access to another account, database, server or system;
* interfere with the operation or security of Codey;
* bypass rate limits, access controls or technical restrictions;
* make excessive automated requests or conduct load or stress testing without permission;
* scrape or systematically extract Codey content or data;
* introduce viruses, malware, destructive code or other harmful material;
* use submitted code to attack, scan, exploit or interfere with third-party systems;
* submit passwords, private keys, authentication tokens or other confidential credentials;
* submit source code or material that infringes another person’s intellectual-property or privacy rights;
* impersonate another person;
* create accounts in bulk or through automated means; or
* use Codey to collect information about other users.

We may restrict, suspend or terminate access where we reasonably believe that these Terms have been breached or that access presents a security, legal or operational risk.

## 5. Source-code execution

Code submitted through Codey may be sent to a third-party execution service, currently JDoodle, together with the programming language, execution instructions and relevant test inputs.

You should treat the code-execution environment as untrusted and temporary. Do not include:

* passwords;
* API keys;
* access tokens;
* confidential business information;
* personal information;
* proprietary source code that you are not permitted to disclose; or
* any other secret or sensitive material.

Codey does not guarantee that execution is isolated from every possible technical risk or that submitted code will remain confidential beyond the protections offered by Codey and its service providers.

Execution time, memory reporting and output may be limited, approximate, unavailable or affected by third-party services.

## 6. Judging and results

Codey compares submitted output with expected results using its configured test cases and judging logic.

A result marked “accepted”, “failed”, “passed” or similar is provided only for educational feedback. It does not guarantee that:

* the solution is correct in every possible situation;
* the solution is efficient or secure;
* the test cases cover every relevant input;
* the displayed runtime or memory figure is precise;
* the same solution will be accepted on another platform; or
* the problem, expected output or judging logic is free from errors.

You remain responsible for reviewing and testing your own code.

## 7. Your code and content

You retain ownership of source code and other original material that you submit to Codey.

You grant us a limited, non-exclusive licence to host, copy, transmit, process and execute that material only as reasonably necessary to:

* provide the Service;
* save your submissions and progress;
* show your submission history;
* produce your account analytics;
* investigate faults or abuse; and
* maintain the security and operation of Codey.

This licence ends when the relevant material is deleted, subject to reasonable backup, security and legal-retention requirements.

You confirm that you have the right to submit and use any material you provide.

## 8. Codey content and intellectual property

The Codey application, interface, design, branding and original software are protected by applicable intellectual-property laws.

Problem statements, examples, libraries, trademarks and other third-party materials remain the property of their respective owners or licensors.

These Terms do not transfer ownership of Codey or third-party content to you.

You may use Codey content for personal learning. You may not reproduce, sell, commercially redistribute or create a competing database from substantial parts of the Service unless applicable law or an applicable open-source licence permits it.

## 9. Third-party services

Codey relies on third-party services, including:

* Supabase for authentication and database services;
* JDoodle for remote source-code execution; and
* **[HOSTING PROVIDER]** for website hosting and infrastructure.

Your information and code may be processed by these providers as explained in the Privacy Policy.

Third-party services operate under their own terms and policies. We are not responsible for a third-party service to the extent that a problem is outside our reasonable control.

Links to third-party websites are provided for convenience and do not constitute an endorsement.

## 10. Service availability and changes

Codey is a personal project and is provided without a guaranteed service level.

We may:

* add, remove or modify features;
* change supported languages or problems;
* impose reasonable usage limits;
* temporarily suspend Codey for security or maintenance;
* correct or remove inaccurate content; or
* discontinue part or all of the Service.

Where reasonably practical, we will try to avoid unnecessary loss of stored account data, but you should retain your own copies of any code you consider important.

## 11. Account suspension and termination

You may stop using Codey at any time.

To request account deletion, contact **[CONTACT EMAIL]** from the email address associated with your account.

We may suspend or terminate an account where reasonably necessary because of:

* a serious or repeated breach of these Terms;
* unlawful conduct;
* misuse of code-execution facilities;
* a threat to Codey, its users or a third party;
* a legal requirement; or
* discontinuation of the Service.

Where appropriate and reasonably possible, we will provide notice or an opportunity to correct the issue.

Sections that are intended to continue after termination, including provisions concerning intellectual property, liability and disputes, will remain effective.

## 12. Privacy

Our collection and use of personal information are explained in the Codey Privacy Policy.

By using Codey, you acknowledge that source code and execution inputs may be transmitted to third-party infrastructure for processing.

## 13. Disclaimers

Codey is provided on an “as available” basis.

We do not promise that Codey will always be:

* available;
* uninterrupted;
* error-free;
* secure from every possible threat;
* suitable for a particular course, examination or employment process; or
* compatible with every device or browser.

Nothing in these Terms affects any legal right or guarantee that cannot lawfully be excluded.

## 14. Liability

Nothing in these Terms excludes or limits liability for:

* death or personal injury caused by negligence;
* fraud or fraudulent misrepresentation; or
* any matter for which liability cannot legally be excluded or limited.

Subject to this, we are not responsible for:

* losses that were not reasonably foreseeable when you began using Codey;
* loss of code that you could reasonably have backed up;
* loss arising from including confidential information or credentials in submitted code;
* interruptions or failures caused by third-party services;
* loss caused by unauthorised use of your account resulting from your failure to protect your credentials; or
* business, commercial or professional losses arising from use of this personal educational Service.

You are responsible for deciding whether to rely on any output, explanation, result or statistic shown by Codey.

## 15. Indemnity for unlawful use

To the extent permitted by law, you are responsible for losses, claims or reasonable costs caused by your deliberate unlawful use of Codey or your deliberate infringement of another person’s rights.

This provision does not make you responsible for losses caused by our own acts, omissions or negligence.

## 16. Changes to these Terms

We may update these Terms to reflect changes to Codey, its service providers or applicable law.

The date at the top will show when the Terms were most recently updated. Material changes may also be communicated through the Service where reasonably practical.

Your continued use after updated Terms take effect means that the updated Terms apply to subsequent use. Changes will not retrospectively remove rights that you already have under applicable law.

## 17. Governing law and disputes

These Terms and your use of Codey are governed by the laws of Scotland.

The Scottish courts will have jurisdiction over disputes relating to these Terms, although consumers may also have rights to bring proceedings in another part of the United Kingdom where applicable consumer law permits.

Before beginning formal proceedings, you and the operator should make reasonable efforts to resolve the issue informally.

## 18. General provisions

If a court finds part of these Terms invalid or unenforceable, the remaining provisions will continue to apply.

A failure to enforce a provision immediately does not waive the right to enforce it later.

These Terms and the Privacy Policy constitute the agreement governing your use of Codey.

## 19. Contact

Questions about these Terms may be sent to:

**Operator:** Anna Kandyba 
**Email:** [CONTACT EMAIL]
`;

export default function TermsPage() {
  return <LegalDocument content={termsContent} />;
}