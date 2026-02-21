import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight, Heart, Users, Calendar, Briefcase, BookOpen, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api, Stats, Event, Club } from '../lib/api';

// Animated counter
function AnimCounter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref as any, { once: true });
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const duration = 1.4;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.floor(eased * value));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return <span ref={ref}>{count}</span>;
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 24 } },
};

export default function Home() {
  const [stats, setStats] = useState<Stats>({ users: 120, clubs: 9, events: 5 });
  const [events, setEvents] = useState<Event[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);

  useEffect(() => {
    api.getStats().then(setStats).catch(() => { });
    api.getEvents().then(e => setEvents(e.slice(0, 3))).catch(() => { });
    api.getClubs().then(c => setClubs(c.slice(0, 4))).catch(() => { });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>

      {/* ── HERO ── */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        borderRadius: '1.75rem', padding: 'clamp(2.5rem,5vw,4.5rem)',
        background: 'linear-gradient(135deg, #fdf0f5 0%, #f3e6f5 50%, #fde8ef 100%)',
        border: '1.5px solid #f0c8d8',
      }}>
        {/* Floating decorative blobs */}
        <motion.div
          animate={{ y: [0, -14, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: 30, right: 80, fontSize: 48, userSelect: 'none', opacity: 0.6 }}
        >🌸</motion.div>
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          style={{ position: 'absolute', top: 70, right: 180, fontSize: 32, userSelect: 'none', opacity: 0.5 }}
        >✨</motion.div>
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          style={{ position: 'absolute', bottom: 40, right: 120, fontSize: 38, userSelect: 'none', opacity: 0.5 }}
        >💌</motion.div>
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', bottom: 20, right: 240, fontSize: 22, userSelect: 'none', opacity: 0.3 }}
        >⭐</motion.div>

        <motion.div variants={stagger} initial="hidden" animate="show" style={{ maxWidth: 640, position: 'relative', zIndex: 1 }}>
          <motion.div variants={fadeUp} style={{ marginBottom: '1.25rem' }}>
            <span className="pill pill-accent">💜 College Social, Reimagined</span>
          </motion.div>

          <motion.h1 variants={fadeUp} style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.6rem, 7vw, 4.8rem)',
            fontWeight: 700, fontStyle: 'italic',
            lineHeight: 1.08, marginBottom: '1.5rem',
            color: '#2D1B2E',
          }}>
            Your campus,<br />
            <span className="gradient-text">your people,</span><br />
            your story.
          </motion.h1>

          <motion.p variants={fadeUp} style={{
            fontSize: '1.1rem', color: '#7a5a7e',
            marginBottom: '2rem', maxWidth: '32rem', lineHeight: 1.7,
            fontFamily: 'var(--font-sans)',
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
      </section>

      {/* ── STATS ── */}
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
              padding: '1.75rem 1rem', textAlign: 'center', cursor: 'default',
            }}
          >
            <div style={{ fontSize: '1.7rem', marginBottom: 6 }}>{s.emoji}</div>
            <div style={{
              fontSize: '2.4rem', fontWeight: 700,
              fontFamily: 'var(--font-display)', fontStyle: 'italic',
              color: s.color, lineHeight: 1,
            }}>
              <AnimCounter value={s.value} />+
            </div>
            <div style={{ color: s.color, fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 4, fontFamily: 'var(--font-sans)' }}>
              {s.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── QUICK ACTIONS ── */}
      <section>
        <motion.h2
          initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', marginBottom: '1.25rem' }}
        >
          Jump right in
        </motion.h2>
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
        >
          {[
            { icon: Heart, label: 'Connect', sub: 'Anonymous confessions', to: '/connect', color: '#C0476D', bg: 'linear-gradient(135deg,#fde8ef,#f9d0de)' },
            { icon: Users, label: 'Clubs', sub: '9+ active groups', to: '/clubs', color: '#7B2D8B', bg: 'linear-gradient(135deg,#f3e6f5,#e8d0f0)' },
            { icon: Calendar, label: 'Hangouts', sub: 'Campus events', to: '/hangouts', color: '#4f46e5', bg: 'linear-gradient(135deg,#eef2ff,#dde0ff)' },
            { icon: Briefcase, label: 'Gigs', sub: 'Earn on the side', to: '/gigs', color: '#0d9488', bg: 'linear-gradient(135deg,#f0fdfa,#d0f5ee)' },
          ].map(q => (
            <motion.div key={q.label} variants={fadeUp} whileHover={{ scale: 1.06, y: -8 }} whileTap={{ scale: 0.97 }}>
              <Link to={q.to} style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{
                  background: q.bg, borderRadius: '1.25rem',
                  border: '1.5px solid rgba(0,0,0,0.05)',
                  padding: '1.5rem', height: '100%', cursor: 'pointer',
                  transition: 'box-shadow 0.2s',
                }}>
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.15 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                    style={{
                      width: 46, height: 46, borderRadius: 14,
                      background: 'white', boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: 14,
                    }}
                  >
                    <q.icon style={{ width: 22, height: 22, color: q.color }} />
                  </motion.div>
                  <div style={{ fontWeight: 700, color: '#2D1B2E', fontSize: '1rem', fontFamily: 'var(--font-sans)' }}>{q.label}</div>
                  <div style={{ fontSize: '0.8rem', color: '#7a5a7e', marginTop: 4, fontFamily: 'var(--font-sans)' }}>{q.sub}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── EVENTS + CLUBS ── */}
      <div className="grid md:grid-cols-2 gap-8">

        {/* Upcoming Events */}
        <section>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}
          >
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', margin: 0 }}>
              Events coming up
            </h2>
            <Link to="/hangouts" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', fontWeight: 600, color: '#C0476D', textDecoration: 'none', fontFamily: 'var(--font-sans)' }}>
              All <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
          </motion.div>

          <motion.div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            {events.length > 0 ? events.map(ev => (
              <motion.div key={ev.id} variants={fadeUp} whileHover={{ x: 8, backgroundColor: '#fdf8fb' }}
                className="card" style={{ padding: '1rem 1.25rem', display: 'flex', gap: 16, alignItems: 'center' }}
              >
                <div style={{
                  width: 54, height: 54, borderRadius: 12, flexShrink: 0,
                  background: 'linear-gradient(135deg,#f3e6f5,#fde8ef)',
                  border: '1.5px solid #f0c8d8',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                }}>
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
              <motion.div variants={fadeUp} className="card"
                style={{ padding: '2.5rem', textAlign: 'center', borderStyle: 'dashed' }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🗓️</div>
                <div style={{ color: '#7a5a7e', marginBottom: 8, fontFamily: 'var(--font-sans)' }}>No events yet.</div>
                <Link to="/hangouts" style={{ color: '#C0476D', fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-sans)' }}>Create the first one →</Link>
              </motion.div>
            )}
          </motion.div>
        </section>

        {/* Popular Clubs */}
        <section>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}
          >
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', margin: 0 }}>
              Popular clubs
            </h2>
            <Link to="/clubs" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', fontWeight: 600, color: '#7B2D8B', textDecoration: 'none', fontFamily: 'var(--font-sans)' }}>
              All <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
          </motion.div>

          <motion.div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            {clubs.length > 0 ? clubs.map(club => (
              <motion.div key={club.id} variants={fadeUp} whileHover={{ x: 8 }}
                className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: 14 }}
              >
                <motion.img whileHover={{ scale: 1.12, rotate: 5 }} src={club.logo_url} alt={club.name}
                  style={{ width: 46, height: 46, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid #f0c8d8' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#2D1B2E', fontFamily: 'var(--font-sans)' }} className="truncate">{club.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#7a5a7e', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-sans)' }}>{club.category}</div>
                </div>
                <div style={{
                  fontSize: '0.8rem', fontWeight: 700, color: '#7B2D8B',
                  background: '#f3e6f5', padding: '0.3rem 0.8rem',
                  borderRadius: 9999, border: '1.5px solid #d4a8df',
                  whiteSpace: 'nowrap', fontFamily: 'var(--font-sans)',
                }}>
                  {club.member_count} 👤
                </div>
              </motion.div>
            )) : (
              <motion.div variants={fadeUp} className="card"
                style={{ padding: '2.5rem', textAlign: 'center', borderStyle: 'dashed' }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🌿</div>
                <div style={{ color: '#7a5a7e', marginBottom: 8, fontFamily: 'var(--font-sans)' }}>No clubs yet.</div>
                <Link to="/clubs" style={{ color: '#7B2D8B', fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-sans)' }}>Explore 9 starter clubs →</Link>
              </motion.div>
            )}
          </motion.div>
        </section>
      </div>

      {/* ── CTA BANNER ── */}
      <motion.section
        initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
        whileHover={{ scale: 1.01 }}
        style={{
          borderRadius: '1.75rem',
          background: 'linear-gradient(135deg, #f3e6f5 0%, #fde8ef 100%)',
          border: '1.5px solid #f0c8d8',
          padding: 'clamp(2rem,4vw,3rem)',
          display: 'flex', flexWrap: 'wrap',
          justifyContent: 'space-between', alignItems: 'center', gap: 24,
        }}
      >
        <div>
          <motion.div
            animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: '2.5rem', marginBottom: 10, display: 'inline-block' }}
          >
            💌
          </motion.div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.7rem', margin: '0 0 8px', color: '#2D1B2E' }}>
            New here? Send your first <span className="gradient-text">confession.</span>
          </h2>
          <p style={{ color: '#7a5a7e', fontSize: '0.95rem', margin: 0, fontFamily: 'var(--font-sans)' }}>
            Completely anonymous. Maximum drama. 😈
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
          <Link to="/connect" className="btn-primary" style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>
            Let's go →
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
}
