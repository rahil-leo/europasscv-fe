import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminPanel() {
    const { user, loading } = useContext(AuthContext);

    const [activeTab, setActiveTab] = useState('add'); // 'add' | 'templates' | 'bookings'

    // Add / Edit template form state
    const [editingId, setEditingId] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [uploading, setUploading] = useState(false);
    const [qualities, setQualities] = useState('');
    const [message, setMessage] = useState('');

    // Data lists
    const [templates, setTemplates] = useState([]);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        if (user?.role === 'admin') {
            loadTemplates();
            loadBookings();
        }
    }, [user]);

    function loadTemplates() {
        api.get('/templates').then((res) => setTemplates(res.data));
    }

    function loadBookings() {
        api.get('/bookings').then((res) => setBookings(res.data));
    }

    async function toggleBookingStatus(id) {
        try {
            const res = await api.patch(`/bookings/${id}/status`);
            setBookings((prev) =>
                prev.map((b) => (b._id === id ? res.data : b))
            );
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update booking status');
        }
    }

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    }

    function resetForm() {
        setEditingId(null);
        setName('');
        setDescription('');
        setImageUrl('');
        setImageFile(null);
        setImagePreview('');
        setQualities('');
    }

    function startEdit(t) {
        setEditingId(t._id);
        setName(t.name);
        setDescription(t.description);
        setImageUrl(t.imageUrl);
        setImagePreview(t.imageUrl);
        setImageFile(null);
        setQualities((t.qualities || []).join(', '));
        setMessage('');
        setActiveTab('add');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function handleDelete(id) {
        if (!window.confirm('Delete this template? This cannot be undone.')) return;
        try {
            await api.delete(`/templates/${id}`);
            if (editingId === id) resetForm();
            loadTemplates();
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to delete template');
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage('');

        try {
            setUploading(true);

            let finalImageUrl = imageUrl;

            // Only upload if a new file was chosen
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                const uploadRes = await api.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                finalImageUrl = uploadRes.data.imageUrl;
            }

            if (!finalImageUrl) {
                setMessage('Please choose an image.');
                setUploading(false);
                return;
            }

            const payload = {
                name,
                description,
                imageUrl: finalImageUrl,
                qualities: qualities.split(',').map((q) => q.trim()).filter(Boolean)
            };

            if (editingId) {
                await api.put(`/templates/${editingId}`, payload);
                setMessage('Template updated.');
            } else {
                await api.post('/templates', payload);
                setMessage('Template added.');
            }

            resetForm();
            loadTemplates();
        } catch (err) {
            setMessage(err.response?.data?.message || 'Something went wrong');
        } finally {
            setUploading(false);
        }
    }

    // Wait for auth check to finish before deciding to redirect
    if (loading) return null;
    if (!user || user.role !== 'admin') return <Navigate to="/" replace />;

    return (
        <div className="max-w-6xl mx-auto px-6 py-12 flex gap-8">
            {/* Sidebar */}
            <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Main content */}
            <div className="flex-1 space-y-12">
                {activeTab === 'add' && (
                    <section>
                        <h2 className="text-xl font-semibold text-slate-800 mb-4">
                            {editingId ? 'Edit Template' : 'Add Template'}
                        </h2>
                        {message && (
                            <p className="mb-4 text-sm text-slate-700 bg-slate-100 px-4 py-2 rounded-lg">{message}</p>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text" placeholder="Template name" value={name}
                                onChange={(e) => setName(e.target.value)} required
                                className="w-full border border-slate-300 rounded-lg px-4 py-2"
                            />
                            <textarea
                                placeholder="Description" value={description}
                                onChange={(e) => setDescription(e.target.value)} required rows={3}
                                className="w-full border border-slate-300 rounded-lg px-4 py-2"
                            />
                            <div>
                                <label className="block text-sm text-slate-600 mb-1">Template Image</label>
                                <input
                                    type="file" accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full border border-slate-300 rounded-lg px-4 py-2 bg-white"
                                />
                                {imagePreview && (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="mt-3 w-40 h-40 object-cover rounded-lg border border-slate-200"
                                    />
                                )}
                            </div>
                            <input
                                type="text" placeholder="Qualities, comma separated (e.g. ATS-friendly, 1-page)"
                                value={qualities} onChange={(e) => setQualities(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg px-4 py-2"
                            />
                            <div className="flex gap-3">
                                <button
                                    type="submit" disabled={uploading}
                                    className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50"
                                >
                                    {uploading ? 'Saving...' : editingId ? 'Update Template' : 'Add Template'}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-6 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </section>
                )}

                {activeTab === 'templates' && (
                    <section>
                        <h2 className="text-xl font-semibold text-slate-800 mb-4">Added Templates</h2>
                        {message && (
                            <p className="mb-4 text-sm text-slate-700 bg-slate-100 px-4 py-2 rounded-lg">{message}</p>
                        )}
                        {templates.length === 0 ? (
                            <p className="text-slate-500">No templates added yet.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {templates.map((t) => (
                                    <div key={t._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                        <img
                                            src={t.imageUrl}
                                            alt={t.name}
                                            className="w-full h-56 object-contain bg-slate-100"
                                        />
                                        <div className="p-4">
                                            <h3 className="font-semibold text-slate-800">{t.name}</h3>
                                            <div className="flex flex-wrap gap-2 mt-2 mb-4">
                                                {(t.qualities || []).slice(0, 3).map((q, i) => (
                                                    <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                                                        {q}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => startEdit(t)}
                                                    className="text-sm px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(t._id)}
                                                    className="text-sm px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {activeTab === 'bookings' && (
                    <section>
                        <h2 className="text-xl font-semibold text-slate-800 mb-4">Bookings</h2>
                        {bookings.length === 0 ? (
                            <p className="text-slate-500">No bookings yet.</p>
                        ) : (
                            <table className="w-full text-sm text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 text-slate-500">
                                        <th className="py-2 pr-4">Template</th>
                                        <th className="py-2 pr-4">User</th>
                                        <th className="py-2 pr-4">Phone</th>
                                        <th className="py-2 pr-4">Notes</th>
                                        <th className="py-2 pr-4">Status</th>
                                        <th className="py-2 pr-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((b) => (
                                        <tr key={b._id} className="border-b border-slate-100">
                                            <td className="py-2 pr-4">{b.template?.name}</td>
                                            <td className="py-2 pr-4">{b.user?.name} ({b.user?.email})</td>
                                            <td className="py-2 pr-4">{b.phone}</td>
                                            <td className="py-2 pr-4">{b.notes || '-'}</td>
                                            <td className="py-2 pr-4">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    b.status === 'done'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {b.status}
                                                </span>
                                            </td>
                                            <td className="py-2 pr-4">
                                                <button
                                                    onClick={() => toggleBookingStatus(b._id)}
                                                    className="text-xs px-2.5 py-1 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100"
                                                >
                                                    {b.status === 'done' ? 'Mark Pending' : 'Mark Done'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </section>
                )}
            </div>
        </div>
    );
}