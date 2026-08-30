import React, { useContext, useEffect, useState } from 'react'
import { context } from '../../src/App'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const OrganizationDashboard = () => {
    const navigate = useNavigate()
    const { organizationCred } = useContext(context)
    const [placements, setPlacements] = useState([])
    const [supervisors, setSupervisors] = useState([])
    const [acceptedInterns, setAcceptedInterns] = useState([])
    const [activeTab, setActiveTab] = useState('placements')

    // Supervisor Form State
    const [supName, setSupName] = useState('')
    const [supEmail, setSupEmail] = useState('')
    const [supDept, setSupDept] = useState('Engineering')
    const [supAddress, setSupAddress] = useState('')
    const [supCapacity, setSupCapacity] = useState(5)
    const [supFocus, setSupFocus] = useState('')
    const [isEditingSup, setIsEditingSup] = useState(false)
    const [editingSupId, setEditingSupId] = useState(null)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [selectedStudentLogs, setSelectedStudentLogs] = useState([])

    const fetchSingleStudentDetail = (studentId) => {
        navigate(`/student-performance/${studentId}`)
    }

    useEffect(() => {
        if (!organizationCred) {
            navigate('/organization/signin')
            return
        }
        fetchPlacements()
        fetchSupervisors()
        fetchAcceptedInterns()
    }, [organizationCred])

    const fetchPlacements = () => {
        if (!organizationCred?.id) return
        axios.post('http://localhost:5687/organization/placements/fetch', { organizationId: organizationCred?.id })
            .then((res) => {
                setPlacements(res?.data?.message || [])
            })
            .catch((err) => console.log(err))
    }

    const fetchAcceptedInterns = () => {
        if (!organizationCred?.id) return
        axios.post('http://localhost:5687/student/fetch-detailed', { organization_id: organizationCred?.id })
            .then((res) => {
                setAcceptedInterns(res?.data?.message || [])
            })
            .catch((err) => console.log(err))
    }

    const fetchSupervisors = () => {
        if (!organizationCred?.id) return
        axios.post('http://localhost:5687/organization/fetch/supervisor', { id: organizationCred?.id })
            .then((res) => {
                setSupervisors(res?.data?.message || [])
            })
            .catch((err) => console.log(err))
    }

    const handlePlacementStatus = (placementId, status) => {
        axios.post('http://localhost:5687/organization/placements/status', {
            placementId,
            status
        })
        .then(() => {
            alert(`Placement request ${status.toLowerCase()} successfully`)
            fetchPlacements()
            fetchAcceptedInterns()
        })
        .catch((err) => {
            alert(err?.response?.data?.message || 'Error updating placement status')
        })
    }

    const handleAssignSupervisor = (studentId, supervisorId) => {
        axios.post('http://localhost:5687/organization/assign-supervisor', {
            studentId,
            supervisorId
        })
        .then(() => {
            alert('Industry supervisor assigned successfully!')
            fetchAcceptedInterns()
        })
        .catch((err) => {
            alert(err?.response?.data?.message || 'Error assigning supervisor')
        })
    }

    const handleSubmitSupervisor = (e) => {
        e.preventDefault()
        if (!supName || !supEmail) return alert('Please enter supervisor name and email')

        if (isEditingSup) {
            axios.post('http://localhost:5687/organization-supervisor/update', {
                id: editingSupId,
                Full_Name: supName,
                Email_Address: supEmail,
                department: supDept,
                Contact_Adress: supAddress,
                capacity: supCapacity,
                focus_areas: supFocus
            })
            .then(() => {
                alert('Supervisor updated successfully')
                resetSupForm()
                fetchSupervisors()
            })
            .catch((err) => alert(err?.response?.data?.message || 'Error updating supervisor'))
        } else {
            axios.post('http://localhost:5687/organization/create/supervisor', {
                Organization_Id: organizationCred?.id,
                Organization_Mail: organizationCred?.Email_Address,
                department: supDept,
                Contact_Adress: supAddress,
                Full_Name: supName,
                Email_Address: supEmail,
                capacity: supCapacity,
                focus_areas: supFocus
            })
            .then(() => {
                alert('Supervisor pre-registered successfully! They can now activate their account.')
                resetSupForm()
                fetchSupervisors()
            })
            .catch((err) => alert(err?.response?.data?.message || 'Error creating supervisor'))
        }
    }

    const resetSupForm = () => {
        setSupName('')
        setSupEmail('')
        setSupDept('Engineering')
        setSupAddress('')
        setSupCapacity(5)
        setSupFocus('')
        setIsEditingSup(false)
        setEditingSupId(null)
    }

    const handleEditSup = (sup) => {
        setIsEditingSup(true)
        setEditingSupId(sup.id)
        setSupName(sup.Full_Name)
        setSupEmail(sup.Email_Address)
        setSupDept(sup.department || 'Engineering')
        setSupAddress(sup.Contact_Adress || '')
        setSupCapacity(sup.capacity || 5)
        setSupFocus(sup.focus_areas || '')
    }

    const handleDeleteSup = (id) => {
        if (!window.confirm('Are you sure you want to delete this supervisor?')) return
        axios.post('http://localhost:5687/organization-supervisor/delete', { id })
            .then(() => {
                alert('Supervisor deleted')
                fetchSupervisors()
            })
            .catch((err) => alert(err?.response?.data?.message || 'Error deleting supervisor'))
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 fixed left-0 top-0 h-screen bg-slate-50 border-r border-slate-200 flex flex-col p-4 z-50">
                <div className="flex items-center gap-3 px-3 py-4 border-b border-slate-200 mb-4">
                    <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined">corporate_fare</span>
                    </div>
                    <div>
                        <h2 className="font-bold text-[16px] text-primary truncate max-w-[130px]">{organizationCred?.Name || 'Organization'}</h2>
                        <span className="text-[11px] text-slate-500 uppercase tracking-wider">Corporate Portal</span>
                    </div>
                </div>

                <nav className="flex-1 space-y-2 px-2">
                    <button 
                        onClick={() => setActiveTab('placements')}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all font-medium text-left ${
                            activeTab === 'placements' ? 'bg-primary text-white font-bold shadow-sm' : 'text-slate-600 hover:text-primary hover:bg-blue-50'
                        }`}
                    >
                        <span className="material-symbols-outlined">assignment_turned_in</span>
                        Placement Requests
                    </button>
                    <button 
                        onClick={() => setActiveTab('accepted-interns')}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all font-medium text-left ${
                            activeTab === 'accepted-interns' ? 'bg-primary text-white font-bold shadow-sm' : 'text-slate-600 hover:text-primary hover:bg-blue-50'
                        }`}
                    >
                        <span className="material-symbols-outlined">group</span>
                        Accepted Interns
                    </button>
                    <button 
                        onClick={() => setActiveTab('supervisors')}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all font-medium text-left ${
                            activeTab === 'supervisors' ? 'bg-primary text-white font-bold shadow-sm' : 'text-slate-600 hover:text-primary hover:bg-blue-50'
                        }`}
                    >
                        <span className="material-symbols-outlined">badge</span>
                        Industry Supervisors
                    </button>
                </nav>

                <div className="border-t border-slate-200 pt-4 px-2">
                    <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 p-3 rounded-xl text-error hover:bg-error/10 font-bold text-sm transition-colors">
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
                        <h1 className="text-2xl font-bold text-primary">Welcome, {organizationCred?.Name}</h1>
                        <p className="text-sm text-slate-500 mt-1">Manage SIWES student placements, approvals, and assigned workplace supervisors.</p>
                    </div>
                    <span className="px-4 py-1.5 bg-blue-50 text-blue-900 border border-blue-200 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        Verified Organization
                    </span>
                </div>

                {/* Section 1: Placement Applications */}
                {activeTab === 'placements' && (
                    <section id="placements" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
                            <div>
                                <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">how_to_reg</span>
                                    Student Placement Applications
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">Review and approve SIWES internship applications from students.</p>
                            </div>
                            <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-900 rounded-full shadow-sm">{placements.length} Total Requests</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                                        <th className="p-4 font-bold">Student Name</th>
                                        <th className="p-4 font-bold">Matric No</th>
                                        <th className="p-4 font-bold">Department</th>
                                        <th className="p-4 font-bold">SIWES Duration</th>
                                        <th className="p-4 font-bold">Status</th>
                                        <th className="p-4 font-bold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 text-sm">
                                    {placements.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="p-8 text-center text-slate-500">No placement applications found yet.</td>
                                        </tr>
                                    ) : (
                                        placements.map((p) => (
                                            <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="p-4">
                                                    <span 
                                                        onClick={() => fetchSingleStudentDetail(p.student_id)}
                                                        className="font-bold text-primary cursor-pointer hover:underline"
                                                    >
                                                        {p.Student_Name || p.Full_Name || `Student #${p.student_id}`}
                                                    </span>
                                                </td>
                                                <td className="p-4 font-medium text-slate-700 text-sm">{p.Matriculation_No || 'N/A'}</td>
                                                <td className="p-4">
                                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">{p.department || 'General'}</span>
                                                </td>
                                                <td className="p-4 text-xs font-medium text-slate-600">
                                                    {p.Start_Date ? new Date(p.Start_Date).toLocaleDateString() : 'N/A'} - {p.End_Date ? new Date(p.End_Date).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                                        p.status === 'approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                                        p.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-200' :
                                                        'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                    }`}>
                                                        {p.status ? p.status.charAt(0).toUpperCase() + p.status.slice(1) : 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    {(!p.status || p.status.toLowerCase() === 'pending') && (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handlePlacementStatus(p.id, 'Approved')}
                                                                className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all flex items-center gap-1 shadow-sm"
                                                            >
                                                                <span className="material-symbols-outlined text-xs">check</span>
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handlePlacementStatus(p.id, 'Rejected')}
                                                                className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 text-xs font-bold rounded-lg hover:bg-red-100 active:scale-95 transition-all flex items-center gap-1"
                                                            >
                                                                <span className="material-symbols-outlined text-xs">close</span>
                                                                Reject
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* Section 2: Accepted Interns Directory & Assignment */}
                {activeTab === 'accepted-interns' && (
                    <section id="accepted-interns" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
                            <div>
                                <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">group</span>
                                    Accepted Interns Directory
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">View your approved students and assign corporate supervisors to them.</p>
                            </div>
                            <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-900 rounded-full shadow-sm">{acceptedInterns.length} Accepted Interns</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                                        <th className="p-4 font-bold">Student Name</th>
                                        <th className="p-4 font-bold">Matric No</th>
                                        <th className="p-4 font-bold">Department</th>
                                        <th className="p-4 font-bold">SIWES Duration</th>
                                        <th className="p-4 font-bold">Industry Supervisor</th>
                                        <th className="p-4 font-bold text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 text-sm">
                                    {acceptedInterns.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="p-8 text-center text-slate-500">No accepted students found for your organization yet.</td>
                                        </tr>
                                    ) : (
                                        acceptedInterns.map((student) => {
                                            return (
                                                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-4">
                                                        <span 
                                                            onClick={() => fetchSingleStudentDetail(student.id)}
                                                            className="font-bold text-primary cursor-pointer hover:underline"
                                                        >
                                                            {student.student_name || student.Full_Name}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 font-medium text-slate-700 text-sm">{student.student_matric || student.Matriculation_No}</td>
                                                    <td className="p-4">
                                                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">{student.student_department || student.department || 'General'}</span>
                                                    </td>
                                                    <td className="p-4 text-xs font-medium text-slate-600">
                                                        {student.student_start_date ? new Date(student.student_start_date).toLocaleDateString() : 'N/A'} - {student.student_end_date ? new Date(student.student_end_date).toLocaleDateString() : 'N/A'}
                                                    </td>
                                                    <td className="p-4">
                                                        <select
                                                            defaultValue={student.Organization_Supervisor_Id || ""}
                                                            id={`supervisor-select-${student.id}`}
                                                            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none"
                                                        >
                                                            <option value="">-- Assign Supervisor --</option>
                                                            {supervisors.map(sup => (
                                                                <option key={sup.id} value={sup.id}>{sup.Full_Name} ({sup.department})</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="p-3 text-right">
                                                        <button
                                                            onClick={() => {
                                                                const selectEl = document.getElementById(`supervisor-select-${student.id}`);
                                                                handleAssignSupervisor(student.id, selectEl?.value);
                                                            }}
                                                            className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all flex items-center gap-1 inline-flex"
                                                        >
                                                            <span className="material-symbols-outlined text-xs">save</span>
                                                            Assign
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* Section 3: Industry Supervisor Management */}
                {activeTab === 'supervisors' && (
                    <section id="supervisors" className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">person_add</span>
                                {isEditingSup ? 'Edit Organization Supervisor' : 'Pre-register Industry Supervisor'}
                            </h2>
                            <form onSubmit={handleSubmitSupervisor} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={supName}
                                        onChange={(e) => setSupName(e.target.value)}
                                        placeholder="Engr. Alex Morgan"
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address *</label>
                                    <input
                                        type="email"
                                        required
                                        value={supEmail}
                                        onChange={(e) => setSupEmail(e.target.value)}
                                        placeholder="alex.morgan@company.com"
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Department</label>
                                    <input
                                        type="text"
                                        value={supDept}
                                        onChange={(e) => setSupDept(e.target.value)}
                                        placeholder="Software Engineering"
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Contact Address</label>
                                    <input
                                        type="text"
                                        value={supAddress}
                                        onChange={(e) => setSupAddress(e.target.value)}
                                        placeholder="Building B, Floor 3"
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Max Intern Capacity</label>
                                    <input
                                        type="number"
                                        value={supCapacity}
                                        onChange={(e) => setSupCapacity(e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                    />
                                </div>
                                <div className="flex items-end gap-3">
                                    {isEditingSup && (
                                        <button type="button" onClick={resetSupForm} className="px-6 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl shadow-sm hover:bg-slate-200 active:scale-95 transition-colors">
                                            Cancel
                                        </button>
                                    )}
                                    <button type="submit" className="flex-1 py-2.5 bg-primary text-white font-bold rounded-xl shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined text-sm">{isEditingSup ? 'save' : 'add'}</span>
                                        {isEditingSup ? 'Save Changes' : 'Register Supervisor'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Supervisors Directory */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">badge</span>
                                Registered Industry Supervisors ({supervisors.length})
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {supervisors.map((s) => (
                                    <div key={s.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between space-y-4 hover:shadow-sm transition-shadow">
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-primary">{s.Full_Name}</h4>
                                                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-bold border border-slate-200">{s.department}</span>
                                            </div>
                                            <p className="text-sm text-slate-500 mt-2">{s.Email_Address}</p>
                                            <p className="text-sm text-slate-500 mt-1 font-medium">Capacity: <span className="text-slate-700">{s.capacity || 5} Interns</span></p>
                                        </div>
                                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                                            <button onClick={() => handleEditSup(s)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                                                <span className="material-symbols-outlined text-sm">edit</span>
                                            </button>
                                            <button onClick={() => handleDeleteSup(s.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Student Detail Modal Removed - Navigation moved to StudentPerformanceView */}
            </main>
        </div>
    )
}

export default OrganizationDashboard
