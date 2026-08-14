import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initSmoothScroll() {
  if (prefersReducedMotion()) return null;
  const lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.9 });
  const updateLenis = (time) => lenis.raf(time * 1000);

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(updateLenis);
  gsap.ticker.lagSmoothing(0);

  return {
    destroy() {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    },
  };
}

export function scopedAnimation(scopeRef, setup) {
  if (!scopeRef.current || prefersReducedMotion()) return () => {};
  const ctx = gsap.context(setup, scopeRef);
  return () => ctx.revert();
}

export { gsap, ScrollTrigger };
