import React, { useContext, useEffect, useState } from 'react'
import { context } from '../../src/App'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import user from '../../public/profile.png'

const OrgSupervisorDashboard = () => {
    const navigate = useNavigate()
    const { organizationSupervisorCred } = useContext(context)
    const [logbooks, setLogbooks] = useState([])
    const [assignedStudents, setAssignedStudents] = useState([])
    const [selectedLog, setSelectedLog] = useState(null)
    const [comment, setComment] = useState('')
    const [rating, setRating] = useState(0)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [selectedStudentLogs, setSelectedStudentLogs] = useState([])
    const [allLeaveRequests, setAllLeaveRequests] = useState([])
    const [activeTab, setActiveTab] = useState('logbooks')

    useEffect(() => {
        if (!organizationSupervisorCred) {
            navigate('/organization-supervisor/signin')
            return
        }
        fetchInternLogbooks()
        fetchAssignedStudents()
        fetchAllLeaves()
    }, [organizationSupervisorCred])

    const fetchAllLeaves = () => {
        if (!organizationSupervisorCred?.id) return
        axios.post('http://localhost:5687/leave/fetch/org-supervisor-all', {
            org_supervisor_id: organizationSupervisorCred?.id
        })
        .then((res) => setAllLeaveRequests(res?.data?.message || []))
        .catch((err) => console.log(err))
    }

    const fetchInternLogbooks = () => {
        if (!organizationSupervisorCred?.id) return
        axios.post('http://localhost:5687/user/student/logbook/fetch', {
            org_supervisor_id: organizationSupervisorCred?.id
        })
        .then((res) => {
            setLogbooks(res?.data?.message || [])
        })
        .catch((err) => console.log(err))
    }

    const fetchAssignedStudents = () => {
        if (!organizationSupervisorCred?.id) return
        axios.post('http://localhost:5687/student/fetch-detailed', {
            organization_supervisor_id: organizationSupervisorCred?.id
        })
        .then((res) => {
            setAssignedStudents(res?.data?.message || [])
        })
        .catch((err) => console.log(err))
    }

    const handleSignOff = (e) => {
        e.preventDefault()
        if (!selectedLog) return

        axios.post('http://localhost:5687/org-supervisor/logbook/sign', {
            id: selectedLog.id,
            org_supervisor_id: organizationSupervisorCred?.id,
            org_supervisor_comment: comment,
            org_supervisor_rating: rating
        })
        .then(() => {
            alert('Logbook entry signed off successfully!')
            setSelectedLog(null)
            setComment('')
            setRating(0)
            fetchInternLogbooks()
        })
        .catch((err) => {
            alert(err?.response?.data?.message || 'Sign-off failed.')
        })
    }

    const handleLeaveAction = async (leave_id, status) => {
        if (!confirm(`Are you sure you want to ${status} this leave request?`)) return;
        try {
            await axios.post('http://localhost:5687/leave/update-status', {
                leave_id,
                status,
                org_supervisor_id: organizationSupervisorCred.id
            });
            alert(`Leave request ${status} successfully.`);
            fetchAllLeaves();
        } catch (error) {
            console.error(error);
            alert(error?.response?.data?.message || "Failed to update leave request");
        }
    }

    return (
        <div className="min-h-screen bg-surface flex">
            {/* Sidebar */}
            <aside className="w-64 fixed left-0 top-0 h-screen bg-slate-50 border-r border-slate-200 flex flex-col p-4 z-50">
                <div className="flex items-center gap-3 px-3 py-4 border-b border-slate-200 mb-4">
                    <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined">badge</span>
                    </div>
                    <div>
                        <h2 className="font-bold text-primary truncate max-w-[130px]">{organizationSupervisorCred?.Full_Name || 'Supervisor'}</h2>
                        <span className="text-[10px] text-slate-500 font-medium">Industry Supervisor</span>
                    </div>
                </div>

                <nav className="flex-grow space-y-1">
                    <button 
                        onClick={() => setActiveTab('logbooks')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left ${
                            activeTab === 'logbooks' ? 'bg-primary text-white font-bold shadow-sm' : 'text-slate-600 hover:bg-blue-50 hover:text-primary font-medium'
                        }`}
                    >
                        <span className="material-symbols-outlined">edit_note</span>
                        Daily Logbook Review
                    </button>
                    <button 
                        onClick={() => setActiveTab('interns')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left ${
                            activeTab === 'interns' ? 'bg-primary text-white font-bold shadow-sm' : 'text-slate-600 hover:bg-blue-50 hover:text-primary font-medium'
                        }`}
                    >
                        <span className="material-symbols-outlined">groups</span>
                        Assigned Interns ({assignedStudents.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('leaves')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left ${
                            activeTab === 'leaves' ? 'bg-primary text-white font-bold shadow-sm' : 'text-slate-600 hover:bg-blue-50 hover:text-primary font-medium'
                        }`}
                    >
                        <span className="material-symbols-outlined">event_busy</span>
                        Leave Requests ({allLeaveRequests.filter(l => l.status === 'pending').length})
                    </button>
                </nav>

                <div className="border-t border-slate-200 pt-4">
                    <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-3 py-2 text-error hover:bg-error/10 font-bold text-sm rounded-lg transition-colors">
                        <span className="material-symbols-outlined">logout</span>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8 space-y-8">
                {/* Header Banner */}
                <div className="flex items-center justify-between bg-surface-container-lowest p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-primary">Workplace Supervision Hub</h1>
                        <p className="text-sm text-slate-500 mt-1">Review student daily activities, verify practical hours, and provide weekly sign-offs.</p>
                    </div>
                    <div className="flex gap-3">
                        <span className="px-4 py-2 bg-yellow-50 text-yellow-900 rounded-xl text-xs font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">event_busy</span>
                            {allLeaveRequests.filter(l => l.status === 'pending').length} Pending Leaves
                        </span>
                        <span className="px-4 py-2 bg-blue-50 text-blue-900 rounded-xl text-xs font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">person_check</span>
                            {assignedStudents.length} Active Interns
                        </span>
                    </div>
                </div>

                {/* Section 1: Logbook Entries Table */}
                {activeTab === 'logbooks' && (
                <section id="logbooks" className="bg-surface-container-lowest rounded-2xl border border-slate-200 p-6 shadow-sm bg-white">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">fact_check</span>
                                Student Daily Logbook Submissions
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">Click "Sign Off" on any entry to review, add feedback, and approve work.</p>
                        </div>
                        <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-900 rounded-full">{logbooks.length} Entries</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                                    <th className="p-3">Date / Week</th>
                                    <th className="p-3">Student Name</th>
                                    <th className="p-3">Tasks / Work Done</th>
                                    <th className="p-3">Sign-off Status</th>
                                    <th className="p-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 text-sm">
                                {logbooks.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-6 text-center text-slate-500">No logbook submissions found for your assigned interns.</td>
                                    </tr>
                                ) : (
                                    logbooks.map((log) => (
                                        <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-3">
                                                <p className="font-mono text-xs">{log.date ? new Date(log.date).toLocaleDateString() : ''}</p>
                                                <span className="px-2 py-0.5 bg-blue-50 text-blue-900 text-[10px] font-bold rounded-full">Week {log.week_number}</span>
                                            </td>
                                            <td className="p-3">
                                                <span 
                                                    onClick={() => navigate(`/student-performance/${log.student_id}`)}
                                                    className="font-bold text-slate-900 cursor-pointer hover:underline hover:text-primary"
                                                >
                                                    {log.Student_Name || `Student #${log.student_id}`}
                                                </span>
                                            </td>
                                            <td className="p-3 max-w-xs truncate" title={log.activity_description}>
                                                {log.activity_description}
                                            </td>
                                            <td className="p-3">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                                    log.org_supervisor_signed ? 'bg-blue-100 text-blue-900' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {log.org_supervisor_signed ? 'Signed Off' : 'Pending Sign-off'}
                                                </span>
                                            </td>
                                            <td className="p-3 text-right">
                                                <button
                                                    onClick={() => {
                                                        setSelectedLog(log)
                                                        setComment(log.org_supervisor_comment || '')
                                                        setRating(log.org_supervisor_rating || 0)
                                                    }}
                                                    className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all flex items-center gap-1 ml-auto shadow-sm"
                                                >
                                                    <span className="material-symbols-outlined text-xs">draw</span>
                                                    {log.org_supervisor_signed ? 'Edit Sign' : 'Sign Off'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
                )}

                {/* Section 2: Assigned Interns */}
                {activeTab === 'interns' && (
                <section id="interns" className="bg-surface-container-lowest rounded-2xl border border-slate-200 p-6 shadow-sm bg-white">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">groups</span>
                                Assigned Intern Directory
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">View profiles, contact information, and academic institution details of your interns.</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                                    <th className="p-3">Intern Profile</th>
                                    <th className="p-3">Matric No</th>
                                    <th className="p-3">Department</th>
                                    <th className="p-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 text-sm">
                                {assignedStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="p-6 text-center text-slate-500">No assigned interns found.</td>
                                    </tr>
                                ) : (
                                    assignedStudents.map((intern) => (
                                        <tr key={intern.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full overflow-hidden border bg-blue-50 flex items-center justify-center">
                                                        <img src={intern.Profile_Img || user} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <span 
                                                            onClick={() => navigate(`/student-performance/${intern.id}`)}
                                                            className="font-bold text-slate-900 cursor-pointer hover:underline hover:text-primary"
                                                        >
                                                            {intern.Full_Name}
                                                        </span>
                                                        <div className="text-xs text-slate-500">{intern.email_address}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3 font-mono text-xs">{intern.Matriculation_No}</td>
                                            <td className="p-3">{intern.department}</td>
                                            <td className="p-3 text-right">
                                                <button 
                                                    onClick={() => navigate(`/student-performance/${intern.id}`)}
                                                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 transition-all shadow-sm"
                                                >
                                                    View Profile
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
                )}

                {/* Section 3: Leave Requests */}
                {activeTab === 'leaves' && (
                <section id="leaves" className="bg-surface-container-lowest rounded-2xl border border-slate-200 p-6 shadow-sm bg-white">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">event_busy</span>
                                Intern Leave Requests
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">Manage and approve absence requests from all your assigned interns.</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                                    <th className="p-3">Intern Profile</th>
                                    <th className="p-3">Leave Dates</th>
                                    <th className="p-3">Reason</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 text-sm">
                                {allLeaveRequests.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-6 text-center text-slate-500">No leave requests found.</td>
                                    </tr>
                                ) : (
                                    allLeaveRequests.map((req) => (
                                        <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-3">
                                                <span 
                                                    onClick={() => navigate(`/student-performance/${req.student_id}`)}
                                                    className="font-bold text-slate-900 cursor-pointer hover:underline hover:text-primary"
                                                >
                                                    {req.student_name}
                                                </span>
                                                <div className="text-xs text-slate-500">{req.matric_no}</div>
                                            </td>
                                            <td className="p-3 text-xs font-bold text-slate-600">
                                                {new Date(req.start_date).toLocaleDateString()} - {new Date(req.end_date).toLocaleDateString()}
                                            </td>
                                            <td className="p-3 max-w-xs truncate" title={req.reason}>{req.reason}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full ${
                                                    req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    req.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="p-3 text-right">
                                                {req.status === 'pending' ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button 
                                                            onClick={() => handleLeaveAction(req.id, 'approved')}
                                                            className="px-3 py-1 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 text-xs font-bold rounded-lg transition-colors"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button 
                                                            onClick={() => handleLeaveAction(req.id, 'rejected')}
                                                            className="px-3 py-1 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-xs font-bold rounded-lg transition-colors"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">Resolved</span>
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

                {/* Sign-off Modal */}
                {selectedLog && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
                            <div className="flex items-center justify-between border-b pb-3">
                                <h3 className="font-bold text-primary text-lg flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">draw</span>
                                    Logbook Entry Sign-off
                                </h3>
                                <button onClick={() => setSelectedLog(null)} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="space-y-2 text-sm bg-slate-50 p-4 rounded-xl">
                                <p><strong className="text-primary">Date:</strong> {selectedLog.date ? new Date(selectedLog.date).toLocaleDateString() : ''}</p>
                                <p><strong className="text-primary">Work Description:</strong> {selectedLog.activity_description}</p>
                            </div>

                            <form onSubmit={handleSignOff} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-2">Daily Performance Rating</label>
                                    <div className="flex gap-1 mb-4">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span 
                                                key={star} 
                                                onClick={() => setRating(star)}
                                                className={`material-symbols-outlined cursor-pointer text-3xl transition-colors ${rating >= star ? 'text-yellow-400' : 'text-slate-300 hover:text-yellow-300'}`}
                                            >
                                                {rating >= star ? 'star' : 'star_border'}
                                            </span>
                                        ))}
                                    </div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Supervisor Remarks & Feedback</label>
                                    <textarea
                                        rows="3"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Add constructive comments regarding intern's daily practical performance..."
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    ></textarea>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        className="flex-1 py-2.5 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md text-sm"
                                    >
                                        <span className="material-symbols-outlined">check_circle</span>
                                        Confirm Sign-off
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedLog(null)}
                                        className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:opacity-90 text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Student Detail Modal */}
                {showDetailModal && selectedStudent && (
                    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh]">
                            <div className="flex items-center justify-between border-b pb-3">
                                <h3 className="font-bold text-primary text-lg flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary font-bold">account_circle</span>
                                    Student Detailed Information
                                </h3>
                                <button onClick={() => setShowDetailModal(false)} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Academic Profile */}
                                <div className="space-y-3 bg-slate-50 p-4 rounded-xl">
                                    <h4 className="font-bold text-primary text-sm flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-base">school</span>
                                        Academic Profile
                                    </h4>
                                    <p className="text-xs"><strong className="text-slate-600">Full Name:</strong> {selectedStudent.Full_Name}</p>
                                    <p className="text-xs"><strong className="text-slate-600">Matric No:</strong> {selectedStudent.Matriculation_No}</p>
                                    <p className="text-xs"><strong className="text-slate-600">Department:</strong> {selectedStudent.department || "N/A"}</p>
                                    <p className="text-xs"><strong className="text-slate-600">Email:</strong> {selectedStudent.email_address}</p>
                                    <p className="text-xs"><strong className="text-slate-600">Contact:</strong> {selectedStudent.Contact_Adress || "N/A"}</p>
                                    <p className="text-xs"><strong className="text-slate-600">SIWES Period:</strong> {selectedStudent.Start_Date ? new Date(selectedStudent.Start_Date).toLocaleDateString() : "N/A"} to {selectedStudent.End_Date ? new Date(selectedStudent.End_Date).toLocaleDateString() : "N/A"}</p>
                                </div>

                                {/* School & Academic Supervisor */}
                                <div className="space-y-3 bg-slate-50 p-4 rounded-xl">
                                    <h4 className="font-bold text-primary text-sm flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-base">badge</span>
                                        Institution & Mentor
                                    </h4>
                                    <p className="text-xs"><strong className="text-slate-600">Institution:</strong> {selectedStudent.institution_name || "N/A"}</p>
                                    <p className="text-xs"><strong className="text-slate-600">Institution Location:</strong> {selectedStudent.institution_location || "N/A"}</p>
                                    <p className="text-xs"><strong className="text-slate-600">Academic Mentor:</strong> {selectedStudent.school_supervisor_name || "N/A"}</p>
                                    <p className="text-xs"><strong className="text-slate-600">Mentor Email:</strong> {selectedStudent.school_supervisor_email || "N/A"}</p>
                                    <p className="text-xs"><strong className="text-slate-600">Mentor Contact:</strong> {selectedStudent.school_supervisor_contact || "N/A"}</p>
                                </div>

                                {/* Placement Company Details */}
                                <div className="space-y-3 bg-slate-50 p-4 rounded-xl">
                                    <h4 className="font-bold text-primary text-sm flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-base">corporate_fare</span>
                                        Workplace Placement
                                    </h4>
                                    <p className="text-xs"><strong className="text-slate-600">Company:</strong> {selectedStudent.organization_name || "Not Placed Yet"}</p>
                                    <p className="text-xs"><strong className="text-slate-600">Company Location:</strong> {selectedStudent.organization_location || "N/A"}</p>
                                    <p className="text-xs"><strong className="text-slate-600">Company Email:</strong> {selectedStudent.organization_email || "N/A"}</p>
                                    <p className="text-xs"><strong className="text-slate-600">Company Contact:</strong> {selectedStudent.organization_contact || "N/A"}</p>
                                </div>

                                {/* Industry Supervisor Details */}
                                <div className="space-y-3 bg-slate-50 p-4 rounded-xl">
                                    <h4 className="font-bold text-primary text-sm flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-base">supervisor_account</span>
                                        Industry Supervisor
                                    </h4>
                                    <p className="text-xs"><strong className="text-slate-600">Mentor Name:</strong> {selectedStudent.org_supervisor_name || "None Assigned"}</p>
                                    <p className="text-xs"><strong className="text-slate-600">Mentor Email:</strong> {selectedStudent.org_supervisor_email || "N/A"}</p>
                                    <p className="text-xs"><strong className="text-slate-600">Mentor Contact:</strong> {selectedStudent.org_supervisor_contact || "N/A"}</p>
                                </div>

                                {/* Student Logbook Journal Section */}
                                <div className="col-span-1 md:col-span-2 space-y-3 border-t pt-4">
                                    <h4 className="font-bold text-primary text-sm flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-base">menu_book</span>
                                        SIWES Logbook Journal ({selectedStudentLogs.length} Entries)
                                    </h4>
                                    <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                                        {selectedStudentLogs.length === 0 ? (
                                            <p className="text-xs text-slate-500 italic py-2">No logbook entries recorded by this student yet.</p>
                                        ) : (
                                            selectedStudentLogs.map((log) => (
                                                <div key={log.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-primary">
                                                                {log.date ? new Date(log.date).toLocaleDateString() : ""}
                                                            </span>
                                                            <span className="px-2 py-0.5 bg-blue-50 text-blue-900 border border-blue-200 rounded-full font-bold">Week {log.week_number}</span>
                                                            <span className={`px-2 py-0.5 rounded-full font-bold ${
                                                                log.org_supervisor_signed ? "bg-blue-100 text-blue-900" : "bg-yellow-100 text-yellow-800"
                                                            }`}>
                                                                {log.org_supervisor_signed ? "Signed" : "Unsigned"}
                                                            </span>
                                                        </div>
                                                        <p className="text-slate-700 leading-normal">{log.activity_description}</p>
                                                        {log.image_attachment && (
                                                            <a href={log.image_attachment} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1 mt-1 font-bold">
                                                                <span className="material-symbols-outlined text-xs">image</span>
                                                                View Image Attachment
                                                            </a>
                                                        )}
                                                        {log.org_supervisor_comment && (
                                                            <p className="text-xs text-primary font-medium italic">Remarks: "{log.org_supervisor_comment}"</p>
                                                        )}
                                                        {log.school_supervisor_grade && (
                                                            <p className="text-xs text-blue-950 font-bold">Assessment Grade: {log.school_supervisor_grade}%</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-3 border-t">
                                <button onClick={() => setShowDetailModal(false)} className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl">
                                    Close Details
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

export default OrgSupervisorDashboard
