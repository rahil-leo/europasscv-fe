import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout, profileComplete } = useContext(AuthContext);
    const navigate  = useNavigate();
    const location  = useLocation();
    const [menuOpen,    setMenuOpen]    = useState(false);
    const [avatarOpen,  setAvatarOpen]  = useState(false);
    const [scrolled,    setScrolled]    = useState(false);
    const avatarRef = useRef(null);

    useEffect(() => {
        function handleScroll() { setScrolled(window.scrollY > 10); }
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close avatar dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (avatarRef.current && !avatarRef.current.contains(e.target)) {
                setAvatarOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    function handleLogout() {
        logout();
        navigate('/');
        setMenuOpen(false);
        setAvatarOpen(false);
    }

    function closeMenu() { setMenuOpen(false); }

    function navLinkClass(path) {
        const isActive = location.pathname === path;
        return isActive
            ? 'text-slate-900 font-semibold border-b-2 border-slate-800'
            : 'text-slate-600 hover:text-slate-900';
    }

    // Avatar circle: shows photo if set, otherwise user initials
    function AvatarCircle({ size = 'h-9 w-9' }) {
        const initials = user?.name
            ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
            : '?';
        return (
            <div className="relative inline-block">
                {user?.avatar ? (
                    <img
                        src={user.avatar}
                        alt="Profile"
                        className={`${size} rounded-full object-cover border-2 border-slate-300`}
                    />
                ) : (
                    <div className={`${size} rounded-full bg-slate-700 text-white flex items-center justify-center text-sm font-semibold border-2 border-slate-300`}>
                        {initials}
                    </div>
                )}
                {/* Amber dot when profile is incomplete */}
                {!profileComplete && (
                    <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-amber-400 border-2 border-white" title="Profile incomplete" />
                )}
            </div>
        );
    }

    return (
        <nav className={`sticky top-0 z-50 px-6 py-4 transition-all duration-300 ${
            scrolled ? 'bg-white/70 backdrop-blur-md shadow-sm' : 'bg-white shadow-sm'
        }`}>
            <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
                    <img src="/images/Logo.png" alt="Logo" className="h-8 w-auto rounded" />
                    <span className="text-xl font-bold text-slate-800">Europass.cv</span>
                </Link>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-4">
                    <Link to="/"           className={navLinkClass('/')}>Home</Link>
                    <Link to="/templates"  className={navLinkClass('/templates')}>Templates</Link>
                    <Link to="/our-work"   className={navLinkClass('/our-work')}>Our Work</Link>
                    <Link to="/apply-jobs" className={navLinkClass('/apply-jobs')}>Apply for Jobs</Link>
                    {user && (
                        <Link to="/my-bookings" className={navLinkClass('/my-bookings')}>My Bookings</Link>
                    )}
                    <Link to="/feedback" className={navLinkClass('/feedback')}>Feedback</Link>
                    {user?.role === 'admin' && (
                        <Link to="/admin" className={navLinkClass('/admin')}>Admin Panel</Link>
                    )}

                    {user ? (
                        /* ── Avatar dropdown ── */
                        <div className="relative" ref={avatarRef}>
                            <button
                                onClick={() => setAvatarOpen((prev) => !prev)}
                                className="flex items-center gap-2 focus:outline-none"
                                aria-label="Account menu"
                            >
                                <AvatarCircle />
                                <span className="text-sm text-slate-600 max-w-[110px] truncate">{user.name}</span>
                            </button>

                            {avatarOpen && (
                                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                                    <Link
                                        to="/profile"
                                        onClick={() => setAvatarOpen(false)}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                    >
                                        <span>👤</span> My Profile
                                        {!profileComplete && (
                                            <span className="ml-auto h-2 w-2 rounded-full bg-amber-400" />
                                        )}
                                    </Link>
                                    <Link
                                        to="/my-bookings"
                                        onClick={() => setAvatarOpen(false)}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                    >
                                        <span>📋</span> My Bookings
                                    </Link>
                                    <hr className="my-1 border-slate-100" />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                                    >
                                        <span>🚪</span> Logout
                                    </button>
                                </div>
                            )}
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
                    <Link to="/"           onClick={closeMenu} className={navLinkClass('/')}>Home</Link>
                    <Link to="/templates"  onClick={closeMenu} className={navLinkClass('/templates')}>Templates</Link>
                    <Link to="/our-work"   onClick={closeMenu} className={navLinkClass('/our-work')}>Our Work</Link>
                    <Link to="/apply-jobs" onClick={closeMenu} className={navLinkClass('/apply-jobs')}>Apply for Jobs</Link>
                    {user && (
                        <Link to="/my-bookings" onClick={closeMenu} className={navLinkClass('/my-bookings')}>My Bookings</Link>
                    )}
                    <Link to="/feedback"  onClick={closeMenu} className={navLinkClass('/feedback')}>Feedback</Link>
                    {user?.role === 'admin' && (
                        <Link to="/admin" onClick={closeMenu} className={navLinkClass('/admin')}>Admin Panel</Link>
                    )}
                    {user ? (
                        <>
                            <div className="flex items-center gap-3 py-1">
                                <AvatarCircle size="h-8 w-8" />
                                <span className="text-sm text-slate-600">{user.name}</span>
                            </div>
                            <Link
                                to="/profile"
                                onClick={closeMenu}
                                className="flex items-center gap-2 text-slate-700 text-sm"
                            >
                                👤 My Profile
                                {!profileComplete && (
                                    <span className="ml-1 text-xs text-amber-500 font-medium">● Incomplete</span>
                                )}
                            </Link>
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