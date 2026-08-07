import Link from "next/link";
import Image from "next/image";

const navigationLinks = [
  {
    label: "Problems",
    href: "/problems",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

const legalLinks = [
  {
    label: "Privacy Policy",
    href: "/privacy",
  },
  {
    label: "Terms of Use",
    href: "/terms",
  },
];

const linkStyles =
  "text-sm text-muted-foreground transition-colors hover:text-foreground";

function FooterLinks() {
  return (
    <div className="grid grid-cols-2 gap-x-10 sm:gap-x-16">
      <nav aria-labelledby="footer-navigation">
        <h2 id="footer-navigation" className="text-sm font-semibold">
          Explore
        </h2>

        <ul className="mt-4 space-y-3 list-none! pl-0!">
          {navigationLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={linkStyles}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <nav aria-labelledby="footer-legal">
        <h2 id="footer-legal" className="text-sm font-semibold">
          Legal
        </h2>

        <ul className="mt-4 space-y-3 list-none! pl-0!">
          {legalLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={linkStyles}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30 backdrop-blur">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-10 sm:px-8 md:grid-cols-[1.5fr_auto] md:justify-between">
        <div className="max-w-sm">
          <p className="text-xl font-bold">Codey</p>

          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Practise coding problems, test your solutions and track your
            progress.
          </p>
        </div>

        <FooterLinks />
      </div>

      <div className="border-t">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5 sm:px-8">
          <p className="min-w-0 text-sm text-muted-foreground">
            © {currentYear} Codey. Personal learning project.
          </p>

          <a
            href="https://github.com/akakj/Codey"
            target="_blank"
            rel="noreferrer"
            aria-label="View Codey on GitHub"
            className="inline-flex size-9 items-center justify-center"
          >
            <Image
              src="../github.svg"
              alt=""
              width={20}
              height={20}
              aria-hidden="true"
              className="opacity-70 transition-opacity dark:invert hover:opacity-100"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
