import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
    // view can be: 'login', 'register', 'verifyOtp', 'forgotPassword', 'resetPassword'
    const [view, setView] = useState('login'); 
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // Utility to reset messages when switching views
    function switchView(newView) {
        setError('');
        setSuccessMsg('');
        setView(newView);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        
        try {
            if (view === 'register') {
                await api.post('/auth/register', { name, email, password });
                setSuccessMsg('OTP sent to your email. Please check your inbox.');
                setView('verifyOtp');
            } else if (view === 'login') {
                const res = await api.post('/auth/login', { email, password });
                login(res.data.token, res.data.user);
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    }

    async function handleVerifyOtp(e) {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        
        try {
            await api.post('/auth/verify-otp', { email, otp });
            setSuccessMsg('Email verified successfully! You can now log in.');
            setOtp('');
            setPassword(''); // clear password for safety
            setView('login');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP');
        }
    }

    async function handleForgotPassword(e) {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        try {
            const res = await api.post('/auth/forgot-password', { email });
            setSuccessMsg(res.data.message);
            setView('resetPassword');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to request password reset');
        }
    }

    async function handleResetPassword(e) {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        try {
            const res = await api.post('/auth/reset-password', { email, otp, newPassword: password });
            setSuccessMsg(res.data.message);
            setOtp('');
            setPassword('');
            setView('login');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        }
    }

    // ── OTP VERIFICATION VIEW ───────────────────────────────────────────────
    if (view === 'verifyOtp') {
        return (
            <div className="max-w-sm mx-auto px-6 py-16">
                <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">Verify Your Email</h1>
                {successMsg && <p className="mb-4 text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg">{successMsg}</p>}
                {error && <p className="mb-4 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{error}</p>}
                
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <p className="text-sm text-slate-600">Enter the 6-digit code sent to <br/><span className="font-semibold text-slate-800">{email}</span></p>
                    <input
                        type="text" placeholder="6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)}
                        required maxLength={6}
                        className="w-full border border-slate-300 rounded-lg px-4 py-2 text-center text-xl tracking-widest font-mono"
                    />
                    <button type="submit" className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700">Verify</button>
                </form>
                
                <p className="text-sm text-slate-500 text-center mt-6">
                    <button onClick={() => switchView('login')} className="text-slate-800 font-medium underline">Back to Login</button>
                </p>
            </div>
        );
    }

    // ── REQUEST PASSWORD RESET VIEW ─────────────────────────────────────────
    if (view === 'forgotPassword') {
        return (
            <div className="max-w-sm mx-auto px-6 py-16">
                <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">Reset Password</h1>
                {error && <p className="mb-4 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{error}</p>}
                
                <form onSubmit={handleForgotPassword} className="space-y-4">
                    <p className="text-sm text-slate-600 mb-4">Enter your email address and we will send you a 6-digit OTP to reset your password.</p>
                    <input
                        type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                        required className="w-full border border-slate-300 rounded-lg px-4 py-2"
                    />
                    <button type="submit" className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700">Send Reset OTP</button>
                </form>
                
                <p className="text-sm text-slate-500 text-center mt-6">
                    <button onClick={() => switchView('login')} className="text-slate-800 font-medium underline">Back to Login</button>
                </p>
            </div>
        );
    }

    // ── ENTER NEW PASSWORD VIEW ─────────────────────────────────────────────
    if (view === 'resetPassword') {
        return (
            <div className="max-w-sm mx-auto px-6 py-16">
                <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">Enter New Password</h1>
                {successMsg && <p className="mb-4 text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg">{successMsg}</p>}
                {error && <p className="mb-4 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{error}</p>}
                
                <form onSubmit={handleResetPassword} className="space-y-4">
                    <p className="text-sm text-slate-600">Enter the OTP sent to <span className="font-semibold">{email}</span> and your new password.</p>
                    <input
                        type="text" placeholder="6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)}
                        required maxLength={6} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-center text-xl tracking-widest font-mono"
                    />
                    <input
                        type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)}
                        required minLength={6} className="w-full border border-slate-300 rounded-lg px-4 py-2"
                    />
                    <button type="submit" className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700">Update Password</button>
                </form>
                
                <p className="text-sm text-slate-500 text-center mt-6">
                    <button onClick={() => switchView('login')} className="text-slate-800 font-medium underline">Back to Login</button>
                </p>
            </div>
        );
    }

    // ── LOGIN / REGISTER VIEW ───────────────────────────────────────────────
    return (
        <div className="max-w-sm mx-auto px-6 py-16">
            <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                {view === 'register' ? 'Sign up' : 'Login'}
            </h1>

            {successMsg && <p className="mb-4 text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg">{successMsg}</p>}
            {error && <p className="mb-4 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                {view === 'register' && (
                    <input
                        type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)}
                        required className="w-full border border-slate-300 rounded-lg px-4 py-2"
                    />
                )}
                <input
                    type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                    required className="w-full border border-slate-300 rounded-lg px-4 py-2"
                />
                <input
                    type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                    required className="w-full border border-slate-300 rounded-lg px-4 py-2"
                />
                <button type="submit" className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700">
                    {view === 'register' ? 'Sign up' : 'Login'}
                </button>
            </form>

            {view === 'login' && (
                <p className="text-right mt-3">
                    <button onClick={() => switchView('forgotPassword')} className="text-sm text-slate-500 hover:text-slate-800 hover:underline">
                        Forgot Password?
                    </button>
                </p>
            )}

            <p className="text-sm text-slate-500 text-center mt-6">
                {view === 'register' ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button onClick={() => switchView(view === 'register' ? 'login' : 'register')} className="text-slate-800 font-medium underline">
                    {view === 'register' ? 'Login' : 'Sign up'}
                </button>
            </p>
        </div>
    );
}
