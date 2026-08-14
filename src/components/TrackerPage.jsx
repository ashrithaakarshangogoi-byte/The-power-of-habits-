import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap, scopedAnimation } from '../animations/scrollAnimations';

const habits = [
  { icon: '📚', name: 'Study Physics', identity: 'I am becoming a disciplined learner.', frequency: 'Daily', streak: 7, completion: 86, status: 'On track', week: [1, 1, 1, 1, 1, 0, 1], note: 'Your strongest cue is dinner. Keep the notebook visible before you eat.' },
  { icon: '🎸', name: 'Practice Guitar', identity: 'I am becoming a musician.', frequency: 'Daily', streak: 5, completion: 71, status: 'Building', week: [1, 1, 0, 1, 1, 0, 1], note: 'Reduce friction by leaving the guitar on its stand, not in its case.' },
  { icon: '🏎️', name: 'Learn Motorsport Engineering', identity: 'I am becoming an engineer.', frequency: '5× per week', streak: 4, completion: 80, status: 'Focused', week: [1, 1, 1, 0, 1, 0, 1], note: 'Pair lessons with one tiny design sketch to make progress visible.' },
  { icon: '📖', name: 'Read', identity: 'I am becoming a reader.', frequency: 'Daily', streak: 12, completion: 92, status: 'Excellent', week: [1, 1, 1, 1, 1, 1, 0], note: 'The bedtime cue is working. Keep the next book within reach.' },
];

const laws = [
  { step: '01', title: 'MAKE IT OBVIOUS', body: 'After I finish dinner, I will study Physics for 20 minutes.', signal: 'Cue → Action' },
  { step: '02', title: 'MAKE IT ATTRACTIVE', body: 'Study Physics + listen to my focus playlist', signal: 'Want → Action' },
  { step: '03', title: 'MAKE IT EASY', body: 'Open my Physics notebook and solve one question.', signal: '2-minute version', original: 'Study Physics for 2 hours' },
  { step: '04', title: 'MAKE IT SATISFYING', body: 'Complete habit → Check it off → Get immediate visual feedback', signal: 'Reward closes the loop' },
];

const tinyRules = [
  ['STUDY', '2 HOURS', 'OPEN THE BOOK'], ['READ', '30 PAGES', 'READ ONE PAGE'], ['EXERCISE', '45 MINUTES', 'PUT ON YOUR SHOES'], ['GUITAR', '30 MINUTES', 'PICK UP THE GUITAR'], ['CODING', '1 HOUR', 'WRITE ONE LINE'],
];

const stacks = [
  ['finish dinner', 'review 5 Physics questions'], ['wake up', 'drink water'], ['get home from school', 'study for 20 minutes'], ['finish studying', 'practice guitar'], ['brush my teeth', 'read 2 pages'],
];

const insights = {
  phone: ['📱 Phone', 'Make distraction harder.', 'Move your phone away from your study space.'],
  books: ['📚 Books', 'Make the habit obvious.', 'Keep your textbook visible on your desk.'],
  guitar: ['🎸 Guitar', 'Reduce friction.', 'Keep your guitar accessible and ready to play.'],
  laptop: ['💻 Laptop', 'Remove unnecessary steps.', 'Keep your development environment ready to use.'],
  alarm: ['⏰ Alarm', 'Make time visible.', 'Use one clear signal to begin instead of relying on memory.'],
  notebook: ['📝 Notebook', 'Make the next action clear.', "Write tomorrow's first task before finishing today."],
};

