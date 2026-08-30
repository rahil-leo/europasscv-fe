import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-20">
            <p className="text-6xl font-bold text-slate-300 mb-4">404</p>
            <h1 className="text-2xl font-semibold text-slate-800 mb-2">Page not found</h1>
            <p className="text-slate-500 mb-8">
                The page you're looking for doesn't exist or may have moved.
            </p>
            <Link
                to="/"
                className="bg-slate-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-700 transition"
            >
                Go back home
            </Link>
        </div>
    );
}