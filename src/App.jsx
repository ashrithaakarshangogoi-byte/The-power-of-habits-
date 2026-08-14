import { useEffect, useState } from 'react';
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

export default function App() {
  const [loaderComplete, setLoaderComplete] = useState(false);

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

  return <>
    {!loaderComplete && <LoadingScreen onComplete={() => setLoaderComplete(true)} />}
    <main id="top" className={`story ${loaderComplete ? 'is-ready' : 'is-loading'}`} aria-label="The Power of Habits interactive story" aria-hidden={!loaderComplete}>
      <Hero /><RepetitionSection /><HabitLoop /><BrainSection /><MythSection /><SmallActions />
      <GoodBadHabits /><EnvironmentSection /><DesigningHabit /><CompoundSection /><HabitBuilder /><FinalSection />
    </main>
  </>;
}
