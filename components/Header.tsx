"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export function Header() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "HOME" },
    { href: "/browse", label: "BROWSE" },
    { href: "/about", label: "ABOUT" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-baseline gap-2 transition-transform hover:opacity-90 active:scale-[0.99]"
        >
          <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            THE FINE MENU
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
            / IND
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1 sm:gap-6">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-mono text-xs sm:text-sm tracking-wider px-2.5 py-1.5 rounded transition-all duration-150",
                  isActive
                    ? "text-foreground font-semibold bg-neutral-200/60"
                    : "text-muted hover:text-foreground hover:bg-neutral-100"
                )}
              >
                {link.label}
              </Link>
            );
          })}

          <Link
            href="/browse"
            aria-label="Search directory"
            className="ml-2 flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted hover:text-foreground hover:border-foreground/40 transition-colors"
          >
            <Search className="h-3.5 w-3.5" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