export default function TrackerPage({ onBack }) {
  const ref = useRef(null);
  const [law, setLaw] = useState(0);
  const [tiny, setTiny] = useState(0);
  const [stack, setStack] = useState(0);
  const [object, setObject] = useState('books');
  const [activeHabit, setActiveHabit] = useState(0);
  const nav = ['SYSTEM', 'BUILD', '2-MIN', 'STACK', 'ENV', 'HABITS', 'TREE'];
  const selectedInsight = insights[object];
  const stackText = useMemo(() => `After I ${stacks[stack][0]}, I will ${stacks[stack][1]}.`, [stack]);

  useEffect(() => scopedAnimation(ref, () => {
    const q = gsap.utils.selector(ref);
    gsap.from(q('.tracker-hero > *'), { autoAlpha: 0, y: 40, stagger: 0.12, duration: 1, ease: 'power3.out' });
    gsap.from(q('.tracker-card'), { scrollTrigger: { trigger: q('.tracker-dashboard')[0], start: 'top 75%' }, autoAlpha: 0, y: 45, stagger: 0.08, duration: 0.8, ease: 'power3.out' });
    gsap.fromTo(q('.habit-fill'), { scaleX: 0 }, { scrollTrigger: { trigger: q('.tracker-dashboard')[0], start: 'top 70%' }, scaleX: 1, stagger: 0.08, duration: 1.2, ease: 'power3.out', transformOrigin: 'left center' });
    gsap.timeline({ scrollTrigger: { trigger: q('.habit-tree')[0], start: 'top top', end: '+=170%', pin: true, scrub: 1 } })
      .from(q('.tree-seed'), { scale: 0.2, autoAlpha: 0 })
      .from(q('.tree-trunk'), { scaleY: 0, transformOrigin: 'bottom center' }, 0.1)
      .from(q('.tree-branch'), { scaleX: 0, autoAlpha: 0, stagger: 0.16, transformOrigin: 'left center' }, 0.25)
      .from(q('.tree-leaf'), { scale: 0, autoAlpha: 0, stagger: 0.08 }, 0.45)
      .from(q('.tree-ending > *'), { autoAlpha: 0, y: 40, stagger: 0.25 }, 0.72);
  }), []);

  useEffect(() => {
    const result = ref.current?.querySelector('.stack-result');
    if (!result) return undefined;
    const tween = gsap.fromTo(result, { autoAlpha: 0, y: 22, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out' });
    return () => tween.kill();
  }, [stack]);

  useEffect(() => {
    const insight = ref.current?.querySelector('.environment-insight');
    if (!insight) return undefined;
    const tween = gsap.fromTo(insight, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' });
    return () => tween.kill();
  }, [object]);

  return <main ref={ref} className="tracker-page" aria-label="Habit tracker presentation dashboard">
    <button className="tracker-back" onClick={onBack}>← BACK TO EXPERIENCE</button>
    <nav className="tracker-nav" aria-label="Tracker sections">{nav.map((item, i) => <a href={`#tracker-${i + 1}`} key={item}>{String(i + 1).padStart(2, '0')} {item}</a>)}</nav>

    <section id="tracker-1" className="tracker-section tracker-hero">
      <p className="eyebrow">01 — YOUR HABIT SYSTEM</p><h1>YOUR HABIT SYSTEM</h1><p>Small actions. Repeated consistently.</p>
      <div className="system-strip">{habits.map(h => <span key={h.name}>{h.icon} {h.name}</span>)}</div>
    </section>

    <section id="tracker-2" className="tracker-section tracker-two-col">
      <div><p className="eyebrow">02 — BUILD YOUR HABIT</p><h2>BUILD YOUR HABIT</h2><p className="tracker-copy">The four laws turn intention into a system you can repeat.</p></div>
      <article className="law-card glass-card">
        <div className="law-progress">{laws[law].step} / 04</div><h3>{laws[law].title}</h3>
        {laws[law].original && <del>{laws[law].original}</del>}<p>{laws[law].body}</p><strong>{laws[law].signal}</strong>
        <div className="law-actions">{laws.map((l, i) => <button className={i === law ? 'active' : ''} onClick={() => setLaw(i)} key={l.step}>{l.step}</button>)}</div>
        {law === 3 && <div className="completion-burst" aria-hidden="true"><span>✓</span><i/><i/><i/></div>}
      </article>
    </section>

    <section id="tracker-3" className="tracker-section tiny-rule">
      <p className="eyebrow">03 — THE 2-MINUTE RULE</p><h2>MAKE IT SO EASY YOU CAN'T SAY NO.</h2>
      <div className="tiny-grid">{tinyRules.map((r, i) => <button className={`tiny-card glass-card ${i === tiny ? 'active' : ''}`} onClick={() => setTiny(i)} key={r[0]}><small>{r[0]}</small><span>{r[1]}</span><b>→ {r[2]}</b></button>)}</div>
      <p className="tracker-quote">The goal isn't to finish the habit.<br/>The goal is to become the person who starts.</p>
    </section>

    <section id="tracker-4" className="tracker-section tracker-two-col">
      <div><p className="eyebrow">04 — HABIT STACKING</p><h2>After I ______, I will ______.</h2><p className="tracker-copy">Attach the new behavior to a cue that already exists.</p></div>
      <div className="stack-panel glass-card"><p>Existing habit: <b>{stacks[stack][0]}</b></p><p>New habit: <b>{stacks[stack][1]}</b></p><blockquote className="stack-result">{stackText}</blockquote><button onClick={() => setStack((stack + 1) % stacks.length)}>GENERATE ANOTHER</button></div>
    </section>

    <section id="tracker-5" className="tracker-section environment-lab">
      <p className="eyebrow">05 — DESIGN YOUR ENVIRONMENT</p><h2>DESIGN YOUR ENVIRONMENT</h2><p>Make good habits obvious. Make bad habits difficult.</p>
      <div className="desk-scene glass-card">{Object.entries(insights).map(([key, value]) => <button className={`desk-object ${key} ${object === key ? 'active' : ''}`} onClick={() => setObject(key)} key={key}>{value[0]}</button>)}<aside className="environment-insight"><small>{selectedInsight[0]}</small><h3>{selectedInsight[1]}</h3><p>{selectedInsight[2]}</p></aside></div>
    </section>

    <section id="tracker-6" className="tracker-section tracker-dashboard">
      <p className="eyebrow">06 — YOUR HABITS</p><h2>YOUR HABITS</h2>
      <div className="habit-grid">{habits.map((h, i) => <article className={`tracker-card glass-card ${activeHabit === i ? 'active' : ''}`} onClick={() => setActiveHabit(i)} key={h.name}><div className="habit-top"><span>{h.icon}</span><h3>{h.name}</h3></div><p>“{h.identity}”</p><strong>🔥 {h.streak} DAY STREAK</strong><div className="week-row">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, j) => <span className={h.week[j] ? 'done' : ''} key={d}>{d}<b>{h.week[j] ? '✓' : '—'}</b></span>)}</div><div className="habit-meter"><i className="habit-fill" style={{ width: `${h.completion}%` }} /></div><footer><b>{h.completion}% completion</b><em>{h.status}</em></footer>{activeHabit === i && <small className="habit-note">{h.note}</small>}</article>)}</div>
    </section>

    <section id="tracker-7" className="tracker-section habit-tree dark">
      <div className="tree-stage"><div className="tree-seed">●</div><div className="tree-trunk" />{['LEARNER','MUSICIAN','ENGINEER','READER'].map((id, i) => <div className={`tree-branch branch-${i}`} key={id}><span className="tree-leaf">🌱 {id}</span><small>{i === 0 ? 'Study Physics · Read' : i === 1 ? 'Practice Guitar' : i === 2 ? 'Learn Motorsport Engineering' : 'Read'}</small></div>)}</div>
      <div className="tree-ending"><p>IDENTITY ↓ SYSTEM ↓ HABIT ↓ REPETITION ↓ RESULT</p><h2>Small actions compound.</h2><h3>Every repetition is a vote for the person you want to become.</h3></div>
    </section>
  </main>;
}
