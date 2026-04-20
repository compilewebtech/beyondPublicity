import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface AboutHighlight {
  iconKey: string;
  title: string;
  description: string;
}

export interface AboutContent {
  paragraphs: string[];
  highlights: AboutHighlight[];
  imageUrl: string;
  imageAlt: string;
  statValue: string;
  statLabel: string;
}

const DOC_PATH = { collection: "settings", id: "about" } as const;

export async function getAbout(): Promise<AboutContent | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, DOC_PATH.collection, DOC_PATH.id));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    paragraphs: Array.isArray(data.paragraphs) ? data.paragraphs : [],
    highlights: Array.isArray(data.highlights) ? data.highlights : [],
    imageUrl: data.imageUrl ?? "",
    imageAlt: data.imageAlt ?? "",
    statValue: data.statValue ?? "",
    statLabel: data.statLabel ?? "",
  };
}

export async function updateAbout(content: AboutContent): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await setDoc(doc(db, DOC_PATH.collection, DOC_PATH.id), {
    ...content,
    updatedAt: serverTimestamp(),
  });
}

export const ABOUT_ICONS: { key: string; label: string; path: string }[] = [
  {
    key: "director",
    label: "Director",
    path: "M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z",
  },
  {
    key: "camera",
    label: "Camera",
    path: "M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z",
  },
  {
    key: "edit",
    label: "Post-Production",
    path: "M7.848 8.25l1.536.887M7.848 8.25a3 3 0 11-5.196-3 3 3 0 015.196 3zm1.536.887a2.165 2.165 0 011.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 11-5.196 3 3 3 0 015.196-3zm1.536-.887a2.165 2.165 0 001.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863l2.077-1.199m0-3.328a4.323 4.323 0 012.068-1.379l5.325-1.628a4.5 4.5 0 012.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.331 4.331 0 0010.607 12m3.736 0l7.794 4.5-.802.215a4.5 4.5 0 01-2.48-.043l-5.326-1.629a4.324 4.324 0 01-2.068-1.379M14.343 12l-2.882 1.664",
  },
  {
    key: "sound",
    label: "Sound",
    path: "M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z",
  },
  {
    key: "sparkles",
    label: "Creative",
    path: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z",
  },
  {
    key: "globe",
    label: "Global Reach",
    path: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418",
  },
  {
    key: "bolt",
    label: "Fast Delivery",
    path: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
  },
  {
    key: "shield",
    label: "Trusted",
    path: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z",
  },
];

export function iconPathFor(key: string): string {
  return ABOUT_ICONS.find((i) => i.key === key)?.path ?? ABOUT_ICONS[0].path;
}

export const DEFAULT_ABOUT: AboutContent = {
  paragraphs: [
    "Welcome to BeyondPublicity Productions, where we redefine the art of storytelling beyond conventional limits. Our team is dedicated to crafting excellence, ensuring your project transforms into an exceptional final product.",
    "Join us in this creative realm, where innovation meets impact, and every project is an opportunity to leave a lasting impression.",
    "Based in Lebanon, we serve clients across the Middle East and beyond, bringing cinematic vision to every production — from commercials and documentaries to feature films and immersive experiences.",
  ],
  highlights: [
    { iconKey: "director", title: "Visionary Directors", description: "Creative leaders who bring unique perspectives" },
    { iconKey: "camera", title: "Expert Cinematographers", description: "Capturing every frame with precision" },
    { iconKey: "edit", title: "Post-Production Pros", description: "Polishing every detail to perfection" },
    { iconKey: "sound", title: "Sound Engineers", description: "Crafting immersive audio experiences" },
  ],
  imageUrl: "/images/about-bg.jpg",
  imageAlt: "BeyondPublicity Productions Studio",
  statValue: "10+",
  statLabel: "Years of Excellence",
};
