import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch,
  type Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Category {
  id: string;
  name: string;
  order: number;
  createdAt: Timestamp;
}

const COLLECTION = "categories";
const PORTFOLIO_COLLECTION = "portfolio";

export async function getCategories(): Promise<Category[]> {
  if (!db) return [];
  const q = query(collection(db, COLLECTION), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Category));
}

export const DEFAULT_CATEGORIES = [
  "Film",
  "Commercial",
  "Documentary",
  "Music Video",
  "Photography",
  "Post-Production",
] as const;

export async function addCategory(name: string): Promise<string> {
  if (!db) throw new Error("Firebase not configured");
  const existing = await getCategories();
  const nextOrder = existing.length > 0 ? Math.max(...existing.map((c) => c.order)) + 1 : 0;
  const docRef = await addDoc(collection(db, COLLECTION), {
    name: name.trim(),
    order: nextOrder,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function seedDefaultCategories(): Promise<number> {
  if (!db) throw new Error("Firebase not configured");
  const existing = await getCategories();
  const existingNames = new Set(existing.map((c) => c.name.toLowerCase()));
  const toAdd = DEFAULT_CATEGORIES.filter((n) => !existingNames.has(n.toLowerCase()));
  let nextOrder = existing.length > 0 ? Math.max(...existing.map((c) => c.order)) + 1 : 0;
  for (const name of toAdd) {
    await addDoc(collection(db, COLLECTION), {
      name,
      order: nextOrder++,
      createdAt: serverTimestamp(),
    });
  }
  return toAdd.length;
}

export async function updateCategory(id: string, name: string, oldName?: string): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  const trimmed = name.trim();
  await updateDoc(doc(db, COLLECTION, id), { name: trimmed });

  // Keep portfolio items in sync if the display name changed
  if (oldName && oldName !== trimmed) {
    const q = query(collection(db, PORTFOLIO_COLLECTION), where("category", "==", oldName));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const batch = writeBatch(db);
      snapshot.docs.forEach((d) => batch.update(d.ref, { category: trimmed }));
      await batch.commit();
    }
  }
}

export async function countItemsInCategory(name: string): Promise<number> {
  if (!db) return 0;
  const q = query(collection(db, PORTFOLIO_COLLECTION), where("category", "==", name));
  const snapshot = await getDocs(q);
  return snapshot.size;
}

export async function deleteCategoryAndItems(id: string, name: string): Promise<number> {
  if (!db) throw new Error("Firebase not configured");
  const q = query(collection(db, PORTFOLIO_COLLECTION), where("category", "==", name));
  const snapshot = await getDocs(q);

  const batch = writeBatch(db);
  snapshot.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();

  await deleteDoc(doc(db, COLLECTION, id));
  return snapshot.size;
}
