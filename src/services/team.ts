import {
  collection, doc, getDocs, setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

export type OrganKey = "brain" | "heart" | "lungs" | "liver";

export interface TeamMember {
  id: OrganKey;
  name: string;
  role: string;
  label: string;
  photoUrl: string;
  storagePath: string;
  skills: string[];
  vision: string;
  color: string;
}

const COLLECTION = "teamMembers";

export const defaultTeamMembers: Record<OrganKey, TeamMember> = {
  brain: {
    id: "brain",
    name: "Theodor Abdo",
    role: "Founder & Producer",
    label: "The Brain",
    photoUrl: "/images/team/theodor.jpg",
    storagePath: "",
    skills: ["Strategic Vision", "Creative Direction", "Business Leadership"],
    vision: "Every great production starts with a bold idea. I see beyond what's in front of us — turning raw concepts into stories that move people.",
    color: "#ffffff",
  },
  heart: {
    id: "heart",
    name: "Violette Ouais",
    role: "Art Director",
    label: "The Heart",
    photoUrl: "/images/team/violette.jpg",
    storagePath: "",
    skills: ["Visual Design", "Set Direction", "Emotional Storytelling"],
    vision: "Art isn't just what you see — it's what you feel. I pour passion into every frame, every color, every texture.",
    color: "#e74c3c",
  },
  lungs: {
    id: "lungs",
    name: "Rudi Abi Hanna",
    role: "Sound Engineer & Designer",
    label: "The Lungs",
    photoUrl: "/images/team/rudi.jpg",
    storagePath: "",
    skills: ["Sound Design", "Audio Mixing", "Live Production"],
    vision: "Sound is the breath of a production. It gives life, rhythm, and emotion to everything the audience experiences.",
    color: "#3498db",
  },
  liver: {
    id: "liver",
    name: "Elie Saliba",
    role: "Production Manager",
    label: "The Backbone",
    photoUrl: "/images/team/elie-saliba.jpg",
    storagePath: "",
    skills: ["Operations", "Problem Solving", "Logistics"],
    vision: "I make sure every moving piece works behind the scenes — so the magic in front of the camera never stops.",
    color: "#8B6914",
  },
};

export const organOrder: OrganKey[] = ["brain", "heart", "lungs", "liver"];

export async function getTeamMembers(): Promise<Record<OrganKey, TeamMember>> {
  if (!db) return defaultTeamMembers;
  const snapshot = await getDocs(collection(db, COLLECTION));
  const fromDb: Partial<Record<OrganKey, TeamMember>> = {};
  snapshot.docs.forEach((d) => {
    const data = d.data() as Omit<TeamMember, "id">;
    fromDb[d.id as OrganKey] = { id: d.id as OrganKey, ...data };
  });
  return {
    brain: fromDb.brain ?? defaultTeamMembers.brain,
    heart: fromDb.heart ?? defaultTeamMembers.heart,
    lungs: fromDb.lungs ?? defaultTeamMembers.lungs,
    liver: fromDb.liver ?? defaultTeamMembers.liver,
  };
}

export async function saveTeamMember(
  key: OrganKey,
  data: Omit<TeamMember, "id">
): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await setDoc(doc(db, COLLECTION, key), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function uploadTeamPhoto(
  key: OrganKey,
  file: File,
  previousStoragePath: string
): Promise<{ photoUrl: string; storagePath: string }> {
  if (!db || !storage) throw new Error("Firebase not configured");
  if (previousStoragePath) {
    try {
      await deleteObject(ref(storage, previousStoragePath));
    } catch {
      // old file may not exist
    }
  }
  const storagePath = `team/${key}-${Date.now()}-${file.name}`;
  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, file);
  
  const photoUrl = await getDownloadURL(storageRef);
  //await setDoc(
  //  doc(db, COLLECTION, key),
  //  { photoUrl, storagePath, updatedAt: serverTimestamp() },
  //  { merge: true }
  //);
  return { photoUrl, storagePath };
}
