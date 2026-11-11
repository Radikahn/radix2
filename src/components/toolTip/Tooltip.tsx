import { useState, type ReactNode, type MouseEvent } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  text: ReactNode;
  children: ReactNode;
}

const OFFSET = 14;

// Floating tooltip that follows the cursor, styled like a classic Mac window:
// white body, hard black border, solid offset shadow, no rounding.
export function Tooltip({ text, children }: TooltipProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const track = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });

  return (
    <span
      className="inline-block"
      onMouseEnter={track}
      onMouseMove={track}
      onMouseLeave={() => setPos(null)}
    >
      {children}
      {pos &&
        createPortal(
          <div
            role="tooltip"
            className="pointer-events-none fixed z-[1000] border-2 border-black bg-white font-jetbrains-mono text-sm text-black whitespace-nowrap shadow-[3px_3px_0_0_#000]"
            style={{
              left: Math.min(pos.x + OFFSET, window.innerWidth - 220),
              top: pos.y + OFFSET,
            }}
          >
            <div className="h-2 border-b-2 border-black bg-[repeating-linear-gradient(0deg,#000_0_1px,#fff_1px_3px)]" />
            <div className="px-2 py-1">{text}</div>
          </div>,
          document.body,
        )}
    </span>
  );
}
