import * as React from "react";

export function Card({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl border border-gold/15 bg-neutral-950/40 p-6 backdrop-blur ${className}`}
      {...props}
    />
  );
}

export function CardTitle({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`text-base font-semibold tracking-tight text-gold ${className}`}
      {...props}
    />
  );
}

export function CardDescription({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-sm leading-relaxed text-neutral-300 ${className}`} {...props} />
  );
}
