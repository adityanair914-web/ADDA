import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, Users, Calendar, Briefcase, User, Menu, X, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Feed', path: '/feed', icon: LayoutDashboard },
    { name: 'Connect', path: '/connect', icon: Heart },
    { name: 'Clubs', path: '/clubs', icon: Users },
    { name: 'Hangouts', path: '/hangouts', icon: Calendar },
    { name: 'Gigs', path: '/gigs', icon: Briefcase },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  A
                </div>
                <span className="font-display font-bold text-xl tracking-tight text-slate-900">Adda</span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={clsx(
                      'inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors duration-200',
                      isActive
                        ? 'border-pink-500 text-slate-900'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    )}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div className="hidden md:flex md:items-center">
              <Link to="/profile" className="p-2 text-slate-400 hover:text-slate-500">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                  <User className="w-5 h-5 text-slate-500" />
                </div>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500"
              >
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
            >
              <div className="pt-2 pb-3 space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={clsx(
                        'block pl-3 pr-4 py-2 border-l-4 text-base font-medium',
                        isActive
                          ? 'bg-pink-50 border-pink-500 text-pink-700'
                          : 'border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700'
                      )}
                    >
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.name}
                      </div>
                    </Link>
                  );
                })}
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700"
                >
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-3" />
                    Profile
                  </div>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Adda. Built for students, by students.
          </p>
          <Link to="/admin" className="text-xs text-slate-300 hover:text-slate-500 transition">
            Admin
          </Link>
        </div>
      </footer>
    </div>
  );
}
