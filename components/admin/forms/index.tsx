"use client";

import React from "react";
import clsx from "clsx";

/* ── AdminFormSection ──────────────────────────────────────────────── */
export interface AdminFormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function AdminFormSection({ title, description, children, className }: AdminFormSectionProps) {
  return (
    <div className={clsx("rounded-admin-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6", className)}>
      <div className="mb-5">
        <h3 className="font-heading text-lg font-semibold text-[var(--admin-ink)]">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-[var(--admin-muted)]">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

/* ── AdminFormGrid ─────────────────────────────────────────────────── */
export interface AdminFormGridProps {
  columns?: 1 | 2 | 3;
  children: React.ReactNode;
  className?: string;
}

export function AdminFormGrid({ columns = 2, children, className }: AdminFormGridProps) {
  return (
    <div
      className={clsx(
        "grid gap-5",
        columns === 1 && "grid-cols-1",
        columns === 2 && "grid-cols-1 md:grid-cols-2",
        columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ── AdminFieldLabel ───────────────────────────────────────────────── */
export interface AdminFieldLabelProps {
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function AdminFieldLabel({ htmlFor, required, children, className }: AdminFieldLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={clsx(
        "mb-1.5 block text-sm font-medium text-[var(--admin-ink)]",
        className
      )}
    >
      {children}
      {required && <span className="ml-0.5 text-[var(--admin-danger)]">*</span>}
    </label>
  );
}

/* ── AdminFieldHint ────────────────────────────────────────────────── */
export interface AdminFieldHintProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminFieldHint({ children, className }: AdminFieldHintProps) {
  return (
    <p className={clsx("mt-1.5 text-xs text-[var(--admin-muted)]", className)}>
      {children}
    </p>
  );
}

/* ── AdminFieldError ───────────────────────────────────────────────── */
export interface AdminFieldErrorProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminFieldError({ children, className }: AdminFieldErrorProps) {
  if (!children) return null;
  return (
    <p className={clsx("mt-1.5 flex items-center gap-1 text-xs font-medium text-[var(--admin-danger)]", className)}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <circle cx="6" cy="6" r="5.5" stroke="currentColor" strokeWidth="1" />
        <path d="M6 3.5v3M6 8h.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      {children}
    </p>
  );
}

/* ── AdminToggle ───────────────────────────────────────────────────── */
export interface AdminToggleFormProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  helpText?: string;
  disabled?: boolean;
}

export function AdminToggleField({ label, checked, onChange, helpText, disabled }: AdminToggleFormProps) {
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={clsx(
          "relative mt-0.5 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
          checked ? "bg-[var(--admin-accent)]" : "bg-[var(--admin-border-strong)]",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <span
          className={clsx(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
      {(label || helpText) && (
        <div>
          {label && <span className="text-sm font-medium text-[var(--admin-ink)]">{label}</span>}
          {helpText && <p className="mt-0.5 text-xs text-[var(--admin-muted)]">{helpText}</p>}
        </div>
      )}
    </div>
  );
}

/* ── AdminCheckbox ─────────────────────────────────────────────────── */
export interface AdminCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  helpText?: string;
  disabled?: boolean;
}

export function AdminCheckbox({ label, checked, onChange, helpText, disabled }: AdminCheckboxProps) {
  return (
    <label className={clsx("flex items-start gap-3 cursor-pointer", disabled && "cursor-not-allowed opacity-50")}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="mt-0.5 h-4 w-4 rounded border-[var(--admin-border-strong)] accent-[var(--admin-accent)]"
      />
      <div>
        <span className="text-sm font-medium text-[var(--admin-ink)]">{label}</span>
        {helpText && <p className="mt-0.5 text-xs text-[var(--admin-muted)]">{helpText}</p>}
      </div>
    </label>
  );
}

/* ── AdminRadioCard ────────────────────────────────────────────────── */
export interface AdminRadioCardProps {
  label: string;
  description?: string;
  value: string;
  selected: boolean;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export function AdminRadioCard({ label, description, value, selected, onChange, icon, disabled }: AdminRadioCardProps) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(value)}
      disabled={disabled}
      className={clsx(
        "flex items-start gap-3 rounded-admin-lg border p-4 text-left transition-all",
        selected
          ? "border-[var(--admin-accent)] bg-[var(--admin-accent-soft)]"
          : "border-[var(--admin-border)] bg-[var(--admin-surface)] hover:border-[var(--admin-border-strong)]",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      {icon && (
        <div className={clsx(
          "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-admin-md",
          selected ? "bg-[var(--admin-accent-muted)] text-[var(--admin-accent)]" : "bg-[var(--admin-surface-muted)] text-[var(--admin-muted)]"
        )}>
          {icon}
        </div>
      )}
      <div>
        <span className={clsx(
          "text-sm font-semibold",
          selected ? "text-[var(--admin-accent)]" : "text-[var(--admin-ink)]"
        )}>
          {label}
        </span>
        {description && (
          <p className="mt-0.5 text-xs text-[var(--admin-muted)]">{description}</p>
        )}
      </div>
    </button>
  );
}

/* ── AdminImageField ───────────────────────────────────────────────── */
export interface AdminImageFieldProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  onPickerOpen?: () => void;
  helpText?: string;
  error?: string;
  required?: boolean;
}

export function AdminImageField({ label, value, onChange, onPickerOpen, helpText, error, required }: AdminImageFieldProps) {
  return (
    <div>
      {label && <AdminFieldLabel required={required}>{label}</AdminFieldLabel>}
      <div
        onClick={onPickerOpen}
        className={clsx(
          "group relative flex h-32 cursor-pointer items-center justify-center overflow-hidden rounded-admin-lg border-2 border-dashed transition-colors",
          value ? "border-[var(--admin-border)]" : "border-[var(--admin-border-strong)]",
          "hover:border-[var(--admin-accent)] hover:bg-[var(--admin-accent-soft)]"
        )}
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-sm font-medium text-white">Change Image</span>
            </div>
          </>
        ) : (
          <div className="text-center">
            <svg className="mx-auto h-8 w-8 text-[var(--admin-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M6.75 7.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            <p className="mt-1 text-xs text-[var(--admin-muted)]">Click to select</p>
          </div>
        )}
      </div>
      {helpText && <AdminFieldHint>{helpText}</AdminFieldHint>}
      {error && <AdminFieldError>{error}</AdminFieldError>}
    </div>
  );
}

/* ── AdminRepeater ─────────────────────────────────────────────────── */
export interface AdminRepeaterProps<T> {
  items: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  addLabel?: string;
  maxItems?: number;
}

export function AdminRepeater<T>({ items, onAdd, onRemove, renderItem, addLabel = "Add Item", maxItems }: AdminRepeaterProps<T>) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="relative rounded-admin-md border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4">
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full text-[var(--admin-muted)] transition-colors hover:bg-[var(--admin-danger-soft)] hover:text-[var(--admin-danger)]"
            aria-label={`Remove item ${index + 1}`}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" />
            </svg>
          </button>
          {renderItem(item, index)}
        </div>
      ))}
      {(!maxItems || items.length < maxItems) && (
        <button
          type="button"
          onClick={onAdd}
          className="flex w-full items-center justify-center gap-2 rounded-admin-md border border-dashed border-[var(--admin-border-strong)] py-3 text-sm font-medium text-[var(--admin-muted)] transition-colors hover:border-[var(--admin-accent)] hover:text-[var(--admin-accent)] hover:bg-[var(--admin-accent-soft)]"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M7 3v8M3 7h8" />
          </svg>
          {addLabel}
        </button>
      )}
    </div>
  );
}

