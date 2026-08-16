import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/testimonials?limit=3')
            .then((res) => setTestimonials(res.data))
            .catch((err) => console.error('Failed to load testimonials', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading || testimonials.length === 0) return null;

    return (
        <section className="bg-slate-50 border-t border-slate-100 py-16 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-slate-800">What Our Users Say</h2>
                    <p className="text-sm text-slate-500 mt-1">Real feedback from professionals who used our templates.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {testimonials.map((t) => (
                        <div key={t._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100/60 flex flex-col justify-between">
                            <div>
                                <div className="flex text-amber-400 text-sm mb-3">
                                    {Array.from({ length: t.rating }).map((_, i) => (
                                        <span key={i}>★</span>
                                    ))}
                                    {Array.from({ length: 5 - t.rating }).map((_, i) => (
                                        <span key={i} className="text-slate-200">★</span>
                                    ))}
                                </div>
                                <p className="text-slate-600 italic text-sm mb-4">"{t.quote}"</p>
                            </div>
                            <p className="text-xs font-semibold text-slate-500 text-right">— {t.user?.name || 'Anonymous'}</p>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <Link to="/feedback" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-slate-900 transition hover:underline">
                        See all feedback <span>→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
