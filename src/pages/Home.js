import React, { useEffect, useState, useMemo } from 'react';
import api from '../api/api';
import TemplateCard from '../components/TemplateCard';
import Testimonials from '../components/Testimonials';

export default function Home() {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        api.get('/templates')
            .then((res) => setTemplates(res.data))
            .catch(() => {}) // silently handle — show empty state
            .finally(() => setLoading(false));
    }, []);

    // Dynamically compute all unique tags/qualities from loaded templates
    const allTags = useMemo(() => {
        const tagsSet = new Set();
        templates.forEach((t) => {
            if (t.qualities && Array.isArray(t.qualities)) {
                t.qualities.forEach((q) => tagsSet.add(q));
            }
        });
        return Array.from(tagsSet).sort();
    }, [templates]);

    // Live search and multi-tag filtering (templates must match query AND have ALL selected tags)
    const filteredTemplates = useMemo(() => {
        return templates.filter((t) => {
            const nameMatch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
            const tagsMatch = selectedTags.every((tag) => t.qualities && t.qualities.includes(tag));
            return nameMatch && tagsMatch;
        });
    }, [templates, searchQuery, selectedTags]);

    function toggleTag(tag) {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    }

    function clearFilters() {
        setSearchQuery('');
        setSelectedTags([]);
    }

    const isFiltered = searchQuery !== '' || selectedTags.length > 0;

    return (
        <div>
            <section
                className="relative text-white text-center py-20 px-6 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
            >
                <div className="absolute inset-0 bg-slate-900/60"></div>
                <div className="relative">
                    <h1 className="text-4xl font-bold mb-4">Find the CV Template That Fits You</h1>
                    <p className="text-slate-200 mb-6">Simple, professional resume templates — pick one and book it.</p>
                    <a href="#templates" className="bg-white text-slate-800 px-6 py-3 rounded-lg font-medium hover:bg-slate-100">
                        Browse Templates
                    </a>
                </div>
            </section>

            <section
                id="templates"
                className="bg-cover bg-center bg-fixed"
                style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.55), rgba(255,255,255,0.55)), url('/images/template1.jpg')" }}
            >
                <div className="max-w-6xl mx-auto px-6 py-12">
                    {/* Header + Search bar container */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <h2 className="text-2xl font-semibold text-slate-800">Templates</h2>
                        
                        {!loading && templates.length > 0 && (
                            <div className="relative w-full md:w-80">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search templates by name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition shadow-sm"
                                />
                            </div>
                        )}
                    </div>

                    {/* Tag chips row */}
                    {!loading && templates.length > 0 && allTags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mb-8 bg-white/50 p-3 rounded-xl border border-slate-100">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">Filter Tags:</span>
                            {allTags.map((tag) => {
                                const isActive = selectedTags.includes(tag);
                                return (
                                    <button
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                                            isActive
                                                ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-900'
                                                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                                        }`}
                                    >
                                        {tag}
                                    </button>
                                );
                            })}
                            
                            {isFiltered && (
                                <button
                                    onClick={clearFilters}
                                    className="text-xs font-semibold text-red-500 hover:text-red-700 transition ml-2 hover:underline"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    )}

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                                    <div className="w-full h-80 bg-slate-200" />
                                    <div className="p-4 space-y-2">
                                        <div className="h-4 bg-slate-200 rounded w-3/4" />
                                        <div className="flex gap-2">
                                            <div className="h-3 bg-slate-100 rounded-full w-16" />
                                            <div className="h-3 bg-slate-100 rounded-full w-12" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : templates.length === 0 ? (
                        <p className="text-slate-500">No templates added yet.</p>
                    ) : filteredTemplates.length === 0 ? (
                        <div className="text-center py-16 bg-white/40 rounded-2xl border border-slate-100">
                            <p className="text-slate-500 font-medium mb-2">No templates match your search.</p>
                            <button
                                onClick={clearFilters}
                                className="text-sm text-slate-700 font-semibold hover:underline"
                            >
                                Reset search & filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTemplates.map((t) => (
                                <TemplateCard key={t._id} template={t} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
            <Testimonials />
        </div>
    );
}