import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { context } from '../../src/App'
import axios from 'axios'

const OrgSupervisorSignin = () => {
    const navigate = useNavigate()
    const { setOrganizationSupervisorCred } = useContext(context)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSignin = (e) => {
        e.preventDefault()
        if (!email || !password) return alert('Please enter email and password')

        axios.post('http://localhost:5687/organization-supervisor/signin', {
            email_address: email,
            password: password
        })
        .then((res) => {
            const supervisorData = res?.data?.message
            setOrganizationSupervisorCred(supervisorData)
            alert('Welcome, ' + (supervisorData?.Full_Name || 'Industry Supervisor'))
            navigate('/organization-supervisor/dashboard')
        })
        .catch((err) => {
            alert(err?.response?.data?.message || 'Sign in failed. Verify your credentials.')
        })
    }

    return (
        <div className="min-h-screen bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
                        <span className="material-symbols-outlined text-3xl">badge</span>
                    </div>
                </div>
                <h2 className="mt-4 text-center text-3xl font-extrabold text-primary">Industry Supervisor Sign In</h2>
                <p className="mt-2 text-center text-sm text-on-surface-variant">
                    Access workplace intern logbooks, verify attendance, and submit sign-offs
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-surface-container-lowest py-8 px-6 shadow-xl rounded-2xl border border-outline-variant sm:px-10">
                    <form className="space-y-6" onSubmit={handleSignin}>
                        <div>
                            <label className="block text-sm font-medium text-on-surface-variant mb-1">Supervisor Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="supervisor@company.com"
                                className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-on-surface-variant mb-1">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-primary text-white font-bold rounded-xl shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">login</span>
                            Sign In to Portal
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-on-surface-variant">First time logging in or haven't set up password? </span>
                        <Link to="/organization-supervisor/signup" className="font-bold text-primary hover:underline">
                            Activate Account Here
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrgSupervisorSignin
