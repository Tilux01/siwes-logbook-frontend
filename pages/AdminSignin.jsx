import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminSignin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:5687/admin/login', {
                email,
                password
            });

            if (res.data.status === "OK") {
                // Navigate to OTP page, we can reuse the existing OtpVerification page
                // Or handle OTP directly. Let's use OTP page.
                // We will need to pass the adminData so OtpVerification knows who is logging in
                // Actually, the OTP verification needs an endpoint. The current OTP flow is for user registration/login.
                // Let's pass state to OtpVerification
                navigate('/OTP-Verification', { 
                    state: { 
                        email: email, 
                        isSuperAdmin: true, 
                        adminData: res.data.adminData 
                    } 
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary-container text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
                    </div>
                    <h1 className="text-2xl font-h1 font-bold text-primary">Super Admin Portal</h1>
                    <p className="text-sm text-on-surface-variant font-medium mt-2">Restricted access. Authorized personnel only.</p>
                </div>

                {error && (
                    <div className="bg-error-container text-error text-sm p-3 rounded-lg mb-6 font-medium text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-on-surface mb-1.5">Admin Email</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">mail</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                                placeholder="Enter admin email"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-on-surface mb-1.5">Secure Password</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">lock</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                                placeholder="Enter secure password"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-4 shadow-sm"
                    >
                        {loading ? 'Authenticating...' : 'Secure Login'}
                        {!loading && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminSignin;
