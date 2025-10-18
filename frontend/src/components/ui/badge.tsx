import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "success" | "warning";
}

export const Badge = ({
  className,
  variant = "default",
  ...props
}: BadgeProps) => {
  const variantClasses: Record<BadgeProps["variant"], string> = {
    default: "bg-brand-100 text-brand-700",
    outline: "border border-brand-300 text-brand-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
};
