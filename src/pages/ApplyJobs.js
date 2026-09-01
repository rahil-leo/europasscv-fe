import React, { useEffect, useState } from 'react';
import api from '../api/api';
import AccessNoticeBanner from '../components/AccessNoticeBanner';

const ACCESS_PASSWORD = 'eurocvstudio@2830'; // change this to whatever you want to share with clients

export default function ApplyJobs() {
    const [portals, setPortals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unlocked, setUnlocked] = useState(false);
    const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [pendingUrl, setPendingUrl] = useState(null);

    useEffect(() => {
        api.get('/job-portals').then((res) => setPortals(res.data)).finally(() => setLoading(false));
        if (sessionStorage.getItem('jobPortalUnlocked') === 'true') {
            setUnlocked(true);
        }
    }, []);

    function handleApplyClick(url) {
        if (unlocked) {
            window.open(url, '_blank', 'noopener,noreferrer');
            return;
        }
        setPendingUrl(url);
        setShowPasswordPrompt(true);
        setError('');
        setPassword('');
    }

    function handleVerify(e) {
        e.preventDefault();
        if (password === ACCESS_PASSWORD) {
            setUnlocked(true);
            sessionStorage.setItem('jobPortalUnlocked', 'true');
            setShowPasswordPrompt(false);
            if (pendingUrl) window.open(pendingUrl, '_blank', 'noopener,noreferrer');
        } else {
            setError('Incorrect password. This access is for clients who booked a CV with us.');
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-2xl font-semibold text-slate-800 mb-2">Apply for Jobs</h1>
            <p className="text-slate-500 mb-8">
                A curated list of job portals to apply directly. This section is exclusively for clients who've booked a Europass CV with us — enter your access password to unlock the links.
            </p>

            {loading ? (
                <p className="text-slate-500">Loading...</p>
            ) : portals.length === 0 ? (
                <p className="text-slate-500">No job portals added yet.</p>
            ) : (
                <div className="space-y-3">
                    {portals.map((p) => (
                        <div key={p._id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center justify-between gap-4">
                            <div>
                                <p className="font-medium text-slate-800">{p.name}</p>
                                {p.country && <p className="text-xs text-slate-400">{p.country}</p>}
                                {p.description && <p className="text-sm text-slate-500 mt-1">{p.description}</p>}
                            </div>
                            <button
                                onClick={() => handleApplyClick(p.url)}
                                className="shrink-0 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700"
                            >
                                Apply
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {showPasswordPrompt && (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-6" onClick={() => setShowPasswordPrompt(false)}>
        <div className="bg-white rounded-2xl max-w-sm w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button
                onClick={() => setShowPasswordPrompt(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl leading-none"
                aria-label="Close"
            >
                ✕
            </button>
            <h3 className="font-semibold text-slate-800 mb-2 pr-6">Access Required</h3>
            <p className="text-sm text-slate-500 mb-4">
                This link is exclusively for those holding a Europass CV from EuroCVStudio. Enter the password we provided you.
            </p>
            {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
            <form onSubmit={handleVerify} className="space-y-3">
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Access password"
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-2"
                />
                <button type="submit" className="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-700">
                    Unlock
                </button>
            </form>
        </div>
    </div>
)}
        </div>
    );
}