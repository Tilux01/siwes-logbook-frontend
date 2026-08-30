import React, { useContext, useEffect, useState } from 'react'
import { context } from '../../src/App'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

const SchoolDashbaordSupervisor = () => {
    const navigate = useNavigate()
    const { schoolCred, studentList, schoolDepartments, schoolSupervisors, setSchoolSupervisors } = useContext(context)
    const [fullName, setFullName] = useState("")
    const [emailAddress, setEmailAddress] = useState('')
    const [Department, setDepartment] = useState("")
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState(null)

    useEffect(() => {
        if (!schoolCred) return navigate("/")
        
        axios.post("http://localhost:5687/school/fetch/supervisor", { id: schoolCred?.id })
            .then((res) => {
                setSchoolSupervisors(res?.data?.message || [])
            })
            .catch((err) => {
                console.log(err)
            })
    }, [schoolCred])

    useEffect(() => {
        if (schoolDepartments?.length > 0 && !Department) {
            setDepartment(schoolDepartments[0].department_name)
        }
    }, [schoolDepartments])

    const handleSubmitSupervisor = () => {
        if (!fullName || !emailAddress || !Department) return alert("Please fill in all parameters")
        
        if (isEditing) {
            axios.post("http://localhost:5687/school/supervisor/update", {
                id: editingId,
                Full_Name: fullName,
                Email_Address: emailAddress,
                department: Department
            })
            .then(() => {
                setSchoolSupervisors(prev => prev.map(s => s.id === editingId ? {
                    ...s,
                    Full_Name: fullName,
                    Email_Address: emailAddress,
                    department: Department
                } : s))
                resetForm()
                alert("Supervisor updated successfully")
            })
            .catch((err) => {
                alert(err?.response?.data?.message || "Error updating supervisor")
            })
        } else {
            axios.post("http://localhost:5687/school/register/supervisor", {
                Full_Name: fullName,
                Email_Address: emailAddress,
                Instituition_Id: schoolCred?.id,
                department: Department
            })
            .then((res) => {
                const newId = res?.data?.message
                setSchoolSupervisors(prev => [...prev, {
                    id: newId,
                    Full_Name: fullName,
                    Email_Address: emailAddress,
                    Instituition_Id: schoolCred?.id,
                    department: Department
                }])
                resetForm()
                alert("Supervisor registered successfully")
            })
            .catch((error) => {
                alert(error?.response?.data?.message || "Error adding supervisor")
            })
        }
    }

    const resetForm = () => {
        setFullName("")
        setEmailAddress("")
        if (schoolDepartments?.length > 0) {
            setDepartment(schoolDepartments[0].department_name)
        } else {
            setDepartment("")
        }
        setIsEditing(false)
        setEditingId(null)
    }

    const handleEditClick = (sup) => {
        setIsEditing(true)
        setEditingId(sup.id)
        setFullName(sup.Full_Name)
        setEmailAddress(sup.Email_Address)
        setDepartment(sup.department)
    }

    const handleDeleteClick = (id) => {
        if (!window.confirm("Are you sure you want to delete this supervisor?")) return
        axios.post("http://localhost:5687/school/supervisor/delete", { id })
            .then(() => {
                setSchoolSupervisors(prev => prev.filter(s => s.id !== id))
                alert("Supervisor deleted successfully")
            })
            .catch((err) => {
                alert(err?.response?.data?.message || "Error deleting supervisor")
            })
    }
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
                    <Link to="/school/dashboard" className="flex items-center gap-3 p-3 text-slate-600 hover:text-primary hover:bg-blue-50 rounded-xl transition-all font-medium">
                        <span className="material-symbols-outlined">dashboard</span>
                        <span className="text-sm">Dashboard</span>
                    </Link>
                    <Link to="/school/dashboard/student" className="flex items-center gap-3 p-3 text-slate-600 hover:text-primary hover:bg-blue-50 rounded-xl transition-all font-medium">
                        <span className="material-symbols-outlined">school</span>
                        <span className="text-sm">Students</span>
                    </Link>
                    <Link to="/school/dashboard/supervisor" className="flex items-center gap-3 p-3 bg-primary text-white font-bold rounded-xl shadow-sm">
                        <span className="material-symbols-outlined">supervisor_account</span>
                        <span className="text-sm">Supervisors</span>
                    </Link>
                    <Link to="/school/dashboard/department" className="flex items-center gap-3 p-3 text-slate-600 hover:text-primary hover:bg-blue-50 rounded-xl transition-all font-medium">
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
                            <h2 className="text-2xl font-bold text-primary">Supervisor Configuration</h2>
                            <p className="text-sm text-slate-500 mt-1">{schoolCred?.Name}</p>
                        </div>
                    </div>
                </header>
                <div className="flex-1 overflow-hidden flex flex-col space-y-8">
                    <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-500">{isEditing ? "edit" : "person_add"}</span>
                                {isEditing ? "Edit Registration" : "Quick Registration"}
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6 items-end">
                            <div className="lg:col-span-3">
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Full Name</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">badge</span>
                                    <input value={fullName} onChange={(e)=>{setFullName(e.target.value)}} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm outline-none" placeholder="e.g. Dr. Jane Smith" type="text" />
                                </div>
                            </div>
                            <div className="lg:col-span-3">
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">mail</span>
                                    <input value={emailAddress} onChange={(e)=>{setEmailAddress(e.target.value)}} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm outline-none" placeholder="jane.smith@university.edu" type="email" />
                                </div>
                            </div>
                            <div className="lg:col-span-3">
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Department</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">apartment</span>
                                    <select value={Department} onChange={(e)=>{setDepartment(e.target.value)}} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm outline-none appearance-none">
                                        {
                                            schoolDepartments?.map((output)=>{
                                                return(
                                                    <option key={output?.id} value={output?.department_name}>{output?.department_name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="lg:col-span-3 flex flex-col gap-2">
                                <button onClick={handleSubmitSupervisor} className="w-full bg-primary text-white h-[44px] rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm" >
                                    <span className="material-symbols-outlined">{isEditing ? "save" : "add"}</span>
                                    {isEditing ? "Save Changes" : "Add Supervisor"}
                                </button>
                                {isEditing && (
                                    <button onClick={resetForm} className="w-full bg-slate-100 text-slate-600 h-[36px] rounded-xl font-bold flex items-center justify-center hover:bg-slate-200 transition-colors" >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    </section>
                    <div className="flex-1 overflow-hidden flex flex-col min-h-0 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold text-primary">Supervisor Directory</h3>
                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[12px] font-bold border border-blue-100">{schoolSupervisors?.length} Active</span>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {schoolSupervisors.slice().reverse().map((sup) => {
                                    const studentCount = studentList?.filter(s => s.School_Supervisor_Id === sup.id).length || 0;
                                    const initials = sup.Full_Name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'SP';
                                    return (
                                        <div key={sup.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group relative">
                                            <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEditClick(sup)} className="p-1.5 hover:bg-blue-100 rounded text-blue-600 transition-colors" title="Edit">
                                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                                </button>
                                                <button onClick={() => handleDeleteClick(sup.id)} className="p-1.5 hover:bg-red-100 rounded text-red-600 transition-colors" title="Delete">
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl overflow-hidden border-2 border-white shadow-sm">
                                                    {sup.Profile_Img ? (
                                                        <img src={sup.Profile_Img} alt={sup.Full_Name} className="w-full h-full object-cover" />
                                                    ) : initials}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-primary text-lg leading-tight">{sup.Full_Name}</h4>
                                                    <p className="text-sm text-slate-500 mt-0.5">{sup.department}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-3 pt-4 border-t border-slate-200">
                                                <div className="flex items-center gap-3 text-slate-600">
                                                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                                                        <span className="material-symbols-outlined text-[16px]">mail</span>
                                                    </div>
                                                    <p className="text-sm truncate font-medium">{sup.Email_Address}</p>
                                                </div>
                                                <div className="flex items-center gap-3 text-slate-600">
                                                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                                                        <span className="material-symbols-outlined text-[16px]">group</span>
                                                    </div>
                                                    <p className="text-sm font-medium"><strong className="text-slate-800">{studentCount}</strong> Assigned Students</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <button className="fixed bottom-8 right-8 w-14 h-14 bg-secondary text-on-secondary rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-transform z-50">
                    <span className="material-symbols-outlined text-[28px]">support_agent</span>
                </button>
            </main>

        </div>
    )
}

export default SchoolDashbaordSupervisor