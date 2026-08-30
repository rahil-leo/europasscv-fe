import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { MAINTENANCE_MODE, MAINTENANCE_MESSAGE } from '../config/maintenance';
import { AuthContext } from '../context/AuthContext';

export default function MaintenanceBanner() {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    if (!MAINTENANCE_MODE) return null;
    if (user?.role === 'admin') return null; // admins bypass maintenance mode
    if (location.pathname === '/login') return null; // always allow reaching the login page

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6 bg-slate-900/70 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-10 text-center shadow-2xl border border-slate-100 animate-[fadeIn_0.3s_ease-out]">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-5 sm:mb-6">
                    <span className="absolute inset-0 rounded-full bg-amber-400/30 animate-ping"></span>
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-100 flex items-center justify-center text-2xl sm:text-3xl">
                        🛠️
                    </div>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">We'll be right back</h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                    {MAINTENANCE_MESSAGE}
                </p>
                <div className="mt-5 sm:mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    Working on it now
                </div>
            </div>
        </div>
    );
}