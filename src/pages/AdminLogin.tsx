import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Lock } from 'lucide-react';
import { motion } from 'motion/react';

const ADMIN_USER = import.meta.env.VITE_ADMIN_USER;
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS;

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simulate a small delay for UX
        setTimeout(() => {
            if (username === ADMIN_USER && password === ADMIN_PASS) {
                sessionStorage.setItem('adda_admin', 'true');
                navigate('/admin');
            } else {
                setError('Invalid credentials. Access denied.');
            }
            setLoading(false);
        }, 600);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600/20 rounded-2xl border border-red-500/30 mb-4">
                        <Shield className="w-8 h-8 text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Admin Access</h1>
                    <p className="text-slate-500 text-sm mt-1">Adda Control Panel — Authorized Personnel Only</p>
                </div>

                {/* Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Username</label>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition placeholder:text-slate-600"
                                placeholder="Enter username"
                                autoComplete="username"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full bg-slate-800 text-white px-4 py-3 pr-12 rounded-xl border border-slate-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition placeholder:text-slate-600"
                                    placeholder="Enter password"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                                >
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl flex items-center gap-2"
                            >
                                <Lock className="w-4 h-4 shrink-0" />
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white py-3 rounded-xl font-bold transition shadow-lg shadow-red-900/30 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Shield className="w-4 h-4" />
                                    Enter Admin Panel
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-slate-700 text-xs mt-6">
                    Not an admin? <a href="/" className="text-slate-500 hover:text-slate-400 underline">Go back to Adda</a>
                </p>
            </motion.div>
        </div>
    );
}
