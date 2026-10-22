/** Labeled stand-in tile until the client's real photo or clip is added to config. */
export default function MediaPlaceholder({
  label,
  tone = "light",
  align = "center",
  className = "",
}: {
  label: string;
  tone?: "light" | "dark";
  /** Where the label sits; before/after sliders put each side's label on its own half. */
  align?: "center" | "left" | "right";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div
      className={`absolute inset-0 flex items-center ${
        align === "left" ? "justify-start pl-[12%]" : align === "right" ? "justify-end pr-[12%]" : "justify-center"
      } ${
        dark ? "bg-ink-2 text-muted-dark" : "bg-sand text-muted"
      } ${className}`}
      role="img"
      aria-label={`Placeholder: ${label}`}
    >
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "16px 16px",
        }}
        aria-hidden
      />
      <div className="relative flex flex-col items-center gap-2 px-6 text-center">
        <svg className="h-7 w-7 opacity-70" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">{label}</span>
      </div>
    </div>
  );
}
