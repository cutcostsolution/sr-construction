import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageSlideshow({ images, altPrefix }: { images: string[]; altPrefix: string }) {
  const [current, setCurrent] = useState(0);
  const total = images.length;

  const next = useCallback(() => setCurrent((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((i) => (i - 1 + total) % total), [total]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  if (total === 0) return null;
  if (total === 1) return (
    <div className="slideshow-single">
      <img src={images[0]} alt={`${altPrefix} — view 1`} />
    </div>
  );

  return (
    <div className="slideshow">
      <div className="slideshow-track" style={{ transform: `translateX(-${current * 100}%)` }}>
        {images.map((src, i) => (
          <div key={i} className="slideshow-slide">
            <img src={src} alt={`${altPrefix} — view ${i + 1}`} loading={i === 0 ? "eager" : "lazy"} />
          </div>
        ))}
      </div>
      <button className="slideshow-arrow slideshow-prev" onClick={prev} aria-label="Previous image"><ChevronLeft size={24} /></button>
      <button className="slideshow-arrow slideshow-next" onClick={next} aria-label="Next image"><ChevronRight size={24} /></button>
      <div className="slideshow-dots">
        {images.map((_, i) => (
          <button key={i} className={i === current ? "active" : ""} onClick={() => setCurrent(i)} aria-label={`Go to image ${i + 1}`} />
        ))}
      </div>
      <span className="slideshow-counter">{String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
    </div>
  );
}
