import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const SchoolSignup = () => {
    const navigate = useNavigate()
    const [Name, setName] = useState("")
    const [Mail, setMail] = useState("")
    const [password, setpassword] = useState("")
    const [Location, setLocation] = useState("")
    const [otpCode, setOtpCode] = useState("")
    const [isOtpSent, setIsOtpSent] = useState(false)
    const [isOtpVerified, setIsOtpVerified] = useState(false)
    const [otpLoading, setOtpLoading] = useState(false)
    const [loading, setLoading] = useState(false)

    const proceed = (e) => {
        e.preventDefault()
        if (!Name || !Mail || !password || !Location || !otpCode) {
            return alert("Please input all parameters including OTP code")
        }
        if (!isOtpVerified) {
            return alert("Please verify your email address with the OTP code first.")
        }
        if (password.length < 5) {
            return alert("Please use a strong password")
        }
        navigate("/school/signup/proceed", {
            state: {
                Name,
                Mail,
                password,
                Location,
                otpCode
            }
        })
    }

    const handleSendOtp = async () => {
        if (!Mail) return alert("Please enter the admin email address first.");
        setOtpLoading(true);
        try {
            const { default: axios } = await import('axios');
            await axios.post("http://localhost:5687/auth/otp/send", { email_address: Mail });
            alert("OTP sent to your email!");
            setIsOtpSent(true);
        } catch (err) {
            alert(err?.response?.data?.message || "Failed to send OTP.");
        } finally {
            setOtpLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otpCode) return alert("Please enter the OTP code.");
        setOtpLoading(true);
        try {
            const { default: axios } = await import('axios');
            await axios.post("http://localhost:5687/auth/otp/verify", { email_address: Mail, otp_code: otpCode });
            alert("Email verified successfully!");
            setIsOtpVerified(true);
        } catch (err) {
            alert(err?.response?.data?.message || "Invalid OTP code.");
        } finally {
            setOtpLoading(false);
        }
    };

    return (
        <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white border-b border-outline-variant shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-lg">school</span>
                    </div>
                    <span className="text-xl font-bold text-primary">
                        SIWES Management Portal
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/school/signin">
                        <button className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-all">
                            Already have an account? Sign In
                        </button>
                    </Link>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center pt-16 px-4 mt-8">
                <div className="w-full max-w-[900px] grid md:grid-cols-2 bg-white rounded-2xl overflow-hidden border border-outline-variant shadow-xl">
                    {/* Left Column Hero */}
                    <div className="relative hidden md:flex flex-col justify-end p-8 bg-primary text-white overflow-hidden">
                        <div className="relative z-10 space-y-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-2">
                                <span className="material-symbols-outlined text-3xl">school</span>
                            </div>
                            <h2 className="text-2xl font-bold">Institution Signup</h2>
                            <p className="text-sm opacity-90">
                                Step 1 of 2: Set up your basic institution details to get started with the SIWES management platform.
                            </p>
                        </div>
                    </div>

                    {/* Right Column Form */}
                    <div className="p-8 flex flex-col justify-center">
                        <div className="mb-6">
                            <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1 mb-1">
                                <span className="material-symbols-outlined text-sm">edit</span>
                                Step 1 of 2
                            </span>
                            <h1 className="text-2xl font-extrabold text-primary">Institution Signup</h1>
                            <p className="text-sm text-on-surface-variant mt-1">
                                Provide basic information to initialize registration.
                            </p>
                        </div>

                        <form className="space-y-4" onSubmit={proceed}>
                            <div>
                                <label className="block text-xs font-medium text-on-surface-variant mb-1">Institution Name</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-3 text-outline text-lg">account_balance</span>
                                    <input
                                        className="w-full h-11 pl-10 pr-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm"
                                        placeholder="e.g. SQI College of ICT"
                                        type="text"
                                        required
                                        value={Name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-on-surface-variant mb-1">Admin Email Address</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-3 text-outline text-lg">mail</span>
                                    <input
                                        className="w-full h-11 pl-10 pr-24 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm disabled:opacity-60"
                                        placeholder="admin@institution.edu.ng"
                                        type="email"
                                        required
                                        disabled={isOtpVerified}
                                        value={Mail}
                                        onChange={(e) => setMail(e.target.value)}
                                    />
                                    {!isOtpVerified && (
                                        <button
                                            type="button"
                                            onClick={handleSendOtp}
                                            disabled={otpLoading || !Mail}
                                            className="absolute right-1 top-1 h-9 px-3 bg-primary/10 text-primary hover:bg-primary/20 font-bold text-xs rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            {isOtpSent ? "Resend OTP" : "Get OTP"}
                                        </button>
                                    )}
                                    {isOtpVerified && (
                                        <span className="absolute right-3 top-3 material-symbols-outlined text-green-500 text-lg">check_circle</span>
                                    )}
                                </div>
                            </div>

                            {isOtpSent && !isOtpVerified && (
                                <div>
                                    <label className="block text-xs font-medium text-on-surface-variant mb-1">Enter Verification Code *</label>
                                    <div className="relative flex gap-2">
                                        <div className="relative flex-1">
                                            <span className="material-symbols-outlined absolute left-3 top-3 text-outline text-lg">pin</span>
                                            <input
                                                className="w-full h-11 pl-10 pr-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm tracking-widest font-bold"
                                                placeholder="123456"
                                                type="text"
                                                required
                                                value={otpCode}
                                                onChange={(e) => setOtpCode(e.target.value)}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleVerifyOtp}
                                            disabled={otpLoading || !otpCode}
                                            className="h-11 px-6 bg-primary text-white font-bold text-sm rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                                        >
                                            Verify
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-medium text-on-surface-variant mb-1">Password</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-3 text-outline text-lg">lock</span>
                                    <input
                                        className="w-full h-11 pl-10 pr-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm"
                                        placeholder="••••••••"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setpassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-on-surface-variant mb-1">Institution Physical Address</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-3 text-outline text-lg">location_on</span>
                                    <input
                                        className="w-full h-11 pl-10 pr-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm"
                                        placeholder="Enter full physical address..."
                                        type="text"
                                        required
                                        value={Location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                className="w-full h-11 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                type="submit"
                                disabled={!isOtpVerified}
                            >
                                <span>Next Step</span>
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>

                            <div className="text-center pt-2">
                                <p className="text-xs text-on-surface-variant">
                                    Already have an admin account?{' '}
                                    <Link to="/school/signin" className="text-primary font-bold hover:underline">
                                        Sign In Here
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default SchoolSignup