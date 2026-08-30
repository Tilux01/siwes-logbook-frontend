import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { uploadImg } from '../../Cloudinary'

const OrganizationSignup = () => {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [location, setLocation] = useState('')
    const [contactAddress, setContactAddress] = useState('')
    const [cacImage, setCacImage] = useState('')
    const [otpCode, setOtpCode] = useState("")
    const [isOtpSent, setIsOtpSent] = useState(false)
    const [isOtpVerified, setIsOtpVerified] = useState(false)
    const [otpLoading, setOtpLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState("")

    const handleImageSelect = (file) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            return alert("Please select an image file.");
        }
        setSelectedFile(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleImageSelect(file);
    };

    const handleSignup = async (e) => {
        e.preventDefault()
        if (!name || !email || !password || !location || !selectedFile || !contactAddress || !otpCode) {
            return alert('Please fill in all required fields including OTP code and CAC Image')
        }
        if (!isOtpVerified) {
            return alert('Please verify your email address with the OTP code first.')
        }

        setLoading(true)

        let uploadedUrl = cacImage;
        if (selectedFile) {
            try {
                const base64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = (err) => reject(err);
                    reader.readAsDataURL(selectedFile);
                });
                const secureUrl = await uploadImg(base64);
                if (secureUrl) {
                    uploadedUrl = secureUrl;
                }
            } catch (err) {
                setLoading(false);
                return alert("Image upload failed. Please try again.");
            }
        }

        axios.post('http://localhost:5687/organization/signup', {
            Name: name,
            Email_Address: email,
            password: password,
            Location: location,
            CAC_Image: uploadedUrl,
            Contact_Adress: contactAddress,
            otp_code: otpCode
        })
        .then(() => {
            alert('Organization account registered successfully! Please log in.')
            navigate('/organization/signin')
        })
        .catch((err) => {
            alert(err?.response?.data?.message || 'Registration failed. Please try again.')
        })
        .finally(() => {
            setLoading(false)
        })
    }

    const handleSendOtp = async () => {
        if (!email) return alert("Please enter the official email address first.");
        setOtpLoading(true);
        try {
            await axios.post("http://localhost:5687/auth/otp/send", { email_address: email });
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
            await axios.post("http://localhost:5687/auth/otp/verify", { email_address: email, otp_code: otpCode });
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
                    <Link to="/organization/signin">
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
                                <span className="material-symbols-outlined text-3xl">corporate_fare</span>
                            </div>
                            <h2 className="text-2xl font-bold">Register Organization</h2>
                            <p className="text-sm opacity-90">
                                Register your company admin profile to host institutional SIWES interns, assign mentors, and verify training logbooks.
                            </p>
                        </div>
                    </div>

                    {/* Right Column Form */}
                    <div className="p-8 flex flex-col justify-center overflow-y-auto max-h-[80vh]">
                        <div className="mb-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1 mb-1">
                                <span className="material-symbols-outlined text-sm">edit</span>
                                Corporate Registration
                            </span>
                            <h1 className="text-xl font-extrabold text-primary">Partner Organization Registration</h1>
                            <p className="text-xs text-on-surface-variant mt-0.5">
                                Provide company credentials and address.
                            </p>
                        </div>

                        <form className="space-y-3" onSubmit={handleSignup}>
                            <div>
                                <label className="block text-xs font-medium text-on-surface-variant mb-1">Company / Organization Name *</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-3 text-outline text-lg">corporate_fare</span>
                                    <input
                                        className="w-full h-11 pl-10 pr-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none text-xs"
                                        placeholder="e.g. Apex Tech Solutions"
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-on-surface-variant mb-1">Official Email Address *</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-3 text-outline text-lg">mail</span>
                                    <input
                                        className="w-full h-11 pl-10 pr-24 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none text-xs disabled:opacity-60"
                                        placeholder="info@company.com"
                                        type="email"
                                        required
                                        disabled={isOtpVerified}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    {!isOtpVerified && (
                                        <button
                                            type="button"
                                            onClick={handleSendOtp}
                                            disabled={otpLoading || !email}
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
                                <label className="block text-xs font-medium text-on-surface-variant mb-1">Password *</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-3 text-outline text-lg">lock</span>
                                    <input
                                        className="w-full h-11 pl-10 pr-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none text-xs"
                                        placeholder="••••••••"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-on-surface-variant mb-1">Location / State *</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-3 text-outline text-lg">location_on</span>
                                    <input
                                        className="w-full h-11 pl-10 pr-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none text-xs"
                                        placeholder="e.g. Ikeja, Lagos"
                                        type="text"
                                        required
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-on-surface-variant mb-1">Official Address *</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-3 text-outline text-lg">home</span>
                                    <input
                                        className="w-full h-11 pl-10 pr-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none text-xs"
                                        placeholder="Enter corporate physical address..."
                                        type="text"
                                        required
                                        value={contactAddress}
                                        onChange={(e) => setContactAddress(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-on-surface-variant mb-1">CAC Document/Logo Image *</label>
                                <div
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    className="border-2 border-dashed border-outline-variant hover:border-primary rounded-xl p-4 bg-surface flex flex-col items-center justify-center cursor-pointer transition-all space-y-2 relative"
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="cac-image-upload"
                                        className="hidden"
                                        onChange={(e) => handleImageSelect(e.target.files[0])}
                                    />
                                    {previewUrl ? (
                                        <div className="flex items-center gap-4 w-full justify-between">
                                            <div className="flex items-center gap-3">
                                                <img src={previewUrl} alt="Preview" className="w-12 h-12 object-cover rounded-lg border shadow-sm" />
                                                <div>
                                                    <p className="text-xs font-bold text-on-surface">Ready for upload</p>
                                                    <span className="text-[10px] text-on-surface-variant block truncate max-w-[150px]">{selectedFile?.name}</span>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    setSelectedFile(null);
                                                    setPreviewUrl("");
                                                    setCacImage("");
                                                }}
                                                className="px-2 py-1 bg-error/10 hover:bg-error/20 text-error text-xs font-bold rounded-lg flex items-center gap-1"
                                            >
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <label htmlFor="cac-image-upload" className="w-full h-full flex flex-col items-center justify-center py-2 cursor-pointer">
                                            <span className="material-symbols-outlined text-outline text-3xl mb-1">cloud_upload</span>
                                            <p className="text-xs font-semibold text-on-surface-variant">Drag & Drop or <span className="text-primary hover:underline">browse</span></p>
                                        </label>
                                    )}
                                </div>
                            </div>

                            <button
                                className="w-full h-11 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md mt-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                type="submit"
                                disabled={loading || !isOtpVerified}
                            >
                                <span className="material-symbols-outlined text-sm">cloud_upload</span>
                                {loading ? "Registering..." : "Register Organization"}
                            </button>

                            <div className="text-center pt-1">
                                <p className="text-[11px] text-on-surface-variant">
                                    Already registered?{' '}
                                    <Link to="/organization/signin" className="text-primary font-bold hover:underline">
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

export default OrganizationSignup
