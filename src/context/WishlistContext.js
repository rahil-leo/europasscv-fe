import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../api/api';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext({ wishlist: [], toggle: () => {}, isWishlisted: () => false });

export function WishlistProvider({ children }) {
    const { user } = useContext(AuthContext);
    const [wishlist, setWishlist] = useState([]); // array of template IDs (strings)

    // Fetch wishlist whenever the logged-in user changes
    useEffect(() => {
        if (!user) { setWishlist([]); return; }
        api.get('/wishlist')
            .then(res => setWishlist(res.data.wishlist.map(t => t._id || t)))
            .catch(() => setWishlist([]));
    }, [user]);

    // Toggle a template in/out of wishlist
    const toggle = useCallback(async (templateId) => {
        if (!user) return; // silently ignore if not logged in
        try {
            const res = await api.post(`/wishlist/${templateId}`);
            // Backend returns the updated array of IDs
            setWishlist(res.data.wishlist.map(id => id.toString()));
        } catch (err) {
            console.error('Wishlist toggle failed', err);
        }
    }, [user]);

    const isWishlisted = useCallback((templateId) => {
        return wishlist.includes(templateId?.toString());
    }, [wishlist]);

    return (
        <WishlistContext.Provider value={{ wishlist, toggle, isWishlisted }}>
            {children}
        </WishlistContext.Provider>
    );
}
