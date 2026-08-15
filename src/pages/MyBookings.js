import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

function getCloudinaryThumb(url, width = 120) {
    if (!url || !url.includes('/upload/')) return url;
    return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
}

export default function MyBookings() {
    const { user, loading } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (user) {
            api.get('/bookings/mine')
                .then((res) => setBookings(res.data))
                .catch((err) => console.error('Failed to fetch bookings', err))
                .finally(() => setFetching(false));
        }
    }, [user]);

    if (loading) return null;
    if (!user) return <Navigate to="/login" replace />;

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">My Bookings</h1>

            {fetching ? (
                <div className="space-y-4 animate-pulse">
                    {[1, 2].map((i) => (
                        <div key={i} className="h-16 bg-slate-100 rounded-lg w-full" />
                    ))}
                </div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl">
                    <p className="text-slate-500 mb-4">You haven't booked any templates yet.</p>
                    <a href="/" className="inline-block bg-slate-800 text-white px-5 py-2 rounded-lg text-sm hover:bg-slate-700">
                        Browse Templates
                    </a>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                                    <th className="py-3 px-4 font-semibold">Template</th>
                                    <th className="py-3 px-4 font-semibold">Phone</th>
                                    <th className="py-3 px-4 font-semibold">Notes</th>
                                    <th className="py-3 px-4 font-semibold">Date Booked</th>
                                    <th className="py-3 px-4 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((b) => (
                                    <tr key={b._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                                        <td className="py-4 px-4 flex items-center gap-3">
                                            {b.template?.imageUrl ? (
                                                <img
                                                    src={getCloudinaryThumb(b.template.imageUrl)}
                                                    alt={b.template.name || 'Template'}
                                                    className="w-12 h-16 object-contain bg-slate-100 rounded border border-slate-200"
                                                />
                                            ) : (
                                                <div className="w-12 h-16 bg-slate-100 rounded border border-slate-200" />
                                            )}
                                            <span className="font-medium text-slate-800">{b.template?.name || 'Deleted Template'}</span>
                                        </td>
                                        <td className="py-4 px-4 text-slate-600">{b.phone}</td>
                                        <td className="py-4 px-4 text-slate-500 max-w-xs truncate" title={b.notes}>
                                            {b.notes || '-'}
                                        </td>
                                        <td className="py-4 px-4 text-slate-500">
                                            {new Date(b.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    b.status === 'done'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                            >
                                                {b.status === 'done' ? 'Done' : 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
