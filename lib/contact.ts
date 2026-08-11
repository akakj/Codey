export const CONTACT_SUBJECTS = [
  "General question",
  "Bug or technical problem",
  "Feedback or suggestion",
  "Recruitment or collaboration",
] as const;

export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];

export const CONTACT_LIMITS = {
  name: 100,
  email: 254,
  message: 3000,
} as const;

export function isContactSubject(
  value: unknown,
): value is ContactSubject {
  return (
    typeof value === "string" &&
    (CONTACT_SUBJECTS as readonly string[]).includes(value)
  );
}