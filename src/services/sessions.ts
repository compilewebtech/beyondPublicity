import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const SESSION_KEY = "bp_admin_session_id";
const REPLACED_KEY = "bp_admin_session_replaced";

export function flagSessionReplaced(): void {
  sessionStorage.setItem(REPLACED_KEY, "1");
}

export function consumeSessionReplaced(): boolean {
  const v = sessionStorage.getItem(REPLACED_KEY);
  if (v) sessionStorage.removeItem(REPLACED_KEY);
  return v === "1";
}

function newSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function claimSession(uid: string): Promise<string> {
  if (!db) throw new Error("Firestore not configured");
  const sessionId = newSessionId();
  await setDoc(doc(db, "sessions", uid), {
    sessionId,
    updatedAt: serverTimestamp(),
  });
  localStorage.setItem(SESSION_KEY, sessionId);
  return sessionId;
}

export function getLocalSessionId(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function clearLocalSessionId(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function watchSession(
  uid: string,
  localSessionId: string,
  onInvalidated: () => void,
): () => void {
  if (!db) return () => {};
  return onSnapshot(doc(db, "sessions", uid), (snap) => {
    const data = snap.data();
    if (!data?.sessionId) return;
    if (data.sessionId !== localSessionId) onInvalidated();
  });
}
