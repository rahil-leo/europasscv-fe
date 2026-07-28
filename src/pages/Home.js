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
                className="relative text-white text-center py-24 px-6 bg-cover bg-center"
                style={{ backgroundImage: "linear-gradient(rgba(15,23,42,0.75), rgba(15,23,42,0.75)), url('/images/hero-bg.jpg')" }}
            >
                <h1 className="text-4xl font-bold mb-4">Find the CV Template That Fits You</h1>
                <p className="text-slate-300 mb-6">Simple, professional resume templates — pick one and book it.</p>
                <a href="#templates" className="bg-white text-slate-800 px-6 py-3 rounded-lg font-medium hover:bg-slate-100">
                    Browse Templates
                </a>
            </section>

            <section id="templates" className="max-w-6xl mx-auto px-6 py-12">
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
            </section>
        </div>
    );
}
