import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from "./pages/Home";
import Templates from './pages/Templates';
import TemplateDetail from './pages/TemplateDetail';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import MyBookings from './pages/MyBookings';
import Feedback from './pages/Feedback';
import WhatsAppButton from './components/WhatsAppButton';
import OurWork from './pages/OurWork';
import ProfilePage from './pages/ProfilePage';
import ProfileIncompleteToast from './components/ProfileIncompleteToast';
import MaintenanceBanner from './components/MaintenanceBanner';
import NotFound from './pages/NotFound';

export default function App() {
    return (
        <AuthProvider>
        <BrowserRouter>
          <MaintenanceBanner />
                <Navbar />
                <Routes>
                    <Route path="/"             element={<Home />} />
                    <Route path="/templates"    element={<Templates />} />
                    <Route path="/templates/:id" element={<TemplateDetail />} />
                    <Route path="/login"        element={<Login />} />
                    <Route path="/admin"        element={<AdminPanel />} />
                    <Route path="/my-bookings"  element={<MyBookings />} />
                    <Route path="/feedback"     element={<Feedback />} />
                    <Route path="/our-work"     element={<OurWork />} />
                    <Route path="/profile"      element={<ProfilePage />} />
                    <Route path="*"              element={<NotFound />} />
                </Routes>
                <Footer />
                <WhatsAppButton />
                {/* Shows only when logged in + profile incomplete */}
                <ProfileIncompleteToast />
            </BrowserRouter>
        </AuthProvider>
    );
}