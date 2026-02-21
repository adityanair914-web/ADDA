import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight, Heart, Users, Calendar, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api, Stats, Event, Club } from '../lib/api';
import { useScroll, useTransform } from 'motion/react';

/* ─────────────────────────────────────────────
   1. TYPEWRITER
───────────────────────────────────────────── */
function Typewriter({ segments, delay = 0 }: {
  segments: { text: string; className?: string; style?: React.CSSProperties }[];
  delay?: number;
}) {
  const fullText = segments.map(s => s.text).join('');
  const [charCount, setCharCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => {
      started.current = true;
      let i = 0;
      const iv = setInterval(() => {
        i++;
        setCharCount(i);
        if (i >= fullText.length) clearInterval(iv);
      }, 38);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [fullText, delay]);

  // rebuild rendered segments respecting char budget
  let remaining = charCount;
  return (
    <>
      {segments.map((seg, si) => {
        const show = seg.text.slice(0, Math.max(0, remaining));
        remaining -= seg.text.length;
        return <span key={si} className={seg.className} style={seg.style}>{show}</span>;
      })}
      {charCount < fullText.length && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.7, repeat: Infinity }}
          style={{ display: 'inline-block', width: 2, height: '0.9em', background: '#C0476D', marginLeft: 2, verticalAlign: 'middle', borderRadius: 1 }}
        />
      )}
    </>
  );
}

/* ─────────────────────────────────────────────
   2. ANIMATED COUNTER
───────────────────────────────────────────── */
function AnimCounter({ value, prefix = '' }: { value: number; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref as any, { once: true });
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const start = performance.now();
    const dur = 1400;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setCount(Math.floor(ease * value));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return <span ref={ref}>{prefix}{count}</span>;
}

/* ─────────────────────────────────────────────
   3. PHYSICS SPRING DECORATION
   (pendulum-style drop with overshoot)
───────────────────────────────────────────── */
function SpringBlob({ emoji, delay = 0, style = {} }: {
  emoji: string; delay?: number; style?: React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ y: -120, rotate: -30, opacity: 0 }}
      animate={{ y: 0, rotate: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 8, delay }}
      whileHover={{ rotate: [0, -12, 12, -6, 6, 0], transition: { duration: 0.5 } }}
      style={{
        position: 'absolute', fontSize: 36, userSelect: 'none',
        cursor: 'default', ...style,
      }}
    >
      {emoji}
      {/* "ribbon" swinging below */}
      <motion.div
        animate={{ rotate: [0, 8, -8, 4, -4, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.5 }}
        style={{
          transformOrigin: 'top center',
          width: 3, height: 28,
          background: 'linear-gradient(180deg,#C0476D,#F7C5D5)',
          borderRadius: 2,
          margin: '0 auto',
        }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   4. 3D SCATTER ICON
───────────────────────────────────────────── */
function ScatterIcon({ icon: Icon, label, sub, to, color, bg, index }: {
  icon: React.ForwardRefExoticComponent<any> | React.ComponentType<any>; label: string; sub: string;
  to: string; color: string; bg: string; index: number;
}) {
  const randomRX = (Math.random() - 0.5) * 180;
  const randomRY = (Math.random() - 0.5) * 180;
  const randomRZ = (Math.random() - 0.5) * 120;

  return (
    <motion.div
      initial={{ rotateX: randomRX, rotateY: randomRY, rotateZ: randomRZ, z: -400, opacity: 0, scale: 0.3 }}
      whileInView={{ rotateX: 0, rotateY: 0, rotateZ: 0, z: 0, opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: 'spring', stiffness: 160, damping: 18, delay: index * 0.12 }}
      whileHover={{ scale: 1.07, y: -8, rotateZ: 3 }}
      whileTap={{ scale: 0.95 }}
      style={{ perspective: 800 }}
    >
      <Link to={to} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{
          background: bg, borderRadius: '1.25rem',
          border: '1.5px solid rgba(0,0,0,0.06)',
          padding: '1.5rem', cursor: 'pointer',
        }}>
          <motion.div
            whileHover={{ rotate: 15, scale: 1.2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 12 }}
            style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'white', boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
            }}
          >
            <Icon style={{ width: 22, height: 22, color }} />
          </motion.div>
          <div style={{ fontWeight: 700, color: '#2D1B2E', fontSize: '1rem', fontFamily: 'var(--font-sans)' }}>{label}</div>
          <div style={{ fontSize: '0.8rem', color: '#7a5a7e', marginTop: 4, fontFamily: 'var(--font-sans)' }}>{sub}</div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   5. SLIDE COUNTER (editorial number reveal)
───────────────────────────────────────────── */
function SlideCounter({ number }: { number: string }) {
  return (
    <motion.div
      initial={{ scale: 2.4, opacity: 0, filter: 'blur(12px)' }}
      whileInView={{ scale: 1, opacity: 0.08, filter: 'blur(0px)' }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, duration: 0.8 }}
      style={{
        position: 'absolute', top: -20, right: 24,
        fontFamily: 'var(--font-display)', fontStyle: 'italic',
        fontSize: 'clamp(6rem,12vw,10rem)',
        fontWeight: 700, color: '#7B2D8B',
        userSelect: 'none', pointerEvents: 'none',
        lineHeight: 1,
      }}
    >
      {number}
    </motion.div>
  );
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 24 } },
};

