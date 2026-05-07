import * as React from "react";
import { logSiteLohnEvent } from "../../../lib/siteLohnTagging";

type Variant = "primary" | "outline" | "light";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  trackingId?: string;
  trackingLabel?: string;
};

export default function Button({
  className = "",
  variant = "primary",
  children,
  trackingId,
  trackingLabel,
  onClick,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lohn-accent/40 disabled:pointer-events-none disabled:opacity-50";

  const variants: Record<Variant, string> = {
    primary: "bg-lohn-dark text-lohn-light hover:bg-lohn-dark/90",
    light: "bg-lohn-light text-lohn-dark hover:bg-lohn-light/90",
    outline:
      "border border-lohn-dark/30 text-lohn-dark hover:bg-lohn-dark/5 hover:border-lohn-dark/45",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      onClick={(e) => {
        if (trackingId || trackingLabel) {
          logSiteLohnEvent({
            event_type: "button_click",
            page_path: `${window.location.pathname}${window.location.search}${window.location.hash}`,
            button_id: trackingId ?? null,
            button_label: trackingLabel ?? null,
          });
        }

        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
}