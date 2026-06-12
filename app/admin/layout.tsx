// app/admin/layout.tsx
import Link from "next/link";
import { LayoutDashboard, ShoppingBag, Package, Settings, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#1A1A1A] text-[#FFFFFF] flex flex-col hidden md:flex">
        <div className="p-6 border-b border-[#333333]">
          <h1 className="text-xl font-bold uppercase tracking-widest">Monvera</h1>
          <p className="text-xs text-[#FFFFFF]/50 mt-1 uppercase tracking-widest">Command Center</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-md bg-[#333333] text-[#FFFFFF] transition-colors">
            <LayoutDashboard size={18} />
            <span className="text-sm font-bold tracking-wider">Overview</span>
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-md text-[#FFFFFF]/70 hover:bg-[#333333] hover:text-[#FFFFFF] transition-colors">
            <ShoppingBag size={18} />
            <span className="text-sm font-bold tracking-wider">Orders</span>
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-md text-[#FFFFFF]/70 hover:bg-[#333333] hover:text-[#FFFFFF] transition-colors">
            <Package size={18} />
            <span className="text-sm font-bold tracking-wider">Products</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-[#333333]">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-md text-[#FFFFFF]/70 hover:bg-[#333333] hover:text-[#FFFFFF] transition-colors">
            <LogOut size={18} />
            <span className="text-sm font-bold tracking-wider">Exit to Store</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}