"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Save, X } from "lucide-react";
import { AdminFormField } from "@/components/admin/ui";

interface UserFormData {
  name: string;
  email: string;
  role: string;
  password: string;
}

interface UserFormProps {
  initialData?: {
    id?: string;
    name: string;
    email: string;
    role: string;
  };
  onSubmit: (data: UserFormData) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

const ROLES = ["Owner", "Manager", "Receptionist", "Technician"];

const inputClass =
  "w-full rounded-xl border border-[var(--admin-border-strong)] bg-white px-3.5 py-2.5 text-xs text-[var(--admin-ink)] placeholder:text-[var(--admin-placeholder)] transition-colors focus:border-[var(--admin-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/20";

export const UserForm: React.FC<UserFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false,
}) => {
  const [form, setForm] = useState<UserFormData>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    role: initialData?.role || "Manager",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Invalid email";
    if (!isEdit && !form.password) errs.password = "Password is required for new users";
    if (form.password && form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  };

  const update = (key: keyof UserFormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <AdminFormField label="Full Name" required error={errors.name} htmlFor="user-name">
        <input
          id="user-name"
          type="text"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Enter full name"
          className={inputClass}
        />
      </AdminFormField>

      <AdminFormField label="Email" required error={errors.email} htmlFor="user-email">
        <input
          id="user-email"
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="Enter email address"
          className={inputClass}
        />
      </AdminFormField>

      <AdminFormField label="Role" required htmlFor="user-role">
        <select
          id="user-role"
          value={form.role}
          onChange={(e) => update("role", e.target.value)}
          className={inputClass}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </AdminFormField>

      <AdminFormField
        label={isEdit ? "New Password (leave blank to keep current)" : "Password"}
        required={!isEdit}
        error={errors.password}
        htmlFor="user-password"
      >
        <input
          id="user-password"
          type="password"
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          placeholder={isEdit ? "••••••••" : "Enter password"}
          className={inputClass}
        />
      </AdminFormField>

      <div className="flex items-center gap-3 pt-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--admin-accent)] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[var(--admin-accent-hover)] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-accent)]/40 focus-visible:ring-offset-2"
        >
          <Save className="h-3.5 w-3.5" />
          {submitting ? "Saving…" : isEdit ? "Update User" : "Create User"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-[var(--admin-border-strong)] bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--admin-ink)] transition-colors hover:bg-[var(--admin-surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-accent)]/40 focus-visible:ring-offset-2"
        >
          <span className="flex items-center gap-1.5">
            <X className="h-3.5 w-3.5" />
            Cancel
          </span>
        </button>
      </div>
    </motion.form>
  );
};

export default UserForm;
