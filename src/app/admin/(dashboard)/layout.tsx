import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminMobileNav from "@/components/admin/AdminMobileNav";
import PushSubscribe from "@/components/admin/PushSubscribe";
import OrderSoundListener from "@/components/admin/OrderSoundListener";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 md:flex-row">
      <PushSubscribe />
      <OrderSoundListener />
      <AdminMobileNav />
      <AdminSidebar />
      <div className="flex-1 px-4 py-6 md:px-8 md:py-10">{children}</div>
    </div>
  );
}
