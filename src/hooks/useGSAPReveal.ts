import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useGSAPReveal<T extends HTMLElement>(
  options: {
    y?: number;
    x?: number;
    opacity?: number;
    duration?: number;
    delay?: number;
    stagger?: number;
    ease?: string;
    start?: string;
    childSelector?: string;
  } = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      y = 40,
      x = 0,
      opacity = 0,
      duration = 0.9,
      delay = 0,
      stagger = 0.1,
      ease = "power3.out",
      start = "top 85%",
      childSelector,
    } = options;

    const targets = childSelector ? el.querySelectorAll(childSelector) : el;

    const tween = gsap.from(targets, {
      y,
      x,
      opacity,
      duration,
      delay,
      stagger: childSelector ? stagger : 0,
      ease,
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: "play none none none",
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
    };
  }, []);

  return ref;
}

export function useParallax<T extends HTMLElement>(speed: number = 0.3) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tween = gsap.to(el, {
      yPercent: speed * 100,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      tween.kill();
    };
  }, [speed]);

  return ref;
}
