/* eslint-disable react/prop-types -- no prop-types dependency in this project */
import { useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const arrowClass =
  "inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2";

// Slider Embla accessible : flèches avec aria-label, autoplay arrêté au survol
// et au focus, désactivé avec prefers-reduced-motion.
export const Slider = ({ label, slideClassName, children }) => {
  const [reduced] = useState(prefersReducedMotion);
  const plugins = useMemo(
    () => [
      Autoplay({
        delay: 4000,
        playOnInit: !reduced,
        stopOnMouseEnter: true,
        stopOnFocusIn: true,
        stopOnInteraction: false,
      }),
    ],
    [reduced]
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, plugins);

  useEffect(() => {
    if (!emblaApi) return undefined;
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!media) return undefined;
    const sync = () => {
      const autoplay = emblaApi.plugins().autoplay;
      if (!autoplay) return;
      if (media.matches) autoplay.stop();
      else autoplay.play();
    };
    media.addEventListener?.("change", sync);
    return () => media.removeEventListener?.("change", sync);
  }, [emblaApi]);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className="relative"
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <ul className="flex list-none p-0 m-0">
          {children.map((child) => (
            <li
              key={child.key}
              className={`min-w-0 flex-grow-0 flex-shrink-0 ${slideClassName}`}
            >
              {child}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex justify-center gap-3">
        <button
          type="button"
          className={arrowClass}
          aria-label={`Previous ${label}`}
          onClick={() => emblaApi?.scrollPrev()}
        >
          <span className="pi pi-chevron-left" aria-hidden="true" />
        </button>
        <button
          type="button"
          className={arrowClass}
          aria-label={`Next ${label}`}
          onClick={() => emblaApi?.scrollNext()}
        >
          <span className="pi pi-chevron-right" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
