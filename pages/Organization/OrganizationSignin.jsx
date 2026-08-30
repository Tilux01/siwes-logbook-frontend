import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { context } from '../../src/App'
import axios from 'axios'

const OrganizationSignin = () => {
    const navigate = useNavigate()
    const { setOrganizationCred } = useContext(context)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSignin = (e) => {
        e.preventDefault()
        if (!email || !password) return alert('Please enter your email and password')

        axios.post('http://localhost:5687/organization/signin', {
            Email_Address: email,
            password: password
        })
        .then((res) => {
            const orgData = res?.data?.message
            setOrganizationCred(orgData)
            alert('Welcome back, ' + (orgData?.Name || 'Organization Admin'))
            navigate('/organization/dashboard')
        })
        .catch((err) => {
            alert(err?.response?.data?.message || 'Login failed. Please verify credentials.')
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
                                <span className="material-symbols-outlined text-3xl">corporate_fare</span>
                            </div>
                            <h2 className="text-2xl font-bold">Company Admin Portal</h2>
                            <p className="text-sm opacity-90">
                                Log in to verify intern daily schedules, approve student placement letters, and assign corporate industry supervisors.
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
                            <h1 className="text-2xl font-extrabold text-primary">Company Login</h1>
                            <p className="text-sm text-on-surface-variant mt-1">
                                Enter organization credentials to manage internships.
                            </p>
                        </div>

                        <form className="space-y-4" onSubmit={handleSignin}>
                            <div>
                                <label className="block text-xs font-medium text-on-surface-variant mb-1">Company Email Address</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-3 text-outline text-lg">mail</span>
                                    <input
                                        className="w-full h-11 pl-10 pr-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm"
                                        placeholder="admin@company.com"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                className="w-full h-11 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md mt-2"
                                type="submit"
                            >
                                <span className="material-symbols-outlined">login</span>
                                Sign In to Portal
                            </button>

                            <div className="text-center pt-2">
                                <p className="text-xs text-on-surface-variant">
                                    Need to register your organization?{' '}
                                    <Link to="/organization/signup" className="text-primary font-bold hover:underline">
                                        Register Company Here
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

export default OrganizationSignin
