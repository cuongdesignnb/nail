import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import SmtpSettingsForm from "@/components/admin/settings/SmtpSettingsForm";

export const dynamic = "force-dynamic";

export default function EmailSettingsPage() {
  return (
    <div className="admin-page-container">
      <AdminPageHeader
        breadcrumbs={[
          { label: "System" },
          { label: "Settings", href: "/admin/settings" },
          { label: "Email & SMTP" },
        ]}
        title="Email & SMTP"
        description="Configure secure transactional email delivery for bookings, Gift Cards and customer notifications."
      />
      <SmtpSettingsForm />
    </div>
  );
}
