import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Check, X, Trash2, Users, Calendar, Briefcase, Plus } from 'lucide-react';
import { api, Confession, Club, Event, Gig } from '../lib/api';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'confessions' | 'users' | 'clubs' | 'events' | 'gigs'>('confessions');
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    pendingConfessions: 0,
    totalUsers: 0,
    activeClubs: 0,
    upcomingEvents: 0
  });

  useEffect(() => {
    loadPending();
    api.getStats().then(s => setStats(prev => ({ ...prev, ...s })));
  }, []);

  const loadPending = async () => {
    setLoading(true);
    try {
      const pendingConfessions = await api.getPendingConfessions();
      const pendingClubs = await api.getPendingClubs();
      setConfessions(pendingConfessions);
      setClubs(pendingClubs);
      setStats(prev => ({ ...prev, pendingConfessions: pendingConfessions.length }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleModerateConfession = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await api.moderateConfession(id, status);
      loadPending();
    } catch (error) {
      console.error(error);
      alert('Moderation failed');
    }
  };

  const handleModerateClub = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await api.moderateClub(id, status);
      loadPending();
    } catch (error) {
      console.error(error);
      alert('Moderation failed');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center">
            <Shield className="w-8 h-8 mr-3 text-indigo-600" />
            Admin Dashboard
          </h1>
          <p className="text-slate-500">Manage content, users, and platform health.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="text-sm text-slate-500 uppercase font-medium">Pending Confessions</div>
          <div className="text-2xl font-bold text-slate-900">{stats.pendingConfessions}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="text-sm text-slate-500 uppercase font-medium">Total Users</div>
          <div className="text-2xl font-bold text-slate-900">{stats.totalUsers}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="text-sm text-slate-500 uppercase font-medium">Active Clubs</div>
          <div className="text-2xl font-bold text-slate-900">{stats.activeClubs}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="text-sm text-slate-500 uppercase font-medium">Upcoming Events</div>
          <div className="text-2xl font-bold text-slate-900">{stats.upcomingEvents}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
        {['confessions', 'users', 'clubs', 'events', 'gigs'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${activeTab === tab
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {activeTab === 'confessions' && (
          <div className="divide-y divide-slate-100">
            <div className="p-4 bg-slate-50 border-b border-slate-100 font-medium text-slate-500 text-sm flex justify-between">
              <span>Confession Content</span>
              <span>Actions</span>
            </div>
            {confessions.map((confession) => (
              <div key={confession.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900">To: {confession.recipient_name}</span>
                    <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">{confession.vibe_type}</span>
                  </div>
                  <p className="text-slate-600 text-sm">"{confession.message}"</p>
                  <div className="text-xs text-slate-400 mt-1">
                    From: {confession.is_anonymous ? 'Anonymous' : 'User'} • {new Date(confession.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleModerateConfession(confession.id, 'approved')}
                    className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition" title="Approve"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleModerateConfession(confession.id, 'rejected')}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition" title="Reject"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {confessions.length === 0 && !loading && (
              <div className="p-8 text-center text-slate-500">No pending confessions.</div>
            )}
          </div>
        )}

        {activeTab === 'clubs' && (
          <div className="divide-y divide-slate-100">
            <div className="p-4 bg-slate-50 border-b border-slate-100 font-medium text-slate-500 text-sm flex justify-between">
              <span>Club Application</span>
              <span>Actions</span>
            </div>
            {clubs.map((club) => (
              <div key={club.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <img src={club.logo_url} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                  <div>
                    <h3 className="font-bold text-slate-900">{club.name}</h3>
                    <p className="text-xs text-slate-500">{club.tagline}</p>
                    <p className="text-xs text-slate-400">{club.category}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleModerateClub(club.id, 'approved')}
                    className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                  >
                    <Check className="w-4 h-4 mr-1 inline" /> Approve
                  </button>
                  <button
                    onClick={() => handleModerateClub(club.id, 'rejected')}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                  >
                    <X className="w-4 h-4 mr-1 inline" /> Reject
                  </button>
                </div>
              </div>
            ))}
            {clubs.length === 0 && !loading && (
              <div className="p-8 text-center text-slate-500">No pending club requests.</div>
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="p-8 text-center text-slate-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>Event approval coming soon.</p>
          </div>
        )}

        {activeTab === 'gigs' && (
          <div className="p-8 text-center text-slate-500">
            <Briefcase className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>Gig verification coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
