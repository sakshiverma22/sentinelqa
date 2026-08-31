/* Signal Architecture interaction: inspect one quality case at a time with keyboard-safe focus. */
import { useEffect, useState } from "react";

type AnimatedListProps = {
  items: string[];
  onItemSelect?: (item: string, index: number) => void;
  showGradients?: boolean;
  enableArrowNavigation?: boolean;
  displayScrollbar?: boolean;
};

export default function AnimatedList({ items, onItemSelect, showGradients = true, enableArrowNavigation = true, displayScrollbar = true }: AnimatedListProps) {
  const [selected, setSelected] = useState(0);
  const select = (index: number) => { setSelected(index); onItemSelect?.(items[index], index); };
  useEffect(() => {
    if (!enableArrowNavigation) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") { event.preventDefault(); select((selected + 1) % items.length); }
      if (event.key === "ArrowUp") { event.preventDefault(); select((selected - 1 + items.length) % items.length); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enableArrowNavigation, items, selected]);
  return (
    <div className={`animated-list ${displayScrollbar ? "with-scrollbar" : ""} ${showGradients ? "with-gradients" : ""}`}>
      {items.map((item, index) => <button type="button" className={`animated-list__item ${selected === index ? "is-selected" : ""}`} key={item} onClick={() => select(index)}><span className="animated-list__id">0{index + 1}</span><span>{item}</span><span className="animated-list__arrow">↗</span></button>)}
    </div>
  );
}
