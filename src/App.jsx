import { useEffect, useRef, useState } from 'react';
import { ScrollTrigger, initSmoothScroll } from './animations/scrollAnimations';
import Hero from './components/Hero';
import RepetitionSection from './components/RepetitionSection';
import HabitLoop from './components/HabitLoop';
import BrainSection from './components/BrainSection';
import MythSection from './components/MythSection';
import SmallActions from './components/SmallActions';
import GoodBadHabits from './components/GoodBadHabits';
import EnvironmentSection from './components/EnvironmentSection';
import DesigningHabit from './components/DesigningHabit';
import CompoundSection from './components/CompoundSection';
import HabitBuilder from './components/HabitBuilder';
import FinalSection from './components/FinalSection';
import LoadingScreen from './components/LoadingScreen';
import TrackerPage from './components/TrackerPage';

export default function App() {
  const [loaderComplete, setLoaderComplete] = useState(false);
  const [page, setPage] = useState('experience');
  const [transitioning, setTransitioning] = useState(false);
  const transitionTimers = useRef([]);

  useEffect(() => {
    if (!loaderComplete) return undefined;

    const lenis = initSmoothScroll();
    const refresh = () => ScrollTrigger.refresh();
    refresh();
    window.addEventListener('load', refresh);

    return () => {
      window.removeEventListener('load', refresh);
      lenis?.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [loaderComplete]);

  useEffect(() => () => {
    transitionTimers.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const moveTo = (nextPage) => {
    if (transitioning || page === nextPage) return;
    setTransitioning(true);
    transitionTimers.current.forEach((timer) => window.clearTimeout(timer));
    transitionTimers.current = [
      window.setTimeout(() => {
        setPage(nextPage);
        window.scrollTo({ top: 0, behavior: 'auto' });
        ScrollTrigger.refresh();
      }, 360),
      window.setTimeout(() => {
        setTransitioning(false);
        ScrollTrigger.refresh();
      }, 900),
    ];
  };

  return <>
    {!loaderComplete && <LoadingScreen onComplete={() => setLoaderComplete(true)} />}
    {transitioning && <div className="page-transition" aria-hidden="true" />}
    {page === 'experience' ? (
      <main id="top" className={`story ${loaderComplete ? 'is-ready' : 'is-loading'}`} aria-label="The Power of Habits interactive story" aria-hidden={!loaderComplete}>
        <Hero /><RepetitionSection /><HabitLoop /><BrainSection /><MythSection /><SmallActions />
        <GoodBadHabits /><EnvironmentSection /><DesigningHabit /><CompoundSection /><HabitBuilder /><FinalSection onOpenTracker={() => moveTo('tracker')} />
      </main>
    ) : (
      <TrackerPage onBack={() => moveTo('experience')} />
    )}
  </>;
}
