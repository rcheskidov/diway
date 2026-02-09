import React, { createContext, useContext, useMemo, useState } from "react";

const TabsContext = createContext(null);

export function Tabs({ defaultValue, value: controlledValue, onValueChange, className = "", ...props }) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const value = controlledValue ?? uncontrolledValue;

  const setValue = (nextValue) => {
    if (controlledValue === undefined) {
      setUncontrolledValue(nextValue);
    }
    if (onValueChange) {
      onValueChange(nextValue);
    }
  };

  const contextValue = useMemo(() => ({ value, setValue }), [value]);

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={className} {...props} />
    </TabsContext.Provider>
  );
}

export function TabsList({ className = "", ...props }) {
  return (
    <div className={`inline-flex rounded-full border border-slate-200 bg-white p-1 ${className}`.trim()} {...props} />
  );
}

export function TabsTrigger({ value, className = "", ...props }) {
  const context = useContext(TabsContext);
  const isActive = context?.value === value;
  return (
    <button
      type="button"
      onClick={() => context?.setValue(value)}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        isActive ? "bg-slate-900 text-white" : "text-slate-600"
      } ${className}`.trim()}
      {...props}
    />
  );
}

export function TabsContent({ value, className = "", ...props }) {
  const context = useContext(TabsContext);
  if (context?.value !== value) {
    return null;
  }
  return <div className={className} {...props} />;
}
