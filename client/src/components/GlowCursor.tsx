/* Signal Architecture motion: the pointer becomes a measured signal, not a decorative cursor trick. */
import { ReactNode, useEffect, useRef, useState } from "react";

type GlowCursorProps = {
  children: ReactNode;
  color?: string;
  secondaryColor?: string;
  trailLength?: number;
  trailWidth?: number;
  trailTaper?: number;
  followSpeed?: number;
  glowIntensity?: number;
  glowSpread?: number;
  hotspot?: number;
  brightness?: number;
  opacity?: number;
  pulseSpeed?: number;
  noiseStrength?: number;
  idleFade?: boolean;
  idleTimeout?: number;
  fadeDuration?: number;
  blendMode?: string;
  global?: boolean;
};

type Point = { x: number; y: number };

export default function GlowCursor({ children, color = "#67E8F9", secondaryColor = "#A78BFA", trailLength = 40, trailWidth = 8, trailTaper = .8, followSpeed = .16, opacity = 1, idleFade = true, idleTimeout = 700, fadeDuration = 900, blendMode = "screen", global = false }: GlowCursorProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const targetRef = useRef<Point>({ x: 0, y: 0 });
  const frameRef = useRef<number | undefined>(undefined);
  const idleRef = useRef<number | undefined>(undefined);
  const [active, setActive] = useState(false);
  const pointCount = Math.max(10, Math.min(54, Math.round(trailLength / 2.2)));

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    pointsRef.current = Array.from({ length: pointCount }, () => ({ x: 0, y: 0 }));
    const onMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      targetRef.current = global
        ? { x: event.clientX, y: event.clientY }
        : { x: event.clientX - rect.left, y: event.clientY - rect.top };
      setActive(true);
      window.clearTimeout(idleRef.current);
      if (idleFade) idleRef.current = window.setTimeout(() => setActive(false), idleTimeout);
    };
    const moveTarget: Window | HTMLDivElement = global ? window : stage;
    moveTarget.addEventListener("pointermove", onMove as EventListener);
    const render = () => {
      const points = pointsRef.current;
      const target = targetRef.current;
      if (points.length) {
        points[0].x += (target.x - points[0].x) * followSpeed;
        points[0].y += (target.y - points[0].y) * followSpeed;
        for (let i = 1; i < points.length; i += 1) {
          points[i].x += (points[i - 1].x - points[i].x) * (followSpeed * .82);
          points[i].y += (points[i - 1].y - points[i].y) * (followSpeed * .82);
        }
        points.forEach((point, index) => {
          const node = stage.querySelector<HTMLElement>(`[data-trace="${index}"]`);
          if (node) {
            const factor = 1 - index / points.length;
            node.style.transform = `translate3d(${point.x - trailWidth / 2}px, ${point.y - trailWidth / 2}px, 0) scale(${Math.max(.08, factor * (1 - trailTaper * .35))})`;
            node.style.opacity = String(factor * opacity);
          }
        });
      }
      frameRef.current = requestAnimationFrame(render);
    };
    frameRef.current = requestAnimationFrame(render);
    return () => {
      moveTarget.removeEventListener("pointermove", onMove as EventListener);
      window.clearTimeout(idleRef.current);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [fadeDuration, followSpeed, global, idleFade, idleTimeout, opacity, pointCount, trailTaper, trailWidth]);

  return (
    <div ref={stageRef} className={`glow-cursor ${global ? "glow-cursor--global" : ""} ${active ? "is-active" : ""}`} style={{ "--glow-color": color, "--glow-secondary": secondaryColor, "--fade-duration": `${fadeDuration}ms`, "--blend-mode": blendMode } as React.CSSProperties}>
      {children}
      <div className={global ? "glow-cursor__trail glow-cursor__trail--global" : "glow-cursor__trail"} aria-hidden="true">
        {Array.from({ length: pointCount }).map((_, index) => <i key={index} data-trace={index} />)}
      </div>
    </div>
  );
}
