import SocialIcon from "@/components/SocialIcon";
import { BUSINESS, type SocialLabel } from "@/lib/business";

/** Each network keeps its own colours at rest so the buttons stand out on the dark sections. */
const BRAND: Record<SocialLabel, string> = {
  Instagram:
    "border-transparent bg-[linear-gradient(45deg,#f9a825,#e1306c_55%,#833ab4)] shadow-[0_8px_20px_-8px_rgba(225,48,108,0.8)] hover:shadow-[0_14px_28px_-8px_rgba(225,48,108,0.9)]",
  LinkedIn:
    "border-transparent bg-[#0a66c2] shadow-[0_8px_20px_-8px_rgba(10,102,194,0.9)] hover:shadow-[0_14px_28px_-8px_rgba(10,102,194,1)]",
  TikTok:
    "border-white/25 bg-black shadow-[-2px_2px_0_0_#25f4ee,2px_-2px_0_0_#fe2c55] hover:shadow-[-3px_3px_0_0_#25f4ee,3px_-3px_0_0_#fe2c55]",
  YouTube:
    "border-transparent bg-[#ff0000] shadow-[0_8px_20px_-8px_rgba(255,0,0,0.8)] hover:shadow-[0_14px_28px_-8px_rgba(255,0,0,0.9)]",
};

export default function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-2.5 ${className}`}>
      {BUSINESS.socials.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${BUSINESS.name} on ${s.label}`}
          className={`group inline-flex h-12 items-center gap-2.5 rounded-full border px-4 text-sm font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-1 hover:brightness-110 focus-visible:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${BRAND[s.label]}`}
        >
          <SocialIcon label={s.label} className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          {s.label}
        </a>
      ))}
    </div>
  );
}
