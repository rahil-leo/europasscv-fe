import React, { useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

const PROFILE_FIELDS = ['avatar', 'phone', 'address'];

function getProgress(user) {
    if (!user) return 0;
    const filled = PROFILE_FIELDS.filter((f) => user[f] && String(user[f]).trim() !== '').length;
    return Math.round((filled / PROFILE_FIELDS.length) * 100);
}

// Resize an image File to 200×200 and return a base64 JPEG string
function resizeImageToBase64(file, size = 200) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            // Centre-crop to square
            const min = Math.min(img.width, img.height);
            const sx = (img.width  - min) / 2;
            const sy = (img.height - min) / 2;
            ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
            URL.revokeObjectURL(url);
            resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.onerror = reject;
        img.src = url;
    });
}

export default function ProfilePage() {
    const { user, updateUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [phone,          setPhone]          = useState(user?.phone   || '');
    const [address,        setAddress]        = useState(user?.address || '');
    const [avatarBase64,   setAvatarBase64]   = useState(null);   // new image (base64)
    const [avatarPreview,  setAvatarPreview]  = useState(user?.avatar || '');
    const [saving,         setSaving]         = useState(false);
    const [success,        setSuccess]        = useState('');
    const [error,          setError]          = useState('');
    const fileInputRef = useRef(null);

    if (!user) {
        navigate('/login');
        return null;
    }

    const previewUser = {
        ...user,
        phone,
        address,
        avatar: avatarPreview || user.avatar,
    };
    const progress = getProgress(previewUser);

    async function handleAvatarChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const b64 = await resizeImageToBase64(file);
            setAvatarBase64(b64);
            setAvatarPreview(b64);
        } catch {
            setError('Could not read image. Please try another file.');
        }
    }

    async function handleSave(e) {
        e.preventDefault();
        setSaving(true);
        setSuccess('');
        setError('');

        try {
            const body = {
                phone:   phone.trim(),
                address: address.trim(),
            };
            if (avatarBase64) body.avatar = avatarBase64;

            // Plain JSON — no multipart needed
            const res = await api.put('/auth/profile', body);

            updateUser(res.data.user);
            setAvatarBase64(null);
            setSuccess('Profile saved successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save profile.');
        } finally {
            setSaving(false);
        }
    }

    const initials = user.name
        ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
        : '?';

    const progressColor =
        progress === 100 ? 'bg-green-500' :
        progress >= 50   ? 'bg-amber-400' :
                           'bg-red-400';

    return (
        <div className="max-w-lg mx-auto px-6 py-12">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">My Profile</h1>
            <p className="text-sm text-slate-500 mb-6">
                These details are optional but help us serve you better.
            </p>

            {/* ── Progress bar ── */}
            <div className="mb-8">
                <div className="flex justify-between text-sm text-slate-600 mb-1">
                    <span>Profile completion</span>
                    <span className="font-semibold">{progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${progressColor}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
                {progress === 100 && (
                    <p className="text-xs text-green-600 mt-1 font-medium">✓ Profile complete!</p>
                )}
            </div>

            {/* ── Avatar upload ── */}
            <div className="flex flex-col items-center mb-8">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="relative group focus:outline-none"
                    title="Click to change photo"
                >
                    {avatarPreview ? (
                        <img
                            src={avatarPreview}
                            alt="Avatar"
                            className="h-24 w-24 rounded-full object-cover border-4 border-slate-200 group-hover:opacity-80 transition"
                        />
                    ) : (
                        <div className="h-24 w-24 rounded-full bg-slate-700 text-white flex items-center justify-center text-2xl font-bold border-4 border-slate-200 group-hover:bg-slate-600 transition">
                            {initials}
                        </div>
                    )}
                    <span className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow border border-slate-200 text-base leading-none">
                        📷
                    </span>
                </button>
                <p className="text-xs text-slate-400 mt-2">Click photo to change · JPG / PNG / WebP</p>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleAvatarChange}
                />
            </div>

            {/* ── Form ── */}
            <form onSubmit={handleSave} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
                    <input
                        type="text"
                        value={user.name}
                        readOnly
                        className="w-full border border-slate-200 rounded-lg px-4 py-2 bg-slate-50 text-slate-500 cursor-not-allowed"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
                    <input
                        type="email"
                        value={user.email}
                        readOnly
                        className="w-full border border-slate-200 rounded-lg px-4 py-2 bg-slate-50 text-slate-500 cursor-not-allowed"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Phone Number <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <input
                        type="tel"
                        placeholder="e.g. +94 77 123 4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Address <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                        placeholder="e.g. 42 Main Street, Colombo, Sri Lanka"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={3}
                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
                    />
                </div>

                {error   && <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{error}</p>}
                {success && <p className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg">{success}</p>}

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-slate-800 text-white px-4 py-2.5 rounded-lg hover:bg-slate-700 disabled:opacity-50 transition font-medium"
                >
                    {saving ? 'Saving…' : 'Save Profile'}
                </button>
            </form>
        </div>
    );
}
