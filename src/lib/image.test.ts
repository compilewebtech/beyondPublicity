import { describe, it, expect } from "vitest";
import { compressImage } from "./image";

describe("compressImage", () => {
  it("returns SVG files untouched (canvas re-encoding would destroy them)", async () => {
    const svg = new File(["<svg/>"], "logo.svg", { type: "image/svg+xml" });
    const result = await compressImage(svg);
    expect(result).toBe(svg);
  });

  it("returns GIF files untouched (animation would be lost)", async () => {
    const gif = new File([new Uint8Array([0x47, 0x49, 0x46])], "loop.gif", { type: "image/gif" });
    const result = await compressImage(gif);
    expect(result).toBe(gif);
  });

  it("returns non-image files untouched", async () => {
    const txt = new File(["hello"], "notes.txt", { type: "text/plain" });
    const result = await compressImage(txt);
    expect(result).toBe(txt);
  });
});
