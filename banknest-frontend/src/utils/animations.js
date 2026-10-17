import { useEffect, useRef, useState } from 'react';

/**
 * Animates a number from 0 to `target` with an ease-out curve.
 * Used for the dashboard balance so money values feel alive.
 * A timeout fallback guarantees the final value lands even when
 * requestAnimationFrame is throttled (e.g. background tabs).
 */
export const useCountUp = (target, duration = 1200) => {
  const [value, setValue] = useState(0);
  const previousTarget = useRef(0);

  useEffect(() => {
    const from = previousTarget.current;
    const to = Number(target) || 0;
    previousTarget.current = to;

    if (from === to) {
      setValue(to);
      return undefined;
    }

    const start = performance.now();
    let frame;
    let fallback;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (to - from) * eased;
      setValue(progress < 1 ? current : to);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    fallback = setTimeout(() => setValue(to), duration + 500);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(fallback);
    };
  }, [target, duration]);

  return value;
};

/**
 * Adds a reveal class to an element when it scrolls into view.
 * Pairs with the `.reveal` CSS classes in index.css.
 */
export const useReveal = () => {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('revealed');
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return ref;
};