/* ─────────────────────────────────────────────
   MAIN HOME COMPONENT
───────────────────────────────────────────── */
export default function Home() {
  const [stats, setStats] = useState<Stats>({ users: 120, clubs: 9, events: 5 });
  const [events, setEvents] = useState<Event[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const heroRef = useRef(null);

  // 6. SCROLL-DRIVEN parallax
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -90]);
  const heroOpacity = useTransform(scrollY, [0, 350], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.93]);

  useEffect(() => {
    api.getStats().then(setStats).catch(() => { });
    api.getEvents().then(e => setEvents(e.slice(0, 3))).catch(() => { });
    api.getClubs().then(c => setClubs(c.slice(0, 4))).catch(() => { });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>

      {/* ═══════════════════════════════════════
          HERO — scroll-driven + typewriter
      ═══════════════════════════════════════ */}
      <motion.section
        ref={heroRef}
        style={{
          position: 'relative', overflow: 'visible',
          borderRadius: '1.75rem',
          background: 'linear-gradient(135deg, #fdf0f5 0%, #f3e6f5 50%, #fde8ef 100%)',
          border: '1.5px solid #f0c8d8',
          padding: 'clamp(2.5rem,5vw,5rem)',
          y: heroY, opacity: heroOpacity, scale: heroScale,
        }}
      >
        {/* Slide counter — editorial */}
        <SlideCounter number="1" />

        {/* Physics spring decorations */}
        <SpringBlob emoji="🌸" delay={0.3} style={{ top: 24, right: 100 }} />
        <SpringBlob emoji="✨" delay={0.55} style={{ top: 72, right: 220 }} />
        <SpringBlob emoji="💌" delay={0.75} style={{ bottom: 40, right: 80 }} />

        <motion.div variants={stagger} initial="hidden" animate="show" style={{ maxWidth: 640, position: 'relative', zIndex: 2 }}>
          <motion.div variants={fadeUp} style={{ marginBottom: '1.25rem' }}>
            <span className="pill pill-accent">💜 College Social OS</span>
          </motion.div>

          {/* TYPEWRITER HEADLINE */}
          <motion.h1 variants={fadeUp} style={{
            fontFamily: 'var(--font-display)', fontStyle: 'italic',
            fontWeight: 700, fontSize: 'clamp(2.5rem,7vw,4.8rem)',
            lineHeight: 1.05, marginBottom: '1.5rem', color: '#2D1B2E',
          }}>
            <Typewriter delay={400} segments={[
              { text: 'Your campus, ' },
              { text: 'your people,', style: { background: 'linear-gradient(135deg,#7B2D8B,#C0476D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } },
              { text: '\nyour story.' },
            ]} />
          </motion.h1>

          <motion.p variants={fadeUp} style={{
            fontSize: '1.1rem', color: '#7a5a7e', marginBottom: '2rem',
            maxWidth: '32rem', lineHeight: 1.7, fontFamily: 'var(--font-sans)',
          }}>
            Send confessions, find your crew, join clubs, RSVP to events, and pick up gigs — all in one place.
          </motion.p>

          <motion.div variants={fadeUp} style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Link to="/connect" className="btn-primary">
              <Heart style={{ width: 16, height: 16 }} /> Send a Confession
            </Link>
            <Link to="/clubs" className="btn-ghost">
              <Users style={{ width: 16, height: 16 }} /> Find Your Tribe
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ═══════════════════════════════════════
          STATS — counter reveal with editorial number
      ═══════════════════════════════════════ */}
      <section style={{ position: 'relative' }}>
        <SlideCounter number="2" />
        <motion.div
          className="grid grid-cols-3 gap-4"
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
        >
          {[
            { label: 'Students', value: stats.users, emoji: '👥', color: '#7B2D8B', bg: '#f3e6f5', border: '#d4a8df' },
            { label: 'Active Clubs', value: stats.clubs, emoji: '🏆', color: '#C0476D', bg: '#fde8ef', border: '#f0b0c5' },
            { label: 'Events', value: stats.events, emoji: '🎉', color: '#2D1B2E', bg: '#F7C5D5', border: '#e8a0b8' },
          ].map(s => (
            <motion.div
              key={s.label} variants={fadeUp}
              whileHover={{ scale: 1.06, y: -6 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              style={{
                background: s.bg, borderRadius: '1.25rem',
                border: `1.5px solid ${s.border}`,
                padding: '2rem 1rem', textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '1.7rem', marginBottom: 6 }}>{s.emoji}</div>
              <div style={{
                fontSize: '2.6rem', fontWeight: 700,
                fontFamily: 'var(--font-display)', fontStyle: 'italic',
                color: s.color, lineHeight: 1,
              }}>
                <AnimCounter value={s.value} />+
              </div>
              <div style={{ color: s.color, fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 4, fontFamily: 'var(--font-sans)' }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════
          3D SCATTER → GRID SETTLE
      ═══════════════════════════════════════ */}
      <section style={{ position: 'relative' }}>
        <SlideCounter number="3" />
        <motion.h2
          initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.7rem', marginBottom: '1.25rem' }}
        >
          Jump right in
        </motion.h2>

        {/* 3D perspective container */}
        <div style={{ perspective: 1000 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Heart, label: 'Connect', sub: 'Anonymous confessions', to: '/connect', color: '#C0476D', bg: 'linear-gradient(135deg,#fde8ef,#f9d0de)' },
            { icon: Users, label: 'Clubs', sub: '9+ active groups', to: '/clubs', color: '#7B2D8B', bg: 'linear-gradient(135deg,#f3e6f5,#e8d0f0)' },
            { icon: Calendar, label: 'Hangouts', sub: 'Campus events', to: '/hangouts', color: '#4f46e5', bg: 'linear-gradient(135deg,#eef2ff,#dde0ff)' },
            { icon: Briefcase, label: 'Gigs', sub: 'Earn on the side', to: '/gigs', color: '#0d9488', bg: 'linear-gradient(135deg,#f0fdfa,#d0f5ee)' },
          ].map((q, i) => (
            <ScatterIcon key={q.label} {...q} index={i} />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          EVENTS + CLUBS
      ═══════════════════════════════════════ */}
      <div className="grid md:grid-cols-2 gap-8">

        {/* Events */}
        <section style={{ position: 'relative' }}>
          <SlideCounter number="4" />
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.5rem', margin: 0 }}>Events coming up</h2>
            <Link to="/hangouts" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', fontWeight: 600, color: '#C0476D', textDecoration: 'none' }}>
              All <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
          </motion.div>

          <motion.div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {events.length > 0 ? events.map(ev => (
              <motion.div key={ev.id} variants={fadeUp} whileHover={{ x: 8 }}
                className="card" style={{ padding: '1rem 1.25rem', display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 54, height: 54, borderRadius: 12, flexShrink: 0, background: 'linear-gradient(135deg,#f3e6f5,#fde8ef)', border: '1.5px solid #f0c8d8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#C0476D', textTransform: 'uppercase', fontFamily: 'var(--font-sans)' }}>
                    {new Date(ev.date_time).toLocaleString('default', { month: 'short' })}
                  </span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-display)', fontStyle: 'italic', color: '#2D1B2E', lineHeight: 1 }}>
                    {new Date(ev.date_time).getDate()}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#2D1B2E', fontFamily: 'var(--font-sans)' }} className="truncate">{ev.title}</div>
                  <div style={{ fontSize: '0.8rem', color: '#7a5a7e', marginTop: 2, fontFamily: 'var(--font-sans)' }}>{ev.location}</div>
                </div>
              </motion.div>
            )) : (
              <motion.div variants={fadeUp} className="card" style={{ padding: '2.5rem', textAlign: 'center', borderStyle: 'dashed' }}>
                <div style={{ fontSize: '2rem', marginBottom: 10 }}>🗓️</div>
                <div style={{ color: '#7a5a7e', fontFamily: 'var(--font-sans)' }}>No events yet.</div>
                <Link to="/hangouts" style={{ color: '#C0476D', fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-sans)' }}>Create the first one →</Link>
              </motion.div>
            )}
          </motion.div>
        </section>

        {/* Clubs */}
        <section>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.5rem', margin: 0 }}>Popular clubs</h2>
            <Link to="/clubs" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', fontWeight: 600, color: '#7B2D8B', textDecoration: 'none' }}>
              All <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
          </motion.div>

          <motion.div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {clubs.length > 0 ? clubs.map(club => (
              <motion.div key={club.id} variants={fadeUp} whileHover={{ x: 8 }}
                className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: 14 }}>
                <motion.img whileHover={{ scale: 1.15, rotate: 6 }} src={club.logo_url} alt={club.name}
                  style={{ width: 46, height: 46, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid #f0c8d8' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#2D1B2E', fontFamily: 'var(--font-sans)' }} className="truncate">{club.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#7a5a7e', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-sans)' }}>{club.category}</div>
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#7B2D8B', background: '#f3e6f5', padding: '0.3rem 0.8rem', borderRadius: 9999, border: '1.5px solid #d4a8df', whiteSpace: 'nowrap', fontFamily: 'var(--font-sans)' }}>
                  {club.member_count} 👤
                </div>
              </motion.div>
            )) : (
              <motion.div variants={fadeUp} className="card" style={{ padding: '2.5rem', textAlign: 'center', borderStyle: 'dashed' }}>
                <div style={{ fontSize: '2rem', marginBottom: 10 }}>🌿</div>
                <Link to="/clubs" style={{ color: '#7B2D8B', fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-sans)' }}>Explore 9 starter clubs →</Link>
              </motion.div>
            )}
          </motion.div>
        </section>
      </div>

      {/* ═══════════════════════════════════════
          CTA — physics bounce
      ═══════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 180, damping: 16 }}
        whileHover={{ scale: 1.01 }}
        style={{
          borderRadius: '1.75rem',
          background: 'linear-gradient(135deg,#f3e6f5 0%,#fde8ef 100%)',
          border: '1.5px solid #f0c8d8',
          padding: 'clamp(2rem,4vw,3.5rem)',
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 24,
        }}
      >
        <div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 6, -6, 0], scale: [1, 1.12, 1] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: '2.8rem', marginBottom: 10, display: 'inline-block' }}
          >💌</motion.div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.8rem', margin: '0 0 8px', color: '#2D1B2E' }}>
            New here? Send your first <span className="gradient-text">confession.</span>
          </h2>
          <p style={{ color: '#7a5a7e', fontSize: '0.95rem', margin: 0, fontFamily: 'var(--font-sans)' }}>
            Completely anonymous. Maximum drama. 😈
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.93 }}>
          <Link to="/connect" className="btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 2.2rem' }}>
            Let's go →
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
}
