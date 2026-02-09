import React, { createContext, useContext } from "react";

const DialogContext = createContext(null);

export function Dialog({ open, onOpenChange, children }) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogContent({ className = "", children, ...props }) {
  const context = useContext(DialogContext);
  if (!context?.open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={() => context.onOpenChange?.(false)}
    >
      <div
        className={`w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg ${className}`.trim()}
        onClick={(event) => event.stopPropagation()}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ className = "", ...props }) {
  return <div className={`mb-4 space-y-1 ${className}`.trim()} {...props} />;
}

export function DialogTitle({ className = "", ...props }) {
  return <h3 className={`text-lg font-semibold ${className}`.trim()} {...props} />;
}

export function DialogDescription({ className = "", ...props }) {
  return <p className={`text-sm text-slate-500 ${className}`.trim()} {...props} />;
}
