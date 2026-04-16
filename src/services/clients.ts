import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  getDocs, query, orderBy, serverTimestamp, type Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

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
  const fileName = `${Date.now()}-${logoFile.name}`;
  const storageRef = ref(storage, `clients/${fileName}`);
  await uploadBytes(storageRef, logoFile);
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
  // Delete old logo
  try {
    await deleteObject(ref(storage, client.storagePath));
  } catch {
    // Old file may not exist
  }
  // Upload new
  const fileName = `${Date.now()}-${newFile.name}`;
  const storageRef = ref(storage, `clients/${fileName}`);
  await uploadBytes(storageRef, newFile);
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
