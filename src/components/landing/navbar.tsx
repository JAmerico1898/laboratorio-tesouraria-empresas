"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { strings } from "@/lib/strings";

const NAV_ITEMS = [
  { label: strings.navHome, href: "/" },
  { label: strings.navM1, href: "/modulo-1" },
  { label: strings.navM2, href: "/modulo-2" },
  { label: strings.navM3, href: "/modulo-3" },
  { label: strings.navM4, href: "/modulo-4" },
  { label: strings.navM5, href: "/modulo-5" },
  { label: "Estudos de Caso", href: "/estudos-de-caso" },
] as const;

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-[0_12px_32px_rgba(25,28,29,0.06)]">
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between gap-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-xl font-extrabold text-primary tracking-tighter font-heading shrink-0"
        >
          <Image
            src="/logo/finlab-logo-white.jpg"
            alt="FinLab"
            width={250}
            height={212}
            priority
            className="h-9 w-auto rounded-md"
          />
          {strings.siteTitle}
        </Link>
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {NAV_ITEMS.filter((item) => item.href !== pathname).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-1.5 rounded-lg text-sm font-semibold text-on-surface-variant hover:text-primary hover:bg-primary-container/20 transition-colors whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
