import * as React from "react";

type Variant = "primary" | "outline";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export default function Button({
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 disabled:pointer-events-none disabled:opacity-50";

  const variants: Record<Variant, string> = {
    primary:
      "bg-gold text-black hover:bg-gold-soft shadow-[0_0_0_1px_rgba(212,175,55,0.25)]",
    outline:
      "border border-gold/40 text-gold hover:bg-gold/10 hover:border-gold/70",
  };

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
