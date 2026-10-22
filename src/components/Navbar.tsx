"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { HAS_REVIEWS } from "@/content/reviews";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Transformations", href: "#transformations" },
  ...(HAS_REVIEWS ? [{ label: "Reviews", href: "#reviews" }] : []),
  { label: "Team", href: "#team" },
  { label: "Areas", href: "#areas" },
  { label: "Contact", href: "#contact" },
];

/**
 * In-app section navigation. Using preventDefault + scrollIntoView fixes mobile:
 * closing the menu on click unmounts the <a> before the browser can apply
 * default hash navigation, so nothing scrolls.
 */
function scrollToSectionId(hash: string) {
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", `#${id}`);
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const onSectionLinkClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      e.preventDefault();
      // Release the menu's scroll lock now, before scrolling, rather than
      // waiting for the effect cleanup after the close re-render.
      document.body.style.overflow = "";
      setMobileOpen(false);
      // Let React close the menu / commit layout, then scroll (keeps iOS in sync too).
      requestAnimationFrame(() => {
        requestAnimationFrame(() => scrollToSectionId(href));
      });
    },
    []
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  // Light surface (cream bar or open menu) → navy logo and dark text.
  const light = scrolled || mobileOpen;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        // No backdrop-filter while the menu is open: it would become the containing
        // block for the fixed full-screen sheet and squash it into the bar.
        mobileOpen
          ? "bg-cream border-b border-sand"
          : scrolled
            ? "bg-cream/90 backdrop-blur-xl border-b border-sand"
            : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between sm:h-18">
          {/* Logo — crossfade between dark-surface (over hero) and light-surface variants. */}
          <Link href="/" className="relative flex shrink-0 items-center py-1" aria-label="Home">
            <BrandLogo
              priority
              tone="dark"
              sizeClassName="h-8 w-auto sm:h-9 max-w-[min(100vw-8rem,220px)]"
              className={`transition-opacity duration-500 ${light ? "opacity-0" : "opacity-100"}`}
            />
            <BrandLogo
              priority
              tone="light"
              sizeClassName="h-8 w-auto sm:h-9 max-w-[min(100vw-8rem,220px)]"
              className={`absolute inset-0 transition-opacity duration-500 ${light ? "opacity-100" : "opacity-0"}`}
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => onSectionLinkClick(e, link.href)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  light ? "text-muted hover:text-ink" : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:block">
            <a
              href="#quote"
              onClick={(e) => onSectionLinkClick(e, "#quote")}
              className="inline-flex items-center gap-2 rounded-full bg-copper px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-copper-hover"
            >
              Get a Quote
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`-mr-2 rounded-full p-2.5 transition-colors lg:hidden ${light ? "text-ink" : "text-white"}`}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
              {mobileOpen ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu: full-screen cream sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-16 bottom-0 flex flex-col bg-cream px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-6 sm:top-18 lg:hidden"
          >
            <ul className="flex-1 space-y-1 overflow-y-auto">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i + 0.05, duration: 0.35 }}
                >
                  <a
                    href={link.href}
                    onClick={(e) => onSectionLinkClick(e, link.href)}
                    className="flex items-center justify-between border-b border-sand py-4 font-heading text-3xl text-ink"
                  >
                    {link.label}
                    <span className="text-lg text-copper" aria-hidden>→</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <a
              href="#quote"
              onClick={(e) => onSectionLinkClick(e, "#quote")}
              className="mt-6 block rounded-full bg-copper px-6 py-4 text-center text-base font-semibold text-white transition-colors hover:bg-copper-hover"
            >
              Get Your Free Quote
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
