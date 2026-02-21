import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Heart, Users, Calendar, Briefcase, Zap, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api, Stats, Event, Club } from '../lib/api';

export default function Home() {
  const [stats, setStats] = useState<Stats>({ users: 120, clubs: 9, events: 5 });
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [featuredClubs, setFeaturedClubs] = useState<Club[]>([]);

  useEffect(() => {
    api.getStats().then(setStats).catch(() => { });
    api.getEvents().then(e => setFeaturedEvents(e.slice(0, 3))).catch(() => { });
    api.getClubs().then(c => setFeaturedClubs(c.slice(0, 4))).catch(() => { });
  }, []);

  return (
    <div className="space-y-10">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-3xl p-8 md:p-14" style={{
        background: 'linear-gradient(135deg, #18082a 0%, #0a0a1a 50%, #0a1a18 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* decorative blobs */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, #ff2d7825 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, #8b5cf620 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="relative z-10 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
            <span className="pill pill-pink">✨ College Social, Reimagined</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem,6vw,4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.25rem' }}
          >
            Your college.<br />
            <span className="gradient-text">Your people.</span><br />
            Your life.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ fontSize: '1.1rem', color: 'var(--color-muted)', marginBottom: '2rem', maxWidth: '36rem' }}
          >
            The one app where you find your crush, your crew, your club, and your next gig — all on campus.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-wrap gap-3">
            <Link to="/connect" className="btn-primary flex items-center gap-2">
              <Heart className="w-4 h-4" /> Send Confession
            </Link>
            <Link to="/clubs" className="btn-ghost flex items-center gap-2">
              <Users className="w-4 h-4" /> Find Your Tribe
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Students', value: stats.users, color: '#ff2d78' },
          { label: 'Clubs', value: stats.clubs, color: '#8b5cf6' },
          { label: 'Events', value: stats.events, color: '#06d6a0' },
        ].map(s => (
          <div key={s.label} className="card text-center py-6 px-4">
            <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: s.color }}>{s.value}</div>
            <div style={{ color: 'var(--color-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Heart, label: 'Connect', sub: 'Send confessions', to: '/connect', color: '#ff2d78', bg: '#ff2d7815' },
          { icon: Users, label: 'Clubs', sub: '9+ active clubs', to: '/clubs', color: '#8b5cf6', bg: '#8b5cf615' },
          { icon: Calendar, label: 'Hangouts', sub: 'Campus events', to: '/hangouts', color: '#06d6a0', bg: '#06d6a015' },
          { icon: Briefcase, label: 'Gigs', sub: 'Earn money', to: '/gigs', color: '#f59e0b', bg: '#f59e0b15' },
        ].map(q => (
          <Link key={q.label} to={q.to} className="card p-5 flex flex-col gap-3 group hover:no-underline" style={{ textDecoration: 'none' }}>
            <div style={{ width: 42, height: 42, borderRadius: '12px', background: q.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <q.icon style={{ width: 22, height: 22, color: q.color }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>{q.label}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>{q.sub}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Events + Clubs ── */}
      <div className="grid md:grid-cols-2 gap-8">

        {/* Events */}
        <section>
          <div className="flex justify-between items-center mb-5">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 800 }}>
              🔥 Happening Soon
            </h2>
            <Link to="/hangouts" className="flex items-center gap-1 text-sm font-semibold" style={{ color: '#ff6b9d' }}>
              All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {featuredEvents.length > 0 ? featuredEvents.map(ev => (
              <div key={ev.id} className="card p-4 flex gap-4 items-center">
                <div style={{
                  width: 52, height: 52, borderRadius: '12px',
                  background: 'linear-gradient(135deg, #8b5cf620, #ff2d7820)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid rgba(255,255,255,0.08)', shrink: 0,
                }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase' }}>
                    {new Date(ev.date_time).toLocaleString('default', { month: 'short' })}
                  </span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)' }}>
                    {new Date(ev.date_time).getDate()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontWeight: 700 }} className="truncate">{ev.title}</div>
                  <div style={{ color: 'var(--color-muted)', fontSize: '0.8rem' }}>{ev.location}</div>
                </div>
              </div>
            )) : (
              <div className="card p-8 text-center" style={{ color: 'var(--color-muted)' }}>
                No events yet — <Link to="/hangouts" style={{ color: '#ff6b9d' }}>be the first to create one!</Link>
              </div>
            )}
          </div>
        </section>

        {/* Clubs */}
        <section>
          <div className="flex justify-between items-center mb-5">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 800 }}>
              ⚡ Popular Clubs
            </h2>
            <Link to="/clubs" className="flex items-center gap-1 text-sm font-semibold" style={{ color: '#ff6b9d' }}>
              All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {featuredClubs.length > 0 ? featuredClubs.map(club => (
              <div key={club.id} className="card p-4 flex items-center gap-4">
                <img src={club.logo_url} alt={club.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', background: 'var(--color-surface2)' }} />
                <div className="flex-1 min-w-0">
                  <div style={{ fontWeight: 700 }} className="truncate">{club.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{club.category}</div>
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.75rem', borderRadius: '9999px', whiteSpace: 'nowrap' }}>
                  {club.member_count} members
                </div>
              </div>
            )) : (
              <div className="card p-8 text-center" style={{ color: 'var(--color-muted)' }}>
                No clubs yet — <Link to="/clubs" style={{ color: '#ff6b9d' }}>explore what's here!</Link>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ── Vibe Check Banner ── */}
      <div className="card px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6" style={{ background: 'linear-gradient(135deg, #18082a, #0a1220)' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem' }}>
            New here? <span className="gradient-text">Start now 👋</span>
          </div>
          <div style={{ color: 'var(--color-muted)', marginTop: 4 }}>Drop an anonymous confession. No cringe, we promise.</div>
        </div>
        <Link to="/connect" className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <Zap className="w-4 h-4" /> Send Confession
        </Link>
      </div>
    </div>
  );
}
