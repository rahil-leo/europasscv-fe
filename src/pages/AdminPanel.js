import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminPanel() {
    const { user, loading } = useContext(AuthContext);

    const [activeTab, setActiveTab] = useState('add');

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
    const [price, setPrice] = useState('');

    // Our Work form state
    const [workTitle, setWorkTitle] = useState('');
    const [workDescription, setWorkDescription] = useState('');
    const [workImageFile, setWorkImageFile] = useState(null);
    const [workImagePreview, setWorkImagePreview] = useState('');
    const [workUploading, setWorkUploading] = useState(false);
    const [workMessage, setWorkMessage] = useState('');

    // Data lists
    const [templates, setTemplates] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [pendingTestimonials, setPendingTestimonials] = useState([]);
    const [approvedTestimonials, setApprovedTestimonials] = useState([]);
    const [workItems, setWorkItems] = useState([]);
  
    const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);
    const [maintenanceMessage, setMaintenanceMessage] = useState('');
    const [settingsMessage, setSettingsMessage] = useState('');

    useEffect(() => {
        if (user?.role === 'admin') {
            loadTemplates();
            loadBookings();
            loadTestimonials();
            loadSettings();
            loadWork();
        }
    }, [user]);

    function loadTemplates() {
        api.get('/templates').then((res) => setTemplates(res.data));
    }

    function loadTestimonials() {
        api.get('/testimonials/pending').then((res) => setPendingTestimonials(res.data));
        api.get('/testimonials').then((res) => setApprovedTestimonials(res.data));
    }

    function loadWork() {
        api.get('/work').then((res) => setWorkItems(res.data));
    }

    async function handleApproveTestimonial(id) {
        try {
            await api.patch(`/testimonials/${id}/approve`);
            loadTestimonials();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to approve testimonial');
        }
    }

    async function handleDeleteTestimonial(id) {
        if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
        try {
            await api.delete(`/testimonials/${id}`);
            loadTestimonials();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete testimonial');
        }
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
      function loadSettings() {
        api.get('/settings/maintenance').then((res) => {
            setMaintenanceEnabled(res.data.enabled);
            setMaintenanceMessage(res.data.message);
        });
    }

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    }

    function handleWorkFileChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setWorkImageFile(file);
        setWorkImagePreview(URL.createObjectURL(file));
    }

    function resetForm() {
        setEditingId(null);
        setName('');
        setDescription('');
        setImageUrl('');
        setImageFile(null);
        setImagePreview('');
        setQualities('');
        setPrice('');
    }

    function resetWorkForm() {
        setWorkTitle('');
        setWorkDescription('');
        setWorkImageFile(null);
        setWorkImagePreview('');
    }

    function startEdit(t) {
        setEditingId(t._id);
        setName(t.name);
        setDescription(t.description);
        setImageUrl(t.imageUrl);
        setImagePreview(t.imageUrl);
        setImageFile(null);
        setQualities((t.qualities || []).join(', '));
        setPrice(t.price || '');
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

    async function handleDeleteWork(id) {
        if (!window.confirm('Delete this work item? This cannot be undone.')) return;
        try {
            await api.delete(`/work/${id}`);
            loadWork();
        } catch (err) {
            setWorkMessage(err.response?.data?.message || 'Failed to delete work item');
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage('');

        try {
            setUploading(true);

            let finalImageUrl = imageUrl;

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
                price,
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

    async function handleWorkSubmit(e) {
        e.preventDefault();
        setWorkMessage('');

        if (!workImageFile) {
            setWorkMessage('Please choose an image.');
            return;
        }

        try {
            setWorkUploading(true);

            const formData = new FormData();
            formData.append('image', workImageFile);
            const uploadRes = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            await api.post('/work', {
                title: workTitle,
                imageUrl: uploadRes.data.imageUrl,
                description: workDescription
            });

            setWorkMessage('Work item added.');
            resetWorkForm();
            loadWork();
        } catch (err) {
            setWorkMessage(err.response?.data?.message || 'Something went wrong');
        } finally {
            setWorkUploading(false);
        }
    }
  
    async function handleToggleMaintenance() {
        try {
            const newEnabled = !maintenanceEnabled;
            await api.put('/settings/maintenance', { enabled: newEnabled, message: maintenanceMessage });
            setMaintenanceEnabled(newEnabled);
            setSettingsMessage(newEnabled ? 'Maintenance mode turned ON.' : 'Maintenance mode turned OFF.');
        } catch (err) {
            setSettingsMessage('Failed to update setting.');
        }
    }

    async function handleSaveMessage() {
        try {
            await api.put('/settings/maintenance', { enabled: maintenanceEnabled, message: maintenanceMessage });
            setSettingsMessage('Message updated.');
        } catch (err) {
            setSettingsMessage('Failed to update message.');
        }
    }

    if (loading) return null;
    if (!user || user.role !== 'admin') return <Navigate to="/" replace />;

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col md:flex-row gap-6 md:gap-8">
            <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="flex-1 space-y-12 min-w-0">
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
                                type="number" placeholder="Price (e.g. 299)" value={price}
                                onChange={(e) => setPrice(e.target.value)} required
                                className="w-full border border-slate-300 rounded-lg px-4 py-2"
                            />
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
                                            <p className="text-slate-600 text-sm mb-2">₹{t.price}</p>
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

                {activeTab === 'ourwork' && (
                    <section className="space-y-8">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800 mb-4">Add Work Item</h2>
                            {workMessage && (
                                <p className="mb-4 text-sm text-slate-700 bg-slate-100 px-4 py-2 rounded-lg">{workMessage}</p>
                            )}
                            <form onSubmit={handleWorkSubmit} className="space-y-4">
                                <input
                                    type="text" placeholder="Title (e.g. Software Developer CV)" value={workTitle}
                                    onChange={(e) => setWorkTitle(e.target.value)} required
                                    className="w-full border border-slate-300 rounded-lg px-4 py-2"
                                />
                                <textarea
                                    placeholder="Short description (optional)" value={workDescription}
                                    onChange={(e) => setWorkDescription(e.target.value)} rows={2}
                                    className="w-full border border-slate-300 rounded-lg px-4 py-2"
                                />
                                <div>
                                    <label className="block text-sm text-slate-600 mb-1">Work Image</label>
                                    <input
                                        type="file" accept="image/*"
                                        onChange={handleWorkFileChange}
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2 bg-white"
                                    />
                                    {workImagePreview && (
                                        <img
                                            src={workImagePreview}
                                            alt="Preview"
                                            className="mt-3 w-40 h-40 object-cover rounded-lg border border-slate-200"
                                        />
                                    )}
                                </div>
                                <button
                                    type="submit" disabled={workUploading}
                                    className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50"
                                >
                                    {workUploading ? 'Saving...' : 'Add Work Item'}
                                </button>
                            </form>
                        </div>

                        <hr className="border-slate-100" />

                        <div>
                            <h2 className="text-xl font-semibold text-slate-800 mb-4">Posted Work</h2>
                            {workItems.length === 0 ? (
                                <p className="text-slate-500">No work items added yet.</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {workItems.map((w) => (
                                        <div key={w._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                            <img
                                                src={w.imageUrl}
                                                alt={w.title}
                                                className="w-full h-56 object-cover bg-slate-100"
                                            />
                                            <div className="p-4">
                                                <h3 className="font-semibold text-slate-800">{w.title}</h3>
                                                {w.description && (
                                                    <p className="text-sm text-slate-500 mt-1 mb-3">{w.description}</p>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteWork(w._id)}
                                                    className="text-sm px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {activeTab === 'bookings' && (
                    <section>
                        <h2 className="text-xl font-semibold text-slate-800 mb-4">Bookings</h2>
                        {bookings.length === 0 ? (
                            <p className="text-slate-500">No bookings yet.</p>
                        ) : (
                            <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-slate-100">
                                <table className="w-full text-sm text-left border-collapse min-w-[700px]">
                                    <thead>
                                        <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                                            <th className="py-3 px-4 font-medium">Template</th>
                                            <th className="py-3 px-4 font-medium">User</th>
                                            <th className="py-3 px-4 font-medium">Phone</th>
                                            <th className="py-3 px-4 font-medium">Notes</th>
                                            <th className="py-3 px-4 font-medium">Status</th>
                                            <th className="py-3 px-4 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.map((b) => (
                                            <tr key={b._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                                <td className="py-3 px-4">{b.template?.name}</td>
                                                <td className="py-3 px-4">{b.user?.name} <span className="text-slate-400 block text-xs">({b.user?.email})</span></td>
                                                <td className="py-3 px-4">{b.phone}</td>
                                                <td className="py-3 px-4 truncate max-w-[150px]" title={b.notes}>{b.notes || '-'}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                        b.status === 'done'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {b.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <button
                                                        onClick={() => toggleBookingStatus(b._id)}
                                                        className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-200 bg-white shadow-sm transition-colors"
                                                    >
                                                        {b.status === 'done' ? 'Mark Pending' : 'Mark Done'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                )}

                {activeTab === 'testimonials' && (
                    <section className="space-y-8">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800 mb-4">Pending Testimonials</h2>
                            {pendingTestimonials.length === 0 ? (
                                <p className="text-slate-500 text-sm">No pending testimonials.</p>
                            ) : (
                                <div className="space-y-4">
                                    {pendingTestimonials.map((t) => (
                                        <div key={t._id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fadeIn">
                                            <div className="space-y-1">
                                                <div className="flex text-amber-400 text-sm">
                                                    {Array.from({ length: t.rating }).map((_, i) => <span key={i}>★</span>)}
                                                    {Array.from({ length: 5 - t.rating }).map((_, i) => <span key={i} className="text-slate-200">★</span>)}
                                                </div>
                                                <p className="text-slate-600 italic text-sm">"{t.quote}"</p>
                                                <p className="text-xs text-slate-500">— {t.user?.name} ({t.user?.email})</p>
                                            </div>
                                            <div className="flex gap-2 shrink-0">
                                                <button
                                                    onClick={() => handleApproveTestimonial(t._id)}
                                                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTestimonial(t._id)}
                                                    className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-650 hover:bg-red-50 text-red-600"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <hr className="border-slate-100" />

                        <div>
                            <h2 className="text-xl font-semibold text-slate-800 mb-4">Approved Testimonials</h2>
                            {approvedTestimonials.length === 0 ? (
                                <p className="text-slate-500 text-sm">No approved testimonials.</p>
                            ) : (
                                <div className="space-y-4">
                                    {approvedTestimonials.map((t) => (
                                        <div key={t._id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex text-amber-400 text-sm">
                                                    {Array.from({ length: t.rating }).map((_, i) => <span key={i}>★</span>)}
                                                    {Array.from({ length: 5 - t.rating }).map((_, i) => <span key={i} className="text-slate-200">★</span>)}
                                                </div>
                                                <p className="text-slate-600 italic text-sm">"{t.quote}"</p>
                                                <p className="text-xs text-slate-500">— {t.user?.name || 'Anonymous'}</p>
                                            </div>
                                            <div className="flex gap-2 shrink-0">
                                                <button
                                                    onClick={() => handleDeleteTestimonial(t._id)}
                                                    className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                )}
        </div>
        {activeTab === 'settings' && (
            <section>
                <h2 className="text-xl font-semibold text-slate-800 mb-4">Site Settings</h2>
                {settingsMessage && (
                    <p className="mb-4 text-sm text-slate-700 bg-slate-100 px-4 py-2 rounded-lg">{settingsMessage}</p>
                )}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-slate-800">Maintenance Mode</p>
                            <p className="text-sm text-slate-500">Shows a full-screen notice to visitors when enabled.</p>
                        </div>
                        <button
                            onClick={handleToggleMaintenance}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
                                maintenanceEnabled ? 'bg-slate-800' : 'bg-slate-300'
                            }`}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                                    maintenanceEnabled ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>

                    <textarea
                        value={maintenanceMessage}
                        onChange={(e) => setMaintenanceMessage(e.target.value)}
                        rows={3}
                        placeholder="Message shown to visitors during maintenance"
                        className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm"
                    />
                    <button
                        onClick={handleSaveMessage}
                        className="text-sm px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100"
                    >
                        Save Message
                    </button>
                </div>
            </section>
        )}
        </div>
    );
}