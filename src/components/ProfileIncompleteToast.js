import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const DISMISS_KEY = 'profile_toast_dismissed';

export default function ProfileIncompleteToast() {
    const { user, profileComplete } = useContext(AuthContext);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Show only when: logged in, profile not complete, not dismissed this session
        if (user && !profileComplete) {
            const dismissed = sessionStorage.getItem(DISMISS_KEY);
            setVisible(!dismissed);
        } else {
            setVisible(false);
        }
    }, [user, profileComplete]);

    function dismiss() {
        sessionStorage.setItem(DISMISS_KEY, '1');
        setVisible(false);
    }

    if (!visible) return null;

    return (
        <div
            role="alert"
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50
                       flex items-center gap-3 bg-amber-50 border border-amber-300
                       text-amber-800 text-sm px-5 py-3 rounded-xl shadow-lg
                       max-w-sm w-[calc(100%-2rem)] animate-fade-in"
        >
            {/* Amber dot */}
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 flex-shrink-0" aria-hidden="true" />

            <span className="flex-1">
                Your profile isn't complete yet.{' '}
                <Link
                    to="/profile"
                    onClick={dismiss}
                    className="font-semibold underline underline-offset-2 hover:text-amber-900"
                >
                    Complete it →
                </Link>
            </span>

            <button
                onClick={dismiss}
                aria-label="Dismiss"
                className="text-amber-500 hover:text-amber-700 text-lg leading-none ml-1"
            >
                ×
            </button>
        </div>
    );
}
