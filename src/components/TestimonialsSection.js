import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function TestimonialsSection() {
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        let isMounted = true;
        api.get('/testimonials') // Fetches only approved testimonials
            .then(res => {
                if (isMounted) {
                    setTestimonials(res.data.slice(0, 6)); // Show max 6 on home page
                }
            })
            .catch(err => console.error("Failed to load testimonials", err));
            
        return () => { isMounted = false; };
    }, []);

    if (testimonials.length === 0) return null; // Don't show if empty

    return (
        <section className="py-16 px-4 max-w-6xl mx-auto text-white">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
                <p className="text-slate-300">Read reviews from professionals who secured their dream jobs with our CVs.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
                {testimonials.map(t => (
                    <div key={t._id} className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white text-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between text-left">
                        <div>
                            <div className="flex text-amber-400 mb-4 text-sm">
                                {Array.from({ length: t.rating }).map((_, i) => <span key={i}>★</span>)}
                                {Array.from({ length: 5 - t.rating }).map((_, i) => <span key={i} className="text-slate-200">★</span>)}
                            </div>
                            <p className="text-slate-600 italic mb-6">"{t.quote}"</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">
                                {(t.user?.name || 'A')[0].toUpperCase()}
                            </div>
                            <div>
                                <p className="font-semibold text-sm">{t.user?.name || 'Anonymous'}</p>
                                <p className="text-xs text-slate-500">Verified Customer</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