/* ── AdminFormFooter ───────────────────────────────────────────────── */
export interface AdminFormFooterProps {
  onSave: () => void;
  onCancel?: () => void;
  saving?: boolean;
  disabled?: boolean;
  saveLabel?: string;
  cancelLabel?: string;
  unsaved?: boolean;
  children?: React.ReactNode;
}

export function AdminFormFooter({
  onSave,
  onCancel,
  saving,
  disabled,
  saveLabel = "Save Changes",
  cancelLabel = "Cancel",
  unsaved,
  children,
}: AdminFormFooterProps) {
  return (
    <div className="sticky bottom-0 z-10 -mx-6 -mb-6 mt-6 flex items-center justify-between gap-4 border-t border-[var(--admin-border)] bg-[var(--admin-surface)]/95 px-6 py-4 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        {unsaved && (
          <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--admin-warning)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--admin-warning)]" />
            Unsaved changes
          </span>
        )}
        {children}
      </div>
      <div className="flex items-center gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-admin-md border border-[var(--admin-border-strong)] bg-[var(--admin-surface)] px-5 py-2.5 text-sm font-medium text-[var(--admin-ink)] transition-colors hover:bg-[var(--admin-surface-hover)] disabled:opacity-50"
          >
            {cancelLabel}
          </button>
        )}
        <button
          type="button"
          onClick={onSave}
          disabled={disabled || saving}
          className="inline-flex items-center gap-2 rounded-admin-md bg-[var(--admin-accent)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--admin-accent-hover)] disabled:opacity-50"
        >
          {saving && (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-25" />
              <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
            </svg>
          )}
          {saveLabel}
        </button>
      </div>
    </div>
  );
}
