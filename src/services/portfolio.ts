import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

export type PortfolioMediaType = "video" | "photo";

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  year: string;
  videoId: string;
  youtubeUrl: string;
  description: string;
  mediaType?: PortfolioMediaType;
  vertical?: boolean;
  photoUrl?: string;
  photoStoragePath?: string;
  linkUrl?: string;
  createdAt: Timestamp;
}

export type PortfolioInput = Omit<PortfolioItem, "id" | "createdAt">;

const COLLECTION = "portfolio";

export async function uploadPortfolioPhoto(file: File): Promise<{ url: string; path: string }> {
  if (!storage) throw new Error("Firebase Storage not configured");
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `portfolio/${Date.now()}-${safeName}`;
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);
  return { url, path };
}

export async function deletePortfolioPhoto(path: string): Promise<void> {
  if (!storage) return;
  try {
    await deleteObject(ref(storage, path));
  } catch (err) {
    console.warn("deletePortfolioPhoto failed (may already be removed)", err);
  }
}

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  if (!db) return [];
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as PortfolioItem));
}

export async function addPortfolioItem(item: PortfolioInput): Promise<string> {
  if (!db) throw new Error("Firebase not configured");
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...item,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updatePortfolioItem(id: string, item: Partial<PortfolioInput>): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await updateDoc(doc(db, COLLECTION, id), item);
}

export async function deletePortfolioItem(id: string): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await deleteDoc(doc(db, COLLECTION, id));
}
