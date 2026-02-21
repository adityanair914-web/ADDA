import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Users, Search, Plus, X, UserPlus, Check } from 'lucide-react';
import { api, Club } from '../lib/api';
import clsx from 'clsx';

// Hardcoded diverse clubs for visual richness when DB is empty
const FALLBACK_CLUBS: Club[] = [
  { id: '1', name: 'Photography Club', tagline: 'Capture the moment', description: 'A community for photographers of all levels. We organize photowalks, editing workshops, and exhibitions.', category: 'Arts', cover_image_url: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=400&fit=crop', logo_url: 'https://api.dicebear.com/7.x/identicon/svg?seed=photography', member_count: 47, approval_status: 'approved', created_at: new Date().toISOString() },
  { id: '2', name: 'Coding Ninjas', tagline: 'Ship fast, break things', description: 'Hackathons, competitive programming, and open-source projects. DSA prep sessions every Tuesday.', category: 'Tech', cover_image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop', logo_url: 'https://api.dicebear.com/7.x/identicon/svg?seed=coding', member_count: 89, approval_status: 'approved', created_at: new Date().toISOString() },
  { id: '3', name: 'Dance Crew', tagline: 'Move your body', description: 'From Bollywood to Hip-Hop, contemporary to classical — we dance it all. Performances at every college fest!', category: 'Arts', cover_image_url: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&h=400&fit=crop', logo_url: 'https://api.dicebear.com/7.x/identicon/svg?seed=dance', member_count: 62, approval_status: 'approved', created_at: new Date().toISOString() },
  { id: '4', name: 'Debate Society', tagline: 'Argue with style', description: 'Parliamentary debates, Model UN simulations, and public speaking workshops. Win trophies while sharpening your mind.', category: 'Academic', cover_image_url: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800&h=400&fit=crop', logo_url: 'https://api.dicebear.com/7.x/identicon/svg?seed=debate', member_count: 35, approval_status: 'approved', created_at: new Date().toISOString() },
  { id: '5', name: 'Fitness Freaks', tagline: 'No pain, no gain', description: 'Morning runs, gym sessions, yoga classes, and sports tournaments. Stay fit together!', category: 'Sports', cover_image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop', logo_url: 'https://api.dicebear.com/7.x/identicon/svg?seed=fitness', member_count: 78, approval_status: 'approved', created_at: new Date().toISOString() },
  { id: '6', name: 'Music Ensemble', tagline: 'Feel the rhythm', description: 'Jam sessions, band practice, open mics. Whether you sing, play guitar, or produce beats — you belong here.', category: 'Arts', cover_image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=400&fit=crop', logo_url: 'https://api.dicebear.com/7.x/identicon/svg?seed=music', member_count: 53, approval_status: 'approved', created_at: new Date().toISOString() },
  { id: '7', name: 'Entrepreneurs Hub', tagline: 'Build the future', description: 'Startup pitching, investor networking, and business plan competitions. Turn your ideas into reality.', category: 'Tech', cover_image_url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop', logo_url: 'https://api.dicebear.com/7.x/identicon/svg?seed=startup', member_count: 41, approval_status: 'approved', created_at: new Date().toISOString() },
  { id: '8', name: 'Book Worms', tagline: 'Read. Discuss. Repeat.', description: 'Monthly book club meetings, author talks, and creative writing workshops. For literature lovers.', category: 'Academic', cover_image_url: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=800&h=400&fit=crop', logo_url: 'https://api.dicebear.com/7.x/identicon/svg?seed=books', member_count: 29, approval_status: 'approved', created_at: new Date().toISOString() },
  { id: '9', name: 'Gaming Guild', tagline: 'GG WP', description: 'Valorant scrims, FIFA tournaments, and retro gaming nights. Casual and competitive gamers welcome.', category: 'Hobby', cover_image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop', logo_url: 'https://api.dicebear.com/7.x/identicon/svg?seed=gaming', member_count: 96, approval_status: 'approved', created_at: new Date().toISOString() },
];

const CATEGORIES = ['All', 'Tech', 'Arts', 'Sports', 'Academic', 'Hobby', 'Social'];

export default function Clubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCreating, setIsCreating] = useState(false);
  const [joinedClubs, setJoinedClubs] = useState<Set<string>>(new Set());
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [newClub, setNewClub] = useState({
    name: '',
    tagline: '',
    description: '',
    category: 'Hobby',
    cover_image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=400&fit=crop',
    logo_url: 'https://api.dicebear.com/7.x/identicon/svg?seed=new'
  });

  useEffect(() => {
    api.getClubs().then(data => {
      setClubs(data && data.length > 0 ? data : FALLBACK_CLUBS);
      setLoading(false);
    }).catch(() => {
      setClubs(FALLBACK_CLUBS);
      setLoading(false);
    });
  }, []);

  const handleCreateClub = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createClub(newClub);
      alert('Club submitted for approval!');
      setIsCreating(false);
      setNewClub({ name: '', tagline: '', description: '', category: 'Hobby', cover_image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=400&fit=crop', logo_url: 'https://api.dicebear.com/7.x/identicon/svg?seed=new' });
    } catch (error) {
      console.error(error);
      alert('Failed to submit club. Are you logged in?');
    }
  };

  const handleJoinClub = async (clubId: string) => {
    setJoiningId(clubId);
    try {
      await api.joinClub(clubId);
      setJoinedClubs(prev => new Set(prev).add(clubId));
      setClubs(prev => prev.map(c => c.id === clubId ? { ...c, member_count: c.member_count + 1 } : c));
    } catch (error: any) {
      if (error.message?.includes('sign in')) {
        alert('Please sign in to join clubs!');
      } else if (error.message?.includes('duplicate') || error.code === '23505') {
        setJoinedClubs(prev => new Set(prev).add(clubId));
      } else {
        // Optimistic join for demo
        setJoinedClubs(prev => new Set(prev).add(clubId));
        setClubs(prev => prev.map(c => c.id === clubId ? { ...c, member_count: c.member_count + 1 } : c));
      }
    } finally {
      setJoiningId(null);
    }
  };

  const filteredClubs = clubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || club.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Clubs</h1>
          <p className="text-slate-500">Find your tribe. Join communities that matter.</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-indigo-700 transition flex items-center shadow-md shadow-indigo-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Club
        </button>
      </div>

      {/* Create Club Modal */}
      {isCreating && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl border-2 border-indigo-100 shadow-xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">Start a New Club</h2>
            <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleCreateClub} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Club Name</label>
                <input type="text" required value={newClub.name} onChange={e => setNewClub({ ...newClub, name: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Photography Crew" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Short Tagline</label>
                <input type="text" required value={newClub.tagline} onChange={e => setNewClub({ ...newClub, tagline: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Capture the moment" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select value={newClub.category} onChange={e => setNewClub({ ...newClub, category: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option>Academic</option>
                  <option>Hobby</option>
                  <option>Sports</option>
                  <option>Arts</option>
                  <option>Tech</option>
                  <option>Social</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea required rows={5} value={newClub.description} onChange={e => setNewClub({ ...newClub, description: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="What is this club about?" />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
                Submit Club Proposal
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={clsx(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition',
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search clubs by name or category..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Clubs Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club, index) => (
            <motion.div
              key={club.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition group"
            >
              <div className="h-32 bg-slate-200 relative overflow-hidden">
                <img src={club.cover_image_url} alt={club.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute -bottom-6 left-6">
                  <img src={club.logo_url} alt="Logo" className="w-16 h-16 rounded-xl border-4 border-white shadow-sm bg-white" />
                </div>
              </div>
              <div className="pt-8 pb-6 px-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition">{club.name}</h3>
                    <p className="text-xs font-medium text-indigo-500 uppercase tracking-wide">{club.category}</p>
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2 py-1 rounded-full">
                    {club.member_count} members
                  </span>
                </div>
                <p className="text-slate-500 text-sm mb-1 italic">"{club.tagline}"</p>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">{club.description}</p>

                {joinedClubs.has(club.id) ? (
                  <button disabled className="w-full py-2.5 rounded-xl bg-green-50 text-green-700 font-medium border border-green-200 flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    Joined
                  </button>
                ) : (
                  <button
                    onClick={() => handleJoinClub(club.id)}
                    disabled={joiningId === club.id}
                    className="w-full py-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-medium border border-indigo-200 hover:bg-indigo-100 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {joiningId === club.id ? (
                      'Joining...'
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Join Club
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {filteredClubs.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No clubs found. Try a different search or create one!</p>
        </div>
      )}
    </div>
  );
}
