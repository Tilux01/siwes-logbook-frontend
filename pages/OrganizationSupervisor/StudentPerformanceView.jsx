import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { context } from '../../src/App'
import axios from 'axios'
import user from '../../public/profile.png'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'

const StudentPerformanceView = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { organizationSupervisorCred, schoolSupervisorCred, schoolCred, studentCred, organizationCred } = useContext(context)
    const [student, setStudent] = useState(null)
    const [logbooks, setLogbooks] = useState([])
    const [evaluation, setEvaluation] = useState(null)
    const [leaveRequests, setLeaveRequests] = useState([])
    const [loading, setLoading] = useState(true)

    // Form state for evaluation
    const [evalForm, setEvalForm] = useState({
        attendance_score: '', attitude_score: '', work_quality_score: '',
        independence_score: '', professionalism_score: '', communication_score: '', leadership_score: '',
        final_remarks: ''
    })

    const isOrgSupervisor = !!organizationSupervisorCred;
    const isOrganization = !!organizationCred;
    const isSchoolSupervisor = !!schoolSupervisorCred;
    const isSchoolAdmin = !!schoolCred;
    const isStudent = !!studentCred;

    useEffect(() => {
        if (!isOrgSupervisor && !isSchoolSupervisor && !isSchoolAdmin && !isStudent && !isOrganization) {
            navigate('/') // Or whatever login
            return
        }
        fetchData()
    }, [id])

    const fetchData = async () => {
        try {
            const studentRes = await axios.post('http://localhost:5687/student/fetch-detailed', { student_id: id })
            setStudent(studentRes.data.message[0])

            const logsRes = await axios.post('http://localhost:5687/user/student/logbook/fetch', { student_id: id })
            setLogbooks(logsRes.data.message || [])

            const evalRes = await axios.post('http://localhost:5687/student/evaluation/fetch', { student_id: id })
            setEvaluation(evalRes.data.message || null)

            const leaveRes = await axios.post('http://localhost:5687/leave/fetch/student', { student_id: id })
            setLeaveRequests(leaveRes.data.message || [])

            setLoading(false)
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    const calculateAutoGrade = () => {
        if (!logbooks || logbooks.length === 0) return 0
        const ratedLogs = logbooks.filter(l => l.org_supervisor_rating > 0)
        if (ratedLogs.length === 0) return 0
        const total = ratedLogs.reduce((acc, curr) => acc + curr.org_supervisor_rating, 0)
        const avg = total / ratedLogs.length
        // Convert 5 star scale to percentage (e.g. 5 = 100%, 4 = 80%)
        return Math.round((avg / 5) * 100)
    }

    const handleEvaluationSubmit = async (e) => {
        e.preventDefault()
        // Check if all fields are filled
        if (Object.values(evalForm).some(v => v === '')) {
            alert("Please fill in all evaluation fields.")
            return
        }

        // Calculate total score based on A=5, B=4, C=3, D=2, F=1
        const gradeValue = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 }
        const total_score = 
            gradeValue[evalForm.attendance_score] + gradeValue[evalForm.attitude_score] +
            gradeValue[evalForm.work_quality_score] + gradeValue[evalForm.independence_score] +
            gradeValue[evalForm.professionalism_score] + gradeValue[evalForm.communication_score] +
            gradeValue[evalForm.leadership_score];

        try {
            await axios.post('http://localhost:5687/org-supervisor/evaluate', {
                student_id: id,
                org_supervisor_id: organizationSupervisorCred.id,
                ...evalForm,
                total_score
            })
            alert("Evaluation submitted successfully!")
            fetchData() // Refresh to show submitted state
        } catch (error) {
            console.error(error)
            alert("Failed to submit evaluation")
        }
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
            fetchData();
        } catch (error) {
            console.error(error);
            alert(error?.response?.data?.message || "Failed to update leave request");
        }
    };

    // Chart Data
    const chartData = logbooks.filter(l => l.org_supervisor_signed).map(l => ({
        name: `Week ${l.week_number}`,
        rating: l.org_supervisor_rating || 0
    }))

    const radarData = evaluation ? [
        { subject: 'Attendance', A: { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 }[evaluation.attendance_score] || 0, fullMark: 5 },
        { subject: 'Attitude', A: { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 }[evaluation.attitude_score] || 0, fullMark: 5 },
        { subject: 'Quality', A: { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 }[evaluation.work_quality_score] || 0, fullMark: 5 },
        { subject: 'Independence', A: { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 }[evaluation.independence_score] || 0, fullMark: 5 },
        { subject: 'Professionalism', A: { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 }[evaluation.professionalism_score] || 0, fullMark: 5 },
        { subject: 'Communication', A: { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 }[evaluation.communication_score] || 0, fullMark: 5 },
        { subject: 'Leadership', A: { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'F': 1 }[evaluation.leadership_score] || 0, fullMark: 5 },
    ] : [];

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><span className="material-symbols-outlined animate-spin text-4xl text-primary">sync</span></div>

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-sm">
                        <span className="material-symbols-outlined">arrow_back</span>
                        Back
                    </button>
                    {(isSchoolSupervisor || isSchoolAdmin) && (
                        <div className="px-6 py-2 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-xl flex items-center gap-3">
                            <span className="material-symbols-outlined text-indigo-500">auto_awesome</span>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider font-bold opacity-70">System Autograde</p>
                                <p className="text-xl font-black">{calculateAutoGrade()}%</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Overview */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="w-32 h-32 rounded-2xl bg-slate-100 border-4 border-white shadow-lg overflow-hidden shrink-0 z-10">
                        <img src={student?.Profile_Img || user} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="z-10 flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-black text-slate-900">{student?.Full_Name}</h1>
                            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200">Active Attachment</span>
                        </div>
                        <p className="text-slate-500 font-medium mb-6">{student?.email_address} • {student?.Contact_Adress || 'No Address'}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Matric No</p>
                                <p className="font-mono text-sm font-bold text-slate-700">{student?.Matriculation_No}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Department</p>
                                <p className="text-sm font-bold text-slate-700">{student?.department || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Institution</p>
                                <p className="text-sm font-bold text-slate-700">{student?.institution_name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">CGPA</p>
                                <p className="text-sm font-bold text-slate-700">{student?.cgpa || 'N/A'}</p>
                            </div>
                        </div>
                        
                        {/* Attachment Details */}
                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Attachment Personnel & Institutions</h4>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Institution</p>
                                    <p className="text-sm font-bold text-slate-700">{student?.institution_name || 'Not Assigned'}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{student?.institution_mail}</p>
                                    <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">call</span> {student?.institution_contact || 'No Phone'}</p>
                                    <p className="text-xs font-medium text-slate-500 mt-0.5 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span> {student?.institution_location || 'No Address'}</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">School Supervisor</p>
                                    <p className="text-sm font-bold text-slate-700">{student?.school_supervisor_name || 'Not Assigned'}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{student?.school_supervisor_email}</p>
                                    <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">call</span> {student?.school_supervisor_contact || 'No Phone'}</p>
                                    <p className="text-xs font-medium text-slate-500 mt-0.5 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span> {student?.school_supervisor_contact || 'No Address'}</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Organization</p>
                                    <p className="text-sm font-bold text-slate-700">{student?.organization_name || 'Not Assigned'}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{student?.organization_email}</p>
                                    <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">call</span> {student?.organization_contact || 'No Phone'}</p>
                                    <p className="text-xs font-medium text-slate-500 mt-0.5 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span> {student?.organization_location || 'No Address'}</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Industry Supervisor</p>
                                    <p className="text-sm font-bold text-slate-700">{student?.org_supervisor_name || 'Not Assigned'}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{student?.org_supervisor_email}</p>
                                    <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">call</span> {student?.org_supervisor_contact || 'No Phone'}</p>
                                    <p className="text-xs font-medium text-slate-500 mt-0.5 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span> {student?.org_supervisor_contact || 'No Address'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Administrative Details (Bank & Docs) */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">account_balance</span>
                            Stipend Account Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Bank Name</p>
                                <p className="font-bold text-slate-700">{student?.bank_name || 'Not Provided'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Account Number</p>
                                <p className="font-bold text-slate-700">{student?.account_number || 'Not Provided'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Account Name</p>
                                <p className="font-bold text-slate-700">{student?.account_name || 'Not Provided'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex-1 border-t md:border-t-0 md:border-l border-slate-200 pt-6 md:pt-0 md:pl-8">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">description</span>
                            Official Documents
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-sm font-medium text-slate-700">Company Acceptance Letter</span>
                                {student?.acceptance_letter_url ? (
                                    <a href={student.acceptance_letter_url} target="_blank" rel="noreferrer" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">open_in_new</span> View
                                    </a>
                                ) : <span className="text-xs text-slate-400 italic">Not Uploaded</span>}
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <span className="text-sm font-medium text-slate-700">ITF Form 8</span>
                                {student?.itf_form8_url ? (
                                    <a href={student.itf_form8_url} target="_blank" rel="noreferrer" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">open_in_new</span> View
                                    </a>
                                ) : <span className="text-xs text-slate-400 italic">Not Uploaded</span>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Metrics & Logs Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Performance Chart */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">monitoring</span>
                                Daily Rating Trend
                            </h3>
                            <div className="h-64 w-full">
                                {chartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                                            <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                            <Line type="monotone" dataKey="rating" stroke="#3b82f6" strokeWidth={4} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
                                        Not enough rated logbooks to generate trend.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Logbook Timeline */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">history_edu</span>
                                Recent Logbook Entries
                            </h3>
                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                {logbooks.map(log => (
                                    <div key={log.id} className="p-4 border border-slate-100 rounded-2xl bg-slate-50 hover:bg-slate-100/50 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-sm text-slate-700">{log.date ? new Date(log.date).toLocaleDateString() : ''}</span>
                                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full">Week {log.week_number}</span>
                                                </div>
                                                <p className="text-sm text-slate-600 mt-2">{log.activity_description}</p>
                                                {log.image_attachment && (
                                                    <a href={log.image_attachment} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1 mt-1 font-bold text-xs">
                                                        <span className="material-symbols-outlined text-xs">image</span>
                                                        View Image Attachment
                                                    </a>
                                                )}
                                            </div>
                                            <div className="flex text-yellow-400 ml-4 shrink-0">
                                                {[1,2,3,4,5].map(star => (
                                                    <span key={star} className="material-symbols-outlined text-sm">
                                                        {log.org_supervisor_rating >= star ? 'star' : 'star_border'}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        {log.org_supervisor_comment && (
                                            <div className="mt-3 p-3 bg-white rounded-xl border border-slate-100 text-xs text-slate-600 flex gap-2">
                                                <span className="material-symbols-outlined text-sm text-primary shrink-0">chat</span>
                                                <span className="italic">"{log.org_supervisor_comment}"</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Leave Requests Section */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">event_busy</span>
                                Leave Requests
                            </h3>
                            {leaveRequests.length === 0 ? (
                                <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-100 italic">
                                    No leave requests submitted.
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                    {leaveRequests.map(req => (
                                        <div key={req.id} className="p-4 border border-slate-100 rounded-2xl bg-slate-50 flex flex-col sm:flex-row justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full ${
                                                        req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        req.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>{req.status}</span>
                                                    <span className="text-xs font-bold text-slate-500">
                                                        {new Date(req.start_date).toLocaleDateString()} - {new Date(req.end_date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-700 italic">"{req.reason}"</p>
                                            </div>
                                            
                                            {isOrgSupervisor && req.status === 'pending' && (
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <button 
                                                        onClick={() => handleLeaveAction(req.id, 'approved')}
                                                        className="p-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg flex items-center gap-1 transition-colors"
                                                        title="Approve"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">check_circle</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleLeaveAction(req.id, 'rejected')}
                                                        className="p-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg flex items-center gap-1 transition-colors"
                                                        title="Reject"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">cancel</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Evaluation Column */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm sticky top-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">assignment_turned_in</span>
                                Final Evaluation
                            </h3>
                            <p className="text-xs text-slate-500 mb-6">Comprehensive performance metrics based on ITF Assessment standards.</p>

                            {evaluation ? (
                                // Show submitted evaluation
                                <div className="space-y-6">
                                    <div className="h-48 w-full -ml-4">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                                <PolarGrid stroke="#e2e8f0" />
                                                <PolarAngleAxis dataKey="subject" tick={{fontSize: 9, fill: '#64748b'}} />
                                                <Radar name="Student" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'Attendance & Punctuality', val: evaluation.attendance_score },
                                            { label: 'Attitude to Work', val: evaluation.attitude_score },
                                            { label: 'Work Quality', val: evaluation.work_quality_score },
                                            { label: 'Independence', val: evaluation.independence_score },
                                            { label: 'Professionalism', val: evaluation.professionalism_score },
                                            { label: 'Communication', val: evaluation.communication_score },
                                            { label: 'Leadership', val: evaluation.leadership_score }
                                        ].map(item => (
                                            <div key={item.label} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                                                <span className="text-sm font-medium text-slate-600">{item.label}</span>
                                                <span className={`px-2 py-0.5 rounded font-black text-xs ${
                                                    item.val === 'A' ? 'bg-green-100 text-green-700' :
                                                    item.val === 'B' ? 'bg-blue-100 text-blue-700' :
                                                    item.val === 'C' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>Grade {item.val}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {evaluation.final_remarks && (
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Supervisor Remarks</p>
                                            <p className="text-sm text-slate-700 italic">"{evaluation.final_remarks}"</p>
                                        </div>
                                    )}
                                </div>
                            ) : isOrgSupervisor ? (
                                // Show evaluation form for Org Supervisor
                                <form onSubmit={handleEvaluationSubmit} className="space-y-4">
                                    {[
                                        { key: 'attendance_score', label: 'Attendance & Punctuality' },
                                        { key: 'attitude_score', label: 'Attitude to Work' },
                                        { key: 'work_quality_score', label: 'Work Quality & Competence' },
                                        { key: 'independence_score', label: 'Independence & Problem Solving' },
                                        { key: 'professionalism_score', label: 'Professionalism & Conduct' },
                                        { key: 'communication_score', label: 'Communication Skills' },
                                        { key: 'leadership_score', label: 'Leadership & Initiative' }
                                    ].map(field => (
                                        <div key={field.key}>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">{field.label}</label>
                                            <select 
                                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                                value={evalForm[field.key]}
                                                onChange={e => setEvalForm({...evalForm, [field.key]: e.target.value})}
                                                required
                                            >
                                                <option value="" disabled>Select Grade...</option>
                                                <option value="A">Excellent (A) - Exceeds expectations</option>
                                                <option value="B">Very Good (B) - High standards</option>
                                                <option value="C">Good (C) - Meets basic requirements</option>
                                                <option value="D">Fair (D) - Barely meets expectations</option>
                                                <option value="F">Poor (F) - Fails standards</option>
                                            </select>
                                        </div>
                                    ))}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Overall Remarks (Optional)</label>
                                        <textarea 
                                            rows="3" 
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                            value={evalForm.final_remarks}
                                            onChange={e => setEvalForm({...evalForm, final_remarks: e.target.value})}
                                            placeholder="Final comments on student's performance..."
                                        />
                                    </div>
                                    <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined text-sm">task_alt</span>
                                        Submit Final Evaluation
                                    </button>
                                </form>
                            ) : (
                                <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">pending_actions</span>
                                    <p className="text-sm font-medium">Industry Supervisor has not submitted the final evaluation yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentPerformanceView
