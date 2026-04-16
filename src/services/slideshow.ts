import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  getDocs, query, orderBy, serverTimestamp, type Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

export interface SlideImage {
  id: string;
  url: string;
  storagePath: string;
  order: number;
  createdAt: Timestamp;
}

const COLLECTION = "slideshow";

export async function getSlides(): Promise<SlideImage[]> {
  if (!db) return [];
  const q = query(collection(db, COLLECTION), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as SlideImage));
}

export async function uploadSlide(file: File, order: number): Promise<string> {
  if (!db || !storage) throw new Error("Firebase not configured");
  const fileName = `${Date.now()}-${file.name}`;
  const storageRef = ref(storage, `slideshow/${fileName}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  const docRef = await addDoc(collection(db, COLLECTION), {
    url,
    storagePath: `slideshow/${fileName}`,
    order,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateSlideOrder(id: string, order: number): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await updateDoc(doc(db, COLLECTION, id), { order });
}

export async function deleteSlide(slide: SlideImage): Promise<void> {
  if (!db || !storage) throw new Error("Firebase not configured");
  try {
    await deleteObject(ref(storage, slide.storagePath));
  } catch {
    // File may already be deleted from storage
  }
  await deleteDoc(doc(db, COLLECTION, slide.id));
}
