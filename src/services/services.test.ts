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

describe("services service", () => {
  it("getServices orders by 'order' ascending", async () => {
    const { getServices } = await import("./services");
    getDocsMock.mockResolvedValue({ docs: [] });

    await getServices();

    expect(orderByMock).toHaveBeenCalledWith("order", "asc");
  });

  it("addService writes the input plus order and timestamp", async () => {
    const { addService } = await import("./services");
    addDocMock.mockResolvedValue({ id: "svc1" });

    const id = await addService(
      { title: "Marketing", iconPath: "M0 0", subItems: [] },
      3,
    );

    expect(id).toBe("svc1");
    expect(addDocMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ title: "Marketing", order: 3, createdAt: "SERVER_TS" }),
    );
  });

  it("uploadServiceBackground sanitizes filenames and returns url + path", async () => {
    const { uploadServiceBackground } = await import("./services");
    getDownloadURLMock.mockResolvedValue("https://example.com/bg.jpg");

    const file = new File(["x"], "Background Photo!.jpg", { type: "image/jpeg" });
    const result = await uploadServiceBackground(file);

    expect(result.url).toBe("https://example.com/bg.jpg");
    expect(result.path).toMatch(/^services\/\d+-Background_Photo_\.jpg$/);
  });

  it("deleteServiceBackground swallows errors", async () => {
    const { deleteServiceBackground } = await import("./services");
    deleteObjectMock.mockRejectedValue(new Error("permission denied"));

    await expect(deleteServiceBackground("services/x.jpg")).resolves.toBeUndefined();
  });
});
