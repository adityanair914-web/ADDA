import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Users, Search, Plus } from 'lucide-react';
import { api, Club } from '../lib/api';
import { Link } from 'react-router-dom';

export default function Clubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newClub, setNewClub] = useState({
    name: '',
    tagline: '',
    description: '',
    category: 'Hobby',
    cover_image_url: 'https://picsum.photos/seed/club/800/400',
    logo_url: 'https://picsum.photos/seed/logo/200/200'
  });

  useEffect(() => {
    api.getClubs().then(setClubs);
  }, []);

  const handleCreateClub = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createClub(newClub);
      alert('Club submitted for approval!');
      setIsCreating(false);
      setNewClub({
        name: '',
        tagline: '',
        description: '',
        category: 'Hobby',
        cover_image_url: 'https://picsum.photos/seed/club/800/400',
        logo_url: 'https://picsum.photos/seed/logo/200/200'
      });
    } catch (error) {
      console.error(error);
      alert('Failed to submit club');
    }
  };

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {isCreating && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl border-2 border-indigo-100 shadow-xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">Start a New Club</h2>
            <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600">
              Cancel
            </button>
          </div>
          <form onSubmit={handleCreateClub} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Club Name</label>
                <input
                  type="text" required
                  value={newClub.name}
                  onChange={e => setNewClub({ ...newClub, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Photography Crew"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Short Tagline</label>
                <input
                  type="text" required
                  value={newClub.tagline}
                  onChange={e => setNewClub({ ...newClub, tagline: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Capture the moment"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={newClub.category}
                  onChange={e => setNewClub({ ...newClub, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
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
                <textarea
                  required rows={5}
                  value={newClub.description}
                  onChange={e => setNewClub({ ...newClub, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="What is this club about? (min 50 chars recommended)"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
              >
                Submit Club Proposal
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Search & Filter */}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClubs.map((club) => (
          <motion.div
            key={club.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition group cursor-pointer"
          >
            <div className="h-32 bg-slate-200 relative">
              <img src={club.cover_image_url} alt={club.name} className="w-full h-full object-cover" />
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
              <p className="text-slate-500 text-sm mb-4 line-clamp-2">{club.description}</p>
              <button className="w-full py-2 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition">
                View Club
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
