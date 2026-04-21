import { useEffect, useRef, useState } from "react";

interface IdleTimeoutOptions {
  idleMs: number;
  warningMs: number;
  onIdle: () => void;
}

const ACTIVITY_EVENTS = ["mousedown", "keydown", "touchstart", "scroll"] as const;

export function useIdleTimeout({ idleMs, warningMs, onIdle }: IdleTimeoutOptions) {
  const [warning, setWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const warnTimer = useRef<number | null>(null);
  const idleTimer = useRef<number | null>(null);
  const tickTimer = useRef<number | null>(null);

  const clearAll = () => {
    if (warnTimer.current) window.clearTimeout(warnTimer.current);
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    if (tickTimer.current) window.clearInterval(tickTimer.current);
  };

  const reset = () => {
    clearAll();
    setWarning(false);
    warnTimer.current = window.setTimeout(() => {
      setWarning(true);
      const deadline = Date.now() + (idleMs - warningMs);
      setSecondsLeft(Math.ceil((idleMs - warningMs) / 1000));
      tickTimer.current = window.setInterval(() => {
        setSecondsLeft(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
      }, 1000);
    }, warningMs);
    idleTimer.current = window.setTimeout(() => {
      clearAll();
      setWarning(false);
      onIdle();
    }, idleMs);
  };

  useEffect(() => {
    reset();
    const handler = () => {
      if (!warning) reset();
    };
    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, handler, { passive: true }));
    return () => {
      clearAll();
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, handler));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idleMs, warningMs]);

  return { warning, secondsLeft, stayActive: reset };
}
