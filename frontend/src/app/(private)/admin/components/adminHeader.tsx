"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "../../user/context/userContext";

const NAV_LINKS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/products", label: "Produtos" },
  { href: "/admin/users", label: "Usuários" },
  { href: "/coupon", label: "Cupons" },
  { href: "/user", label: "Perfil" },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const { logout } = useUser();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/sigin");
  }

  return (
    <header className="w-full bg-teal-950 border-b border-teal-800 shadow-md">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-extrabold text-amber-200 tracking-tight">
            Brazilian Core
          </span>
          <span className="text-xs font-bold bg-amber-200 text-teal-950 rounded-full px-2 py-0.5 uppercase tracking-widest">
            Admin
          </span>
        </div>

        <nav className="flex items-center gap-2">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  active
                    ? "bg-amber-200 text-teal-950"
                    : "text-amber-200 hover:bg-teal-800"
                }`}
              >
                {label}
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="ml-4 px-4 py-2 rounded-lg font-semibold text-sm text-red-300 hover:bg-teal-800 transition-all duration-200 cursor-pointer"
          >
            Sair
          </button>
        </nav>
      </div>
    </header>
  );
}
