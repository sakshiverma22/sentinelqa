/* Signal Architecture motion: one deliberate reveal that hands the stage from signal to proof. */
import { ReactNode, useEffect, useRef, useState } from "react";

type ScrollExpandProps = {
  src: string;
  alt?: string;
  title?: string;
  scrollHint?: string;
  useWindowScroll?: boolean;
  mediaZoom?: number;
  children?: ReactNode;
};

export default function ScrollExpand({ src, alt = "", title, scrollHint = "Scroll", useWindowScroll = true, mediaZoom = 1.18, children }: ScrollExpandProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!useWindowScroll) return;
    const update = () => {
      const node = stageRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const distance = Math.max(1, window.innerHeight - rect.height * .22);
      const next = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / distance));
      setProgress(next);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [useWindowScroll]);
  return (
    <div ref={stageRef} className="scroll-expand" style={{ "--expand-progress": progress } as React.CSSProperties}>
      <div className="scroll-expand__media" style={{ transform: `scale(${1 + (mediaZoom - 1) * progress})` }}>
        <img src={src} alt={alt} />
      </div>
      <div className="scroll-expand__veil" />
      <div className="scroll-expand__content">
        {title && <span className="eyebrow">{title}</span>}
        {children}
      </div>
      <div className="scroll-expand__hint"><i />{scrollHint}</div>
    </div>
  );
}
