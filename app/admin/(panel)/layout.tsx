import { requireAdmin } from "@/lib/session";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <AdminShell>{children}</AdminShell>;
}
