import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  getDocs, query, orderBy, serverTimestamp, type Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { compressImage } from "@/lib/image";

export interface Client {
  id: string;
  name: string;
  logoUrl: string;
  storagePath: string;
  order: number;
  createdAt: Timestamp;
}

export type ClientInput = { name: string };

const COLLECTION = "clients";

export async function getClients(): Promise<Client[]> {
  if (!db) return [];
  const q = query(collection(db, COLLECTION), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Client));
}

export async function addClient(name: string, logoFile: File, order: number): Promise<string> {
  if (!db || !storage) throw new Error("Firebase not configured");
  const compressed = await compressImage(logoFile, { maxWidth: 800, maxHeight: 800, quality: 0.9 });
  const fileName = `${Date.now()}-${compressed.name}`;
  const storageRef = ref(storage, `clients/${fileName}`);
  await uploadBytes(storageRef, compressed);
  const logoUrl = await getDownloadURL(storageRef);
  const docRef = await addDoc(collection(db, COLLECTION), {
    name,
    logoUrl,
    storagePath: `clients/${fileName}`,
    order,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateClient(id: string, data: Partial<{ name: string; order: number }>): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await updateDoc(doc(db, COLLECTION, id), data);
}

export async function replaceClientLogo(client: Client, newFile: File): Promise<string> {
  if (!db || !storage) throw new Error("Firebase not configured");
  const compressed = await compressImage(newFile, { maxWidth: 800, maxHeight: 800, quality: 0.9 });
  try {
    await deleteObject(ref(storage, client.storagePath));
  } catch {
    // Old file may not exist
  }
  const fileName = `${Date.now()}-${compressed.name}`;
  const storageRef = ref(storage, `clients/${fileName}`);
  await uploadBytes(storageRef, compressed);
  const logoUrl = await getDownloadURL(storageRef);
  await updateDoc(doc(db, COLLECTION, client.id), {
    logoUrl,
    storagePath: `clients/${fileName}`,
  });
  return logoUrl;
}

export async function deleteClient(client: Client): Promise<void> {
  if (!db || !storage) throw new Error("Firebase not configured");
  try {
    await deleteObject(ref(storage, client.storagePath));
  } catch {
    // File may already be deleted
  }
  await deleteDoc(doc(db, COLLECTION, client.id));
}
