import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "../../client/src/hooks/use-mobile.tsx";

// jsdom does not implement window.matchMedia — we must stub it
function setupMatchMedia(matches: boolean) {
  const listeners: EventListenerOrEventListenerObject[] = [];
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: (_: string, cb: EventListenerOrEventListenerObject) => {
        listeners.push(cb);
      },
      removeEventListener: (_: string, cb: EventListenerOrEventListenerObject) => {
        const idx = listeners.indexOf(cb);
        if (idx > -1) listeners.splice(idx, 1);
      },
      dispatchEvent: vi.fn(),
    })),
  });
  return listeners;
}

describe("useIsMobile", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns false when viewport is wider than 768px", () => {
    setupMatchMedia(false);
    Object.defineProperty(window, "innerWidth", { writable: true, value: 1024 });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("returns true when viewport is narrower than 768px", () => {
    setupMatchMedia(true);
    Object.defineProperty(window, "innerWidth", { writable: true, value: 375 });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });
});
