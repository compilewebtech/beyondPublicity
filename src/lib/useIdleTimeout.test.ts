import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useIdleTimeout } from "./useIdleTimeout";

describe("useIdleTimeout", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("fires onIdle after idleMs of no activity", () => {
    const onIdle = vi.fn();
    renderHook(() => useIdleTimeout({ idleMs: 1000, warningMs: 500, onIdle }));

    expect(onIdle).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(1000); });
    expect(onIdle).toHaveBeenCalledOnce();
  });

  it("shows warning at warningMs and counts down", () => {
    const onIdle = vi.fn();
    const { result } = renderHook(() =>
      useIdleTimeout({ idleMs: 2000, warningMs: 1000, onIdle }),
    );

    expect(result.current.warning).toBe(false);
    act(() => { vi.advanceTimersByTime(1000); });
    expect(result.current.warning).toBe(true);
    expect(result.current.secondsLeft).toBe(1);
  });

  it("resets timers when stayActive is called", () => {
    const onIdle = vi.fn();
    const { result } = renderHook(() =>
      useIdleTimeout({ idleMs: 1000, warningMs: 500, onIdle }),
    );

    act(() => { vi.advanceTimersByTime(600); });
    expect(result.current.warning).toBe(true);

    act(() => { result.current.stayActive(); });
    expect(result.current.warning).toBe(false);

    act(() => { vi.advanceTimersByTime(600); });
    expect(onIdle).not.toHaveBeenCalled();
  });

  it("user activity resets the timer (before warning)", () => {
    const onIdle = vi.fn();
    renderHook(() =>
      useIdleTimeout({ idleMs: 1000, warningMs: 500, onIdle }),
    );

    act(() => {
      vi.advanceTimersByTime(400);
      window.dispatchEvent(new MouseEvent("mousedown"));
      vi.advanceTimersByTime(700);
    });

    expect(onIdle).not.toHaveBeenCalled();
  });
});
