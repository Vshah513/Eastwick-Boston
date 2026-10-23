#!/usr/bin/env bash
# Compress the client's raw media for the web.
#
#   media-src/<folder>/[<slot>/...]<anything>.{mov,mp4,m4v}  ->  public/media/<folder>/<slot-...-slug>.mp4 + .jpg (poster)
#   media-src/<folder>/[<slot>/...]<anything>.{jpg,jpeg,png,heic} -> public/media/<folder>/<slot-...-slug>.jpg
#
# <folder> is one of: hero, services, transformations, team, og.
# Subfolders are labelled slots (e.g. services/window-cleaning, transformations/driveway/before);
# their names are prefixed onto the output filename.
# Filenames become lowercase-hyphenated slugs ("IMG 4821.JPG" in transformations/driveway/before
# -> transformations/driveway-before-img-4821.jpg).
# Videos: H.264, no audio, faststart, long edge <= 1080 (hero <= 1920), target <= 4 MB.
# media-src/ is gitignored; only the optimized output is committed.
set -euo pipefail

command -v ffmpeg >/dev/null || { echo "ffmpeg is required (brew install ffmpeg)"; exit 1; }

SRC="media-src"
OUT="public/media"
MAX_BYTES=$((4 * 1024 * 1024))

[ -d "$SRC" ] || { echo "Put raw files in $SRC/<folder>/ first (folders: hero services transformations team og)"; exit 1; }

slugify() {
  echo "$1" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g'
}

encode_video() { # in out long_edge crf
  ffmpeg -nostdin -loglevel error -y -i "$1" -an -c:v libx264 -preset slow -crf "$4" -pix_fmt yuv420p \
    -vf "scale='if(gt(iw,ih),min($3,iw),-2)':'if(gt(iw,ih),-2,min($3,ih))'" \
    -movflags +faststart "$2"
}

find "$SRC" -type f -not -name '.*' | while read -r file; do
  rel="${file#"$SRC"/}"
  folder="${rel%%/*}"
  [ "$folder" = "$rel" ] && { echo "  skipped $file (put it inside a folder)"; continue; }
  slot_path="${rel#*/}"
  name=$(basename "$slot_path")
  base="${name%.*}"
  ext=$(echo "${name##*.}" | tr '[:upper:]' '[:lower:]')
  slots=$(dirname "$slot_path")
  [ "$slots" = "." ] && slug=$(slugify "$base") || slug=$(slugify "$slots-$base")
  mkdir -p "$OUT/$folder"

  case "$ext" in
    mov|mp4|m4v)
      long=1080; [ "$folder" = "hero" ] && long=1920
      out="$OUT/$folder/$slug.mp4"
      encode_video "$file" "$out" "$long" 26
      if [ "$(stat -f%z "$out" 2>/dev/null || stat -c%s "$out")" -gt "$MAX_BYTES" ]; then
        echo "  $out is over 4 MB at CRF 26, re-encoding at CRF 28"
        encode_video "$file" "$out" "$long" 28
      fi
      ffmpeg -nostdin -loglevel error -y -ss 1 -i "$out" -frames:v 1 -q:v 3 "$OUT/$folder/$slug.jpg"
      orient=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$out" < /dev/null | awk -F, '{print ($1>$2)?"landscape":"portrait"}')
      echo "✓ $out ($(du -h "$out" | cut -f1), $orient) + poster $slug.jpg"
      ;;
    jpg|jpeg|png|heic|webp)
      out="$OUT/$folder/$slug.jpg"
      ffmpeg -nostdin -loglevel error -y -i "$file" -vf "scale='if(gt(iw,ih),min(2400,iw),-2)':'if(gt(iw,ih),-2,min(2400,ih))'" -q:v 3 "$out"
      echo "✓ $out ($(du -h "$out" | cut -f1))"
      ;;
    *)
      echo "  skipped $file (unsupported type)"
      ;;
  esac
done

echo "Done. Add the new files to src/content/*.ts (src, poster, orientation, alt)."
