import React from 'react';

const TABS = [
    { key: 'add', label: 'Add Template' },
    { key: 'templates', label: 'Templates' },
    { key: 'ourwork', label: 'Our Work' },
    { key: 'bookings', label: 'Bookings' },
    { key: 'testimonials', label: 'Testimonials' },
    { key: 'settings', label: 'Settings' }
];

export default function AdminSidebar({ activeTab, onTabChange }) {
    return (
        <aside className="w-full md:w-56 shrink-0">
            <nav className="flex overflow-x-auto md:flex-col gap-2 pb-2 md:pb-0 scrollbar-hide">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => onTabChange(tab.key)}
                        className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeTab === tab.key
                                ? 'bg-slate-800 text-white'
                                : 'text-slate-600 bg-slate-50 hover:bg-slate-100 md:bg-transparent'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </aside>
    );
}