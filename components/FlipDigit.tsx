"use client";

import { useEffect, useRef, useState } from "react";

/**
 * One character of a split-flap (departures-board) display.
 * Animates a 3D flip whenever `value` changes.
 */
export function FlipDigit({ value, size = "lg" }: { value: string; size?: "lg" | "sm" }) {
  const [display, setDisplay] = useState(value);
  const [prev, setPrev] = useState(value);
  const [flipping, setFlipping] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (value === display) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrev(display);
    setFlipping(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setDisplay(value);
      setFlipping(false);
    }, 280);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const shown = flipping ? prev : display;

  return (
    <span className={`flip-digit flip-digit--${size}`} aria-hidden="true">
      <span className="flip-digit__panel">{shown}</span>
      {flipping && (
        <span className="flip-digit__flap">
          <span className="flip-digit__flap-face flip-digit__flap-front">{prev}</span>
          <span className="flip-digit__flap-face flip-digit__flap-back">{value}</span>
        </span>
      )}
      <span className="flip-digit__hinge" />
    </span>
  );
}
