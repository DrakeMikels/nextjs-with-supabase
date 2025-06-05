"use client";

import { animate, stagger } from "motion";
import { splitText } from "motion-plus";
import { useEffect, useRef } from "react";

interface SplitTextProps {
  text: string;
  className?: string;
  staggerDelay?: number;
}

export function SplitText({ text, className = "", staggerDelay = 0.05 }: SplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.fonts.ready.then(() => {
      if (!containerRef.current) return;

      // Hide the container until the fonts are loaded
      containerRef.current.style.visibility = "visible";

      const h1Element = containerRef.current.querySelector("h1");
      if (!h1Element) return;

      const { words } = splitText(h1Element);

      // Animate the words in the h1
      animate(
        words,
        { opacity: [0, 1], y: [10, 0] },
        {
          type: "spring",
          duration: 2,
          bounce: 0,
          delay: stagger(staggerDelay),
        }
      );
    });
  }, [staggerDelay]);

  return (
    <div className={`split-text-container ${className}`} ref={containerRef}>
      <h1 className="split-text-heading" style={{ color: "#F6F6F6" }}>
        {text}
      </h1>
      <StyleSheet />
    </div>
  );
}

function StyleSheet() {
  return (
    <style>{`
      .split-text-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        text-align: center;
        visibility: hidden;
      }

      .split-text-heading {
        font-family: 'Inter', 'Articulat CF', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-weight: 700;
        font-size: 2.5rem;
        line-height: 1.2;
        margin: 0;
      }

      .split-word {
        will-change: transform, opacity;
      }

      @media (max-width: 768px) {
        .split-text-heading {
          font-size: 2rem;
        }
      }
    `}</style>
  );
} 