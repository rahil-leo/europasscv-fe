import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-slate-800 text-slate-300">
            <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">

                <div>
                    <p className="text-white text-lg font-semibold mb-2">Europass.cv</p>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Simple, professional CV templates designed to help you stand out.
                        Pick a template, book it, and we'll take care of the rest.
                    </p>
                </div>

                <div>
                    <p className="text-white font-semibold mb-3">Quick Links</p>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-white">Home</Link></li>
                        <li><a href="#templates" className="hover:text-white">Browse Templates</a></li>
                        <li><Link to="/login" className="hover:text-white">Login / Sign up</Link></li>
                    </ul>
                </div>

                <div>
                    <p className="text-white font-semibold mb-3">Get in Touch</p>
                    <p className="text-sm text-slate-400 mb-3">
                        Follow us for template previews, tips, and updates.
                    </p>
                    <a
                        href="https://www.instagram.com/europass_ats?igsh=ZTRpdjVxYm4xMmt2"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.163 6.163 0 100 12.326 6.163 6.163 0 000-12.326zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                        </svg>
                        @europass_ats
                    </a>
                </div>

            </div>

            <div className="border-t border-slate-700">
                <p className="max-w-6xl mx-auto px-6 py-4 text-xs text-slate-500 text-center">
                    © {new Date().getFullYear()} Europass.cv. All rights reserved.
                </p>
            </div>
        </footer>
    );
}