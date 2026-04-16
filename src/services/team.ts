import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  getDocs, query, orderBy, serverTimestamp, type Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { compressImage } from "@/lib/image";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  storagePath: string;
  order: number;
  createdAt?: Timestamp;
}

export type TeamMemberInput = {
  name: string;
  role: string;
  bio: string;
};

const COLLECTION = "teamMembers";

export async function getTeamMembers(): Promise<TeamMember[]> {
  if (!db) return [];
  const q = query(collection(db, COLLECTION), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as TeamMember));
}

export async function addTeamMember(
  input: TeamMemberInput,
  photoFile: File | null,
  order: number
): Promise<string> {
  if (!db || !storage) throw new Error("Firebase not configured");
  let photoUrl = "";
  let storagePath = "";
  if (photoFile) {
    const compressed = await compressImage(photoFile, { maxWidth: 1200, maxHeight: 1200, quality: 0.85 });
    const fileName = `${Date.now()}-${compressed.name}`;
    storagePath = `team/${fileName}`;
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, compressed);
    photoUrl = await getDownloadURL(storageRef);
  }
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...input,
    photoUrl,
    storagePath,
    order,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateTeamMember(
  id: string,
  data: Partial<TeamMemberInput> & { order?: number }
): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await updateDoc(doc(db, COLLECTION, id), data);
}

export async function replaceTeamPhoto(member: TeamMember, newFile: File): Promise<{ photoUrl: string; storagePath: string }> {
  if (!db || !storage) throw new Error("Firebase not configured");
  const compressed = await compressImage(newFile, { maxWidth: 1200, maxHeight: 1200, quality: 0.85 });
  if (member.storagePath) {
    try {
      await deleteObject(ref(storage, member.storagePath));
    } catch {
      // old file may not exist
    }
  }
  const fileName = `${Date.now()}-${compressed.name}`;
  const storagePath = `team/${fileName}`;
  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, compressed);
  const photoUrl = await getDownloadURL(storageRef);
  await updateDoc(doc(db, COLLECTION, member.id), { photoUrl, storagePath });
  return { photoUrl, storagePath };
}

export async function deleteTeamMember(member: TeamMember): Promise<void> {
  if (!db || !storage) throw new Error("Firebase not configured");
  if (member.storagePath) {
    try {
      await deleteObject(ref(storage, member.storagePath));
    } catch {
      // file may already be deleted
    }
  }
  await deleteDoc(doc(db, COLLECTION, member.id));
}
