import Image from "next/image";
import AutoVideo from "@/components/AutoVideo";
import MediaPlaceholder from "@/components/MediaPlaceholder";
import type { MediaItem, Orientation } from "@/content/types";

type MediaFrameProps = {
  item: MediaItem;
  /** Shape of the frame the media is rendered into. */
  frame: Orientation;
  /** next/image sizes hint. */
  sizes: string;
  priority?: boolean;
  /** Controlled video playback (see AutoVideo). */
  active?: boolean;
  preload?: "none" | "metadata" | "auto";
  tone?: "light" | "dark";
  onPlaying?: () => void;
  placeholderAlign?: "center" | "left" | "right";
};

/**
 * Renders a photo, clip or placeholder into an absolutely-positioned frame.
 * The parent sets the aspect ratio. Media whose orientation differs from the
 * frame is shown whole over a blurred copy of itself so nothing important is
 * cropped away; otherwise it fills the frame using its focal point.
 */
export default function MediaFrame({
  item,
  frame,
  sizes,
  priority = false,
  active,
  preload,
  tone = "light",
  onPlaying,
  placeholderAlign,
}: MediaFrameProps) {
  if (item.kind === "placeholder") {
    return <MediaPlaceholder label={item.label} tone={tone} align={placeholderAlign} />;
  }

  const fit = item.fit ?? (item.orientation === frame ? "cover" : "contain-blur");
  const position = { objectPosition: item.focal ?? "50% 50%" };
  const backdropSrc = item.kind === "video" ? item.poster : item.src;

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink">
      {fit === "contain-blur" && (
        <Image
          src={backdropSrc}
          alt=""
          aria-hidden
          fill
          sizes="10vw"
          className="scale-110 object-cover opacity-70 blur-2xl"
        />
      )}
      {item.kind === "video" ? (
        <AutoVideo
          src={item.src}
          poster={item.poster}
          label={item.alt}
          active={active}
          preload={preload}
          onPlaying={onPlaying}
          className={`absolute inset-0 h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"}`}
          style={position}
        />
      ) : (
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={fit === "cover" ? "object-cover" : "object-contain"}
          style={position}
        />
      )}
    </div>
  );
}
