export interface User {
  id: string;
  name: string;
  email: string;
  instagram_handle?: string;
  department?: string;
  year?: string;
  bio?: string;
  interests: string[];
  looking_for: string[];
  profile_pic_url?: string;
  user_type: 'student' | 'club_admin' | 'organizer' | 'super_admin';
}

export interface Confession {
  id: string;
  sender_id: string;
  recipient_name: string;
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
}

export interface Event {
  id: string;
  title: string;
  description: string;
  organizer_id: string;
  club_id?: string;
  club_name?: string;
  event_type: string;
  date_time: string;
  location: string;
  cover_image_url: string;
}

export interface Gig {
  id: string;
  title: string;
  description: string;
  pay_amount: string;
  gig_type: string;
  location: string;
  posted_by: string;
  status: 'open' | 'filled' | 'closed';
}

export interface Stats {
  users: number;
  clubs: number;
  events: number;
}

export const api = {
  getMe: async (): Promise<User> => {
    const res = await fetch('/api/users/me');
    return res.json();
  },
  getConfessions: async (): Promise<Confession[]> => {
    const res = await fetch('/api/confessions');
    return res.json();
  },
  postConfession: async (data: Partial<Confession>) => {
    const res = await fetch('/api/confessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  getClubs: async (): Promise<Club[]> => {
    const res = await fetch('/api/clubs');
    return res.json();
  },
  getClub: async (id: string): Promise<Club> => {
    const res = await fetch(`/api/clubs/${id}`);
    return res.json();
  },
  getEvents: async (): Promise<Event[]> => {
    const res = await fetch('/api/events');
    return res.json();
  },
  getGigs: async (): Promise<Gig[]> => {
    const res = await fetch('/api/gigs');
    return res.json();
  },
  getBouquets: async (): Promise<any[]> => {
    const res = await fetch('/api/bouquets');
    return res.json();
  },
  postBouquet: async (data: { sender_id: string; recipient_id: string; message: string }) => {
    const res = await fetch('/api/bouquets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  getPendingConfessions: async (): Promise<Confession[]> => {
    const res = await fetch('/api/admin/pending-confessions');
    return res.json();
  },
  moderateConfession: async (id: string, status: 'approved' | 'rejected') => {
    const res = await fetch(`/api/admin/confessions/${id}/moderate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },
  getPendingClubs: async (): Promise<Club[]> => {
    const res = await fetch('/api/admin/pending-clubs');
    return res.json();
  },
  moderateClub: async (id: string, status: 'approved' | 'rejected') => {
    const res = await fetch(`/api/admin/clubs/${id}/moderate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },
  createClub: async (data: Partial<Club>) => {
    const res = await fetch('/api/clubs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  createEvent: async (data: Partial<Event>) => {
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  applyForGig: async (gigId: string, data: { user_id: string; proof_url: string; upi_id: string }) => {
    const res = await fetch(`/api/gigs/${gigId}/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  getFeed: async (): Promise<any[]> => {
    const res = await fetch('/api/feed');
    return res.json();
  },
  getStats: async (): Promise<Stats> => {
    const res = await fetch('/api/stats');
    return res.json();
  }
};
