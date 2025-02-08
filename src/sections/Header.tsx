"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Logo, MenuIcon } from "@/assets";
import { Button } from "@/components/Button";

const navItems = [
  { href: "/services", title: "Services" },
  { href: "/innovations", title: "Innovations" },
  // { href: "/contracts", title: "Contract" },
  { href: "/contactus", title: "Contact Us" },
];

export const Header = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header className="sticky top-0 py-4 border-b border-white/15 md:border-none z-10">
      <div className="absolute inset-0 backdrop-blur -z-10 md:hidden"></div>
      <div className="container">
        <div className="relative flex justify-between items-center md:border border-white/15 md:p-2.5 rounded-xl max-w-2xl mx-auto">
          <div className="absolute inset-0 backdrop-blur -z-10 hidden md:block"></div>
          <div>
            <div className="inline-flex items-center justify-center size-10 border border-white/15 rounded-lg">
              <Link href="/">
                <Logo className="size-8" />
              </Link>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <nav className="flex gap-8 text-sm">
              {navItems.map((link, index) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={index}
                    href={link.href}
                    className={`transition ${
                      isActive
                        ? "text-blue-400 font-semibold neon-glow"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    {link.title}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <Link href="https://www.linkedin.com/in/mainak-chaudhuri-127898176/" target="_blank">
              <Button>Reach Out</Button>
            </Link>
            <button onClick={toggleMenu} className="md:hidden">
              <MenuIcon />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <nav className="absolute top-16 left-0 w-full bg-black/80 backdrop-blur-md p-4 flex flex-col items-center gap-4 md:hidden">
            {navItems.map((link, index) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={index}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`text-white text-lg transition ${
                    isActive ? "text-blue-400 font-semibold neon-glow" : "hover:text-white/70"
                  }`}
                >
                  {link.title}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
};
