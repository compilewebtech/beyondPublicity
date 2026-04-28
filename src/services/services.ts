import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  getDocs, query, orderBy, serverTimestamp, type Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

export interface SubItem {
  number: string;
  title: string;
  description: string;
}

export interface Service {
  id: string;
  title: string;
  iconPath: string;
  subItems: SubItem[];
  order: number;
  backgroundUrl?: string;
  backgroundStoragePath?: string;
  createdAt?: Timestamp;
}

export type ServiceInput = {
  title: string;
  iconPath: string;
  subItems: SubItem[];
  backgroundUrl?: string;
  backgroundStoragePath?: string;
};

export async function uploadServiceBackground(file: File): Promise<{ url: string; path: string }> {
  if (!storage) throw new Error("Firebase Storage not configured");
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `services/${Date.now()}-${safeName}`;
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);
  return { url, path };
}

export async function deleteServiceBackground(path: string): Promise<void> {
  if (!storage) return;
  try {
    await deleteObject(ref(storage, path));
  } catch (err) {
    console.warn("deleteServiceBackground failed", err);
  }
}

const COLLECTION = "services";

export async function getServices(): Promise<Service[]> {
  if (!db) return [];
  const q = query(collection(db, COLLECTION), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Service));
}

export async function addService(input: ServiceInput, order: number): Promise<string> {
  if (!db) throw new Error("Firebase not configured");
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...input,
    order,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateService(
  id: string,
  data: Partial<ServiceInput> & { order?: number }
): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await updateDoc(doc(db, COLLECTION, id), data);
}

export async function deleteService(id: string): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await deleteDoc(doc(db, COLLECTION, id));
}
