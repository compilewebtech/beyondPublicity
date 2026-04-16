import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

type Tone = "danger" | "default";

interface ConfirmOptions {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  tone?: Tone;
}

interface PendingPrompt extends ConfirmOptions {
  resolve: (result: boolean) => void;
}

const ConfirmContext = createContext<((options: ConfirmOptions) => Promise<boolean>) | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<PendingPrompt | null>(null);
  const confirmBtnRef = useRef<HTMLButtonElement | null>(null);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setPending({ ...options, resolve });
    });
  }, []);

  const close = useCallback((result: boolean) => {
    setPending((p) => {
      p?.resolve(result);
      return null;
    });
  }, []);

  useEffect(() => {
    if (!pending) return;
    confirmBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(false);
      if (e.key === "Enter") close(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pending, close]);

  const tone = pending?.tone ?? "default";
  const confirmClasses =
    tone === "danger"
      ? "bg-red-500 text-white hover:bg-red-500/85"
      : "bg-white text-black hover:bg-white/85";

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {pending && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          className="fixed inset-0 z-[100] flex items-center justify-center px-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => close(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md border border-white/15 bg-[#0a0a0a] p-6 md:p-8 shadow-2xl"
          >
            <h2 id="confirm-title" className="font-inter text-lg font-bold text-white mb-2">
              {pending.title}
            </h2>
            {pending.message && (
              <p className="text-white/60 text-sm font-light leading-relaxed mb-6">
                {pending.message}
              </p>
            )}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => close(false)}
                className="px-5 py-2.5 border border-white/15 text-white/70 text-xs tracking-widest uppercase font-light hover:border-white hover:text-white transition-colors"
              >
                {pending.cancelText ?? "Cancel"}
              </button>
              <button
                ref={confirmBtnRef}
                onClick={() => close(true)}
                className={`px-5 py-2.5 text-xs tracking-widest uppercase font-semibold transition-colors ${confirmClasses}`}
              >
                {pending.confirmText ?? "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider");
  return ctx;
}
