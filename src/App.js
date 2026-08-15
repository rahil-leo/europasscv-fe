import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import TemplateDetail from './pages/TemplateDetail';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import MyBookings from './pages/MyBookings';

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/templates/:id" element={<TemplateDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/my-bookings" element={<MyBookings />} />
                </Routes>
                <Footer />
            </BrowserRouter>
        </AuthProvider>
    );
}
