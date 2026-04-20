import { describe, it, expect } from "vitest";
import { extractVideoId, getThumbnailUrl, getHqThumbnailUrl } from "./youtube";

describe("extractVideoId", () => {
  it("pulls the id from a standard watch URL", () => {
    expect(extractVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("pulls the id from a youtu.be short URL", () => {
    expect(extractVideoId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("pulls the id from an embed URL", () => {
    expect(extractVideoId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("accepts a bare 11-character id", () => {
    expect(extractVideoId("dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("returns null for garbage input", () => {
    expect(extractVideoId("not a youtube url")).toBeNull();
    expect(extractVideoId("")).toBeNull();
    expect(extractVideoId("https://example.com/video")).toBeNull();
  });
});

describe("thumbnail URLs", () => {
  it("builds the standard thumbnail URL", () => {
    expect(getThumbnailUrl("abc12345678")).toBe("https://img.youtube.com/vi/abc12345678/mqdefault.jpg");
  });

  it("builds the HQ thumbnail URL", () => {
    expect(getHqThumbnailUrl("abc12345678")).toBe("https://img.youtube.com/vi/abc12345678/hqdefault.jpg");
  });
});
