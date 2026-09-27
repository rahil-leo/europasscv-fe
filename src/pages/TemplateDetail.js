import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

export default function TemplateDetail() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [template, setTemplate] = useState(null);
    const [showForm, setShowForm] = useState(false);
    
    // Booking Form State
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');
    const [message, setMessage] = useState('');

    // Promo Code State
    const [promoCode, setPromoCode] = useState('');
    const [promoError, setPromoError] = useState('');
    const [promoSuccess, setPromoSuccess] = useState('');
    const [discountedPrice, setDiscountedPrice] = useState(null);

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

    async function handleApplyPromo() {
        if (!promoCode.trim()) return;
        setPromoError('');
        setPromoSuccess('');
        try {
            const res = await api.post('/promos/validate', { code: promoCode, templateId: id });
            setDiscountedPrice(res.data.discountedPrice);
            setPromoSuccess(`Promo applied! Discount: ${res.data.discountType === 'percentage' ? res.data.discountValue + '%' : '₹' + res.data.discountValue}`);
        } catch (err) {
            setPromoError(err.response?.data?.message || 'Invalid promo code');
            setDiscountedPrice(null);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await api.post('/bookings', { 
                templateId: id, 
                phone, 
                notes,
                originalPrice: template.price,
                discountedPrice: discountedPrice || template.price,
                promoCodeUsed: promoSuccess ? promoCode : null
            });
            setMessage('Booking submitted! We will get in touch with you soon.');
            setShowForm(false);
            setPhone('');
            setNotes('');
            setPromoCode('');
            setDiscountedPrice(null);
            setPromoSuccess('');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Something went wrong. Try again.');
        }
    }

    if (!template) return <p className="text-center py-12 text-slate-500">Loading...</p>;

    return (
        <div className="max-w-3xl mx-auto px-6 py-12">
            <img src={template.imageUrl} alt={template.name} className="w-full max-h-[800px] object-contain bg-slate-100 rounded-xl mb-6" />
            <h1 className="text-2xl font-bold text-slate-800 mb-2">{template.name}</h1>
            
            <div className="flex items-center gap-3 mb-2">
                {discountedPrice !== null ? (
                    <>
                        <p className="text-xl font-semibold text-green-600">₹{discountedPrice}</p>
                        <p className="text-lg font-medium text-slate-400 line-through">₹{template.price}</p>
                    </>
                ) : (
                    <p className="text-xl font-semibold text-slate-700">₹{template.price}</p>
                )}
            </div>

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
                <div className="mt-6 p-6 bg-slate-50 border border-slate-200 rounded-xl">
                    <h3 className="font-semibold text-slate-800 mb-4">Complete your booking</h3>
                    
                    {/* Promo Code Section */}
                    <div className="mb-6 pb-6 border-b border-slate-200">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Have a promo code?</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Enter code"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-slate-500 focus:border-slate-500 uppercase"
                            />
                            <button
                                type="button"
                                onClick={handleApplyPromo}
                                className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-300 font-medium transition"
                            >
                                Apply
                            </button>
                        </div>
                        {promoError && <p className="text-red-500 text-xs mt-2">{promoError}</p>}
                        {promoSuccess && <p className="text-green-600 text-xs mt-2 font-medium">{promoSuccess}</p>}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
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
                        <button type="submit" className="w-full bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-700 font-medium text-lg shadow-sm">
                            Confirm Booking {discountedPrice !== null ? `(₹${discountedPrice})` : `(₹${template.price})`}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}