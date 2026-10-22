"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PHONE_HREF, SMS_HREF } from "@/lib/business";

/**
 * Phone-only bottom bar (Call · Text · Get a Quote). Appears once the hero is
 * scrolled past and hides while the quote form is on screen.
 */
export default function StickyActionBar() {
  const [pastHero, setPastHero] = useState(false);
  const [quoteVisible, setQuoteVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const quote = document.getElementById("quote");
    const io = quote
      ? new IntersectionObserver(([entry]) => setQuoteVisible(entry.isIntersecting), { threshold: 0.05 })
      : null;
    if (quote) io?.observe(quote);

    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  const show = pastHero && !quoteVisible;
  const btn = "flex flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl py-2 text-xs font-semibold";

  return (
    <AnimatePresence>
      {show && (
        <motion.nav
          aria-label="Quick contact"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-sand bg-cream/95 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden"
        >
          <div className="flex gap-2">
            <a href={PHONE_HREF} className={`${btn} text-ink`}>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
              Call
            </a>
            <a href={SMS_HREF} className={`${btn} text-ink`}>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
              Text
            </a>
            <a href="#quote" className={`${btn} flex-[1.6] flex-row gap-2 bg-copper text-sm text-white`}>
              Get a Quote <span aria-hidden>→</span>
            </a>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
