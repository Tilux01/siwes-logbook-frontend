import React, { useContext, useEffect, useState } from 'react'
import { context } from '../../src/App'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

const SchoolDepartmentDashboard = () => {
    const { schoolCred, studentList, schoolDepartments, setSchoolDepartments } = useContext(context)
    const navigate = useNavigate()
    const [departmentName, setdepartmentName] = useState("")
    const [facultyName, setfacultyName] = useState("Engineering")
    const [HODName, setHODName] = useState("")
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState(null)

    useEffect(() => {
        if (!schoolCred) return navigate("/")
    }, [schoolCred])

    useEffect(() => {
        console.log(schoolDepartments);
    }, [schoolDepartments])

    const handleSubmitDepartment = () => {
        if (!departmentName || !facultyName || !HODName) return alert("Please fill in all inputs")
        
        if (isEditing) {
            axios.post("http://localhost:5687/school/department/update", {
                id: editingId,
                departmentName,
                facultyName,
                HODName
            })
            .then(() => {
                setSchoolDepartments(prev => prev.map(d => d.id === editingId ? {
                    ...d,
                    department_name: departmentName,
                    faculty_name: facultyName,
                    Hod_name: HODName
                } : d))
                resetForm()
                alert("Department updated successfully")
            })
            .catch((err) => {
                alert(err?.response?.data?.message || "Error updating department")
            })
        } else {
            axios.post("http://localhost:5687/school/register/department", {
                departmentName,
                instituitionId: schoolCred?.id,
                facultyName,
                HODName
            })
            .then((output) => {
                setSchoolDepartments(prev => [...prev, {
                    id: output?.data?.message,
                    department_name: departmentName,
                    instituition_id: schoolCred?.id,
                    faculty_name: facultyName,
                    Hod_name: HODName
                }])
                resetForm()
                alert("Department created successfully")
            })
            .catch((error) => {
                alert(error?.response?.data?.message || "Error adding department")
            })
        }
    }

    const resetForm = () => {
        setdepartmentName("")
        setfacultyName("Engineering")
        setHODName("")
        setIsEditing(false)
        setEditingId(null)
    }

    const handleEditClick = (dept) => {
        setIsEditing(true)
        setEditingId(dept.id)
        setdepartmentName(dept.department_name)
        setfacultyName(dept.faculty_name)
        setHODName(dept.Hod_name)
    }

    const handleDeleteClick = (id) => {
        if (!window.confirm("Are you sure you want to delete this department?")) return
        axios.post("http://localhost:5687/school/department/delete", { id })
            .then(() => {
                setSchoolDepartments(prev => prev.filter(d => d.id !== id))
                alert("Department deleted successfully")
            })
            .catch((err) => {
                alert(err?.response?.data?.message || "Error deleting department")
            })
    }
    return (
        <div className="bg-slate-50 min-h-screen flex">
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
                    <Link to="/school/dashboard" className="flex items-center gap-3 p-3 text-slate-600 hover:text-primary hover:bg-blue-50 rounded-xl transition-all font-medium">
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
                    <Link to="/school/dashboard/department" className="flex items-center gap-3 p-3 bg-primary text-white font-bold rounded-xl shadow-sm">
                        <span className="material-symbols-outlined">domain</span>
                        <span className="text-sm">Departments</span>
                    </Link>
                </nav>

                <div className="mt-auto p-4 space-y-2">
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
                            <img src={schoolCred?.Profile_Img || "user"} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-primary">Department Configuration</h2>
                            <p className="text-sm text-slate-500 mt-1">{schoolCred?.Name}</p>
                        </div>
                    </div>
                </header>
                <div className="w-full space-y-8">
                    <nav className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                        <a className="hover:text-primary transition-colors" href="#">Portal</a>
                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        <span className="text-primary font-bold">Department Management</span>
                    </nav>
                    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-primary">{isEditing ? "Edit Department" : "Create New Department"}</h2>
                                <p className="text-slate-500 text-sm mt-1">{isEditing ? "Modify the department details." : "Configure academic divisions and assign Heads of Department."}</p>
                            </div>
                            <span className="material-symbols-outlined text-primary text-4xl opacity-10">domain_add</span>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-sm text-slate-700">Department Name</label>
                                    <input value={departmentName} onChange={(e) => { setdepartmentName(e.target.value) }} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" placeholder="e.g. Mechanical Engineering" type="text" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-sm text-slate-700">Faculty Name</label>
                                    <select value={facultyName} onChange={(e) => { setfacultyName(e.target.value) }} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none">
                                        <option>Engineering</option>
                                        <option>Science</option>
                                        <option>Social Sciences</option>
                                        <option>Management</option>
                                        <option>Arts &amp; Humanities</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-sm text-slate-700">HOD Name</label>
                                    <input value={HODName} onChange={(e) => { setHODName(e.target.value) }} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" placeholder="Search for staff member..." type="text" />
                                </div>
                                <div className="flex flex-col justify-end gap-2">
                                    <button onClick={handleSubmitDepartment} className="w-full h-[46px] bg-primary text-white font-bold rounded-xl shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined text-sm">{isEditing ? "save" : "add_circle"}</span>
                                        {isEditing ? "Save Changes" : "Create Department"}
                                    </button>
                                    {isEditing && (
                                        <button onClick={resetForm} className="w-full h-[36px] bg-slate-100 text-slate-600 font-bold rounded-xl shadow-sm hover:bg-slate-200 active:scale-95 transition-colors">
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-6">
                                <div>
                                    <h3 className="text-xl font-bold text-primary">Departments Directory</h3>
                                    <p className="text-slate-500 text-sm">Listing of all registered academic units and administrators.</p>
                                </div>
                                <div className="hidden lg:flex gap-4 border-l border-slate-200 pl-6">
                                    <div className="text-center">
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Total Depts</p>
                                        <p className="text-xl font-bold text-primary">{schoolDepartments?.length}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-100 transition-colors text-sm">
                                    <span className="material-symbols-outlined text-[18px]">filter_list</span>
                                    Filter
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-100 transition-colors text-sm">
                                    <span className="material-symbols-outlined text-[18px]">download</span>
                                    Export
                                </button>
                            </div>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 text-slate-500 sticky top-0 z-10 border-b border-slate-200 text-xs">
                                            <th className="px-6 py-4 font-bold uppercase tracking-wider">Department Name</th>
                                            <th className="px-6 py-4 font-bold uppercase tracking-wider">Faculty</th>
                                            <th className="px-6 py-4 font-bold uppercase tracking-wider">HOD Name</th>
                                            <th className="px-6 py-4 font-bold uppercase tracking-wider">Students</th>
                                            <th className="px-6 py-4 font-bold uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {schoolDepartments.slice().reverse().map((output) => {
                                            return (
                                                <tr key={output.id} className="hover:bg-slate-50 transition-colors group">
                                                    <td className="px-6 py-4 font-bold text-primary">{output?.department_name}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">{output?.faculty_name}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{output?.Hod_name}</td>
                                                    <td className="px-6 py-4 text-sm font-medium text-slate-500">{studentList?.filter((std) => std?.department === output?.department_name).length}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => handleEditClick(output)} className="p-1.5 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors" title="Edit">
                                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                                            </button>
                                                            <button onClick={() => handleDeleteClick(output.id)} className="p-1.5 hover:bg-red-100 rounded-lg text-red-600 transition-colors" title="Delete">
                                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                </div>
                <footer className="mt-auto p-6 text-center text-slate-400 text-xs mt-8">
                    <p>© 2024 Institutional SIWES Portal | Secured Management System v2.1.0</p>
                </footer>
            </main>

        </div>
    )
}

export default SchoolDepartmentDashboard