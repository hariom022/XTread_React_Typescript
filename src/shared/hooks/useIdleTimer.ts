import { useEffect, useRef, useCallback } from "react";

interface IdleTimerOptions {
  timeoutMs?: number; // Inactivity limit (default: 5 minutes)
  onIdle: () => void;
}

const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  "mousemove",
  "mousedown",
  "keydown",
  "touchstart",
  "scroll",
];

export const useIdleTimer = ({
  timeoutMs = 5 * 60 * 1000,
  onIdle,
}: IdleTimerOptions) => {
  const timerRef = useRef<number | null>(null);
  const onIdleRef = useRef(onIdle);
  onIdleRef.current = onIdle;

  const handleLogout = useCallback(() => {
    onIdleRef.current();
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    // Record timestamp in localStorage to keep multiple tabs in sync
    localStorage.setItem("last_activity", Date.now().toString());

    timerRef.current = window.setTimeout(() => {
      handleLogout();
    }, timeoutMs);
  }, [timeoutMs, handleLogout]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Throttle event listeners to prevent CPU spikes on frequent mouse moves
    let throttleTimeout: number | null = null;
    const throttledReset = () => {
      if (!throttleTimeout) {
        throttleTimeout = window.setTimeout(() => {
          resetTimer();
          throttleTimeout = null;
        }, 1000);
      }
    };

    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, throttledReset, { passive: true });
    });

    // Cross-tab sync: reset this tab's timer if the user acts in another tab
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "last_activity") {
        if (timerRef.current) window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
          handleLogout();
        }, timeoutMs);
      }
    };
    window.addEventListener("storage", handleStorage);

    resetTimer();

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (throttleTimeout) window.clearTimeout(throttleTimeout);
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, throttledReset);
      });
      window.removeEventListener("storage", handleStorage);
    };
  }, [resetTimer, handleLogout, timeoutMs]);
};