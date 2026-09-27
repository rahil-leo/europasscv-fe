import React from 'react';

export default function TrustStats() {
    return (
        <section className="bg-slate-800 text-white py-12 px-4 border-t border-slate-700">
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-700">
                <div className="px-4">
                    <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
                    <p className="text-sm text-slate-300 font-medium uppercase tracking-wide">CVs Created</p>
                </div>
                <div className="px-4">
                    <div className="text-3xl md:text-4xl font-bold mb-2">50+</div>
                    <p className="text-sm text-slate-300 font-medium uppercase tracking-wide">Premium Templates</p>
                </div>
                <div className="px-4">
                    <div className="text-3xl md:text-4xl font-bold mb-2">99%</div>
                    <p className="text-sm text-slate-300 font-medium uppercase tracking-wide">Satisfaction Rate</p>
                </div>
                <div className="px-4">
                    <div className="text-3xl md:text-4xl font-bold mb-2">24/7</div>
                    <p className="text-sm text-slate-300 font-medium uppercase tracking-wide">Customer Support</p>
                </div>
            </div>
        </section>
    );
}
