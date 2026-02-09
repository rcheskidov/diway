import React from "react";

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed";

const variantClasses = {
  default: "bg-slate-900 text-white border-slate-900",
  secondary: "bg-slate-100 text-slate-900 border-slate-200",
  outline: "bg-white text-slate-900 border-slate-200",
  ghost: "bg-transparent text-slate-700 border-transparent",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-xs",
  icon: "h-9 w-9 p-0",
};

export function Button({
  variant = "default",
  size,
  className = "",
  type = "button",
  ...props
}) {
  const classes = [
    baseClasses,
    variantClasses[variant] || variantClasses.default,
    size ? sizeClasses[size] : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <button type={type} className={classes} {...props} />;
}
