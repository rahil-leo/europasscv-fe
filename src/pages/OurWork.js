import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function OurWork() {
    const [work, setWork] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        api.get('/work')
            .then((res) => setWork(res.data))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <h1 className="text-2xl font-semibold text-slate-800 mb-2">Our Work</h1>
            <p className="text-slate-500 mb-8">A look at some of the CVs we've created.</p>

            {loading ? (
                <p className="text-slate-500">Loading...</p>
            ) : work.length === 0 ? (
                <p className="text-slate-500">No work posted yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {work.map((w) => (
                        <div
                            key={w._id}
                            className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition"
                            onClick={() => setSelectedImage(w)}
                        >
                            <img src={w.imageUrl} alt={w.title} className="w-full h-auto object-contain bg-slate-50" loading="lazy" />
                            <div className="p-4">
                                <h3 className="font-semibold text-slate-800">{w.title}</h3>
                                {w.description && <p className="text-sm text-slate-500 mt-1">{w.description}</p>}
                                <p className="text-xs text-slate-400 mt-2">Click to view full size</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-xl relative" onClick={(e) => e.stopPropagation()}>
                        <img src={selectedImage.imageUrl} alt={selectedImage.title} className="w-full" />
                        <div className="p-4">
                            <h3 className="font-semibold text-slate-800">{selectedImage.title}</h3>
                            {selectedImage.description && <p className="text-sm text-slate-500 mt-1">{selectedImage.description}</p>}
                        </div>
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 bg-white/90 rounded-full w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-white"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}