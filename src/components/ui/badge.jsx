import React from "react";

const variantClasses = {
  default: "bg-slate-900 text-white",
  secondary: "bg-slate-100 text-slate-700",
  outline: "border border-slate-200 text-slate-700",
  destructive: "bg-rose-500 text-white",
};

export function Badge({ variant = "default", className = "", ...props }) {
  const classes = [
    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
    variantClasses[variant] || variantClasses.default,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={classes} {...props} />;
}
