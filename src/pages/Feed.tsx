import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { api } from '../lib/api';
import { MessageCircle, Calendar, Users, Heart } from 'lucide-react';
import clsx from 'clsx';

export default function Feed() {
    const [feedItems, setFeedItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getFeed().then(items => {
            setFeedItems(items);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'confession': return <Heart className="w-5 h-5 text-pink-500" />;
            case 'club': return <Users className="w-5 h-5 text-indigo-500" />;
            case 'event': return <Calendar className="w-5 h-5 text-orange-500" />;
            default: return <MessageCircle className="w-5 h-5 text-slate-500" />;
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-display font-bold text-slate-900">Campus Feed</h1>
                <p className="text-slate-500">Everything happening at Adda right now.</p>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
                    </div>
                ) : feedItems.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                        <p className="text-slate-500">Nothing to show yet. Join some clubs or attend events!</p>
                    </div>
                ) : (
                    feedItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                                    {getIcon(item.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            {item.type}
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-slate-800 font-medium">
                                        {item.type === 'confession' ? `"${item.content}"` : item.content}
                                    </p>

                                    {item.type === 'event' && (
                                        <div className="mt-4 p-3 bg-orange-50 rounded-xl border border-orange-100 text-orange-800 text-sm">
                                            Check out this upcoming event!
                                        </div>
                                    )}

                                    {item.type === 'club' && (
                                        <div className="mt-4 p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-800 text-sm">
                                            New club just joined the platform!
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
