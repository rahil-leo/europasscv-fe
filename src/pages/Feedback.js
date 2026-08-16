import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

export default function Feedback() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Form/submission states
    const [quote, setQuote] = useState('');
    const [rating, setRating] = useState(5);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    
    // Track user's testimonial if already submitted
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [myFeedback, setMyFeedback] = useState(null);

    useEffect(() => {
        loadTestimonials();
    }, [user]);

    function loadTestimonials() {
        setLoading(true);
        api.get('/testimonials')
            .then((res) => {
                setTestimonials(res.data);
                
                // If user is logged in, check if their feedback is in the approved list
                if (user) {
                    const found = res.data.find(
                        (t) => t.user?._id === user.id || t.user === user.id
                    );
                    if (found) {
                        setHasSubmitted(true);
                        setMyFeedback(found);
                    }
                }
            })
            .catch((err) => console.error('Failed to load testimonials', err))
            .finally(() => setLoading(false));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!quote.trim()) return;

        try {
            setSubmitting(true);
            setMessage('');
            const res = await api.post('/testimonials', { quote, rating });
            
            setHasSubmitted(true);
            setMyFeedback({ quote, rating });
            setMessage('Thanks! Your feedback will appear once approved.');
            setQuote('');
            setRating(5);
            loadTestimonials();
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Something went wrong';
            setMessage(errorMsg);
            if (errorMsg.includes('already submitted')) {
                setHasSubmitted(true);
            }
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDeleteMyFeedback() {
        if (!window.confirm('Are you sure you want to delete your feedback?')) return;
        
        try {
            await api.delete('/testimonials/mine');
            setHasSubmitted(false);
            setMyFeedback(null);
            setMessage('Your feedback has been deleted.');
            loadTestimonials();
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to delete feedback');
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">User Feedback</h1>
            <p className="text-slate-500 mb-8">See what others are saying, or share your own experience with us.</p>

            {/* Submission Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-12">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">Share Your Feedback</h2>

                {authLoading ? (
                    <div className="h-20 bg-slate-50 rounded-lg animate-pulse" />
                ) : !user ? (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 text-center">
                        <p className="text-slate-600 mb-3">Login to leave feedback about our CV templates.</p>
                        <Link to="/login" className="inline-block bg-slate-800 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-slate-700">
                            Log in
                        </Link>
                    </div>
                ) : hasSubmitted ? (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-slate-700">Your Submitted Feedback:</span>
                            <button
                                onClick={handleDeleteMyFeedback}
                                className="text-xs text-red-500 hover:text-red-700 font-semibold hover:underline"
                            >
                                Delete my feedback
                            </button>
                        </div>
                        {myFeedback ? (
                            <div className="space-y-2">
                                <div className="flex text-amber-400 text-lg">
                                    {Array.from({ length: myFeedback.rating }).map((_, i) => (
                                        <span key={i}>★</span>
                                    ))}
                                    {Array.from({ length: 5 - myFeedback.rating }).map((_, i) => (
                                        <span key={i} className="text-slate-200">★</span>
                                    ))}
                                </div>
                                <p className="text-slate-600 italic">"{myFeedback.quote}"</p>
                            </div>
                        ) : (
                            <p className="text-slate-500 text-sm">Your feedback is submitted and pending approval.</p>
                        )}
                        {message && <p className="mt-3 text-xs text-emerald-600 font-medium">{message}</p>}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-600 mb-1.5 font-medium">Rating</label>
                            <div className="flex gap-1.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`text-2xl transition-colors ${
                                            star <= rating ? 'text-amber-400' : 'text-slate-200'
                                        }`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-slate-600 mb-1.5 font-medium">Your Review</label>
                            <textarea
                                placeholder="Describe your experience using our templates..."
                                value={quote}
                                onChange={(e) => setQuote(e.target.value)}
                                required
                                rows={3}
                                className="w-full border border-slate-200 rounded-lg px-4 py-2 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition shadow-sm bg-slate-50/50"
                            />
                        </div>

                        {message && (
                            <p className="text-sm text-slate-600 bg-slate-50 px-4 py-2 rounded-lg">{message}</p>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-700 transition disabled:opacity-50"
                        >
                            {submitting ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                    </form>
                )}
            </div>

            {/* Testimonials Grid */}
            <h2 className="text-xl font-semibold text-slate-800 mb-6">What Users Say</h2>
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                    {[1, 2].map((i) => (
                        <div key={i} className="h-32 bg-slate-100 rounded-2xl" />
                    ))}
                </div>
            ) : testimonials.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                    <p className="text-slate-500">Be the first to leave feedback!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {testimonials.map((t) => (
                        <div key={t._id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
                            <div>
                                <div className="flex text-amber-400 text-sm mb-3">
                                    {Array.from({ length: t.rating }).map((_, i) => (
                                        <span key={i}>★</span>
                                    ))}
                                    {Array.from({ length: 5 - t.rating }).map((_, i) => (
                                        <span key={i} className="text-slate-200">★</span>
                                    ))}
                                </div>
                                <p className="text-slate-600 italic text-sm mb-4">"{t.quote}"</p>
                            </div>
                            <p className="text-xs font-semibold text-slate-500 text-right">— {t.user?.name || 'Anonymous'}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
