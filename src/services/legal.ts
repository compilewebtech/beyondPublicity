import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type LegalPageId = "privacy" | "terms";

export interface LegalSection {
  heading: string;
  body: string;
}

export interface LegalPage {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}

const COLLECTION = "legalPages";

export async function getLegalPage(id: LegalPageId): Promise<LegalPage | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    title: data.title ?? "",
    lastUpdated: data.lastUpdated ?? "",
    sections: Array.isArray(data.sections) ? data.sections : [],
  };
}

export async function updateLegalPage(id: LegalPageId, data: LegalPage): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await setDoc(doc(db, COLLECTION, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export const DEFAULT_PRIVACY: LegalPage = {
  title: "Privacy Policy",
  lastUpdated: "April 2026",
  sections: [
    {
      heading: "1. Who we are",
      body:
        'BeyondPublicity Productions ("we", "us", "our") is a media production company based in Beirut, Lebanon. This policy explains what information we collect when you use our website and how we handle it.',
    },
    {
      heading: "2. Information we collect",
      body:
        "When you contact us through the site, we collect the details you voluntarily provide — typically your name, email address, and the message you send us.\n\nWe do not use third-party analytics trackers, advertising cookies, or fingerprinting on this site. Our hosting provider may log standard request metadata (IP address, user agent, timestamps) for security and reliability purposes.",
    },
    {
      heading: "3. How we use your information",
      body:
        "We use the information you send us only to respond to your enquiry and, if we end up working together, to deliver the services you engaged us for. We do not sell or rent your personal data to anyone.",
    },
    {
      heading: "4. Data storage",
      body:
        "Site content and any contact records are stored on Google Firebase infrastructure. Portfolio videos are served by YouTube; when you play one, YouTube's own privacy policy applies.",
    },
    {
      heading: "5. Your rights",
      body:
        "You can ask us to access, correct, or delete any personal information we hold about you by emailing the address below. We will respond within a reasonable timeframe.",
    },
    {
      heading: "6. Contact",
      body:
        "Questions about this policy? Reach us via the contact section on our homepage or at the email listed there.",
    },
  ],
};

export const DEFAULT_TERMS: LegalPage = {
  title: "Terms of Service",
  lastUpdated: "April 2026",
  sections: [
    {
      heading: "1. Acceptance",
      body:
        "By accessing or using this website you agree to these terms. If you do not agree, please do not use the site.",
    },
    {
      heading: "2. Our content",
      body:
        "All text, imagery, film footage, and other materials shown on this site — except where clearly attributed to a third party — are owned by BeyondPublicity Productions or licensed to us. You may browse and share links to our pages, but you may not reproduce, redistribute, or use our content commercially without our written consent.",
    },
    {
      heading: "3. Embedded media",
      body:
        "Videos shown in the portfolio are embedded from YouTube. Playback is governed by YouTube's own terms and privacy policy.",
    },
    {
      heading: "4. Contact submissions",
      body:
        "When you contact us through the site, you confirm that the information you provide is accurate and that you have the right to share it. Do not submit confidential material you are not authorised to disclose.",
    },
    {
      heading: "5. No warranty",
      body:
        'The site is provided "as is". We make no guarantees about uninterrupted availability or the accuracy of every detail, and we are not liable for losses arising from use of the site to the fullest extent permitted by law.',
    },
    {
      heading: "6. Changes",
      body:
        'We may update these terms from time to time. The "Last updated" date above always reflects the current version.',
    },
    {
      heading: "7. Governing law",
      body:
        "These terms are governed by the laws of Lebanon. Any dispute arising from your use of the site shall be handled under that jurisdiction.",
    },
  ],
};

export function defaultFor(id: LegalPageId): LegalPage {
  return id === "privacy" ? DEFAULT_PRIVACY : DEFAULT_TERMS;
}
