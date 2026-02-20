import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Briefcase, MapPin, DollarSign, CheckCircle } from 'lucide-react';
import { api, Gig } from '../lib/api';

export default function Gigs() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [applyingGig, setApplyingGig] = useState<Gig | null>(null);
  const [appData, setAppData] = useState({
    upi_id: '',
    proof_url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api.getGigs().then(setGigs);
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingGig) return;
    setIsSubmitting(true);
    try {
      await api.applyForGig(applyingGig.id, { ...appData, user_id: 'mock-user-id' });
      alert('Application submitted! Admin will verify soon.');
      setApplyingGig(null);
      setAppData({ upi_id: '', proof_url: '' });
    } catch (error) {
      console.error(error);
      alert('Failed to apply');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Gigs</h1>
          <p className="text-slate-500">Earn money with micro-tasks and part-time jobs.</p>
        </div>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-teal-700 transition flex items-center shadow-md shadow-teal-200">
          <Briefcase className="w-4 h-4 mr-2" />
          Post a Gig
        </button>
      </div>

      <div className="grid gap-4">
        {gigs.map((gig) => (
          <motion.div
            key={gig.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition flex flex-col md:flex-row gap-6 items-start md:items-center"
          >
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-slate-900">{gig.title}</h3>
                <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full uppercase tracking-wide font-medium">{gig.gig_type}</span>
              </div>
              <p className="text-slate-500 text-sm mb-3">{gig.description}</p>
              <div className="flex items-center text-xs text-slate-400 gap-4">
                <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {gig.location}</span>
                <span className="flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Verified Poster</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 w-full md:w-auto">
              <span className="text-2xl font-bold text-slate-900">{gig.pay_amount}</span>
              <button
                onClick={() => setApplyingGig(gig)}
                className="w-full md:w-auto bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 transition"
              >
                Apply Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {applyingGig && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Apply for Gig</h2>
            <p className="text-slate-500 mb-6">Completing: <span className="text-teal-600 font-bold">{applyingGig.title}</span></p>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">UPI ID (for payment)</label>
                <input
                  type="text" required
                  value={appData.upi_id}
                  onChange={e => setAppData({ ...appData, upi_id: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                  placeholder="e.g. name@upi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Proof of Work (Link/Screenshot URL)</label>
                <input
                  type="url" required
                  value={appData.proof_url}
                  onChange={e => setAppData({ ...appData, proof_url: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                  placeholder="Link to your work or screenshot"
                />
              </div>
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setApplyingGig(null)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition shadow-lg shadow-teal-100 disabled:opacity-70"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Work'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
