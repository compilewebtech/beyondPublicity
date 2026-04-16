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
import { db } from "@/lib/firebase";

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  year: string;
  videoId: string;
  youtubeUrl: string;
  description: string;
  createdAt: Timestamp;
}

export type PortfolioInput = Omit<PortfolioItem, "id" | "createdAt">;

const COLLECTION = "portfolio";

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
