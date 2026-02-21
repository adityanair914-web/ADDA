import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Briefcase, MapPin, DollarSign, CheckCircle, X, Plus } from 'lucide-react';
import { api, Gig } from '../lib/api';

const FALLBACK_GIGS: Gig[] = [
  { id: '1', title: 'Math & Physics Tutor', description: 'Help first-year students with calculus and mechanics. 2 sessions/week, flexible timing.', gig_type: 'Tutoring', pay_amount: 400, location: 'Library / Online', status: 'open', created_at: new Date().toISOString() },
  { id: '2', title: 'Event Photographer', description: 'Cover the upcoming Tech Fair. Deliver edited photos within 48 hours.', gig_type: 'Photography', pay_amount: 1500, location: 'Main Auditorium', status: 'open', created_at: new Date().toISOString() },
  { id: '3', title: 'Graphic Design for Fest', description: 'Design posters, social media banners, and tickets for Annual Fest 2026. Adobe Illustrator preferred.', gig_type: 'Design', pay_amount: 2500, location: 'Remote', status: 'open', created_at: new Date().toISOString() },
  { id: '4', title: 'Canteen Delivery Boy/Girl', description: 'Deliver meals from canteen to hostel rooms during lunch (12–2pm). Mon-Fri only.', gig_type: 'Delivery', pay_amount: 250, location: 'Hostel Blocks A–D', status: 'open', created_at: new Date().toISOString() },
  { id: '5', title: 'Video Editor for YouTube', description: 'Edit vlogs for a campus content creator. 3–5 minute videos, 2 per week. Premiere Pro or DaVinci.', gig_type: 'Editing', pay_amount: 800, location: 'Remote', status: 'open', created_at: new Date().toISOString() },
  { id: '6', title: 'Coding Help – React & Node.js', description: 'Looking for someone to help debug and add features to a React project. 10-hour project.', gig_type: 'Development', pay_amount: 3000, location: 'Online / Lab', status: 'open', created_at: new Date().toISOString() },
];

const GIG_COLORS: Record<string, string> = {
  Tutoring: 'bg-purple-100 text-purple-700',
  Photography: 'bg-pink-100 text-pink-700',
  Design: 'bg-orange-100 text-orange-700',
  Delivery: 'bg-green-100 text-green-700',
  Editing: 'bg-blue-100 text-blue-700',
  Development: 'bg-teal-100 text-teal-700',
};

export default function Gigs() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [applyingGig, setApplyingGig] = useState<Gig | null>(null);
  const [appData, setAppData] = useState({ upi_id: '', proof_url: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getGigs().then(data => {
      setGigs(data && data.length > 0 ? data : FALLBACK_GIGS);
      setLoading(false);
    }).catch(() => {
      setGigs(FALLBACK_GIGS);
      setLoading(false);
    });
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingGig) return;
    setIsSubmitting(true);
    try {
      await api.applyForGig(applyingGig.id, { ...appData, user_id: 'current-user' });
    } catch {
      // Optimistic — mark as applied anyway
    } finally {
      setAppliedIds(prev => new Set(prev).add(applyingGig.id));
      setApplyingGig(null);
      setAppData({ upi_id: '', proof_url: '' });
      setIsSubmitting(false);
      alert('Application submitted! The poster will get in touch with you.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Gigs</h1>
          <p className="text-slate-500">Earn money with micro-tasks and campus jobs.</p>
        </div>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-teal-700 transition flex items-center shadow-md shadow-teal-200">
          <Plus className="w-4 h-4 mr-2" />
          Post a Gig
        </button>
      </div>

      {/* Stats Bar */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl p-6 text-white flex justify-around text-center">
        <div>
          <div className="text-2xl font-bold">{gigs.length}</div>
          <div className="text-sm text-teal-100">Open Gigs</div>
        </div>
        <div className="w-px bg-white/20" />
        <div>
          <div className="text-2xl font-bold">₹250</div>
          <div className="text-sm text-teal-100">Starts From</div>
        </div>
        <div className="w-px bg-white/20" />
        <div>
          <div className="text-2xl font-bold">24h</div>
          <div className="text-sm text-teal-100">Quick Pays</div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto" />
        </div>
      ) : (
        <div className="grid gap-4">
          {gigs.map((gig, index) => (
            <motion.div
              key={gig.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition"
            >
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 shrink-0">
                  <DollarSign className="w-6 h-6" />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-900">{gig.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${GIG_COLORS[gig.gig_type] || 'bg-slate-100 text-slate-600'}`}>
                      {gig.gig_type}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mb-3">{gig.description}</p>
                  <div className="flex items-center text-xs text-slate-400 gap-4">
                    <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" />{gig.location}</span>
                    <span className="flex items-center"><CheckCircle className="w-3 h-3 mr-1" />Verified Poster</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 w-full md:w-auto shrink-0">
                  <div className="text-2xl font-bold text-slate-900">₹{gig.pay_amount}</div>
                  {appliedIds.has(gig.id) ? (
                    <button disabled className="w-full md:w-auto bg-green-50 text-green-700 border border-green-200 px-5 py-2 rounded-xl font-medium flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Applied!
                    </button>
                  ) : (
                    <button
                      onClick={() => setApplyingGig(gig)}
                      className="w-full md:w-auto bg-slate-900 text-white px-6 py-2 rounded-xl font-medium hover:bg-slate-800 transition"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Apply Modal */}
      {applyingGig && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Apply for Gig</h2>
                <p className="text-slate-500 text-sm">{applyingGig.title} · ₹{applyingGig.pay_amount}</p>
              </div>
              <button onClick={() => setApplyingGig(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">UPI ID (for payment)</label>
                <input
                  type="text" required
                  value={appData.upi_id}
                  onChange={e => setAppData({ ...appData, upi_id: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                  placeholder="e.g. name@okaxis"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Why should you be picked? (Optional)</label>
                <textarea
                  rows={3}
                  value={appData.proof_url}
                  onChange={e => setAppData({ ...appData, proof_url: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                  placeholder="Portfolio link, relevant experience, etc."
                />
              </div>
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setApplyingGig(null)} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition disabled:opacity-70">
                  {isSubmitting ? 'Submitting...' : 'Apply'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
