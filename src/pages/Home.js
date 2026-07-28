import React, { useEffect, useState } from 'react';
import api from '../api/api';
import TemplateCard from '../components/TemplateCard';

export default function Home() {
    const [templates, setTemplates] = useState([]);

    useEffect(() => {
        api.get('/templates').then((res) => setTemplates(res.data));
    }, []);

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
                    <h2 className="text-2xl font-semibold text-slate-800 mb-6">Templates</h2>
                    {templates.length === 0 ? (
                        <p className="text-slate-500">No templates added yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {templates.map((t) => (
                                <TemplateCard key={t._id} template={t} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}