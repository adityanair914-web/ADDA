import { useEffect, useState } from 'react';
import { User as UserIcon, Mail, MapPin, Calendar, Edit2 } from 'lucide-react';
import { api, User } from '../lib/api';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    api.getMe().then(setUser).catch(() => { });
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-pink-500 to-purple-600"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-md">
              <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden">
                {user.profile_pic_url ? (
                  <img src={user.profile_pic_url} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-10 h-10 text-slate-400" />
                )}
              </div>
            </div>
            <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-medium hover:bg-slate-50 transition flex items-center shadow-sm">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
            <p className="text-slate-500 mb-4">@{user.instagram_handle || 'username'}</p>

            <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-6">
              <span className="flex items-center"><BriefcaseIcon className="w-4 h-4 mr-1" /> {user.department} • {user.year} Year</span>
              <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {user.hostel}</span>
            </div>

            <p className="text-slate-700 mb-6 max-w-2xl">{user.bio}</p>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-slate-900 mb-3">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest, i) => (
                    <span key={i} className="bg-pink-50 text-pink-700 px-3 py-1 rounded-full text-sm font-medium border border-pink-100">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats Placeholder */}
              <div>
                <h3 className="font-bold text-slate-900 mb-3">Activity</h3>
                <div className="flex gap-4">
                  <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100 flex-1">
                    <div className="text-xl font-bold text-slate-900">12</div>
                    <div className="text-xs text-slate-500 uppercase">Events</div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100 flex-1">
                    <div className="text-xl font-bold text-slate-900">5</div>
                    <div className="text-xs text-slate-500 uppercase">Clubs</div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100 flex-1">
                    <div className="text-xl font-bold text-slate-900">8</div>
                    <div className="text-xs text-slate-500 uppercase">Gigs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
