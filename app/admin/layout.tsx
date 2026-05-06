"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import "@/app/globals.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = Cookies.get("admin_token");
    const user = Cookies.get("admin_username");
    if (!token && pathname !== "/admin/login") {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
      if (user) setUsername(user);
    }
    setIsLoading(false);
  }, [pathname, router]);

  const handleLogout = () => {
    Cookies.remove("admin_token");
    Cookies.remove("admin_username");
    router.push("/admin/login");
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500 font-medium">Loading session...</div>;

  if (!isAuthenticated && pathname !== "/admin/login") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {pathname !== "/admin/login" && (
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-gray-950 tracking-tight">Hyle Admin</h1>
            <nav className="flex gap-1">
              <Link href="/admin/requests" className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${pathname === '/admin/requests' ? 'bg-forest/5 text-forest' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
                Requests
              </Link>
              <Link href="/admin/blogs" className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${pathname === '/admin/blogs' ? 'bg-forest/5 text-forest' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
                Blogs
              </Link>
              <Link href="/admin" className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${pathname === '/admin' ? 'bg-forest/5 text-forest' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
                Admins
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold uppercase text-gray-400 tracking-widest">Account</span>
              <span className="text-sm font-bold text-forest">{username}</span>
            </div>
            <div className="h-8 w-[1px] bg-gray-200" />
            <button
              onClick={handleLogout}
              className="text-sm font-bold text-red-600 hover:text-red-700 px-4 py-2 rounded-md transition-colors hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </header>
      )}
      <main className="p-8 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
