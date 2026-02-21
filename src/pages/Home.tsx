import { useEffect, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight, Heart, Users, Calendar, Briefcase, Zap, Star, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api, Stats, Event, Club } from '../lib/api';

// Animated counter hook
function useCounter(target: number, duration = 1.5) {
  const [count, setCount] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const start = Date.now();
    const tick = () => {
      const elapsed = (Date.now() - start) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return count;
}

function AnimCounter({ value }: { value: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useCounter(inView ? value : 0);
  return <span ref={ref}>{count}</span>;
}

// Floating decoration
const floaty = {
  animate: { y: [0, -12, 0], transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' } },
};
const floatyDelay = {
  animate: { y: [0, -10, 0], transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 } },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
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
    <div className="space-y-12">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden rounded-3xl px-8 md:px-14 py-14 md:py-20" style={{
        background: 'linear-gradient(135deg, #fff0f8 0%, #f5f0ff 50%, #fff8f0 100%)',
        border: '1.5px solid #ffd6e7',
      }}>
        {/* Floating blobs */}
        <motion.div {...floaty} style={{ position: 'absolute', top: 20, right: 80, width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#ff2d78,#ff8fab)', opacity: 0.2, filter: 'blur(2px)' }} />
        <motion.div {...floatyDelay} style={{ position: 'absolute', bottom: 30, right: 200, width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', opacity: 0.25, filter: 'blur(1px)' }} />
        <motion.div {...floaty} style={{ position: 'absolute', top: 40, right: 220, width: 30, height: 30, borderRadius: '50%', background: '#f59e0b', opacity: 0.3 }} />

        {/* Floating emoji decorations */}
        <motion.div animate={{ rotate: [0, 10, -10, 0], y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: 24, right: 100, fontSize: 32, pointerEvents: 'none' }}>✨</motion.div>
        <motion.div animate={{ rotate: [0, -8, 8, 0], y: [0, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          style={{ position: 'absolute', bottom: 32, right: 140, fontSize: 28, pointerEvents: 'none' }}>💫</motion.div>
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          style={{ position: 'absolute', top: 60, right: 320, fontSize: 24, pointerEvents: 'none', display: 'none' }} className="md:block">🎯</motion.div>

        <motion.div
          variants={container} initial="hidden" animate="show"
          className="relative z-10 max-w-2xl"
        >
          <motion.div variants={item} className="mb-5">
            <span className="pill pill-pink">
              <Sparkles className="w-3 h-3" /> Made for your campus
            </span>
          </motion.div>

          <motion.h1 variants={item} style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.4rem, 7vw, 4.5rem)',
            fontWeight: 800, lineHeight: 1.05, marginBottom: '1.25rem',
          }}>
            Your college.<br />
            <span className="gradient-text">Your people.</span><br />
            Your vibe. 🔥
          </motion.h1>

          <motion.p variants={item} style={{ fontSize: '1.1rem', color: '#6b6b8a', marginBottom: '2rem', maxWidth: '34rem', lineHeight: 1.6 }}>
            The one place to find your next crush, study partner, club, or gig — all on campus.
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap gap-3">
            <Link to="/connect" className="btn-primary">
              <Heart className="w-4 h-4" /> Send Confession
            </Link>
            <Link to="/clubs" className="btn-ghost">
              <Users className="w-4 h-4" /> Find Your Tribe
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <motion.div
        className="grid grid-cols-3 gap-4"
        variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
      >
        {[
          { label: 'Students', value: stats.users, emoji: '👥', color: '#ff2d78', bg: '#fff0f5', border: '#ffd6e7' },
          { label: 'Active Clubs', value: stats.clubs, emoji: '⚡', color: '#7c3aed', bg: '#f5f0ff', border: '#ddd6fe' },
          { label: 'Events', value: stats.events, emoji: '🎉', color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4' },
        ].map(s => (
          <motion.div key={s.label} variants={item} whileHover={{ scale: 1.04, y: -4 }} className="card text-center py-7 px-4 cursor-default"
            style={{ background: s.bg, borderColor: s.border }}>
            <div style={{ fontSize: '1.8rem', marginBottom: 4 }}>{s.emoji}</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: s.color }}>
              <AnimCounter value={s.value} />+
            </div>
            <div style={{ color: '#6b6b8a', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── QUICK ACTIONS ── */}
      <section>
        <motion.h2
          initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: '1rem' }}
        >
          Jump right in 🚀
        </motion.h2>
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
        >
          {[
            { icon: Heart, label: 'Connect', sub: 'Send confessions', to: '/connect', color: '#ff2d78', bg: 'linear-gradient(135deg,#fff0f5,#ffe0ee)' },
            { icon: Users, label: 'Clubs', sub: '9+ active clubs', to: '/clubs', color: '#7c3aed', bg: 'linear-gradient(135deg,#f5f0ff,#ede0ff)' },
            { icon: Calendar, label: 'Hangouts', sub: 'Campus events', to: '/hangouts', color: '#0d9488', bg: 'linear-gradient(135deg,#f0fdfa,#d5f5f0)' },
            { icon: Briefcase, label: 'Gigs', sub: 'Earn money', to: '/gigs', color: '#d97706', bg: 'linear-gradient(135deg,#fffbeb,#fde68a50)' },
          ].map(q => (
            <motion.div key={q.label} variants={item} whileHover={{ scale: 1.06, y: -6 }} whileTap={{ scale: 0.97 }}>
              <Link to={q.to} className="card p-5 flex flex-col gap-3 h-full block" style={{ textDecoration: 'none', background: q.bg }}>
                <motion.div
                  whileHover={{ rotate: 12 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                  style={{ width: 44, height: 44, borderRadius: 12, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}
                >
                  <q.icon style={{ width: 22, height: 22, color: q.color }} />
                </motion.div>
                <div>
                  <div style={{ fontWeight: 700, color: '#0f0f1a', fontSize: '0.95rem' }}>{q.label}</div>
                  <div style={{ fontSize: '0.78rem', color: '#6b6b8a', marginTop: 2 }}>{q.sub}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── EVENTS + CLUBS ── */}
      <div className="grid md:grid-cols-2 gap-8">

        {/* Events */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex justify-between items-center mb-5"
          >
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>🔥 Happening Soon</h2>
            <Link to="/hangouts" className="flex items-center gap-1 text-sm font-bold" style={{ color: '#ff2d78', textDecoration: 'none' }}>
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          <motion.div className="space-y-3" variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {events.length > 0 ? events.map(ev => (
              <motion.div key={ev.id} variants={item} whileHover={{ x: 6 }} className="card p-4 flex gap-4 items-center">
                <div style={{
                  width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                  background: 'linear-gradient(135deg,#fff0f5,#f5f0ff)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  border: '1.5px solid #ffd6e7',
                }}>
                  <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#ff2d78', textTransform: 'uppercase' }}>
                    {new Date(ev.date_time).toLocaleString('default', { month: 'short' })}
                  </span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f0f1a' }}>
                    {new Date(ev.date_time).getDate()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }} className="truncate">{ev.title}</div>
                  <div style={{ color: '#6b6b8a', fontSize: '0.8rem', marginTop: 2 }}>{ev.location}</div>
                </div>
              </motion.div>
            )) : (
              <motion.div variants={item} className="card p-8 text-center" style={{ borderStyle: 'dashed' }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>📅</div>
                <div style={{ color: '#6b6b8a' }}>No events yet.</div>
                <Link to="/hangouts" style={{ color: '#ff2d78', fontWeight: 600, textDecoration: 'none' }}>Create the first one →</Link>
              </motion.div>
            )}
          </motion.div>
        </section>

        {/* Clubs */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex justify-between items-center mb-5"
          >
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>⚡ Popular Clubs</h2>
            <Link to="/clubs" className="flex items-center gap-1 text-sm font-bold" style={{ color: '#7c3aed', textDecoration: 'none' }}>
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          <motion.div className="space-y-3" variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {clubs.length > 0 ? clubs.map(club => (
              <motion.div key={club.id} variants={item} whileHover={{ x: 6 }} className="card p-4 flex items-center gap-4">
                <motion.img
                  whileHover={{ rotate: 8, scale: 1.1 }}
                  src={club.logo_url} alt={club.name}
                  style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid #ffd6e7' }}
                />
                <div className="flex-1 min-w-0">
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }} className="truncate">{club.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b6b8a', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>{club.category}</div>
                </div>
                <motion.div whileHover={{ scale: 1.1 }}
                  style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ff2d78', background: '#fff0f5', padding: '0.3rem 0.8rem', borderRadius: '9999px', whiteSpace: 'nowrap', border: '1.5px solid #ffd6e7' }}>
                  {club.member_count} 👥
                </motion.div>
              </motion.div>
            )) : (
              <motion.div variants={item} className="card p-8 text-center" style={{ borderStyle: 'dashed' }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>🏆</div>
                <div style={{ color: '#6b6b8a' }}>No clubs yet.</div>
                <Link to="/clubs" style={{ color: '#7c3aed', fontWeight: 600, textDecoration: 'none' }}>Browse the 9 starter clubs →</Link>
              </motion.div>
            )}
          </motion.div>
        </section>
      </div>

      {/* ── CTA BANNER ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
        whileHover={{ scale: 1.01 }}
        className="card px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6"
        style={{ background: 'linear-gradient(135deg,#fff0f5 0%,#f5f0ff 100%)', borderColor: '#ffd6e7' }}
      >
        <div>
          <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: '2.5rem', marginBottom: 8, display: 'inline-block' }}>👋</motion.div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', lineHeight: 1.2 }}>
            New here? <span className="gradient-text">Drop your first confession.</span>
          </div>
          <div style={{ color: '#6b6b8a', marginTop: 6 }}>100% anonymous. Maximum chaos. 😈</div>
        </div>
        <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
          <Link to="/connect" className="btn-primary" style={{ fontSize: '1rem', padding: '0.75rem 2rem' }}>
            <Zap className="w-4 h-4" /> Let's go →
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
