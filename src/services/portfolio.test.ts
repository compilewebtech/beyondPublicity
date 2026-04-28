import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const addDocMock = vi.fn();
const updateDocMock = vi.fn();
const deleteDocMock = vi.fn();
const getDocsMock = vi.fn();
const docMock = vi.fn((_db, col, id) => ({ col, id }));
const collectionMock = vi.fn((_db, name) => ({ name }));
const queryMock = vi.fn((c) => c);
const orderByMock = vi.fn((field, dir) => ({ field, dir }));
const serverTimestampMock = vi.fn(() => "SERVER_TS");

const uploadBytesMock = vi.fn();
const getDownloadURLMock = vi.fn();
const deleteObjectMock = vi.fn();
const refMock = vi.fn((_storage, path) => ({ path }));

vi.mock("firebase/firestore", () => ({
  collection: (...args: unknown[]) => collectionMock(...(args as [unknown, string])),
  addDoc: (...args: unknown[]) => addDocMock(...(args as [unknown, unknown])),
  updateDoc: (...args: unknown[]) => updateDocMock(...(args as [unknown, unknown])),
  deleteDoc: (...args: unknown[]) => deleteDocMock(...(args as [unknown])),
  doc: (...args: unknown[]) => docMock(...(args as [unknown, string, string])),
  getDocs: (...args: unknown[]) => getDocsMock(...(args as [unknown])),
  query: (...args: unknown[]) => queryMock(...(args as [unknown])),
  orderBy: (...args: unknown[]) => orderByMock(...(args as [string, string])),
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
  addDocMock.mockReset();
  updateDocMock.mockReset();
  deleteDocMock.mockReset();
  getDocsMock.mockReset();
  uploadBytesMock.mockReset();
  getDownloadURLMock.mockReset();
  deleteObjectMock.mockReset();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("portfolio service", () => {
  it("getPortfolioItems returns mapped docs ordered by createdAt desc", async () => {
    const { getPortfolioItems } = await import("./portfolio");
    getDocsMock.mockResolvedValue({
      docs: [
        { id: "a", data: () => ({ title: "A", category: "Films" }) },
        { id: "b", data: () => ({ title: "B", category: "Ads" }) },
      ],
    });

    const items = await getPortfolioItems();

    expect(items).toEqual([
      { id: "a", title: "A", category: "Films" },
      { id: "b", title: "B", category: "Ads" },
    ]);
    expect(orderByMock).toHaveBeenCalledWith("createdAt", "desc");
  });

  it("addPortfolioItem writes the input plus a server timestamp", async () => {
    const { addPortfolioItem } = await import("./portfolio");
    addDocMock.mockResolvedValue({ id: "new-id" });

    const id = await addPortfolioItem({
      title: "Test",
      category: "Films",
      year: "2025",
      videoId: "abc12345678",
      youtubeUrl: "https://youtube.com/watch?v=abc12345678",
      description: "A test",
    });

    expect(id).toBe("new-id");
    expect(addDocMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ title: "Test", createdAt: "SERVER_TS" }),
    );
  });

  it("uploadPortfolioPhoto returns url + path and uses portfolio/ prefix", async () => {
    const { uploadPortfolioPhoto } = await import("./portfolio");
    getDownloadURLMock.mockResolvedValue("https://example.com/photo.jpg");

    const file = new File(["x"], "my photo!.jpg", { type: "image/jpeg" });
    const result = await uploadPortfolioPhoto(file);

    expect(result.url).toBe("https://example.com/photo.jpg");
    expect(result.path).toMatch(/^portfolio\/\d+-my_photo_\.jpg$/);
    expect(uploadBytesMock).toHaveBeenCalled();
  });

  it("deletePortfolioPhoto swallows errors so cleanup never blocks", async () => {
    const { deletePortfolioPhoto } = await import("./portfolio");
    deleteObjectMock.mockRejectedValue(new Error("not found"));

    await expect(deletePortfolioPhoto("portfolio/abc.jpg")).resolves.toBeUndefined();
  });
});
