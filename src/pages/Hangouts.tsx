import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Clock, Users, Plus, X, CheckCircle } from 'lucide-react';
import { api, Event } from '../lib/api';

const FALLBACK_EVENTS: Event[] = [
  { id: '1', title: 'Annual Tech Fest 2026', description: 'The biggest tech event of the year! Hackathons, robotics, coding competitions, and cash prizes worth ₹2 lakhs.', organizer_id: 'admin', event_type: 'fest', date_time: new Date(Date.now() + 7 * 86400000).toISOString(), location: 'College Grounds', cover_image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop', created_at: new Date().toISOString() },
  { id: '2', title: 'Campus Photography Walk', description: 'Explore the campus with your camera. All skill levels welcome. Best shots get framed and displayed!', organizer_id: 'admin', event_type: 'workshop', date_time: new Date(Date.now() + 3 * 86400000).toISOString(), location: 'Main Gate → Amphitheatre', cover_image_url: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=400&fit=crop', created_at: new Date().toISOString() },
  { id: '3', title: 'Inter-College Debate Championship', description: 'Battle of brains! 8 colleges, 32 teams, one trophy. Open rounds + Finals available to watch.', organizer_id: 'admin', event_type: 'competition', date_time: new Date(Date.now() + 14 * 86400000).toISOString(), location: 'Seminar Hall, Block B', cover_image_url: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800&h=400&fit=crop', created_at: new Date().toISOString() },
  { id: '4', title: 'Night DJ Party 🎉', description: 'End-of-semester bash! DJ Night with food stalls, neon lights, and lawn space. Open to all.', organizer_id: 'admin', event_type: 'party', date_time: new Date(Date.now() + 21 * 86400000).toISOString(), location: 'College Lawn', cover_image_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=400&fit=crop', created_at: new Date().toISOString() },
  { id: '5', title: 'Resume & LinkedIn Workshop', description: 'Placement season prep! Learn to build a killer resume and optimize your LinkedIn for recruiters.', organizer_id: 'admin', event_type: 'workshop', date_time: new Date(Date.now() + 5 * 86400000).toISOString(), location: 'Room 201, Academic Block', cover_image_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop', created_at: new Date().toISOString() },
];

const EVENT_TYPE_STYLES: Record<string, string> = {
  fest: 'bg-pink-100 text-pink-700',
  workshop: 'bg-blue-100 text-blue-700',
  competition: 'bg-orange-100 text-orange-700',
  party: 'bg-purple-100 text-purple-700',
  seminar: 'bg-teal-100 text-teal-700',
};

export default function Hangouts() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [rsvpIds, setRsvpIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    event_type: 'workshop',
    date_time: '',
    location: '',
    cover_image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=400&fit=crop',
    club_id: ''
  });

  useEffect(() => {
    api.getEvents().then(data => {
      setEvents(data && data.length > 0 ? data : FALLBACK_EVENTS);
      setLoading(false);
    }).catch(() => {
      setEvents(FALLBACK_EVENTS);
      setLoading(false);
    });
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createEvent(newEvent);
      alert('Event submitted for approval!');
      setIsCreating(false);
    } catch {
      alert('Please sign in to create events!');
    }
  };

  const handleRsvp = (id: string) => {
    setRsvpIds(prev => new Set(prev).add(id));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Hangouts</h1>
          <p className="text-slate-500">Events, parties, workshops — everything happening on campus.</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-indigo-700 transition flex items-center shadow-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </button>
      </div>

      {/* Create Event Modal */}
      {isCreating && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl border-2 border-indigo-100 shadow-xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">Create an Event</h2>
            <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Event Name</label>
                <input type="text" required value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Photography Walk" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select value={newEvent.event_type} onChange={e => setNewEvent({ ...newEvent, event_type: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="workshop">Workshop</option>
                  <option value="fest">Fest</option>
                  <option value="competition">Competition</option>
                  <option value="party">Party</option>
                  <option value="seminar">Seminar</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date & Time</label>
                <input type="datetime-local" required value={newEvent.date_time} onChange={e => setNewEvent({ ...newEvent, date_time: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input type="text" required value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Main Auditorium" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea required rows={6} value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Tell people what this event is about..." />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition">
                Submit Event
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition group"
            >
              <div className="h-44 relative overflow-hidden">
                <img src={event.cover_image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wide ${EVENT_TYPE_STYLES[event.event_type] || 'bg-slate-100 text-slate-700'}`}>
                    {event.event_type}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{event.title}</h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">{event.description}</p>

                <div className="flex flex-col gap-2 text-sm text-slate-500 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    {new Date(event.date_time).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    {new Date(event.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-400" />
                    {event.location}
                  </div>
                </div>

                {rsvpIds.has(event.id) ? (
                  <button disabled className="w-full py-2.5 rounded-xl bg-green-50 text-green-700 border border-green-200 font-medium flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" /> You're Going!
                  </button>
                ) : (
                  <button
                    onClick={() => handleRsvp(event.id)}
                    className="w-full py-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition font-medium flex items-center justify-center gap-2"
                  >
                    <Users className="w-4 h-4" /> RSVP
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
