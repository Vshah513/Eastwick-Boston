/**
 * A professional window squeegee, drawn with the blade vertical on the right
 * (the leading edge when moving right) and the handle trailing to the left.
 * Scales to any blade length: the viewBox is 120×200 and the blade spans the
 * full height. The blade's centre sits at (BLADE_X, 100) in viewBox units.
 */
export const VIEWBOX_W = 120;
export const VIEWBOX_H = 200;
export const BLADE_X = 106;

const BUBBLES = [
  [113, 14, 2.2], [116, 27, 1.4], [112, 41, 2.8], [117, 55, 1.6], [114, 68, 2.1],
  [111, 83, 1.3], [116, 96, 2.5], [113, 111, 1.7], [117, 124, 2.0], [112, 138, 2.6],
  [115, 152, 1.4], [113, 166, 2.3], [117, 179, 1.5], [112, 190, 1.9],
] as const;

export default function Squeegee({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
      preserveAspectRatio="none"
      className={className}
      style={style}
      aria-hidden
    >
      <defs>
        <linearGradient id="sq-brass" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#6b5020" />
          <stop offset="0.3" stopColor="#c9a24b" />
          <stop offset="0.5" stopColor="#f3dc93" />
          <stop offset="0.7" stopColor="#b8913f" />
          <stop offset="1" stopColor="#5e451a" />
        </linearGradient>
        <linearGradient id="sq-chrome" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f5f5f4" />
          <stop offset="0.45" stopColor="#a8a29e" />
          <stop offset="0.55" stopColor="#78716c" />
          <stop offset="1" stopColor="#d6d3d1" />
        </linearGradient>
        <linearGradient id="sq-grip" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#3f3a37" />
          <stop offset="0.35" stopColor="#1c1917" />
          <stop offset="1" stopColor="#0c0a09" />
        </linearGradient>
        <linearGradient id="sq-rubber" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#0c0a09" />
          <stop offset="0.6" stopColor="#292524" />
          <stop offset="1" stopColor="#0c0a09" />
        </linearGradient>
        <linearGradient id="sq-foam" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Handle: black rubber grip with ridges, angled cap */}
      <rect x="2" y="88" width="66" height="24" rx="11" fill="url(#sq-grip)" />
      {[12, 20, 28, 36, 44].map((x) => (
        <rect key={x} x={x} y="90" width="2.5" height="20" rx="1" fill="#000" opacity="0.45" />
      ))}
      <rect x="6" y="91" width="56" height="3" rx="1.5" fill="#fff" opacity="0.12" />

      {/* Chrome ferrule + clip joining handle to channel */}
      <rect x="64" y="92" width="12" height="16" rx="2" fill="url(#sq-chrome)" />
      <path d="M74 86 L96 80 L96 120 L74 114 Z" fill="url(#sq-chrome)" />
      <path d="M76 88 L94 83 L94 86 L76 91 Z" fill="#fff" opacity="0.6" />
      <circle cx="85" cy="100" r="3" fill="#57534e" />
      <circle cx="84.3" cy="99.3" r="1" fill="#fff" opacity="0.7" />

      {/* Brass channel */}
      <rect x="94" y="0" width="12" height="200" rx="3" fill="url(#sq-brass)" />
      <rect x="99" y="2" width="1.5" height="196" fill="#fff" opacity="0.45" />
      <rect x="93" y="0" width="14" height="6" rx="2" fill="#3f2f12" />
      <rect x="93" y="194" width="14" height="6" rx="2" fill="#3f2f12" />

      {/* Rubber blade (leading edge) */}
      <rect x="104" y="3" width="6" height="194" rx="1.5" fill="url(#sq-rubber)" />

      {/* Water and suds pushed ahead of the blade */}
      <rect x="110" y="2" width="10" height="196" fill="url(#sq-foam)" />
      {BUBBLES.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="#fff" opacity={0.55 + (i % 3) * 0.12} />
      ))}
    </svg>
  );
}
