import * as React from "react";
import { cn } from "@/lib/utils/cn";

const DEFAULT_MAX_NUMERIC_DIGITS = 12;
const DEFAULT_MAX_NUMERIC_DECIMALS = 6;
const DEFAULT_MAX_NUMERIC_VALUE = 999_999_999_999;

function limitNumericInput(value: string, maxDigits: number, maxDecimals: number) {
  if (value === "" || value === "-" || value === "." || value === "-.") {
    return value;
  }

  const isNegative = value.trim().startsWith("-");
  const sanitized = value.replace(/[^0-9.]/g, "");
  const [rawInteger = "", rawDecimal = ""] = sanitized.split(".");
  const integerPart = rawInteger.slice(0, Math.max(1, maxDigits));
  const decimalPart = maxDecimals > 0 ? rawDecimal.slice(0, maxDecimals) : "";
  const hasDecimal = sanitized.includes(".") || value.includes(".");

  let nextValue = integerPart;
  if (hasDecimal && maxDecimals > 0) {
    nextValue = `${integerPart}.${decimalPart}`;
  }

  if (isNegative && nextValue) {
    nextValue = `-${nextValue}`;
  } else if (isNegative && (value === "-" || value === "-.")) {
    nextValue = value;
  } else if (isNegative && hasDecimal && !nextValue) {
    nextValue = "-.";
  }

  return nextValue;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  maxDigits?: number;
  maxDecimals?: number;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, maxDigits, maxDecimals, onChange, inputMode, max, ...props },
    ref,
  ) => {
    const isNumeric = type === "number";
    const resolvedMaxDigits = maxDigits ?? DEFAULT_MAX_NUMERIC_DIGITS;
    const resolvedMaxDecimals = maxDecimals ?? DEFAULT_MAX_NUMERIC_DECIMALS;
    const resolvedInputMode = inputMode ?? (isNumeric ? "decimal" : undefined);
    const resolvedMax = isNumeric ? (max ?? DEFAULT_MAX_NUMERIC_VALUE) : max;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (isNumeric) {
        const nextValue = limitNumericInput(
          event.currentTarget.value,
          resolvedMaxDigits,
          resolvedMaxDecimals,
        );

        if (nextValue !== event.currentTarget.value) {
          event.currentTarget.value = nextValue;
        }
      }

      onChange?.(event);
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm",
          "ring-offset-background",
          "placeholder:text-muted-foreground",
          "transition-all duration-200",
          "hover:border-primary/50 hover:bg-muted/30",
          "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isNumeric && "tabular-nums text-right",
          className,
        )}
        inputMode={resolvedInputMode}
        max={resolvedMax}
        ref={ref}
        onChange={isNumeric ? handleChange : onChange}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
