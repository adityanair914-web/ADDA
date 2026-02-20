import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database('adda.db');

// Initialize Database Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    name TEXT,
    instagram_handle TEXT,
    department TEXT,
    year TEXT,
    hostel TEXT,
    bio TEXT,
    interests TEXT, -- JSON array
    looking_for TEXT, -- JSON array
    profile_pic_url TEXT,
    user_type TEXT DEFAULT 'student',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS confessions (
    id TEXT PRIMARY KEY,
    sender_id TEXT,
    recipient_name TEXT,
    recipient_instagram TEXT,
    message TEXT,
    vibe_type TEXT,
    is_anonymous INTEGER DEFAULT 1,
    status TEXT DEFAULT 'pending',
    likes_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(sender_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS bouquets (
    id TEXT PRIMARY KEY,
    sender_id TEXT,
    recipient_id TEXT,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    read_at DATETIME,
    FOREIGN KEY(sender_id) REFERENCES users(id),
    FOREIGN KEY(recipient_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS clubs (
    id TEXT PRIMARY KEY,
    name TEXT,
    tagline TEXT,
    description TEXT,
    category TEXT,
    cover_image_url TEXT,
    logo_url TEXT,
    member_count INTEGER DEFAULT 0,
    approval_status TEXT DEFAULT 'approved',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS club_members (
    club_id TEXT,
    user_id TEXT,
    role TEXT DEFAULT 'member',
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(club_id, user_id),
    FOREIGN KEY(club_id) REFERENCES clubs(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS club_posts (
    id TEXT PRIMARY KEY,
    club_id TEXT,
    author_id TEXT,
    content TEXT,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    likes_count INTEGER DEFAULT 0,
    FOREIGN KEY(club_id) REFERENCES clubs(id),
    FOREIGN KEY(author_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    organizer_id TEXT,
    club_id TEXT,
    event_type TEXT,
    date_time DATETIME,
    location TEXT,
    cover_image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(organizer_id) REFERENCES users(id),
    FOREIGN KEY(club_id) REFERENCES clubs(id)
  );

  CREATE TABLE IF NOT EXISTS event_rsvps (
    event_id TEXT,
    user_id TEXT,
    status TEXT DEFAULT 'going',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(event_id, user_id),
    FOREIGN KEY(event_id) REFERENCES events(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS gigs (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    pay_amount TEXT,
    gig_type TEXT,
    location TEXT,
    posted_by TEXT,
    status TEXT DEFAULT 'open',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(posted_by) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS gig_applications (
    id TEXT PRIMARY KEY,
    gig_id TEXT,
    user_id TEXT,
    proof_url TEXT,
    upi_id TEXT,
    status TEXT DEFAULT 'pending',
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(gig_id) REFERENCES gigs(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    type TEXT,
    content TEXT,
    link_url TEXT,
    read_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS matches (
    user1_id TEXT,
    user2_id TEXT,
    matched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'pending',
    PRIMARY KEY(user1_id, user2_id),
    FOREIGN KEY(user1_id) REFERENCES users(id),
    FOREIGN KEY(user2_id) REFERENCES users(id)
  );
`);

// Seed Data if empty
const userCount = db.prepare('SELECT count(*) as count FROM users').get() as { count: number };
if (userCount.count === 0) {
  console.log('Seeding database...');

  const adminId = uuidv4();
  db.prepare(`
    INSERT INTO users (id, email, name, user_type, department, year, bio, interests)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    adminId,
    'admin@adda.com',
    'Admin User',
    'super_admin',
    'CS',
    '4th',
    'Building the future of college social life.',
    JSON.stringify(['coding', 'entrepreneurship'])
  );

  const clubId = uuidv4();
  db.prepare(`
    INSERT INTO clubs (id, name, tagline, description, category, cover_image_url, logo_url, member_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    clubId,
    'Photography Club',
    'Capture the moment',
    'A community for shutterbugs and visual storytellers.',
    'Arts',
    'https://picsum.photos/seed/photo/800/400',
    'https://picsum.photos/seed/photologo/100/100',
    42
  );

  db.prepare(`
    INSERT INTO events (id, title, description, organizer_id, club_id, event_type, date_time, location, cover_image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    uuidv4(),
    'Campus Photo Walk',
    'Join us for a sunset photo walk around the main campus.',
    adminId,
    clubId,
    'meetup',
    new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    'Main Gate',
    'https://picsum.photos/seed/walk/800/400'
  );

  db.prepare(`
    INSERT INTO gigs (id, title, description, pay_amount, gig_type, location, posted_by)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    uuidv4(),
    'Event Photographer Needed',
    'Need a photographer for the upcoming freshers party. 3 hours commitment.',
    '₹1500',
    'freelance',
    'Auditorium',
    adminId
  );

  db.prepare(`
    INSERT INTO confessions (id, sender_id, recipient_name, message, vibe_type, status, likes_count)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    uuidv4(),
    adminId,
    'Library Girl',
    'I saw you reading Dune yesterday. Cool taste!',
    'crush',
    'approved',
    12
  );
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes

  // Users
  app.get('/api/users/me', (req, res) => {
    // Mock Auth: Get the first admin user for now
    const user = db.prepare('SELECT * FROM users LIMIT 1').get();
    if (user) {
      user.interests = JSON.parse(user.interests || '[]');
      user.looking_for = JSON.parse(user.looking_for || '[]');
    }
    res.json(user);
  });

  // Bouquets
  app.get('/api/bouquets', (req, res) => {
    // Mock user_id for now (should be from auth)
    const user = db.prepare('SELECT id FROM users LIMIT 1').get() as { id: string };
    const bouquets = db.prepare('SELECT * FROM bouquets WHERE recipient_id = ? ORDER BY created_at DESC').all(user.id);
    res.json(bouquets);
  });

  app.post('/api/bouquets', (req, res) => {
    const { sender_id, recipient_id, message } = req.body;
    const id = uuidv4();
    db.prepare(`
      INSERT INTO bouquets (id, sender_id, recipient_id, message)
      VALUES (?, ?, ?, ?)
    `).run(id, sender_id, recipient_id, message);
    res.json({ success: true, id });
  });

  // Moderation
  app.get('/api/admin/pending-confessions', (req, res) => {
    const pending = db.prepare('SELECT * FROM confessions WHERE status = "pending" ORDER BY created_at ASC').all();
    res.json(pending);
  });

  app.post('/api/admin/confessions/:id/moderate', (req, res) => {
    const { status } = req.body; // 'approved' or 'rejected'
    db.prepare('UPDATE confessions SET status = ? WHERE id = ?').run(status, req.params.id);
    res.json({ success: true });
  });

  app.get('/api/admin/pending-clubs', (req, res) => {
    const pending = db.prepare('SELECT * FROM clubs WHERE approval_status = "pending" ORDER BY created_at ASC').all();
    res.json(pending);
  });

  app.post('/api/admin/clubs/:id/moderate', (req, res) => {
    const { status } = req.body; // 'approved' or 'rejected'
    db.prepare('UPDATE clubs SET approval_status = ? WHERE id = ?').run(status, req.params.id);
    res.json({ success: true });
  });

  // Creation Flows
  app.post('/api/clubs', (req, res) => {
    const { name, tagline, description, category, cover_image_url, logo_url } = req.body;
    const id = uuidv4();
    db.prepare(`
      INSERT INTO clubs (id, name, tagline, description, category, cover_image_url, logo_url, approval_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, tagline, description, category, cover_image_url, logo_url, 'pending');
    res.json({ success: true, id });
  });

  app.post('/api/events', (req, res) => {
    const { title, description, organizer_id, club_id, event_type, date_time, location, cover_image_url } = req.body;
    const id = uuidv4();
    db.prepare(`
      INSERT INTO events (id, title, description, organizer_id, club_id, event_type, date_time, location, cover_image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, title, description, organizer_id, club_id, event_type, date_time, location, cover_image_url);
    res.json({ success: true, id });
  });

  // Gigs
  app.post('/api/gigs/:id/apply', (req, res) => {
    const { user_id, proof_url, upi_id } = req.body;
    const id = uuidv4();
    db.prepare(`
      INSERT INTO gig_applications (id, gig_id, user_id, proof_url, upi_id)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, req.params.id, user_id, proof_url, upi_id);
    res.json({ success: true, id });
  });

  // Confessions
  app.get('/api/confessions', (req, res) => {
    const confessions = db.prepare('SELECT * FROM confessions WHERE status = "approved" ORDER BY created_at DESC').all();
    res.json(confessions);
  });

  app.post('/api/confessions', (req, res) => {
    const { sender_id, recipient_name, message, vibe_type, is_anonymous } = req.body;
    const id = uuidv4();
    db.prepare(`
      INSERT INTO confessions (id, sender_id, recipient_name, message, vibe_type, is_anonymous, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, sender_id, recipient_name, message, vibe_type, is_anonymous ? 1 : 0, 'pending');
    res.json({ success: true, id });
  });

  // Clubs
  app.get('/api/clubs', (req, res) => {
    const clubs = db.prepare('SELECT * FROM clubs ORDER BY member_count DESC').all();
    res.json(clubs);
  });

  app.get('/api/clubs/:id', (req, res) => {
    const club = db.prepare('SELECT * FROM clubs WHERE id = ?').get(req.params.id);
    res.json(club);
  });

  // Events
  app.get('/api/events', (req, res) => {
    const events = db.prepare(`
      SELECT events.*, clubs.name as club_name 
      FROM events 
      LEFT JOIN clubs ON events.club_id = clubs.id 
      ORDER BY date_time ASC
    `).all();
    res.json(events);
  });

  // Gigs
  app.get('/api/gigs', (req, res) => {
    const gigs = db.prepare('SELECT * FROM gigs WHERE status = "open" ORDER BY created_at DESC').all();
    res.json(gigs);
  });

  // Feed (Unified)
  app.get('/api/feed', (req, res) => {
    // Simplified feed: combine confessions, club posts, and events
    const confessions = db.prepare('SELECT id, "confession" as type, message as content, created_at FROM confessions WHERE status = "approved" LIMIT 10').all();
    const clubs = db.prepare('SELECT id, "club" as type, name as content, created_at FROM clubs WHERE approval_status = "approved" LIMIT 10').all();
    const events = db.prepare('SELECT id, "event" as type, title as content, created_at FROM events LIMIT 10').all();

    const feed = [...confessions, ...clubs, ...events].sort((a: any, b: any) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    res.json(feed);
  });

  // Stats
  app.get('/api/stats', (req, res) => {
    const userCount = db.prepare('SELECT count(*) as c FROM users').get() as { c: number };
    const clubCount = db.prepare('SELECT count(*) as c FROM clubs').get() as { c: number };
    const eventCount = db.prepare('SELECT count(*) as c FROM events').get() as { c: number };
    res.json({
      users: userCount.c,
      clubs: clubCount.c,
      events: eventCount.c
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
    // Production static serving (simplified for this environment)
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
