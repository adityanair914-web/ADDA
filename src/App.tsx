import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { supabase } from './lib/supabase';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Connect from './pages/Connect';
import Clubs from './pages/Clubs';
import Hangouts from './pages/Hangouts';
import Gigs from './pages/Gigs';
import Profile from './pages/Profile';
import Feed from './pages/Feed';
import Auth from './pages/Auth';
import Admin from './pages/Admin';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Layout session={session}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={!session ? <Auth /> : <Navigate to="/" />} />
          <Route path="/connect" element={session ? <Connect /> : <Navigate to="/auth" />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/hangouts" element={<Hangouts />} />
          <Route path="/gigs" element={<Gigs />} />
          <Route path="/profile" element={session ? <Profile /> : <Navigate to="/auth" />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Layout>
    </Router>
  );
}

