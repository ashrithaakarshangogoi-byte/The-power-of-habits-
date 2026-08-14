import { useEffect, useRef } from 'react';
import { gsap, scopedAnimation } from '../animations/scrollAnimations';

export default function FinalSection({ onOpenTracker }) {
  const ref = useRef(null);

  useEffect(() => scopedAnimation(ref, () => {
    const q = gsap.utils.selector(ref);
    gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top top', end: '+=220%', pin: true, scrub: 1 } })
      .from(q('.final-line'), { autoAlpha: 0, y: 70, stagger: 0.45 })
      .from(q('button'), { autoAlpha: 0, y: 30, stagger: 0.12 }, 1.8);
  }), []);

  return <section ref={ref} className="panel final dark">
    <h2 className="final-line">HABITS ARE NOT BUILT IN ONE MOMENT.</h2>
    <h2 className="final-line">THEY ARE BUILT IN MANY SMALL ONES.</h2>
    <h2 className="final-line">START SMALL.</h2>
    <h2 className="final-line accent">REPEAT.</h2>
    <p className="final-line">YOUR NEXT ACTION IS THE FIRST ONE.</p>
    <div className="final-actions">
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>START AGAIN</button>
      <button className="tracker-cta" onClick={onOpenTracker}>TRACKER →</button>
    </div>
  </section>;
}
