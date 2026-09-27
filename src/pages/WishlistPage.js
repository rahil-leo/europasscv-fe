import React, { useContext, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext';
import api from '../api/api';

function getCloudinaryThumb(url, width = 400) {
    if (!url || !url.includes('/upload/')) return url;
    return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
}

export default function WishlistPage() {
    const { user, loading } = useContext(AuthContext);
    const { toggle } = useContext(WishlistContext);
    const [templates, setTemplates] = useState([]);
    const [fetching, setFetching] = useState(true);

    // Fetch full populated template objects directly from backend
    useEffect(() => {
        if (!user) return;
        api.get('/wishlist')
            .then(res => setTemplates(res.data.wishlist))
            .catch(() => setTemplates([]))
            .finally(() => setFetching(false));
    }, [user]);

    // When user removes from wishlist, remove from local state too (instant UI)
    async function handleRemove(templateId) {
        await toggle(templateId);
        setTemplates(prev => prev.filter(t => t._id !== templateId));
    }

    if (loading) return null;
    if (!user) return <Navigate to="/login" replace />;

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">My Wishlist</h1>
                    <p className="text-slate-500 text-sm mt-1">Templates you saved for later</p>
                </div>
                {templates.length > 0 && (
                    <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        {templates.length} saved
                    </span>
                )}
            </div>

            {fetching ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                            <div className="w-full h-64 bg-slate-200" />
                            <div className="p-4 space-y-2">
                                <div className="h-4 bg-slate-200 rounded w-3/4" />
                                <div className="h-3 bg-slate-100 rounded w-1/4" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : templates.length === 0 ? (
                <div className="text-center py-24 border-2 border-dashed border-slate-200 rounded-2xl">
                    <div className="text-5xl mb-4">🤍</div>
                    <h2 className="text-lg font-semibold text-slate-700 mb-2">No saved templates yet</h2>
                    <p className="text-slate-500 text-sm mb-6">
                        Browse templates and click the ❤️ heart icon to save them here.
                    </p>
                    <Link
                        to="/templates"
                        className="inline-block bg-slate-800 text-white px-6 py-2.5 rounded-lg text-sm hover:bg-slate-700 transition"
                    >
                        Browse Templates
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map(t => (
                        <div key={t._id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden relative">
                            {/* Remove (heart) button */}
                            <button
                                onClick={() => handleRemove(t._id)}
                                title="Remove from wishlist"
                                className="absolute top-3 right-3 z-10 w-9 h-9 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition hover:scale-110"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>

                            <Link to={`/templates/${t._id}`}>
                                <img
                                    src={getCloudinaryThumb(t.imageUrl)}
                                    alt={t.name}
                                    className="w-full h-64 object-contain bg-slate-100"
                                    loading="lazy"
                                />
                                <div className="p-4">
                                    <h3 className="font-semibold text-slate-800">{t.name}</h3>
                                    <p className="text-slate-700 font-medium mt-1">₹{t.price}</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {(t.qualities || []).slice(0, 3).map((q, i) => (
                                            <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{q}</span>
                                        ))}
                                    </div>
                                </div>
                            </Link>

                            <div className="px-4 pb-4">
                                <Link
                                    to={`/templates/${t._id}`}
                                    className="block w-full text-center bg-slate-800 text-white text-sm py-2 rounded-lg hover:bg-slate-700 transition"
                                >
                                    View &amp; Book
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
