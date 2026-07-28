import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

export default function AdminPanel() {
    const { user, loading } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [uploading, setUploading] = useState(false);
    const [qualities, setQualities] = useState('');
    const [message, setMessage] = useState('');
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        if (user?.role === 'admin') {
            loadBookings();
        }
    }, [user]);

    function loadBookings() {
        api.get('/bookings').then((res) => setBookings(res.data));
    }

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    }

    async function handleAddTemplate(e) {
        e.preventDefault();
        setMessage('');

        if (!imageFile) {
            setMessage('Please choose an image to upload.');
            return;
        }

        try {
            setUploading(true);

            // Step 1: upload the image file to Cloudinary via backend
            const formData = new FormData();
            formData.append('image', imageFile);
            const uploadRes = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const uploadedUrl = uploadRes.data.imageUrl;
            setImageUrl(uploadedUrl);

            // Step 2: create the template using the uploaded image URL
            await api.post('/templates', {
                name,
                description,
                imageUrl: uploadedUrl,
                qualities: qualities.split(',').map((q) => q.trim()).filter(Boolean)
            });

            setMessage('Template added.');
            setName('');
            setDescription('');
            setImageUrl('');
            setImageFile(null);
            setImagePreview('');
            setQualities('');
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
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
            <section>
                <h2 className="text-xl font-semibold text-slate-800 mb-4">Add Template</h2>
                {message && <p className="mb-4 text-sm text-slate-700 bg-slate-100 px-4 py-2 rounded-lg">{message}</p>}
                <form onSubmit={handleAddTemplate} className="space-y-4">
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
                    <button type="submit" disabled={uploading} className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50">
                        {uploading ? 'Uploading...' : 'Add Template'}
                    </button>
                </form>
            </section>

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
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((b) => (
                                <tr key={b._id} className="border-b border-slate-100">
                                    <td className="py-2 pr-4">{b.template?.name}</td>
                                    <td className="py-2 pr-4">{b.user?.name} ({b.user?.email})</td>
                                    <td className="py-2 pr-4">{b.phone}</td>
                                    <td className="py-2 pr-4">{b.notes || '-'}</td>
                                    <td className="py-2 pr-4">{b.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
}