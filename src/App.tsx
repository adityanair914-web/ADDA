import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { supabase } from './lib/supabase';
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
import AdminLogin from './pages/AdminLogin';

/** Guard: only lets admin through if sessionStorage token is set */
function AdminGuard({ children }: { children: React.ReactNode }) {
  const isAdmin = sessionStorage.getItem('adda_admin') === 'true';
  return isAdmin ? <>{children}</> : <Navigate to="/admin-login" replace />;
}

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data }) => setSession(data.session))
      .catch(console.error)
      .finally(() => setLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #ec4899', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* ── Admin routes (outside normal Layout, no navbar) ── */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <Admin />
            </AdminGuard>
          }
        />

        {/* ── Public / student routes (with navbar Layout) ── */}
        <Route
          path="/*"
          element={
            <Layout session={session}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={!session ? <Auth /> : <Navigate to="/" />} />
                <Route path="/connect" element={<Connect />} />
                <Route path="/clubs" element={<Clubs />} />
                <Route path="/hangouts" element={<Hangouts />} />
                <Route path="/gigs" element={<Gigs />} />
                <Route path="/profile" element={session ? <Profile /> : <Navigate to="/auth" />} />
                <Route path="/feed" element={<Feed />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}
