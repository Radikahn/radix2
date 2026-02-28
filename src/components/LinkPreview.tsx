import { type ReactNode, useRef, useState } from "react";
import { gsap } from "gsap";

interface DotConfig {
  color: string;
  className?: string;
}

interface LinkPreviewProps {
  dots: DotConfig[];
  label: string;
  href: string;
  previewUrl?: string;
  previewContent?: ReactNode;
  previewLabel: string;
  className?: string;
}

export default function LinkPreview({
  dots,
  label,
  href,
  previewUrl,
  previewContent,
  previewLabel,
  className,
}: LinkPreviewProps) {
  const dotRef = useRef<HTMLParagraphElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleDotMouseEnter = () => {
    if (isAnimating || !dotRef.current || !modalRef.current) return;
    setIsAnimating(true);

    const dotRect = dotRef.current.getBoundingClientRect();

    gsap.set(modalRef.current, {
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      top: dotRect.top + dotRect.height / 2,
      left: dotRect.left + dotRect.width / 2,
      xPercent: -50,
      yPercent: -50,
      width: dotRect.width,
      height: dotRect.height,
      opacity: 1,
      overflow: "hidden",
    });

    const tl = gsap.timeline({
      onComplete: () => {
        setIsVisible(true);
        setIsAnimating(false);
      },
    });

    const modalWidth = Math.min(320, window.innerWidth * 0.8);
    const modalHeight = Math.min(420, window.innerHeight * 0.6);

    tl.to(modalRef.current, {
      width: modalWidth,
      height: modalHeight,
      borderRadius: 5,
      duration: 0.45,
      ease: "power3.out",
    });

    timelineRef.current = tl;
  };

  const handleModalMouseLeave = () => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    setIsVisible(false);

    if (!dotRef.current || !modalRef.current) return;

    const dotRect = dotRef.current.getBoundingClientRect();

    gsap.to(modalRef.current, {
      width: dotRect.width,
      height: dotRect.height,
      top: dotRect.top + dotRect.height / 2,
      left: dotRect.left + dotRect.width / 2,
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => {
        gsap.set(modalRef.current, { display: "none" });
        setIsAnimating(false);
      },
    });
  };

  return (
    <div className={"max-w-2xl space-y-4 " + (className ?? "")}>
      <div className="flex flex-col">
        <div className="font-jetbrains-mono justify-center cursor-default">
          <div className="flex flex-row justify-center">
            <p className="mt-5 text-[clamp(0.875rem,2vw,1.25rem)]">{label}</p>
            <div
              className="ml-4 flex flex-row text-[clamp(2rem,5vw,3.75rem)] cursor-pointer"
              onMouseEnter={handleDotMouseEnter}
            >
              {dots.map((dot, i) => (
                <p
                  key={i}
                  ref={i === 0 ? dotRef : undefined}
                  className={`font-jersey-10 ${dot.color} ${dot.className ?? ""}`}
                >
                  •
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        ref={modalRef}
        style={{ display: "none", position: "fixed", zIndex: 9999 }}
        className="bg-neutral-100 overflow-hidden shadow-2xl"
        onMouseLeave={handleModalMouseLeave}
      >
        <div className="p-2 flex justify-between items-center border-b border-zinc-700">
          <span className="text-xs text-zinc-400 font-jetbrains-mono">
            {previewLabel}
          </span>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-orange-500 font-jetbrains-mono hover:underline"
          >
            open
          </a>
        </div>
        {isVisible &&
          (previewContent ?? (
            <iframe
              width="100%"
              height="100%"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              className="flex-1"
              src={previewUrl}
            />
          ))}
      </div>
    </div>
  );
}
