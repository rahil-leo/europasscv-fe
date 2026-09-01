import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function AccessNoticeBanner() {
    const location = useLocation();
    const [dismissed, setDismissed] = useState(
        sessionStorage.getItem('accessNoticeDismissed') === 'true'
    );

    if (location.pathname !== '/apply-jobs') return null;
    if (dismissed) return null;

    function handleClose() {
        setDismissed(true);
        sessionStorage.setItem('accessNoticeDismissed', 'true');
    }

    return (
        <div className="sticky top-[68px] z-40 bg-amber-50 border-b border-amber-200 px-4 sm:px-6 py-3">
            <div className="max-w-6xl mx-auto flex items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-start gap-2 sm:gap-3 min-w-0">
                    <span className="text-base sm:text-lg shrink-0">🔒</span>
                    <p className="text-xs sm:text-sm text-amber-900 leading-snug">
                        <span className="font-semibold">This section is for our clients.</span>{' '}
                        <span className="hidden sm:inline">Already booked a Europass CV? Contact us for your access password. </span>
                        <span className="sm:hidden">Booked a CV with us? Contact us for your password. </span>
                        <Link to="/templates" className="underline font-medium hover:text-amber-950 whitespace-nowrap">
                            Get your CV
                        </Link>
                    </p>
                </div>
                <button
                    onClick={handleClose}
                    className="shrink-0 text-amber-700 hover:text-amber-900 text-lg leading-none mt-0.5 sm:mt-0"
                    aria-label="Close"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}