import React from "react";

const baseCard = "rounded-2xl border border-slate-200 bg-white shadow-sm";

export function Card({ className = "", ...props }) {
  return <div className={`${baseCard} ${className}`.trim()} {...props} />;
}

export function CardHeader({ className = "", ...props }) {
  return <div className={`p-5 ${className}`.trim()} {...props} />;
}

export function CardTitle({ className = "", ...props }) {
  return <h3 className={`text-lg font-semibold ${className}`.trim()} {...props} />;
}

export function CardContent({ className = "", ...props }) {
  return <div className={`p-5 ${className}`.trim()} {...props} />;
}
