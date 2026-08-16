import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

export default function TemplateDetail() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [template, setTemplate] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        api.get(`/templates/${id}`).then((res) => setTemplate(res.data));
    }, [id]);

    function handleBookClick() {
        if (!user) {
            setMessage('You need to login to book a template.');
            return;
        }
        setMessage('');
        setShowForm(true);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await api.post('/bookings', { templateId: id, phone, notes });
            setMessage('Booking submitted! We will get in touch with you soon.');
            setShowForm(false);
            setPhone('');
            setNotes('');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Something went wrong. Try again.');
        }
    }

    if (!template) return <p className="text-center py-12 text-slate-500">Loading...</p>;

    return (
        <div className="max-w-3xl mx-auto px-6 py-12">
            <img src={template.imageUrl} alt={template.name} className="w-full max-h-[800px] object-contain bg-slate-100 rounded-xl mb-6" />
            <h1 className="text-2xl font-bold text-slate-800 mb-2">{template.name}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
                {(template.qualities || []).map((q, i) => (
                    <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{q}</span>
                ))}
            </div>
            <p className="text-slate-600 mb-6">{template.description}</p>

            {message && <p className="mb-4 text-sm text-slate-700 bg-slate-100 px-4 py-2 rounded-lg">{message}</p>}

            <div className="flex gap-3">
    {!showForm && (
        <button
            onClick={handleBookClick}
            className="bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-700"
        >
            Book this Template
        </button>
    )}

    <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSd-3aSsXn1BvgGJyRP0Z4HcFpQJLVAggCX64dLaoQAPvMpIIA/viewform?usp=publish-editor"
        target="_blank"
        rel="noopener noreferrer"
        className="border border-slate-800 text-slate-800 px-6 py-3 rounded-lg hover:bg-slate-100"
    >
        Fill Interest Form
    </a>
</div>

            {showForm && (
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <input
                        type="tel"
                        placeholder="Phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full border border-slate-300 rounded-lg px-4 py-2"
                    />
                    <textarea
                        placeholder="Any notes or specific request (optional)"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-4 py-2"
                        rows={3}
                    />
                    <button type="submit" className="bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-700">
                        Confirm Booking
                    </button>
                </form>
            )}
        </div>
    );
}