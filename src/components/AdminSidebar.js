import React from 'react';

const TABS = [
    { key: 'add', label: 'Add Template' },
    { key: 'templates', label: 'Templates' },
    { key: 'ourwork', label: 'Our Work' },
    { key: 'bookings', label: 'Bookings' },
    { key: 'testimonials', label: 'Testimonials' }
];

export default function AdminSidebar({ activeTab, onTabChange }) {
    return (
        <aside className="w-48 shrink-0">
            <nav className="space-y-1">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => onTabChange(tab.key)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium ${
                            activeTab === tab.key
                                ? 'bg-slate-800 text-white'
                                : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </aside>
    );
}