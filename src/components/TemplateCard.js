import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';

function getCloudinaryThumb(url, width = 400) {
    if (!url || !url.includes('/upload/')) return url;
    return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
}

export default function TemplateCard({ template }) {
    const { isWishlisted, toggle } = useContext(WishlistContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const wished = isWishlisted(template._id);

    function handleHeart(e) {
        e.preventDefault(); // don't navigate to template detail
        e.stopPropagation();
        if (!user) { navigate('/login'); return; }
        toggle(template._id);
    }

    return (
        <Link
            to={`/templates/${template._id}`}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden block relative group"
        >
            {/* Heart button */}
            <button
                onClick={handleHeart}
                aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
                className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all
                    ${wished
                        ? 'bg-red-500 text-white scale-110'
                        : 'bg-white/80 text-slate-400 hover:text-red-500 hover:bg-white opacity-0 group-hover:opacity-100'
                    }`}
            >
                <svg className="w-4 h-4" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>

            <img
                src={getCloudinaryThumb(template.imageUrl)}
                alt={template.name}
                className="w-full h-80 object-contain bg-slate-100"
                loading="lazy"
                width={400}
                height={320}
            />
            <div className="p-4">
                <h3 className="font-semibold text-slate-800">{template.name}</h3>
                <p className="text-slate-700 font-medium mt-1">₹{template.price}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                    {(template.qualities || []).slice(0, 3).map((q, i) => (
                        <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                            {q}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    );
}