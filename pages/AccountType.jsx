import { Link } from 'react-router-dom'

const AccountType = () => {
    return (
        <div>
            <header className="fixed top-0 left-0 w-full z-50 border-b border-outline-variant bg-white/80 backdrop-blur-md transition-all duration-200 ease-in-out">
                <nav className="flex justify-between items-center px-6 md:px-12 h-16 max-w-7xl mx-auto">
                    <div className="text-xl font-bold tracking-tight text-primary font-h2 flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-lg">
                                school
                            </span>
                        </div>
                        <span>SIWES Logbook</span>
                    </div>
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/" className="font-inter text-sm font-medium tracking-tight text-on-surface-variant hover:text-primary transition-all">
                            Home
                        </Link>
                        <Link to="/Support" className="font-inter text-sm font-medium tracking-tight text-on-surface-variant hover:text-primary transition-all">
                            Support
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/SignIn">
                            <button className="bg-primary text-white font-inter text-sm font-medium tracking-tight px-5 py-2 rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all">
                                Student Sign In
                            </button>
                        </Link>
                    </div>
                </nav>
            </header>
            <main className="pt-32 pb-xl px-gutter max-w-container-max mx-auto min-h-[calc(100vh-80px)] flex flex-col items-center">
                <div className="text-center mb-xl max-w-3xl">
                    <h1 className="font-headline-lg text-headline-lg text-primary font-extrabold mb-4">
                        Choose Your Account Type
                    </h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant">
                        Select the profile option that best describes your role to log in or register for the digital SIWES portal.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-md w-full">
                    {/* 1. Student Card */}
                    <Link to="/SignIn" className="block">
                        <div className="account-card transition-all bg-white border border-outline-variant p-md rounded-xl flex flex-col items-center text-center cursor-pointer group h-full hover:border-primary hover:shadow-xl">
                            <div className="icon-box w-14 h-14 rounded-full bg-blue-50 text-primary flex items-center justify-center mb-md group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[30px]">school</span>
                            </div>
                            <h3 className="font-bold text-lg text-primary mb-sm">Student Account</h3>
                            <p className="text-xs text-on-surface-variant mb-md">
                                Track industrial training, log daily tasks, and submit practical reports.
                            </p>
                            <div className="mt-auto pt-sm flex items-center text-primary font-bold text-xs group-hover:gap-xs transition-all">
                                <span>Sign In / Register</span>
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </div>
                        </div>
                    </Link>

                    {/* 2. School Admin Card */}
                    <Link to="/school/signin" className="block">
                        <div className="account-card transition-all bg-white border border-outline-variant p-md rounded-xl flex flex-col items-center text-center cursor-pointer group h-full hover:border-primary hover:shadow-xl">
                            <div className="icon-box w-14 h-14 rounded-full bg-blue-50 text-primary flex items-center justify-center mb-md group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[30px]">account_balance</span>
                            </div>
                            <h3 className="font-bold text-lg text-primary mb-sm">School Admin</h3>
                            <p className="text-xs text-on-surface-variant mb-md">
                                Oversee institutional SIWES programs, departments, and student rosters.
                            </p>
                            <div className="mt-auto pt-sm flex items-center text-primary font-bold text-xs group-hover:gap-xs transition-all">
                                <span>Sign In / Register</span>
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </div>
                        </div>
                    </Link>

                    {/* 3. Organization Admin Card */}
                    <Link to="/organization/signin" className="block">
                        <div className="account-card transition-all bg-white border border-outline-variant p-md rounded-xl flex flex-col items-center text-center cursor-pointer group h-full hover:border-primary hover:shadow-xl">
                            <div className="icon-box w-14 h-14 rounded-full bg-blue-50 text-primary flex items-center justify-center mb-md group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[30px]">corporate_fare</span>
                            </div>
                            <h3 className="font-bold text-lg text-primary mb-sm">Company Admin</h3>
                            <p className="text-xs text-on-surface-variant mb-md">
                                Manage corporate SIWES placements and pre-register industry supervisors.
                            </p>
                            <div className="mt-auto pt-sm flex items-center text-primary font-bold text-xs group-hover:gap-xs transition-all">
                                <span>Sign In / Register</span>
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </div>
                        </div>
                    </Link>

                    {/* 4. Academic / School Supervisor Card */}
                    <Link to="/Supervisor-Login" className="block">
                        <div className="account-card transition-all bg-white border border-outline-variant p-md rounded-xl flex flex-col items-center text-center cursor-pointer group h-full hover:border-primary hover:shadow-xl">
                            <div className="icon-box w-14 h-14 rounded-full bg-blue-50 text-primary flex items-center justify-center mb-md group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[30px]">workspace_premium</span>
                            </div>
                            <h3 className="font-bold text-lg text-primary mb-sm">Academic Supervisor</h3>
                            <p className="text-xs text-on-surface-variant mb-md">
                                Academic staff portal to assess student performance and grade logbooks.
                            </p>
                            <div className="mt-auto pt-sm flex items-center text-primary font-bold text-xs group-hover:gap-xs transition-all">
                                <span>Sign In</span>
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </div>
                        </div>
                    </Link>

                    {/* 5. Industry / Company Supervisor Card */}
                    <Link to="/organization-supervisor/signin" className="block">
                        <div className="account-card transition-all bg-white border border-outline-variant p-md rounded-xl flex flex-col items-center text-center cursor-pointer group h-full hover:border-primary hover:shadow-xl">
                            <div className="icon-box w-14 h-14 rounded-full bg-blue-50 text-primary flex items-center justify-center mb-md group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[30px]">badge</span>
                            </div>
                            <h3 className="font-bold text-lg text-primary mb-sm">Industry Supervisor</h3>
                            <p className="text-xs text-on-surface-variant mb-md">
                                Workplace supervisor portal to verify intern daily tasks and sign logbooks.
                            </p>
                            <div className="mt-auto pt-sm flex items-center text-primary font-bold text-xs group-hover:gap-xs transition-all">
                                <span>Sign In / Activate</span>
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </div>
                        </div>
                    </Link>
                </div>
            </main>
            <footer className="bg-slate-50 dark:bg-slate-950 w-full py-8 border-t border-slate-200 dark:border-slate-800">
                <div className="flex flex-col md:flex-row justify-between items-center px-8 gap-4 max-w-screen-xl mx-auto">
                    <div className="font-bold text-slate-700">
                        SIWES Logbook Management
                    </div>
                    <div className="text-xs font-normal text-slate-500 dark:text-slate-400">
                        © 2026 SIWES Logbook Management System. All academic rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default AccountType
