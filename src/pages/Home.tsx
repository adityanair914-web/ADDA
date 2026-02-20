import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Heart, Users, Calendar, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api, Stats, Event, Club } from '../lib/api';

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [featuredClubs, setFeaturedClubs] = useState<Club[]>([]);

  useEffect(() => {
    api.getStats().then(setStats);
    api.getEvents().then(events => setFeaturedEvents(events.slice(0, 3)));
    api.getClubs().then(clubs => setFeaturedClubs(clubs.slice(0, 3)));
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 text-white p-8 md:p-16 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight"
          >
            Your college. <br/>Your people. <br/>Your life.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-pink-100 mb-8 max-w-2xl"
          >
            The single platform where students find their people — whether that's love interests, study partners, club members, or party crews.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/connect" className="bg-white text-pink-600 px-6 py-3 rounded-xl font-semibold hover:bg-pink-50 transition shadow-lg flex items-center">
              <Heart className="w-5 h-5 mr-2" />
              Send Confession
            </Link>
            <Link to="/clubs" className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Find Clubs
            </Link>
          </motion.div>
        </div>
        
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-pink-500/30 rounded-full blur-3xl" />
      </section>

      {/* Stats Ticker */}
      {stats && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex justify-around items-center text-center">
          <div>
            <div className="text-3xl font-bold text-slate-900">{stats.users}</div>
            <div className="text-sm text-slate-500 uppercase tracking-wide font-medium">Active Members</div>
          </div>
          <div className="w-px h-12 bg-slate-200" />
          <div>
            <div className="text-3xl font-bold text-slate-900">{stats.clubs}</div>
            <div className="text-sm text-slate-500 uppercase tracking-wide font-medium">Active Clubs</div>
          </div>
          <div className="w-px h-12 bg-slate-200" />
          <div>
            <div className="text-3xl font-bold text-slate-900">{stats.events}</div>
            <div className="text-sm text-slate-500 uppercase tracking-wide font-medium">Upcoming Events</div>
          </div>
        </div>
      )}

      {/* Featured Sections Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Events */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-indigo-500" />
              Happening Soon
            </h2>
            <Link to="/hangouts" className="text-indigo-600 font-medium hover:text-indigo-700 flex items-center text-sm">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {featuredEvents.map(event => (
              <div key={event.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition flex gap-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-lg flex flex-col items-center justify-center text-indigo-700 shrink-0">
                  <span className="text-xs font-bold uppercase">{new Date(event.date_time).toLocaleString('default', { month: 'short' })}</span>
                  <span className="text-xl font-bold">{new Date(event.date_time).getDate()}</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{event.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-1">{event.description}</p>
                  <div className="mt-2 text-xs text-slate-400 flex items-center">
                    <span>{event.location}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(event.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Clubs */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center">
              <Users className="w-6 h-6 mr-2 text-pink-500" />
              Popular Clubs
            </h2>
            <Link to="/clubs" className="text-pink-600 font-medium hover:text-pink-700 flex items-center text-sm">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid gap-4">
            {featuredClubs.map(club => (
              <div key={club.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition flex items-center gap-4">
                <img src={club.logo_url} alt={club.name} className="w-12 h-12 rounded-full object-cover bg-slate-100" />
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900">{club.name}</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">{club.category}</p>
                </div>
                <div className="text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1 rounded-full">
                  {club.member_count} members
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Quick Links */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 hover:shadow-md transition cursor-pointer">
          <h3 className="font-bold text-orange-900 mb-2">New here?</h3>
          <p className="text-sm text-orange-700">Take the interest quiz to find your tribe.</p>
        </div>
        <div className="bg-teal-50 p-6 rounded-2xl border border-teal-100 hover:shadow-md transition cursor-pointer">
          <h3 className="font-bold text-teal-900 mb-2">Study Partners</h3>
          <p className="text-sm text-teal-700">Find someone to ace that exam with.</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 hover:shadow-md transition cursor-pointer">
          <h3 className="font-bold text-blue-900 mb-2">Earn Cash</h3>
          <p className="text-sm text-blue-700">Check out the latest gigs on campus.</p>
        </div>
      </section>
    </div>
  );
}
