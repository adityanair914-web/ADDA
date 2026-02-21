import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, Users, Calendar, Briefcase, User, Menu, X, LogOut, LogIn, Rss } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../lib/supabase';
import clsx from 'clsx';

export default function Layout({ children, session }: { children: React.ReactNode, session: any }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Feed', path: '/feed', icon: Rss },
    { name: 'Connect', path: '/connect', icon: Heart },
    { name: 'Clubs', path: '/clubs', icon: Users },
    { name: 'Hangouts', path: '/hangouts', icon: Calendar },
    { name: 'Gigs', path: '/gigs', icon: Briefcase },
  ];

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>

      {/* ── Navbar ── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        style={{
          background: 'rgba(253,248,251,0.92)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1.5px solid #f0dce8',
          position: 'sticky', top: 0, zIndex: 50,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64 }}>

            {/* Logo */}
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
              <motion.div
                whileHover={{ scale: 1.12, rotate: -8 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 14 }}
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'linear-gradient(135deg, #7B2D8B, #C0476D)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(123,45,139,0.35)',
                  color: 'white', fontFamily: 'var(--font-display)', fontStyle: 'italic',
                  fontWeight: 700, fontSize: '1.1rem',
                }}
              >
                A
              </motion.div>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontWeight: 700,
                fontSize: '1.5rem',
                letterSpacing: '-0.01em',
                background: 'linear-gradient(135deg, #7B2D8B, #C0476D)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Adda
              </span>
            </Link>

            {/* Desktop Nav */}
            <div style={{ display: 'none' }} className="md:flex items-center gap-1">
              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <motion.div key={item.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to={item.path}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '0.45rem 1rem',
                        borderRadius: 9999,
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        fontFamily: 'var(--font-sans)',
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                        ...(isActive(item.path) ? {
                          background: 'linear-gradient(135deg, #f3e6f5, #fde8ef)',
                          color: '#7B2D8B',
                          fontWeight: 600,
                        } : {
                          color: '#7a5a7e',
                        }),
                      }}
                    >
                      <item.icon style={{ width: 15, height: 15 }} />
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Desktop Nav (proper flex for desktop) */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <motion.div key={item.name + '-d'} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to={item.path}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '0.45rem 0.9rem',
                      borderRadius: 9999,
                      fontSize: '0.875rem',
                      fontWeight: isActive(item.path) ? 600 : 500,
                      fontFamily: 'var(--font-sans)',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      background: isActive(item.path) ? 'linear-gradient(135deg, #f3e6f5, #fde8ef)' : 'transparent',
                      color: isActive(item.path) ? '#7B2D8B' : '#7a5a7e',
                    }}
                  >
                    <item.icon style={{ width: 15, height: 15 }} />
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Auth */}
            <div className="hidden md:flex items-center gap-3">
              {session ? (
                <>
                  <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}>
                    <Link to="/profile" style={{ textDecoration: 'none' }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #7B2D8B, #C0476D)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 10px rgba(123,45,139,0.3)',
                      }}>
                        <User style={{ width: 16, height: 16, color: 'white' }} />
                      </div>
                    </Link>
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => supabase.auth.signOut()}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b090b5', padding: 8, borderRadius: '50%' }}
                    title="Sign Out"
                  >
                    <LogOut style={{ width: 16, height: 16 }} />
                  </motion.button>
                </>
              ) : (
                <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/auth" className="btn-primary">
                    <LogIn style={{ width: 15, height: 15 }} /> Sign In
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Mobile toggle */}
            <motion.button
              whileTap={{ scale: 0.85 }}
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a5a7e', padding: 8 }}
            >
              {mobileOpen ? <X style={{ width: 22, height: 22 }} /> : <Menu style={{ width: 22, height: 22 }} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              style={{ borderTop: '1.5px solid #f0dce8', background: 'white', overflow: 'hidden' }}
            >
              <div style={{ padding: '12px 16px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 16px', borderRadius: 14,
                        textDecoration: 'none',
                        fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: '0.9rem',
                        background: isActive(item.path) ? 'linear-gradient(135deg,#f3e6f5,#fde8ef)' : 'transparent',
                        color: isActive(item.path) ? '#7B2D8B' : '#7a5a7e',
                        transition: 'all 0.15s',
                      }}
                    >
                      <item.icon style={{ width: 18, height: 18 }} />
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                {!session && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    <Link to="/auth" onClick={() => setMobileOpen(false)} className="btn-primary"
                      style={{ marginTop: 8, justifyContent: 'center', width: '100%' }}>
                      <LogIn style={{ width: 15, height: 15 }} /> Sign In
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ── Page Content with transition ── */}
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        style={{ flex: 1, maxWidth: 1280, width: '100%', margin: '0 auto', padding: '2rem 1rem' }}
        className="sm:px-6 lg:px-8"
      >
        {children}
      </motion.main>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1.5px solid #f0dce8', background: 'white' }}>
        <div className="max-w-7xl mx-auto py-5 px-4 flex justify-between items-center">
          <p style={{ fontSize: '0.85rem', color: '#b090b5', fontFamily: 'var(--font-sans)' }}>
            © {new Date().getFullYear()} Adda — made with 💜 for students
          </p>
          <Link to="/admin-login"
            style={{ fontSize: '0.75rem', color: '#e0d0e8', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#C0476D')}
            onMouseLeave={e => (e.currentTarget.style.color = '#e0d0e8')}
          >
            Admin
          </Link>
        </div>
      </footer>
    </div>
  );
}
