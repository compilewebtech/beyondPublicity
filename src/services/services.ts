import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  getDocs, query, orderBy, serverTimestamp, type Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

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
  createdAt?: Timestamp;
}

export type ServiceInput = {
  title: string;
  iconPath: string;
  subItems: SubItem[];
};

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
