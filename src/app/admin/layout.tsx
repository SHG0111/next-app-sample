import { ReactNode } from "react";
import Sidebar from "./components/sidebar/page";
interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:max-w-7xl ml-auto">{children}</main>
    </div>
  );
}
