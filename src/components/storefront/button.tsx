import type { ReactNode } from "react";
import Link from "next/link";

const baseClassName =
  "inline-flex items-center justify-center rounded-xl bg-accent px-8 py-2.5 text-center font-[family-name:var(--font-display)] text-xl font-[750] text-accent-foreground transition-opacity hover:opacity-90";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  external?: boolean;
  className?: string;
};

export function ButtonLink({
  href,
  children,
  external = false,
  className = "",
}: ButtonLinkProps) {
  const classes = `${baseClassName} ${className}`.trim();

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
