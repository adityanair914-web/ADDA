import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Send, MessageCircle, User } from 'lucide-react';
import { api, Confession } from '../lib/api';
import clsx from 'clsx';

export default function Connect() {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [activeTab, setActiveTab] = useState<'feed' | 'send' | 'inbox'>('feed');
  const [inboxConfessions, setInboxConfessions] = useState<Confession[]>([]);
  const [bouquets, setBouquets] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    recipient_name: '',
    message: '',
    vibe_type: 'crush',
    is_anonymous: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadConfessions();
    loadInbox();
  }, []);

  const loadConfessions = () => {
    api.getConfessions().then(setConfessions).catch(() => { });
  };

  const loadInbox = async () => {
    api.getBouquets().then(setBouquets).catch(() => { });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.postConfession(formData);
      alert('Confession sent for approval!');
      setFormData({ recipient_name: '', message: '', vibe_type: 'crush', is_anonymous: true });
      setActiveTab('feed');
    } catch (error) {
      console.error(error);
      alert('Failed to send confession');
    } finally {
      setIsSubmitting(false);
    }
  };

  const vibeColors: Record<string, string> = {
    crush: 'bg-pink-100 text-pink-700 border-pink-200',
    funny: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    appreciation: 'bg-blue-100 text-blue-700 border-blue-200',
    miss_you: 'bg-purple-100 text-purple-700 border-purple-200',
    bouquet_rose: 'bg-red-100 text-red-700 border-red-200',
    bouquet_sunflower: 'bg-orange-100 text-orange-700 border-orange-200',
    bouquet_tulip: 'bg-teal-100 text-teal-700 border-teal-200',
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Connect</h1>
          <p className="text-slate-500">Confessions, bouquets, and finding your match.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => setActiveTab('feed')}
            className={clsx(
              'px-4 py-2 rounded-xl font-medium transition whitespace-nowrap',
              activeTab === 'feed' ? 'bg-pink-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            )}
          >
            Feed
          </button>
          <button
            onClick={() => setActiveTab('inbox')}
            className={clsx(
              'px-4 py-2 rounded-xl font-medium transition whitespace-nowrap',
              activeTab === 'inbox' ? 'bg-indigo-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            )}
          >
            Your Inbox
          </button>
          <button
            onClick={() => setActiveTab('send')}
            className={clsx(
              'px-4 py-2 rounded-xl font-medium transition whitespace-nowrap flex items-center shadow-md shadow-pink-100',
              activeTab === 'send' ? 'bg-pink-600 text-white' : 'bg-pink-500 text-white hover:bg-pink-600'
            )}
          >
            <Send className="w-4 h-4 mr-2" />
            New Confession
          </button>
        </div>
      </div>

      {activeTab === 'feed' ? (
        <div className="space-y-6">
          {confessions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed">
              <Heart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No confessions yet. Be the first!</p>
            </div>
          ) : (
            confessions.map((confession) => (
              <motion.div
                key={confession.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                      {confession.is_anonymous ? (
                        <User className="w-5 h-5 text-slate-400" />
                      ) : (
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${confession.sender_id}`} alt="Avatar" className="w-10 h-10 rounded-full" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">
                        {confession.is_anonymous ? 'Anonymous' : 'Someone'}
                        <span className="font-normal text-slate-500 mx-1">confessed to</span>
                        <span className="text-pink-600">{confession.recipient_name}</span>
                      </p>
                      <p className="text-xs text-slate-400">{new Date(confession.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={clsx('px-3 py-1 rounded-full text-xs font-medium border', vibeColors[confession.vibe_type] || 'bg-slate-100 text-slate-600')}>
                    {confession.vibe_type.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-lg text-slate-800 mb-4 leading-relaxed font-medium">
                  "{confession.message}"
                </p>

                <div className="flex items-center text-slate-500 text-sm border-t border-slate-100 pt-4">
                  <button className="flex items-center hover:text-pink-500 transition mr-6">
                    <Heart className="w-4 h-4 mr-1" />
                    {confession.likes_count} Likes
                  </button>
                  <button className="flex items-center hover:text-indigo-500 transition">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Comment
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      ) : activeTab === 'inbox' ? (
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-pink-500" />
              Received Bouquets
            </h2>
            {bouquets.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed">
                <p className="text-slate-500">You haven't received any bouquets yet. Check back later!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bouquets.map(bouquet => (
                  <motion.div
                    key={bouquet.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-pink-500"
                  >
                    <div className="text-3xl mb-2">
                      {bouquet.message.includes('🌹') ? '🌹' : bouquet.message.includes('🌻') ? '🌻' : '🌷'}
                    </div>
                    <p className="font-medium text-slate-800 mb-2">"{bouquet.message}"</p>
                    <p className="text-xs text-slate-400">{new Date(bouquet.created_at).toLocaleDateString()}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-indigo-500" />
              Received Confessions
            </h2>
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed">
              <p className="text-slate-500">Your matches and specific confessions will appear here.</p>
            </div>
          </section>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100"
        >
          <h2 className="text-2xl font-bold mb-6 text-slate-900">Send a Confession</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">To (Name or Instagram)</label>
              <input
                type="text"
                required
                value={formData.recipient_name}
                onChange={e => setFormData({ ...formData, recipient_name: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                placeholder="@username or Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <div className="flex gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, vibe_type: 'crush' })} // Reset to default vibe if switching back
                  className={clsx(
                    'flex-1 py-3 rounded-xl border font-medium transition flex items-center justify-center',
                    !formData.vibe_type.startsWith('bouquet')
                      ? 'bg-pink-50 border-pink-500 text-pink-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  )}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Confession
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, vibe_type: 'bouquet_rose' })}
                  className={clsx(
                    'flex-1 py-3 rounded-xl border font-medium transition flex items-center justify-center',
                    formData.vibe_type.startsWith('bouquet')
                      ? 'bg-pink-50 border-pink-500 text-pink-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  )}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Bouquet
                </button>
              </div>
            </div>

            {!formData.vibe_type.startsWith('bouquet') ? (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Vibe</label>
                <div className="flex flex-wrap gap-2">
                  {['crush', 'funny', 'appreciation', 'miss_you'].map(vibe => (
                    <button
                      key={vibe}
                      type="button"
                      onClick={() => setFormData({ ...formData, vibe_type: vibe })}
                      className={clsx(
                        'px-4 py-2 rounded-lg text-sm font-medium border transition',
                        formData.vibe_type === vibe
                          ? 'bg-pink-50 border-pink-500 text-pink-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      )}
                    >
                      {vibe.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Choose Bouquet</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'bouquet_rose', label: '🌹 Roses', desc: 'Classic Romance' },
                    { id: 'bouquet_sunflower', label: '🌻 Sunflowers', desc: 'Bright & Cheerful' },
                    { id: 'bouquet_tulip', label: '🌷 Tulips', desc: 'Elegant & Sweet' },
                  ].map(bouquet => (
                    <button
                      key={bouquet.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, vibe_type: bouquet.id })}
                      className={clsx(
                        'p-3 rounded-xl border text-left transition',
                        formData.vibe_type === bouquet.id
                          ? 'bg-pink-50 border-pink-500 ring-1 ring-pink-500'
                          : 'bg-white border-slate-200 hover:border-pink-300'
                      )}
                    >
                      <div className="text-lg mb-1">{bouquet.label.split(' ')[0]}</div>
                      <div className="text-sm font-medium text-slate-900">{bouquet.label.split(' ')[1]}</div>
                      <div className="text-xs text-slate-500">{bouquet.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                placeholder="Write your heart out..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="anonymous"
                checked={formData.is_anonymous}
                onChange={e => setFormData({ ...formData, is_anonymous: e.target.checked })}
                className="w-4 h-4 text-pink-600 rounded border-slate-300 focus:ring-pink-500"
              />
              <label htmlFor="anonymous" className="ml-2 text-sm text-slate-700">Send Anonymously</label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-pink-500 text-white py-3 rounded-xl font-bold hover:bg-pink-600 transition shadow-lg shadow-pink-200 disabled:opacity-70"
            >
              {isSubmitting ? 'Sending...' : 'Send Confession'}
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
}
