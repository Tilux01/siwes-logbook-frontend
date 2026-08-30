import axios from 'axios'
import React, { useContext, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { context } from '../../src/App'

const SchoolSignin = () => {
    const { setSchoolCred } = useContext(context)
    const navigate = useNavigate()
    const [mail, setMail] = useState("")
    const [password, setpassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const signin = (e) => {
        e.preventDefault()
        if (!mail || !password) return alert("Please fill in all parameters")
        setIsLoading(true)
        axios.post("http://localhost:5687/school/signin", {
            email_address: mail,
            password
        })
            .then((output) => {
                setSchoolCred(output?.data?.message)
                navigate("/school/dashboard")
            })
            .catch((error) => {
                alert(error?.response?.data?.message || "Sign in failed. Check credentials.")
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

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
                    <Link to="/">
                        <button className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-all">
                            Back Home
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
                                <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
                            </div>
                            <h2 className="text-2xl font-bold">School Admin Portal</h2>
                            <p className="text-sm opacity-90">
                                Access the institutional SIWES management portal to register departments, students, academic supervisors, and monitor progress.
                            </p>
                        </div>
                    </div>

                    {/* Right Column Form */}
                    <div className="p-8 flex flex-col justify-center">
                        <div className="mb-6">
                            <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1 mb-1">
                                <span className="material-symbols-outlined text-sm">verified</span>
                                Secure Sign In
                            </span>
                            <h1 className="text-2xl font-extrabold text-primary">Institution Login</h1>
                            <p className="text-sm text-on-surface-variant mt-1">
                                Enter your credentials to manage the portal.
                            </p>
                        </div>

                        <form className="space-y-4" onSubmit={signin}>
                            <div>
                                <label className="block text-xs font-medium text-on-surface-variant mb-1">Official Email Address</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-3 text-outline text-lg">mail</span>
                                    <input
                                        className="w-full h-11 pl-10 pr-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm"
                                        placeholder="name@institution.edu.ng"
                                        type="email"
                                        required
                                        value={mail}
                                        onChange={(e) => setMail(e.target.value)}
                                    />
                                </div>
                            </div>

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

                            <button
                                className="w-full h-11 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md mt-2"
                                type="submit"
                                disabled={isLoading}
                            >
                                <span className="material-symbols-outlined">login</span>
                                {isLoading ? "Signing In..." : "Sign In to Portal"}
                            </button>

                            <div className="text-center pt-2">
                                <p className="text-xs text-on-surface-variant">
                                    Don't have an admin account?{' '}
                                    <Link to="/school/signup" className="text-primary font-bold hover:underline">
                                        Register Here
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

export default SchoolSignin