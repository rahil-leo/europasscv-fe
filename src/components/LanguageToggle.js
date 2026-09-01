import React from 'react';

export default function LanguageToggle({ language, onToggle }) {
    return (
        <button
            onClick={onToggle}
            className="text-xs font-medium text-slate-500 border border-slate-300 rounded-full px-3 py-1 hover:bg-slate-100 transition"
        >
            {language === 'en' ? 'മലയാളത്തിൽ കാണുക' : 'View in English'}
        </button>
    );
}