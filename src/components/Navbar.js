import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    function handleLogout() {
        logout();
        navigate('/');
        setMenuOpen(false);
    }

    function closeMenu() {
        setMenuOpen(false);
    }

    return (
        <nav className="sticky top-0 z-50 px-6 py-4 shadow-sm bg-white">
            <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
                    <img src="/images/Logo.png" alt="Logo" className="h-8 w-auto rounded" />
                    <span className="text-xl font-bold text-slate-800">Europass.cv</span>
                </Link>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-4">
                    <Link to="/" className="text-slate-600 hover:text-slate-900">Templates</Link>
                    {user?.role === 'admin' && (
                        <Link to="/admin" className="text-slate-600 hover:text-slate-900">Admin Panel</Link>
                    )}
                    {user ? (
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-500">Hi, {user.name}</span>
                            <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700">Logout</button>
                        </div>
                    ) : (
                        <Link to="/login" className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700">
                            Login / Sign up
                        </Link>
                    )}
                </div>

                {/* Mobile toggle button */}
                <button
                    onClick={() => setMenuOpen((prev) => !prev)}
                    className="md:hidden p-2 text-slate-700"
                    aria-label="Toggle menu"
                >
                    {menuOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile dropdown menu */}
            {menuOpen && (
                <div className="md:hidden mt-4 flex flex-col gap-3 pb-2">
                    <Link to="/" onClick={closeMenu} className="text-slate-600 hover:text-slate-900">Templates</Link>
                    {user?.role === 'admin' && (
                        <Link to="/admin" onClick={closeMenu} className="text-slate-600 hover:text-slate-900">Admin Panel</Link>
                    )}
                    {user ? (
                        <>
                            <span className="text-sm text-slate-500">Hi, {user.name}</span>
                            <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 text-left">Logout</button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            onClick={closeMenu}
                            className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 text-center"
                        >
                            Login / Sign up
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}