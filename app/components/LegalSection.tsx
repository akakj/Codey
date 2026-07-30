import type { ReactNode } from "react";

export const OPERATOR_NAME = "Anna Kandyba";
export const CONTACT_EMAIL = "anna.kandyba@example.com";
export const HOSTING_PROVIDER = "Vercel";
export const SUPABASE_REGION = "West Europe";

export function DataUseCard({
  title,
  information,
  purpose,
  lawfulBasis,
}: {
  title: string;
  information: string;
  purpose: string;
  lawfulBasis: string;
}) {
  return (
    <div className="rounded-lg border p-5">
      <h3 className="font-semibold text-foreground">{title}</h3>
      <dl className="mt-3 space-y-3 text-sm leading-6">
        <div>
          <dt className="font-medium text-foreground">Information</dt>
          <dd>{information}</dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">Purpose</dt>
          <dd>{purpose}</dd>
        </div>
        <div>
          <dt className="font-medium text-foreground">Lawful basis</dt>
          <dd>{lawfulBasis}</dd>
        </div>
      </dl>
    </div>
  );
}

type LegalSectionProps = {
  title: string;
  children: ReactNode;
};

export function LegalSection({
  title,
  children,
}: LegalSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        {title}
      </h2>

      <div className="space-y-4 leading-7">
        {children}
      </div>
    </section>
  );
}