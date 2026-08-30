const CoordinatorDashboard = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 fixed left-0 top-0 h-screen bg-slate-50 border-r border-slate-200 flex flex-col p-4 z-50">
                <div className="flex items-center gap-3 px-3 py-4 border-b border-slate-200 mb-4">
                    <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined">school</span>
                    </div>
                    <div>
                        <h2 className="font-bold text-[16px] text-primary truncate max-w-[130px]">SIWES Portal</h2>
                        <span className="text-[11px] text-slate-500 uppercase tracking-wider">Academic Mgmt</span>
                    </div>
                </div>

                <nav className="flex-1 space-y-2 px-2">
                    <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all font-medium text-left bg-primary text-white font-bold shadow-sm">
                        <span className="material-symbols-outlined">dashboard</span>
                        Dashboard
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all font-medium text-left text-slate-600 hover:text-primary hover:bg-blue-50">
                        <span className="material-symbols-outlined">edit_note</span>
                        Daily Logs
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all font-medium text-left text-slate-600 hover:text-primary hover:bg-blue-50">
                        <span className="material-symbols-outlined">supervisor_account</span>
                        Supervision
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all font-medium text-left text-slate-600 hover:text-primary hover:bg-blue-50">
                        <span className="material-symbols-outlined">settings</span>
                        Settings
                    </button>
                </nav>

                <div className="border-t border-slate-200 pt-4 px-2 space-y-2">
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-blue-50 hover:text-primary font-bold text-sm transition-colors">
                        <span className="material-symbols-outlined">help</span>
                        Help Center
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl text-error hover:bg-error/10 font-bold text-sm transition-colors">
                        <span className="material-symbols-outlined">logout</span>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-primary">Welcome, Dr. Sarah Jenkins</h1>
                        <p className="text-sm text-slate-500 mt-1">SIWES Supervisor</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative w-64">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                            <input className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" placeholder="Search students..." type="text" />
                        </div>
                        <img
                            alt="User profile avatar"
                            className="w-10 h-10 rounded-full border border-slate-200 object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC97-1S91-fUVlzeMumw0HaRL2XCVKIXCY2iTJq8O7fzcg88JqgbJLssVIhUy_y4-_1TK2v-AFMXnsXSaomhRwRS2naLYpcqQ_DAQBvcEaczm7bTLicEE9Tj72N9Ou3lb14AlOdxRWxVoq-UutC8gpe9LYkrsHI7eYsLn-Y7MOoyNqUHTLAx3ibpeIkcOTtTzE_KDqwotiU1tBaDOz3xd2BEi3hT2NbFsUDZ215Z_qVA0bnSqQglGjEzNTxQx2eTLWruv1Kfr2CgYoZ"
                        />
                    </div>
                </div>

                <div className="space-y-6 max-w-7xl mx-auto w-full">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-lg font-bold text-primary">
                            Student Supervision Dashboard
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Overseeing 24 students across 3 departments for the 2024 SIWES Session.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                            <span className="material-symbols-outlined text-sm">file_download</span>
                            Export Reports
                        </button>
                        <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm">
                            <span className="material-symbols-outlined text-sm">add</span>
                            Schedule Review
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-blue-900">group</span>
                            </div>
                            <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2 py-1 rounded-full">
                                Active
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-primary">24</p>
                        <p className="text-sm font-medium text-slate-500">
                            Assigned Students
                        </p>
                    </div>
                    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-yellow-600">pending_actions</span>
                            </div>
                            <span className="text-xs font-bold text-yellow-800 bg-yellow-100 px-2 py-1 rounded-full">
                                Action Required
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-primary">12</p>
                        <p className="text-sm font-medium text-slate-500">
                            Pending Log Reviews
                        </p>
                    </div>
                    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-emerald-600">task_alt</span>
                            </div>
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-1 rounded-full">
                                Compliant
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-primary">82%</p>
                        <p className="text-sm font-medium text-slate-500">
                            Average Log Completion
                        </p>
                    </div>
                    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                                <span className="material-symbols-outlined text-red-600">warning</span>
                            </div>
                            <span className="text-xs font-bold text-red-800 bg-red-100 px-2 py-1 rounded-full">
                                Critical
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-primary">3</p>
                        <p className="text-sm font-medium text-slate-500">
                            Students Not Reporting
                        </p>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600">
                                <span className="material-symbols-outlined text-sm">filter_list</span>
                                <span className="font-medium">Department:</span>
                                <select className="bg-transparent border-none p-0 text-sm focus:ring-0 cursor-pointer text-primary font-bold outline-none">
                                    <option>All Departments</option>
                                    <option>Computer Science</option>
                                    <option>Mechanical Engineering</option>
                                    <option>Architecture</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600">
                                <span className="font-medium">Status:</span>
                                <select className="bg-transparent border-none p-0 text-sm focus:ring-0 cursor-pointer text-primary font-bold outline-none">
                                    <option>All Statuses</option>
                                    <option>On Track</option>
                                    <option>Pending Action</option>
                                    <option>At Risk</option>
                                </select>
                            </div>
                        </div>
                        <div className="text-sm text-slate-500 font-medium">
                            Showing <span className="font-bold text-slate-800">10</span> of 24 students
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                                    <th className="p-4 font-bold">Student Name</th>
                                    <th className="p-4 font-bold">Department</th>
                                    <th className="p-4 font-bold">Organization</th>
                                    <th className="p-4 font-bold">Progress Summary</th>
                                    <th className="p-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 text-sm">
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xs border border-blue-200">
                                                AA
                                            </div>
                                            <div>
                                                <p className="font-bold text-primary">Adebayo, Ayomide</p>
                                                <p className="text-xs text-slate-500 font-mono">CSC/2021/043</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium text-slate-700">Computer Science</td>
                                    <td className="p-4 font-medium text-slate-700">Mainframe Solutions Ltd.</td>
                                    <td className="p-4">
                                        <div className="px-2.5 py-1 w-max rounded-full bg-yellow-100 text-yellow-800 text-[10px] font-bold flex items-center gap-1 border border-yellow-200">
                                            <span className="material-symbols-outlined text-[12px]">priority_high</span>
                                            3 PENDING LOGS
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-primary hover:underline text-sm font-bold">Review Logs</button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold text-xs border border-indigo-200">
                                                BT
                                            </div>
                                            <div>
                                                <p className="font-bold text-primary">Benson, Tamara</p>
                                                <p className="text-xs text-slate-500 font-mono">MEE/2021/112</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium text-slate-700">Mechanical Engineering</td>
                                    <td className="p-4 font-medium text-slate-700">Dangote Refinery</td>
                                    <td className="p-4">
                                        <div className="px-2.5 py-1 w-max rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1 border border-emerald-200">
                                            <span className="material-symbols-outlined text-[12px]">check</span>
                                            ON TRACK
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-primary hover:underline text-sm font-bold">Review Logs</button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-900 flex items-center justify-center font-bold text-xs border border-purple-200">
                                                CI
                                            </div>
                                            <div>
                                                <p className="font-bold text-primary">Chukwu, Ikechukwu</p>
                                                <p className="text-xs text-slate-500 font-mono">ARC/2021/015</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium text-slate-700">Architecture</td>
                                    <td className="p-4 font-medium text-slate-700">Urban Designs Studio</td>
                                    <td className="p-4">
                                        <div className="px-2.5 py-1 w-max rounded-full bg-yellow-100 text-yellow-800 text-[10px] font-bold flex items-center gap-1 border border-yellow-200">
                                            <span className="material-symbols-outlined text-[12px]">schedule</span>
                                            1 PENDING LOG
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-primary hover:underline text-sm font-bold">Review Logs</button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xs border border-blue-200">
                                                DL
                                            </div>
                                            <div>
                                                <p className="font-bold text-primary">David, Lawal</p>
                                                <p className="text-xs text-slate-500 font-mono">CSC/2021/098</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium text-slate-700">Computer Science</td>
                                    <td className="p-4 font-medium text-slate-700">Interswitch Group</td>
                                    <td className="p-4">
                                        <div className="px-2.5 py-1 w-max rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1 border border-emerald-200">
                                            <span className="material-symbols-outlined text-[12px]">check</span>
                                            ON TRACK
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-primary hover:underline text-sm font-bold">Review Logs</button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-red-100 text-red-900 flex items-center justify-center font-bold text-xs border border-red-200">
                                                ES
                                            </div>
                                            <div>
                                                <p className="font-bold text-primary">Eze, Somto</p>
                                                <p className="text-xs text-slate-500 font-mono">MEE/2021/022</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium text-slate-700">Mechanical Engineering</td>
                                    <td className="p-4 font-medium text-slate-700">Shell Nigeria</td>
                                    <td className="p-4">
                                        <div className="px-2.5 py-1 w-max rounded-full bg-red-100 text-red-800 text-[10px] font-bold flex items-center gap-1 border border-red-200">
                                            <span className="material-symbols-outlined text-[12px]">warning</span>
                                            7 DAYS NO LOG
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-primary hover:underline text-sm font-bold">Review Logs</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 flex items-center justify-between bg-white border-t border-slate-200">
                        <p className="text-sm font-medium text-slate-500">
                            Showing page 1 of 3
                        </p>
                        <div className="flex gap-2">
                            <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-400 bg-slate-50 cursor-not-allowed">
                                Previous
                            </button>
                            <button className="px-3 py-1.5 border border-primary rounded-lg text-sm text-white bg-primary font-bold shadow-sm">
                                1
                            </button>
                            <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 bg-white hover:bg-slate-50 transition-colors">
                                2
                            </button>
                            <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 bg-white hover:bg-slate-50 transition-colors">
                                3
                            </button>
                            <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-700 font-bold bg-white hover:bg-slate-50 transition-colors shadow-sm">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            </main>
        </div>
    )
}

export default CoordinatorDashboard;
