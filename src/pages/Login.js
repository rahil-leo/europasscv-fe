import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        try {
            const url = isRegister ? '/auth/register' : '/auth/login';
            const body = isRegister ? { name, email, password } : { email, password };
            const res = await api.post(url, body);
            login(res.data.token, res.data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    }

    return (
        <div className="max-w-sm mx-auto px-6 py-16">
            <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                {isRegister ? 'Sign up' : 'Login'}
            </h1>

            {error && <p className="mb-4 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                {isRegister && (
                    <input
                        type="text"
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full border border-slate-300 rounded-lg px-4 py-2"
                    />
                )}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-2"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-2"
                />
                <button type="submit" className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700">
                    {isRegister ? 'Sign up' : 'Login'}
                </button>
            </form>

            <p className="text-sm text-slate-500 text-center mt-4">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button onClick={() => setIsRegister(!isRegister)} className="text-slate-800 font-medium underline">
                    {isRegister ? 'Login' : 'Sign up'}
                </button>
            </p>
        </div>
    );
}
