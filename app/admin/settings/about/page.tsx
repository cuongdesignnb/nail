import { AboutPageEditor } from "@/components/admin/about-settings/AboutPageEditor";

export default function AdminAboutSettingsPage() {
  return (
    <div className="admin-page">
      <section className="admin-section-heading">
        <div>
          <h1>About Page Settings</h1>
          <p>Manage the content, images, SEO and call-to-action sections of the public About page.</p>
        </div>
      </section>
      <AboutPageEditor />
    </div>
  );
}
