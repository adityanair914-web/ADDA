import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, Users, Calendar, Briefcase, User, Menu, X, Zap, LogOut, LogIn, Rss } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>

      {/* ── Navbar ── */}
      <nav style={{
        background: 'rgba(10,10,18,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div style={{
                background: 'linear-gradient(135deg, #ff2d78, #8b5cf6)',
                borderRadius: '10px',
                width: 34, height: 34,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 16px #ff2d7850',
              }}>
                <Zap className="w-5 h-5 text-white" fill="white" />
              </div>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #ff2d78, #a78bfa)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>adda</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={clsx(
                    'flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold transition-all duration-200',
                    isActive(item.path)
                      ? 'text-white'
                      : 'text-[#7878a0] hover:text-white hover:bg-white/5'
                  )}
                  style={isActive(item.path) ? {
                    background: 'linear-gradient(135deg, #ff2d7820, #8b5cf620)',
                    color: '#ff6b9d',
                  } : {}}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {session ? (
                <>
                  <Link to="/profile">
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #ff2d78, #8b5cf6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </Link>
                  <button
                    onClick={() => supabase.auth.signOut()}
                    className="text-[#7878a0] hover:text-red-400 transition-colors p-2 rounded-full hover:bg-red-400/10"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="btn-primary text-sm flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-xl text-[#7878a0] hover:text-white hover:bg-white/5 transition"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}
            >
              <div className="px-4 py-3 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={clsx(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all',
                      isActive(item.path)
                        ? 'text-[#ff6b9d]'
                        : 'text-[#7878a0] hover:text-white hover:bg-white/5'
                    )}
                    style={isActive(item.path) ? { background: 'linear-gradient(135deg, #ff2d7815, #8b5cf615)' } : {}}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                ))}
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#7878a0] hover:text-white hover:bg-white/5 transition-all"
                >
                  <User className="w-5 h-5" />
                  Profile
                </Link>
                {!session && (
                  <Link
                    to="/auth"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-primary text-sm flex items-center justify-center gap-2 w-full mt-2"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Main ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(10,10,18,0.6)' }}>
        <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
            © {new Date().getFullYear()} adda — built for students 🎓
          </p>
          <Link to="/admin-login" className="text-xs hover:text-[#ff6b9d] transition" style={{ color: 'var(--color-border)' }}>
            Admin
          </Link>
        </div>
      </footer>
    </div>
  );
}
