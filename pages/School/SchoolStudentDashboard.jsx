import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { context } from '../../src/App'
import user from '../../public/profile.png'
import axios from 'axios'

const SchoolStudentDashboard = () => {
    const { schoolCred, setSchoolCred, studentList, setStudentList, schoolDepartments } = useContext(context)
    const navigate = useNavigate()
    const [fullName, setFullName] = useState("")
    const [supervisorId, setSupervisorId] = useState("")
    const [emailAdress, setEmailAddress] = useState("")
    const [matricNo, setMatricNo] = useState("")
    const [department, setDepartment] = useState("")
    const [startDate, setStartDat] = useState("")
    const [endDate, setEndDate] = useState("")
    const [supervisorsList, setSupervisorsList] = useState([])
    const [isEditing, setIsEditing] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [selectedStudentLogs, setSelectedStudentLogs] = useState([])

    const handleOpenStudentDetails = (student) => {
        navigate(`/student-performance/${student.id}`)
    }

    useEffect(() => {
        if (!schoolCred) return navigate("/")

        axios.post("http://localhost:5687/school/fetch/supervisor", { id: schoolCred?.id })
            .then((res) => {
                const list = res?.data?.message || []
                setSupervisorsList(list)
                if (list.length > 0) {
                    setSupervisorId(list[0].id)
                }
            })
            .catch((err) => {
                console.log(err)
            })

        axios.post("http://localhost:5687/student/fetch-detailed", { instituition_id: schoolCred?.id })
            .then((students) => {
                setStudentList(students?.data?.message || [])
            })
            .catch((err) => console.log(err))
    }, [schoolCred])

    useEffect(() => {
        if (schoolDepartments?.length > 0 && !department) {
            setDepartment(schoolDepartments[0].department_name)
        }
    }, [schoolDepartments])

    const handleSubmitStudent = () => {
        if (!fullName || !emailAdress || !supervisorId || !matricNo || !department || !startDate || !endDate) {
            return alert("Please fill in all parameters")
        }

        if (isEditing) {
            axios.post("http://localhost:5687/school/student/update", {
                id: editingId,
                Full_Name: fullName,
                email_address: emailAdress,
                Matriculation_No: matricNo,
                department,
                Start_Date: startDate,
                End_Date: endDate
            })
            .then(() => {
                setStudentList(prev => prev.map(s => s.id === editingId ? {
                    ...s,
                    Full_Name: fullName,
                    email_address: emailAdress,
                    Matriculation_No: matricNo,
                    department,
                    Start_Date: startDate,
                    End_Date: endDate
                } : s))
                resetForm()
                alert("Student updated successfully")
            })
            .catch((err) => {
                alert(err?.response?.data?.message || "Error updating student")
            })
        } else {
            axios.post("http://localhost:5687/school/register/student", {
                Full_Name: fullName,
                Instituition_Id: schoolCred?.id,
                School_Supervisor_Id: supervisorId,
                email_address: emailAdress,
                Matriculation_No: matricNo,
                department,
                Instituition_Mail: schoolCred?.Mail,
                Start_Date: startDate,
                End_Date: endDate
            })
            .then((res) => {
                const newId = res?.data?.message?.insertId || res?.data?.message
                setStudentList(prev => [...prev, {
                    id: newId,
                    Full_Name: fullName,
                    email_address: emailAdress,
                    Matriculation_No: matricNo,
                    department,
                    Start_Date: startDate,
                    End_Date: endDate,
                    School_Supervisor_Id: supervisorId
                }])
                resetForm()
                alert("Student enrolled successfully")
            })
            .catch((err) => {
                alert(err?.response?.data?.message || "Error enrolling student")
            })
        }
    }

    const resetForm = () => {
        setFullName("")
        setEmailAddress("")
        setMatricNo("")
        setStartDat("")
        setEndDate("")
        setIsEditing(false)
        setEditingId(null)
    }

    const handleEditClick = (student) => {
        setIsEditing(true)
        setEditingId(student.id)
        setFullName(student.Full_Name)
        setEmailAddress(student.email_address)
        setMatricNo(student.Matriculation_No)
        setDepartment(student.department)
        setSupervisorId(student.School_Supervisor_Id)
        
        if (student.Start_Date) {
            setStartDat(new Date(student.Start_Date).toISOString().split('T')[0])
        }
        if (student.End_Date) {
            setEndDate(new Date(student.End_Date).toISOString().split('T')[0])
        }
    }

    const handleDeleteClick = (id) => {
        if (!window.confirm("Are you sure you want to delete this student?")) return
        axios.post("http://localhost:5687/school/student/delete", { id })
            .then(() => {
                setStudentList(prev => prev.filter(s => s.id !== id))
                alert("Student deleted successfully")
            })
            .catch((err) => {
                alert(err?.response?.data?.message || "Error deleting student")
            })
    }
    return (
        <div className="bg-slate-50 min-h-screen flex pb-16 md:pb-0">
            {/* Sidebar */}
            <aside className="hidden md:flex h-screen w-64 flex-col fixed left-0 top-0 bg-slate-50 border-r border-slate-200 z-50">
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
                    <Link to="/school/dashboard/student" className="flex items-center gap-3 p-3 bg-primary text-white font-bold rounded-xl shadow-sm">
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
                    <div className="pt-4 border-t border-slate-200">
                        <button onClick={() => navigate("/")} className="w-full flex items-center gap-3 p-3 text-error hover:bg-error/10 rounded-xl transition-colors font-bold text-sm">
                            <span className="material-symbols-outlined">logout</span>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="md:ml-64 flex-1 p-4 md:p-8 space-y-8 w-full">
                {/* Header */}
                <header className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hidden md:flex">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full border-4 border-slate-50 shadow-sm overflow-hidden bg-slate-100 flex items-center justify-center text-primary">
                            <img src={schoolCred?.Profile_Img || user} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-primary">Students Directory</h2>
                            <p className="text-sm text-slate-500 mt-1">{schoolCred?.Name}</p>
                        </div>
                    </div>
                </header>
                <div className="w-full space-y-8">
                    <nav className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                        <a className="hover:text-primary transition-colors" href="#">Portal</a>
                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        <span className="text-primary font-bold">Students Directory</span>
                    </nav>
                    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-primary">{isEditing ? "Edit Student" : "Add New Student"}</h2>
                                <p className="text-slate-500 text-sm mt-1">{isEditing ? "Modify student enrollment details." : "Enroll a new student into the SIWES management system."}</p>
                            </div>
                            <span className="material-symbols-outlined text-primary text-4xl opacity-10">person_add</span>
                        </div>
                        <div className="p-6 grid grid-cols-1 gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-sm text-slate-700">Full Name</label>
                                    <input value={fullName} onChange={(e) => { setFullName(e.target.value) }} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" placeholder="e.g. John Doe" type="text" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-sm text-slate-700">Email Address</label>
                                    <input value={emailAdress} onChange={(e) => { setEmailAddress(e.target.value) }} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" placeholder="john.doe@university.edu" type="email" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-sm text-slate-700">Supervisor</label>
                                    <select value={supervisorId} onChange={(e) => { setSupervisorId(e.target.value) }} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none">
                                        <option value="">Select a supervisor</option>
                                        {
                                            supervisorsList?.map((output) => {
                                                return (
                                                    <option key={output?.id} value={output?.id}>{output?.Full_Name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
 
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-sm text-slate-700">Matric No</label>
                                    <input value={matricNo} onChange={(e) => { setMatricNo(e.target.value) }} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" placeholder="SCI/19/20/0045" type="text" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-sm text-slate-700">Department</label>
                                    <select value={department} onChange={(e) => { setDepartment(e.target.value) }} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none">
                                        {
                                            schoolDepartments?.map((output) => {
                                                return (
                                                    <option key={output?.id} value={output?.department_name}>{output?.department_name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-sm text-slate-700">Start Date</label>
                                    <input value={startDate} onChange={(e) => { setStartDat(e.target.value) }} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" type="date" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-sm text-slate-700">End Date</label>
                                    <input value={endDate} onChange={(e) => { setEndDate(e.target.value) }} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none" type="date" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                {isEditing && (
                                    <button onClick={resetForm} className="px-6 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl shadow-sm hover:bg-slate-200 active:scale-95 transition-colors">
                                        Cancel
                                    </button>
                                )}
                                <button onClick={handleSubmitStudent} className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-sm hover:opacity-90 active:scale-95 transition-all">
                                    {isEditing ? "Save Changes" : "Enroll Student"}
                                </button>
                            </div>
                        </div>
                    </section>
                    <section className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-primary">Student Directory</h3>
                                <p className="text-slate-500 text-sm">Manage and monitor current SIWES placements.</p>
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
                            <div className="overflow-x-auto max-h-[450px] overflow-y-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 text-slate-500 sticky top-0 z-10 border-b border-slate-200 text-xs">
                                            <th className="px-6 py-4 font-bold uppercase tracking-wider">Student Profile</th>
                                            <th className="px-6 py-4 font-bold uppercase tracking-wider">Matric No</th>
                                            <th className="px-6 py-4 font-bold uppercase tracking-wider">Department</th>
                                            <th className="px-6 py-4 font-bold uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 font-bold uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {
                                            studentList?.slice()?.reverse()?.map((student) => {
                                                let statusText = "Active"
                                                let statusColor = "bg-blue-500"
                                                
                                                const targetDate = new Date(student?.Start_Date)
                                                const endDate = new Date(student?.End_Date)
                                                const currentDate = new Date()
                                                
                                                if (currentDate < targetDate) {
                                                    statusText = "Pending"
                                                    statusColor = "bg-slate-400"
                                                } else if (currentDate > endDate) {
                                                    statusText = "Completed"
                                                    statusColor = "bg-emerald-500"
                                                }

                                                return (
                                                    <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                                                                    <img src={student?.Profile_Img || user} className="w-full h-full object-cover" />
                                                                </div>
                                                                <div>
                                                                    <div 
                                                                        onClick={() => handleOpenStudentDetails(student)}
                                                                        className="font-bold text-primary transition-colors cursor-pointer hover:underline text-sm"
                                                                    >
                                                                        {student?.Full_Name}
                                                                    </div>
                                                                    <div className="text-[12px] text-slate-500">{student?.email_address}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-medium text-slate-700">{student?.Matriculation_No}</td>
                                                        <td className="px-6 py-4">
                                                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">{student?.department}</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="flex items-center gap-2 font-bold text-xs text-slate-700">
                                                                <span className={`w-2 h-2 rounded-full ${statusColor}`}></span>
                                                                {statusText}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button onClick={() => handleEditClick(student)} className="p-1.5 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors" title="Edit">
                                                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                                                </button>
                                                                <button onClick={() => handleDeleteClick(student.id)} className="p-1.5 hover:bg-red-100 rounded-lg text-red-600 transition-colors" title="Delete">
                                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
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
            <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-container-lowest border-t border-outline-variant z-50 flex items-center justify-around px-sm">
                <button className="flex flex-col items-center gap-1 text-on-surface-variant">
                    <span className="material-symbols-outlined">dashboard</span>
                    <span className="text-[10px] font-bold">Home</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-primary">
                    <span className="material-symbols-outlined" >school</span>
                    <span className="text-[10px] font-bold">Students</span>
                </button>
                <div className="relative -top-4">
                    <button className="w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl">add</span>
                    </button>
                </div>
                <button className="flex flex-col items-center gap-1 text-on-surface-variant">
                    <span className="material-symbols-outlined">menu_book</span>
                    <span className="text-[10px] font-bold">Logs</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-on-surface-variant">
                    <span className="material-symbols-outlined">settings</span>
                    <span className="text-[10px] font-bold">Settings</span>
                </button>
            </nav>
        </div>
    )
}

export default SchoolStudentDashboard