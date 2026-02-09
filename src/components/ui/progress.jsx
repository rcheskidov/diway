import React from "react";

export function Progress({ value = 0, className = "", ...props }) {
  const safeValue = Math.min(100, Math.max(0, value));
  return (
    <div
      className={`h-2 w-full rounded-full bg-slate-200 ${className}`.trim()}
      {...props}
    >
      <div
        className="h-full rounded-full bg-slate-900 transition-all"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}
