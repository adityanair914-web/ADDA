import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { api, Event } from '../lib/api';

export default function Hangouts() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    event_type: 'party',
    date_time: '',
    location: '',
    cover_image_url: 'https://picsum.photos/seed/event/800/400',
    club_id: ''
  });

  useEffect(() => {
    api.getEvents().then(setEvents).catch(() => { });
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Mock organizer_id for now
      await api.createEvent({ ...newEvent, organizer_id: 'mock-user-id' });
      alert('Event hosted successfully!');
      setIsCreating(false);
      api.getEvents().then(setEvents);
    } catch (error) {
      console.error(error);
      alert('Failed to host event');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Hangouts</h1>
          <p className="text-slate-500">Discover events, parties, and meetups happening around you.</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-orange-600 transition flex items-center shadow-md shadow-orange-200"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Host Event
        </button>
      </div>

      {isCreating && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl border-2 border-orange-100 shadow-xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">Host an Event</h2>
            <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600">
              Cancel
            </button>
          </div>
          <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Event Title</label>
                <input
                  type="text" required
                  value={newEvent.title}
                  onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="e.g. Freshers Party 2026"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date & Time</label>
                  <input
                    type="datetime-local" required
                    value={newEvent.date_time}
                    onChange={e => setNewEvent({ ...newEvent, date_time: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select
                    value={newEvent.event_type}
                    onChange={e => setNewEvent({ ...newEvent, event_type: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none"
                  >
                    <option value="party">Party</option>
                    <option value="study">Study Session</option>
                    <option value="sports">Sports</option>
                    <option value="trip">Trip/Trek</option>
                    <option value="movie">Movie</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input
                  type="text" required
                  value={newEvent.location}
                  onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="e.g. Main Auditorium or Cafe Lounge"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  required rows={5}
                  value={newEvent.description}
                  onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Tell everyone what's happening..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-100"
              >
                Create Event
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Featured Event (First one) */}
        {events.length > 0 && (
          <div className="lg:col-span-3 relative rounded-3xl overflow-hidden shadow-xl group cursor-pointer h-96">
            <img src={events[0].cover_image_url} alt={events[0].title} className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 flex flex-col justify-end">
              <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4 uppercase tracking-wide">Featured</span>
              <h2 className="text-4xl font-bold text-white mb-2">{events[0].title}</h2>
              <div className="flex flex-wrap gap-4 text-white/80 text-sm mb-4">
                <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {new Date(events[0].date_time).toLocaleDateString()}</span>
                <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {new Date(events[0].date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {events[0].location}</span>
              </div>
              <p className="text-white/90 max-w-2xl line-clamp-2">{events[0].description}</p>
            </div>
          </div>
        )}

        {/* Other Events */}
        {events.slice(1).map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition group cursor-pointer flex flex-col"
          >
            <div className="h-48 relative overflow-hidden">
              <img src={event.cover_image_url} alt={event.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-center shadow-sm">
                <span className="block text-xs font-bold text-slate-500 uppercase">{new Date(event.date_time).toLocaleString('default', { month: 'short' })}</span>
                <span className="block text-xl font-bold text-slate-900">{new Date(event.date_time).getDate()}</span>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="mb-4">
                <span className="text-xs font-medium text-orange-500 uppercase tracking-wide mb-1 block">{event.event_type}</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition">{event.title}</h3>
                <p className="text-slate-500 text-sm line-clamp-2">{event.description}</p>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
                <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {event.location}</span>
                <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {new Date(event.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
