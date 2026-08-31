/* Signal Architecture motion: short, editorial reveal; never competes with evidence. */
import { useEffect, useState } from "react";

type BlurTextProps = {
  text: string;
  delay?: number;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  className?: string;
  onAnimationComplete?: () => void;
};

export default function BlurText({ text, delay = 80, animateBy = "words", direction = "top", className = "", onAnimationComplete }: BlurTextProps) {
  const units = animateBy === "letters" ? text.split("") : text.split(" ");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDone(true);
      onAnimationComplete?.();
    }, Math.max(0, units.length * delay + 500));
    return () => window.clearTimeout(timeout);
  }, [delay, onAnimationComplete, units.length]);

  return (
    <span className={`blur-text ${className}`} aria-label={text}>
      {units.map((unit, index) => (
        <span
          key={`${unit}-${index}`}
          className={`blur-text__unit ${done ? "is-done" : ""}`}
          style={{
            animationDelay: `${index * delay}ms`,
            transform: `translateY(${direction === "top" ? "-16px" : "16px"})`,
          }}
        >
          {unit}{animateBy === "words" && index < units.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}
