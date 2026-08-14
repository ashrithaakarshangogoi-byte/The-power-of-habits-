import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '../animations/scrollAnimations';

export const LOADER_DURATION = 10000;
const EXIT_DURATION = 900;

export default function LoadingScreen({ onComplete }) {
  const rootRef = useRef(null);
  const progressRef = useRef(null);
  const percentRef = useRef(null);
  const completeRef = useRef(false);
  const exitTweenRef = useRef(null);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const progress = progressRef.current;
    const percent = percentRef.current;
    if (!root || !progress || !percent) return undefined;

    const previousOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const reduced = prefersReducedMotion();
    const progressValue = { value: 0 };
    const ctx = gsap.context(() => {
      gsap.set(root, { autoAlpha: 1, pointerEvents: 'auto' });
      gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' });

      const intro = gsap.timeline();
      intro
        .from('.loader-backdrop', { autoAlpha: 0, duration: reduced ? 0.01 : 1.2, ease: 'power2.out' }, 0)
        .from('.loader-title', { autoAlpha: 0, y: reduced ? 0 : 22, filter: reduced ? 'blur(0px)' : 'blur(18px)', duration: reduced ? 0.01 : 1.8, ease: 'power3.out' }, 0.25)
        .from('.loader-subtitle, .loader-status', { autoAlpha: 0, y: reduced ? 0 : 14, duration: reduced ? 0.01 : 1.1, stagger: 0.16, ease: 'power2.out' }, 1)
        .from('.loader-ring', { autoAlpha: 0, scale: reduced ? 1 : 0.78, duration: reduced ? 0.01 : 1.7, stagger: 0.24, ease: 'power2.out' }, 1.2)
        .from('.loader-particle', { autoAlpha: 0, scale: 0, duration: reduced ? 0.01 : 0.9, stagger: 0.08, ease: 'power2.out' }, 1.4);

      if (!reduced) {
        gsap.to('.loader-orbit', { rotate: 360, duration: 4.8, ease: 'none', repeat: -1 });
        gsap.to('.loader-ring', { rotate: 18, scale: 1.08, opacity: 0.72, duration: 5, stagger: 0.35, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        gsap.to('.loader-particle', { opacity: 0.8, scale: 1.35, duration: 1.8, stagger: 0.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      }

      gsap.to(progressValue, {
        value: 100,
        duration: LOADER_DURATION / 1000,
        ease: 'power1.inOut',
        onUpdate: () => {
          const value = Math.round(progressValue.value);
          percent.textContent = `${String(value).padStart(2, '0')}%`;
          gsap.set(progress, { scaleX: progressValue.value / 100 });
        },
      });

      gsap.to('.loader-title', {
        color: '#ffffff',
        letterSpacing: '0.19em',
        duration: reduced ? 0.01 : 2,
        delay: reduced ? 0 : 7,
        ease: 'power2.out',
      });
    }, rootRef);

    const finishTimer = window.setTimeout(() => {
      if (completeRef.current) return;
      completeRef.current = true;
      setExiting(true);
      exitTweenRef.current = gsap.to(root, {
        autoAlpha: 0,
        scale: reduced ? 1 : 1.025,
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: reduced ? 0.01 : EXIT_DURATION / 1000,
        ease: 'power3.inOut',
        onStart: () => gsap.set(root, { pointerEvents: 'none' }),
        onComplete: () => {
          document.documentElement.style.overflow = previousOverflow;
          document.body.style.overflow = previousBodyOverflow;
          onComplete?.();
        },
      });
    }, LOADER_DURATION);

    return () => {
      window.clearTimeout(finishTimer);
      exitTweenRef.current?.kill();
      ctx.revert();
      document.documentElement.style.overflow = previousOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [onComplete]);

  return (
    <section
      ref={rootRef}
      className={`loading-screen${exiting ? ' is-exiting' : ''}`}
      aria-label="Loading The Power of Habits experience"
      aria-live="polite"
    >
      <div className="loader-backdrop" aria-hidden="true" />
      <div className="loader-visual" aria-hidden="true">
        <div className="loader-orbit">
          <span className="loader-glow" />
          <span className="loader-particle p1" />
          <span className="loader-particle p2" />
          <span className="loader-particle p3" />
        </div>
        <span className="loader-ring r1" />
        <span className="loader-ring r2" />
        <span className="loader-ring r3" />
      </div>
      <div className="loader-copy">
        <h1 className="loader-title">Navaneeth × Ashrith</h1>
        <p className="loader-subtitle">THE POWER OF HABITS</p>
      </div>
      <div className="loader-status">
        <div className="loader-progress" aria-hidden="true"><span ref={progressRef} /></div>
        <p><span>INITIALIZING EXPERIENCE</span><b ref={percentRef}>00%</b></p>
      </div>
    </section>
  );
}
