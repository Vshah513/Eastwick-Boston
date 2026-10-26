"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Results", href: "#results" },
  { label: "Founders", href: "#founders" },
  { label: "Areas", href: "#areas" },
  { label: "FAQ", href: "#faq" },
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

/** Floating frosted pill: logo left, links centred (desktop), quote action right. */
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
    const onScroll = () => setScrolled(window.scrollY > 24);
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

  return (
    // No backdrop-filter on the header itself: it would become the containing
    // block for the fixed dimmer and shrink it to the bar.
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-5 lg:px-6 lg:pt-5">
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="dimmer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-ink/45 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
        )}
      </AnimatePresence>

      <nav aria-label="Main" className="relative mx-auto max-w-6xl">
        <div
          className={`flex h-14 items-center justify-between rounded-full border bg-white/95 pr-1.5 pl-5 backdrop-blur-xl transition-shadow duration-300 sm:h-16 sm:pr-2 sm:pl-6 ${
            scrolled || mobileOpen
              ? "border-line shadow-[0_10px_40px_-12px_rgba(11,27,51,0.28)]"
              : "border-white/60 shadow-[0_4px_20px_-8px_rgba(11,27,51,0.2)]"
          }`}
        >
          <Link href="/" className="flex shrink-0 items-center" aria-label="Home">
            <BrandLogo priority tone="light" sizeClassName="h-7 w-auto sm:h-8 max-w-[min(100vw-9rem,200px)]" />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => onSectionLinkClick(e, link.href)}
                  className="rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-fog hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            <a
              href="#quote"
              onClick={(e) => onSectionLinkClick(e, "#quote")}
              className="hidden items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover sm:inline-flex"
            >
              Free quote <span aria-hidden>→</span>
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white transition-colors hover:bg-ink-2 lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                {mobileOpen ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 9h16M4 15h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu: a card that drops from the pill */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-full mt-2 origin-top overflow-hidden rounded-[28px] bg-white p-2 shadow-[0_30px_80px_-20px_rgba(11,27,51,0.45)] lg:hidden"
            >
              <ul>
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.03 * i + 0.05, duration: 0.3 }}
                  >
                    <a
                      href={link.href}
                      onClick={(e) => onSectionLinkClick(e, link.href)}
                      className="flex items-center justify-between rounded-2xl px-4 py-3.5 font-heading text-2xl font-bold tracking-tight text-ink transition-colors hover:bg-fog"
                    >
                      {link.label}
                      <span className="text-xs font-semibold text-muted tabular-nums">0{i + 1}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
              <a
                href="#quote"
                onClick={(e) => onSectionLinkClick(e, "#quote")}
                className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-accent-hover"
              >
                Get your free quote <span aria-hidden>→</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
