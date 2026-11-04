import type { Metadata } from "next";
import AdminAuth from "./components/AdminAuth/AdminAuth";

export const metadata: Metadata = {
  title: "Panel administracyjny",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminAuth>{children}</AdminAuth>;
}
