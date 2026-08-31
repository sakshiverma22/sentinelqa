/* Signal Architecture motion: waveforms are atmosphere for the instrument panel, kept quiet behind content. */
import { useEffect, useRef } from "react";

type GradientWavesProps = {
  horizonColor?: string;
  waveColor?: string;
  crestColor?: string;
  speed?: number;
  amplitude?: number;
  waveScale?: number;
  waveRatio?: number;
  swell?: number;
  turbulence?: number;
  tilt?: number;
  zoom?: number;
  height?: number;
  fogDepth?: number;
  detail?: string;
  brightness?: number;
  opacity?: number;
  mouseInteraction?: boolean;
  parallaxStrength?: number;
  grain?: boolean;
  grainIntensity?: number;
};

export default function GradientWaves({ horizonColor = "#5227FF", waveColor = "#FF9FFC", crestColor = "#FFFFFF", mouseInteraction = true, parallaxStrength = .5, opacity = 1, grain = true, grainIntensity = .05 }: GradientWavesProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || !mouseInteraction) return;
    const onMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - .5) * parallaxStrength * 22;
      const y = (event.clientY / window.innerHeight - .5) * parallaxStrength * 12;
      node.style.setProperty("--wave-x", `${x}px`);
      node.style.setProperty("--wave-y", `${y}px`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mouseInteraction, parallaxStrength]);

  return (
    <div ref={ref} className="gradient-waves" style={{ opacity, "--horizon": horizonColor, "--wave": waveColor, "--crest": crestColor, "--grain-opacity": grain ? grainIntensity : 0 } as React.CSSProperties} aria-hidden="true">
      <svg viewBox="0 0 1440 700" preserveAspectRatio="none">
        <defs>
          <linearGradient id="sentinel-horizon" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="var(--horizon)" stopOpacity=".08" />
            <stop offset=".52" stopColor="var(--wave)" stopOpacity=".37" />
            <stop offset="1" stopColor="var(--horizon)" stopOpacity=".04" />
          </linearGradient>
          <linearGradient id="sentinel-crest" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--crest)" stopOpacity=".34" />
            <stop offset=".6" stopColor="var(--wave)" stopOpacity=".08" />
            <stop offset="1" stopColor="var(--horizon)" stopOpacity="0" />
          </linearGradient>
          <filter id="sentinel-blur"><feGaussianBlur stdDeviation="18" /></filter>
        </defs>
        <g className="wave-layer wave-layer-back" transform="translate(var(--wave-x), var(--wave-y))">
          <path d="M-30 432 C160 320 270 442 430 374 C620 291 751 418 903 345 C1070 264 1210 375 1470 272 L1470 720 L-30 720 Z" fill="url(#sentinel-horizon)" filter="url(#sentinel-blur)" />
          <path d="M-30 486 C145 398 302 500 478 424 C649 350 789 471 946 399 C1124 317 1297 434 1470 355" fill="none" stroke="url(#sentinel-crest)" strokeWidth="54" opacity=".5" />
        </g>
        <g className="wave-layer wave-layer-front" transform="translate(calc(var(--wave-x) * -1), calc(var(--wave-y) * -1))">
          <path d="M-30 572 C164 449 282 594 470 511 C660 428 795 560 958 480 C1110 405 1278 518 1470 431" fill="none" stroke="url(#sentinel-horizon)" strokeWidth="2" opacity=".7" />
          <path d="M-30 610 C169 490 305 636 495 546 C682 458 803 603 978 515 C1144 432 1294 563 1470 474" fill="none" stroke="var(--wave)" strokeWidth="1" opacity=".34" />
          <path d="M-30 644 C162 538 305 670 509 581 C688 503 845 642 1011 550 C1172 461 1326 603 1470 525" fill="none" stroke="var(--crest)" strokeWidth="1" opacity=".18" />
        </g>
      </svg>
      <div className="wave-grain" />
    </div>
  );
}
