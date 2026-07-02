import React, { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";
import clsx from "clsx";

interface FormFieldBase {
  label: string;
  error?: string;
  description?: string;
}

interface InputProps extends FormFieldBase, InputHTMLAttributes<HTMLInputElement> {
  type?: "text" | "number" | "email" | "password" | "url" | "checkbox";
}

interface TextareaProps extends FormFieldBase, TextareaHTMLAttributes<HTMLTextAreaElement> {
  rows?: number;
}

interface SelectProps extends FormFieldBase, SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

export function FormField({
  label,
  error,
  description,
  id,
  type = "text",
  className,
  ...props
}: InputProps) {
  const isCheckbox = type === "checkbox";
  return (
    <div className={clsx("flex flex-col gap-1.5 w-full font-sans mb-4", { "flex-row-reverse items-center justify-end gap-3": isCheckbox }, className)}>
      {!isCheckbox && (
        <label htmlFor={id} className="text-xs font-semibold text-aera-ink tracking-wide">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={clsx(
          "w-full rounded-lg border border-aera-champagne/60 px-3 py-2 text-xs font-sans text-aera-ink placeholder-aera-muted/40 outline-none focus:border-aera-accent transition-all bg-white",
          {
            "border-rose-300 focus:border-rose-500": error,
            "w-4 h-4 rounded border-aera-champagne accent-aera-accent cursor-pointer": isCheckbox,
          }
        )}
        {...props}
      />
      {isCheckbox && (
        <label htmlFor={id} className="text-xs font-semibold text-aera-ink tracking-wide cursor-pointer select-none">
          {label}
        </label>
      )}
      {description && <p className="text-[10px] text-aera-muted">{description}</p>}
      {error && <p className="text-[10px] text-rose-500 font-medium">{error}</p>}
    </div>
  );
}

export function FormTextarea({
  label,
  error,
  description,
  id,
  rows = 3,
  className,
  ...props
}: TextareaProps) {
  return (
    <div className={clsx("flex flex-col gap-1.5 w-full font-sans mb-4", className)}>
      <label htmlFor={id} className="text-xs font-semibold text-aera-ink tracking-wide">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        className={clsx(
          "w-full rounded-lg border border-aera-champagne/60 px-3 py-2 text-xs font-sans text-aera-ink placeholder-aera-muted/40 outline-none focus:border-aera-accent transition-all bg-white resize-y",
          {
            "border-rose-300 focus:border-rose-500": error,
          }
        )}
        {...props}
      />
      {description && <p className="text-[10px] text-aera-muted">{description}</p>}
      {error && <p className="text-[10px] text-rose-500 font-medium">{error}</p>}
    </div>
  );
}

export function FormSelect({
  label,
  error,
  description,
  id,
  options,
  className,
  ...props
}: SelectProps) {
  return (
    <div className={clsx("flex flex-col gap-1.5 w-full font-sans mb-4", className)}>
      <label htmlFor={id} className="text-xs font-semibold text-aera-ink tracking-wide">
        {label}
      </label>
      <select
        id={id}
        className={clsx(
          "w-full rounded-lg border border-aera-champagne/60 px-3 py-2 text-xs font-sans text-aera-ink outline-none focus:border-aera-accent transition-all bg-white",
          {
            "border-rose-300 focus:border-rose-500": error,
          }
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {description && <p className="text-[10px] text-aera-muted">{description}</p>}
      {error && <p className="text-[10px] text-rose-500 font-medium">{error}</p>}
    </div>
  );
}
