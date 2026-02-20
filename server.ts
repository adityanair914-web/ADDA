import express from 'express';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // Use service role for backend bypass of RLS
const supabase = createClient(supabaseUrl, supabaseKey);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  // Users
  app.get('/api/users/me', async (req, res) => {
    // Mock Auth: Get the first admin user for now
    const { data: user, error } = await supabase.from('users').select('*').limit(1).single();
    if (error && error.code !== 'PGRST116') return res.status(500).json({ error: error.message });
    res.json(user);
  });

  // Bouquets
  app.get('/api/bouquets', async (req, res) => {
    const { data: user } = await supabase.from('users').select('id').limit(1).single();
    if (!user) return res.json([]);

    const { data: bouquets, error } = await supabase
      .from('bouquets')
      .select('*')
      .eq('recipient_id', user.id)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(bouquets);
  });

  app.post('/api/bouquets', async (req, res) => {
    const { sender_id, recipient_id, message } = req.body;
    const { data, error } = await supabase
      .from('bouquets')
      .insert([{ id: uuidv4(), sender_id, recipient_id, message }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, id: data.id });
  });

  // Moderation
  app.get('/api/admin/pending-confessions', async (req, res) => {
    const { data: pending, error } = await supabase
      .from('confessions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    res.json(pending);
  });

  app.post('/api/admin/confessions/:id/moderate', async (req, res) => {
    const { status } = req.body;
    const { error } = await supabase
      .from('confessions')
      .update({ status })
      .eq('id', req.params.id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  app.get('/api/admin/pending-clubs', async (req, res) => {
    const { data: pending, error } = await supabase
      .from('clubs')
      .select('*')
      .eq('approval_status', 'pending')
      .order('created_at', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    res.json(pending);
  });

  app.post('/api/admin/clubs/:id/moderate', async (req, res) => {
    const { status } = req.body;
    const { error } = await supabase
      .from('clubs')
      .update({ approval_status: status })
      .eq('id', req.params.id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  // Creation Flows
  app.post('/api/clubs', async (req, res) => {
    const { name, tagline, description, category, cover_image_url, logo_url } = req.body;
    const { data, error } = await supabase
      .from('clubs')
      .insert([{
        id: uuidv4(), name, tagline, description, category,
        cover_image_url, logo_url, approval_status: 'pending'
      }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, id: data.id });
  });

  app.post('/api/events', async (req, res) => {
    const { title, description, organizer_id, club_id, event_type, date_time, location, cover_image_url } = req.body;
    const { data, error } = await supabase
      .from('events')
      .insert([{
        id: uuidv4(), title, description, organizer_id, club_id,
        event_type, date_time, location, cover_image_url
      }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, id: data.id });
  });

  // Gigs
  app.post('/api/gigs/:id/apply', async (req, res) => {
    const { user_id, proof_url, upi_id } = req.body;
    const { data, error } = await supabase
      .from('gig_applications')
      .insert([{ id: uuidv4(), gig_id: req.params.id, user_id, proof_url, upi_id }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, id: data.id });
  });

  // Confessions
  app.get('/api/confessions', async (req, res) => {
    const { data: confessions, error } = await supabase
      .from('confessions')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(confessions);
  });

  app.post('/api/confessions', async (req, res) => {
    const { sender_id, recipient_name, message, vibe_type, is_anonymous } = req.body;
    const { data, error } = await supabase
      .from('confessions')
      .insert([{
        id: uuidv4(), sender_id, recipient_name, message,
        vibe_type, is_anonymous: !!is_anonymous, status: 'pending'
      }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, id: data.id });
  });

  // Clubs
  app.get('/api/clubs', async (req, res) => {
    const { data: clubs, error } = await supabase
      .from('clubs')
      .select('*')
      .order('member_count', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(clubs);
  });

  app.get('/api/clubs/:id', async (req, res) => {
    const { data: club, error } = await supabase
      .from('clubs')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(club);
  });

  // Events
  app.get('/api/events', async (req, res) => {
    const { data: events, error } = await supabase
      .from('events')
      .select(`
        *,
        clubs ( name )
      `)
      .order('date_time', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });

    // Flatten the join result to match old SQLite response format
    const formattedEvents = events.map((e: any) => ({
      ...e,
      club_name: e.clubs?.name
    }));

    res.json(formattedEvents);
  });

  // Gigs
  app.get('/api/gigs', async (req, res) => {
    const { data: gigs, error } = await supabase
      .from('gigs')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(gigs);
  });

  // Feed (Unified)
  app.get('/api/feed', async (req, res) => {
    const [confRes, clubRes, eventRes] = await Promise.all([
      supabase.from('confessions').select('id, message, created_at').eq('status', 'approved').limit(10),
      supabase.from('clubs').select('id, name, created_at').eq('approval_status', 'approved').limit(10),
      supabase.from('events').select('id, title, created_at').limit(10)
    ]);

    const confessions = (confRes.data || []).map(c => ({ id: c.id, type: 'confession', content: c.message, created_at: c.created_at }));
    const clubs = (clubRes.data || []).map(c => ({ id: c.id, type: 'club', content: c.name, created_at: c.created_at }));
    const events = (eventRes.data || []).map(e => ({ id: e.id, type: 'event', content: e.title, created_at: e.created_at }));

    const feed = [...confessions, ...clubs, ...events].sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    res.json(feed);
  });

  // Stats
  app.get('/api/stats', async (req, res) => {
    const [u, c, e] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('clubs').select('*', { count: 'exact', head: true }),
      supabase.from('events').select('*', { count: 'exact', head: true })
    ]);

    res.json({
      users: u.count || 0,
      clubs: c.count || 0,
      events: e.count || 0
    });
  });

  // Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
