import { supabase } from './supabase';

// --- Type Exports ---
export interface Confession {
  id: string;
  sender_id: string;
  recipient_name: string;
  recipient_instagram?: string;
  message: string;
  vibe_type: string;
  is_anonymous: boolean;
  status: 'pending' | 'approved' | 'rejected';
  likes_count: number;
  created_at: string;
}

export interface Club {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  cover_image_url: string;
  logo_url: string;
  member_count: number;
  approval_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  organizer_id: string;
  club_id?: string;
  event_type: string;
  date_time: string;
  location: string;
  cover_image_url: string;
  created_at: string;
  club_name?: string;
}

export interface Stats {
  users: number;
  clubs: number;
  events: number;
}

export interface Gig {
  id: string;
  title: string;
  description: string;
  gig_type: string;
  pay_amount: number;
  location: string;
  status: 'open' | 'closed';
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profile_pic_url?: string;
  instagram_handle?: string;
  department: string;
  year: string;
  hostel: string;
  bio: string;
  interests: string[];
}

// --- API Functions ---
export const api = {
  // Users
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase.from('users').select('*').eq('id', user.id).single();
    return data;
  },

  getMe: async (): Promise<User | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {
      id: 'guest',
      name: 'Campus Explorer',
      email: 'guest@adda.app',
      department: 'Undeclared',
      year: '1st',
      hostel: 'Day Scholar',
      bio: 'Sign in to customize your profile!',
      interests: ['Exploring', 'Making Friends', 'Events']
    };
    const { data } = await supabase.from('users').select('*').eq('id', user.id).single();
    return data || {
      id: user.id,
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student',
      email: user.email || '',
      department: 'Not Set',
      year: '1st',
      hostel: 'Not Set',
      bio: 'Edit your profile to add a bio!',
      interests: ['New Student']
    };
  },

  // Confessions
  getConfessions: async () => {
    const { data, error } = await supabase
      .from('confessions')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    if (error) { console.error(error); return []; }
    return data || [];
  },

  postConfession: async (confession: Partial<Confession>) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('confessions')
      .insert([{ ...confession, sender_id: user?.id, status: 'pending' }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Bouquets
  getBouquets: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data, error } = await supabase
      .from('bouquets')
      .select('*')
      .eq('recipient_id', user.id)
      .order('created_at', { ascending: false });
    if (error) { console.error(error); return []; }
    return data || [];
  },

  // Clubs
  getClubs: async () => {
    const { data, error } = await supabase
      .from('clubs')
      .select('*')
      .order('member_count', { ascending: false });
    if (error) { console.error(error); return []; }
    return data || [];
  },

  createClub: async (club: Partial<Club>) => {
    const { data, error } = await supabase
      .from('clubs')
      .insert([{ ...club, approval_status: 'pending' }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  joinClub: async (clubId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Please sign in first');
    const { error } = await supabase
      .from('club_members')
      .insert([{ club_id: clubId, user_id: user.id }]);
    if (error) throw error;
    // Increment member count
    await supabase.rpc('increment_member_count', { club_id_input: clubId });
  },

  // Events
  getEvents: async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date_time', { ascending: true });
    if (error) { console.error(error); return []; }
    return data || [];
  },

  createEvent: async (event: Partial<Event>) => {
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Gigs
  getGigs: async () => {
    const { data, error } = await supabase
      .from('gigs')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false });
    if (error) { console.error(error); return []; }
    return data || [];
  },

  applyForGig: async (gigId: string, application: { user_id: string; upi_id: string; proof_url: string }) => {
    const { data, error } = await supabase
      .from('gig_applications')
      .insert([{ ...application, gig_id: gigId }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Admin
  getPendingConfessions: async () => {
    const { data, error } = await supabase
      .from('confessions')
      .select('*')
      .eq('status', 'pending');
    if (error) { console.error(error); return []; }
    return data || [];
  },

  moderateConfession: async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('confessions')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
  },

  getPendingClubs: async () => {
    const { data, error } = await supabase
      .from('clubs')
      .select('*')
      .eq('approval_status', 'pending');
    if (error) { console.error(error); return []; }
    return data || [];
  },

  moderateClub: async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('clubs')
      .update({ approval_status: status })
      .eq('id', id);
    if (error) throw error;
  },

  // Feed
  getFeed: async () => {
    const [confRes, clubRes, eventRes] = await Promise.all([
      supabase.from('confessions').select('id, message, created_at').eq('status', 'approved').limit(10),
      supabase.from('clubs').select('id, name, created_at').eq('approval_status', 'approved').limit(10),
      supabase.from('events').select('id, title, created_at').limit(10)
    ]);

    const confessions = (confRes.data || []).map(c => ({ id: c.id, type: 'confession' as const, content: c.message, created_at: c.created_at }));
    const clubs = (clubRes.data || []).map(c => ({ id: c.id, type: 'club' as const, content: c.name, created_at: c.created_at }));
    const events = (eventRes.data || []).map(e => ({ id: e.id, type: 'event' as const, content: e.title, created_at: e.created_at }));

    return [...confessions, ...clubs, ...events].sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  // Stats
  getStats: async (): Promise<Stats> => {
    const [u, c, e] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('clubs').select('*', { count: 'exact', head: true }),
      supabase.from('events').select('*', { count: 'exact', head: true })
    ]);
    return { users: u.count || 0, clubs: c.count || 0, events: e.count || 0 };
  }
};
