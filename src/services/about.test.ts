import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const setDocMock = vi.fn();
const getDocMock = vi.fn();
const docMock = vi.fn((_db, col, id) => ({ col, id }));
const serverTimestampMock = vi.fn(() => "SERVER_TS");

const uploadBytesMock = vi.fn();
const getDownloadURLMock = vi.fn();
const deleteObjectMock = vi.fn();
const refMock = vi.fn((_storage, path) => ({ path }));

vi.mock("firebase/firestore", () => ({
  doc: (...args: unknown[]) => docMock(...(args as [unknown, string, string])),
  getDoc: (...args: unknown[]) => getDocMock(...(args as [unknown])),
  setDoc: (...args: unknown[]) => setDocMock(...(args as [unknown, unknown])),
  serverTimestamp: () => serverTimestampMock(),
}));

vi.mock("firebase/storage", () => ({
  ref: (...args: unknown[]) => refMock(...(args as [unknown, string])),
  uploadBytes: (...args: unknown[]) => uploadBytesMock(...(args as [unknown, unknown])),
  getDownloadURL: (...args: unknown[]) => getDownloadURLMock(...(args as [unknown])),
  deleteObject: (...args: unknown[]) => deleteObjectMock(...(args as [unknown])),
}));

vi.mock("@/lib/firebase", () => ({
  db: { __mock: "db" },
  storage: { __mock: "storage" },
}));

beforeEach(() => {
  setDocMock.mockReset();
  getDocMock.mockReset();
  uploadBytesMock.mockReset();
  getDownloadURLMock.mockReset();
  deleteObjectMock.mockReset();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("about service", () => {
  it("getAbout returns null when the doc doesn't exist", async () => {
    const { getAbout } = await import("./about");
    getDocMock.mockResolvedValue({ exists: () => false });

    expect(await getAbout()).toBeNull();
  });

  it("getAbout falls back to safe defaults for missing fields", async () => {
    const { getAbout } = await import("./about");
    getDocMock.mockResolvedValue({
      exists: () => true,
      data: () => ({}),
    });

    const result = await getAbout();
    expect(result).toEqual({
      paragraphs: [],
      highlights: [],
      imageUrl: "",
      imageStoragePath: "",
      imageAlt: "",
      statValue: "",
      statLabel: "",
    });
  });

  it("uploadAboutImage returns url + path with about/ prefix", async () => {
    const { uploadAboutImage } = await import("./about");
    getDownloadURLMock.mockResolvedValue("https://example.com/about.jpg");

    const file = new File(["x"], "About Image.jpg", { type: "image/jpeg" });
    const result = await uploadAboutImage(file);

    expect(result.url).toBe("https://example.com/about.jpg");
    expect(result.path).toMatch(/^about\/\d+-About_Image\.jpg$/);
  });

  it("deleteAboutImage swallows errors so save flow never blocks", async () => {
    const { deleteAboutImage } = await import("./about");
    deleteObjectMock.mockRejectedValue(new Error("not found"));

    await expect(deleteAboutImage("about/x.jpg")).resolves.toBeUndefined();
  });
});
