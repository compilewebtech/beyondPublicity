export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: "image/jpeg" | "image/webp";
}

// Keep SVG/GIF untouched (animation / vector data would be lost on canvas re-encode).
const SKIP_TYPES = new Set(["image/svg+xml", "image/gif"]);

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to decode image"));
    };
    img.src = url;
  });
}

export async function compressImage(
  file: File,
  {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.82,
    mimeType = "image/jpeg",
  }: CompressOptions = {}
): Promise<File> {
  if (SKIP_TYPES.has(file.type)) return file;
  if (!file.type.startsWith("image/")) return file;

  const img = await loadImage(file);

  const scale = Math.min(1, maxWidth / img.width, maxHeight / img.height);
  const targetWidth = Math.round(img.width * scale);
  const targetHeight = Math.round(img.height * scale);

  // Nothing to do — already small and we'd only bloat it by re-encoding a PNG.
  if (scale === 1 && file.size < 500_000 && file.type === mimeType) {
    return file;
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, mimeType, quality)
  );
  if (!blob) return file;

  // Refuse to return a bigger file than we started with.
  if (blob.size >= file.size) return file;

  const ext = mimeType === "image/webp" ? "webp" : "jpg";
  const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
  return new File([blob], `${baseName}.${ext}`, { type: mimeType });
}
