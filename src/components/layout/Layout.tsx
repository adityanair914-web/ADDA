import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, Users, Calendar, Briefcase, User, Menu, X, LogOut, LogIn, Rss, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../lib/supabase';
import clsx from 'clsx';

export default function Layout({ children, session }: { children: React.ReactNode, session: any }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    <div className="min-h-screen flex flex-col" style={{ background: '#fafafa' }}>

      {/* ── Navbar ── */}
      <motion.nav
        initial={{ y: -64 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1.5px solid #f0f0f8',
          position: 'sticky', top: 0, zIndex: 50,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'linear-gradient(135deg, #ff2d78, #7c3aed)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(255,45,120,0.4)',
                }}
              >
                <Zap className="w-5 h-5 text-white" fill="white" />
              </motion.div>
              <span style={{
                fontFamily: 'var(--font-display)', fontWeight: 800,
                fontSize: '1.4rem', letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, #ff2d78, #7c3aed)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>adda</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <motion.div key={item.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to={item.path}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                    style={isActive(item.path) ? {
                      background: 'linear-gradient(135deg, #fff0f5, #f5f0ff)',
                      color: '#ff2d78',
                    } : {
                      color: '#6b6b8a',
                    }}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Auth */}
            <div className="hidden md:flex items-center gap-3">
              {session ? (
                <>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Link to="/profile">
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ff2d78, #7c3aed)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 10px rgba(255,45,120,0.3)',
                      }}>
                        <User className="w-4 h-4 text-white" />
                      </div>
                    </Link>
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => supabase.auth.signOut()}
                    style={{ color: '#a0a0b8', padding: '0.5rem', borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer' }}
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </motion.button>
                </>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/auth" className="btn-primary text-sm">
                    <LogIn className="w-4 h-4" /> Sign In
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Mobile toggle */}
            <motion.button
              whileTap={{ scale: 0.85 }}
              className="md:hidden p-2 rounded-xl"
              style={{ color: '#6b6b8a', border: 'none', background: 'transparent', cursor: 'pointer' }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ borderTop: '1.5px solid #f0f0f8', background: 'white', overflow: 'hidden' }}
            >
              <div className="px-4 pt-3 pb-4 space-y-1">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all"
                      style={isActive(item.path) ? {
                        background: 'linear-gradient(135deg, #fff0f5, #f5f0ff)',
                        color: '#ff2d78',
                      } : { color: '#6b6b8a' }}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                {!session && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary text-sm w-full justify-center mt-2">
                      <LogIn className="w-4 h-4" /> Sign In
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ── Main Content ── */}
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {children}
      </motion.main>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1.5px solid #f0f0f8', background: 'white' }}>
        <div className="max-w-7xl mx-auto py-5 px-4 flex justify-between items-center">
          <p className="text-sm" style={{ color: '#a0a0b8' }}>
            © {new Date().getFullYear()} adda — made with 💖 for campus life
          </p>
          <Link to="/admin-login" className="text-xs transition" style={{ color: '#e0e0f0' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ff2d78')}
            onMouseLeave={e => (e.currentTarget.style.color = '#e0e0f0')}
          >
            Admin
          </Link>
        </div>
      </footer>
    </div>
  );
}
