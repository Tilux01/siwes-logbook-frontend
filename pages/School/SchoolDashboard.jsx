import React, { useContext, useEffect } from 'react'
import { context } from '../../src/App'
import { useNavigate, Link } from 'react-router-dom'
import user from '../../public/profile.png'
import axios from 'axios'

const SchoolDashboard = () => {
    const { schoolCred, studentList, setStudentList, setSchoolDepartments, schoolSupervisors, setSchoolSupervisors } = useContext(context)
    const navigate = useNavigate()

    useEffect(() => {
        if (!schoolCred) return navigate("/school/signin")

        // Fetch Students
        axios.post("http://localhost:5687/school/fetch/student", { id: schoolCred?.id })
            .then((res) => {
                setStudentList(res?.data?.message || [])
            })
            .catch((err) => console.log(err))

        // Fetch Departments
        axios.post("http://localhost:5687/school/register/department/fetch", { id: schoolCred?.id })
            .then((res) => {
                setSchoolDepartments(res?.data?.message || [])
            })
            .catch((err) => console.log(err))

        // Fetch Supervisors
        axios.post("http://localhost:5687/school/fetch/supervisor", { id: schoolCred?.id })
            .then((res) => {
                setSchoolSupervisors(res?.data?.message || [])
            })
            .catch((err) => console.log(err))
    }, [schoolCred])

    return (
        <div className="bg-surface min-h-screen flex">
            {/* Sidebar */}
            <aside className="h-screen w-64 flex flex-col fixed left-0 top-0 bg-slate-50 border-r border-slate-200 z-50">
                <div className="p-6 border-b border-slate-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm">
                        <span className="material-symbols-outlined">account_balance</span>
                    </div>
                    <div>
                        <h2 className="font-bold text-[16px] text-primary truncate max-w-[130px]">{schoolCred?.Name || 'Institution'}</h2>
                        <p className="text-[11px] text-slate-500 uppercase tracking-wider">SIWES Portal</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    <Link to="/school/dashboard" className="flex items-center gap-3 p-3 bg-primary text-white font-bold rounded-xl shadow-sm">
                        <span className="material-symbols-outlined">dashboard</span>
                        <span className="text-sm">Dashboard</span>
                    </Link>
                    <Link to="/school/dashboard/student" className="flex items-center gap-3 p-3 text-slate-600 hover:text-primary hover:bg-blue-50 rounded-xl transition-all font-medium">
                        <span className="material-symbols-outlined">school</span>
                        <span className="text-sm">Students</span>
                    </Link>
                    <Link to="/school/dashboard/supervisor" className="flex items-center gap-3 p-3 text-slate-600 hover:text-primary hover:bg-blue-50 rounded-xl transition-all font-medium">
                        <span className="material-symbols-outlined">supervisor_account</span>
                        <span className="text-sm">Supervisors</span>
                    </Link>
                    <Link to="/school/dashboard/department" className="flex items-center gap-3 p-3 text-slate-600 hover:text-primary hover:bg-blue-50 rounded-xl transition-all font-medium">
                        <span className="material-symbols-outlined">domain</span>
                        <span className="text-sm">Departments</span>
                    </Link>
                </nav>

                <div className="mt-auto p-4 space-y-2">
                    <button onClick={() => navigate("/school/dashboard/student")} className="w-full py-2.5 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all text-sm shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">person_add</span>
                        <span>Quick Add Student</span>
                    </button>
                    <div className="pt-4 border-t border-slate-200">
                        <button onClick={() => navigate("/")} className="w-full flex items-center gap-3 p-3 text-error hover:bg-error/10 rounded-xl transition-colors font-bold text-sm">
                            <span className="material-symbols-outlined">logout</span>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8 space-y-8">
                {/* Header */}
                <header className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full border-4 border-slate-50 shadow-sm overflow-hidden bg-slate-100 flex items-center justify-center text-primary">
                            <img src={schoolCred?.Profile_Img || user} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-primary">Welcome back, {schoolCred?.Name || "Institution"}</h2>
                            <p className="text-sm text-slate-500 mt-1">{schoolCred?.Mail || "Enrolled"}</p>
                        </div>
                    </div>
                </header>

                <div className="space-y-8 w-full">
                    {/* Summary Counters */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                                <span className="material-symbols-outlined text-[32px]">group</span>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Registered Students</p>
                                <h3 className="text-3xl font-black text-primary">{studentList?.length || 0}</h3>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <span className="material-symbols-outlined text-[32px]">work_history</span>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Students in Placement</p>
                                <h3 className="text-3xl font-black text-primary">
                                    {studentList?.filter(s => s.Start_Date).length || 0}
                                </h3>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
                                <span className="material-symbols-outlined text-[32px]">support_agent</span>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Academic Supervisors</p>
                                <h3 className="text-3xl font-black text-primary">{schoolSupervisors?.length || 0}</h3>
                            </div>
                        </div>
                    </section>

                    {/* Directory Sections */}
                    <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* Student Progress Directory */}
                        <div className="xl:col-span-2 space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-primary">Student Progress Directory</h2>
                                <button onClick={() => navigate("/school/dashboard/student")} className="px-4 py-2 bg-primary text-white rounded-lg font-bold text-xs hover:opacity-90 transition-all flex items-center gap-2 shadow-sm">
                                    <span className="material-symbols-outlined text-[18px]">add</span>
                                    Add New Student
                                </button>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                                            <th className="px-6 py-4 font-bold">Student</th>
                                            <th className="px-6 py-4 font-bold">Department / Matric</th>
                                            <th className="px-6 py-4 font-bold">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 text-sm">
                                        {(!studentList || studentList.length === 0) ? (
                                            <tr>
                                                <td colSpan="3" className="p-6 text-center text-slate-500 font-medium">No students registered yet. Click "Add New Student" to enroll.</td>
                                            </tr>
                                        ) : (
                                            studentList.slice(0, 5).map((student) => (
                                                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-primary font-bold overflow-hidden border border-slate-200">
                                                                <img src={student?.Profile_Img || user} alt="" className="w-full h-full object-cover" />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-primary">{student?.Full_Name}</p>
                                                                <p className="text-[12px] text-slate-500">{student?.email_address}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="font-medium text-slate-700">{student?.department}</p>
                                                        <p className="text-[12px] text-slate-500">{student?.Matriculation_No}</p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100">Enrolled</span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                                <div onClick={() => navigate("/school/dashboard/student")} className="p-4 bg-slate-50 flex justify-center cursor-pointer border-t border-slate-200 hover:bg-slate-100 transition-colors">
                                    <button className="text-primary font-bold text-sm">View All Students</button>
                                </div>
                            </div>
                        </div>

                        {/* Academic Supervisors Widget */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-primary">Assigned Supervisors</h2>
                                <button onClick={() => navigate("/school/dashboard/supervisor")} className="p-1.5 rounded-lg bg-slate-100 text-primary hover:bg-primary hover:text-white transition-all border border-slate-200">
                                    <span className="material-symbols-outlined text-sm">add</span>
                                </button>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-200 p-4 divide-y divide-slate-100 shadow-sm">
                                {(!schoolSupervisors || schoolSupervisors.length === 0) ? (
                                    <p className="p-4 text-center text-xs text-slate-500 font-medium">No academic supervisors registered yet.</p>
                                ) : (
                                    schoolSupervisors.slice(0, 4).map((sup) => (
                                        <div key={sup.id} onClick={() => navigate("/school/dashboard/supervisor")} className="py-3 flex items-center gap-3 hover:bg-slate-50 px-2 rounded-xl transition-colors cursor-pointer">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm overflow-hidden">
                                                {sup.Profile_Img ? (
                                                    <img src={sup.Profile_Img} alt={sup.Full_Name} className="w-full h-full object-cover" />
                                                ) : (
                                                    sup.Full_Name?.charAt(0) || 'S'
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-slate-800 text-sm">{sup.Full_Name}</h4>
                                                <p className="text-[12px] text-slate-500">{sup.department}</p>
                                            </div>
                                            <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="bg-primary p-6 rounded-2xl text-white shadow-md space-y-3 relative overflow-hidden">
                                <h3 className="text-md font-bold">Department Configuration</h3>
                                <p className="text-xs opacity-90 leading-relaxed">Manage academic departments, faculties, and HOD assignments for SIWES tracking.</p>
                                <button onClick={() => navigate("/school/dashboard/department")} className="px-4 py-2 mt-2 bg-white text-primary font-bold text-xs rounded-xl shadow-sm hover:bg-blue-50 transition-all">
                                    Manage Departments
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default SchoolDashboard