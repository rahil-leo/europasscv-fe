import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate('/');
    }

    return (
        <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 shadow-sm bg-white">
            <Link to="/" className="flex items-center gap-2">
                <img src="/images/logo.Png" alt="Logo" className="h-8 w-auto rounded" />
                <span className="text-xl font-bold text-slate-800">Europass.cv</span>
            </Link>
            <div className="flex items-center gap-4">
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
        </nav>
    );
}