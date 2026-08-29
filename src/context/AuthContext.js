import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../api/api';

export const AuthContext = createContext(null);

// Derive profileComplete from user object (no extra fetch needed)
function isProfileComplete(user) {
    if (!user) return false;
    return !!(user.phone && user.address && user.avatar);
}

export function AuthProvider({ children }) {
    const [user, setUser]       = useState(null);
    const [loading, setLoading] = useState(true);

    // On app load, check if a token is already saved (already logged in)
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }
        api.get('/auth/me')
            .then((res) => setUser(res.data.user))
            .catch(() => {
                localStorage.removeItem('token');
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    function login(token, userData) {
        localStorage.setItem('token', token);
        setUser(userData);
    }

    function logout() {
        localStorage.removeItem('token');
        setUser(null);
    }

    // Patch the in-memory user after a profile save — avoids a full re-fetch
    const updateUser = useCallback((partialData) => {
        setUser((prev) => prev ? { ...prev, ...partialData } : prev);
    }, []);

    const profileComplete = isProfileComplete(user);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, updateUser, profileComplete }}>
            {children}
        </AuthContext.Provider>
    );
}
