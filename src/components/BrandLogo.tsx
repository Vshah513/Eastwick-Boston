import Image from "next/image";
import { BUSINESS } from "@/lib/business";

/**
 * Two background-knockout variants (transparent PNGs):
 *  - "light": navy wordmark, for light surfaces (scrolled navbar, cream sections).
 *  - "dark":  white wordmark, for dark surfaces (hero, footer).
 */
export const BRAND_LOGO_LIGHT_SRC = "/media/brand/logo-for-light.png";
export const BRAND_LOGO_DARK_SRC = "/media/brand/logo-for-dark.png";

const intrinsic = { width: 644, height: 182 };

type BrandLogoProps = {
  className?: string;
  /** Tailwind height classes controlling display size; width follows aspect ratio. */
  sizeClassName?: string;
  priority?: boolean;
  /** Background tone the logo sits on — picks the matching knockout variant. */
  tone?: "light" | "dark";
};

export default function BrandLogo({
  className = "",
  sizeClassName = "h-9 w-auto sm:h-10",
  priority = false,
  tone = "light",
}: BrandLogoProps) {
  return (
    <Image
      src={tone === "dark" ? BRAND_LOGO_DARK_SRC : BRAND_LOGO_LIGHT_SRC}
      alt={BUSINESS.name}
      width={intrinsic.width}
      height={intrinsic.height}
      className={`object-contain object-left ${sizeClassName} ${className}`.trim()}
      priority={priority}
    />
  );
}
