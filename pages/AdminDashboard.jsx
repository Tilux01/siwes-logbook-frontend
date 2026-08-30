import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { context } from '../src/App';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { adminCred } = useContext(context);
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({ students: 0, organizations: 0, schools: 0 });
    const [students, setStudents] = useState([]);
    const [schools, setSchools] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editType, setEditType] = useState(null); // 'students' | 'schools' | 'organizations'
    const [editData, setEditData] = useState({});
    const [editId, setEditId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!adminCred) {
            navigate('/Admin');
            return;
        }
        fetchAllData();
    }, [adminCred]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const statsRes = await axios.get('http://localhost:5687/admin/dashboard-stats');
            setStats(statsRes.data.message);

            const studentsRes = await axios.post('http://localhost:5687/admin/fetch-all', { type: 'students' });
            setStudents(studentsRes.data.message);

            const schoolsRes = await axios.post('http://localhost:5687/admin/fetch-all', { type: 'schools' });
            setSchools(schoolsRes.data.message);

            const orgsRes = await axios.post('http://localhost:5687/admin/fetch-all', { type: 'organizations' });
            setOrganizations(orgsRes.data.message);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm("Are you sure you want to delete this record? This action cannot be undone.")) return;
        
        try {
            await axios.post('http://localhost:5687/admin/delete', { type, id });
            alert("Record deleted successfully.");
            fetchAllData();
        } catch (error) {
            console.error(error);
            alert("Error deleting record.");
        }
    };

    const openEditModal = (type, record) => {
        setEditType(type);
        setEditId(record.id);
        setEditData(record);
        setIsEditModalOpen(true);
    };

    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const submitEdit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post('http://localhost:5687/admin/update', { 
                type: editType, 
                id: editId, 
                data: editData 
            });
            alert("Record updated successfully.");
            setIsEditModalOpen(false);
            fetchAllData();
        } catch (error) {
            console.error(error);
            alert("Error updating record.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-surface flex items-center justify-center font-bold text-primary">Loading Super Admin Data...</div>;
    }

    return (
        <div className="min-h-screen bg-surface flex font-body-md text-on-surface">
            {/* Sidebar */}
            <aside className="w-64 fixed left-0 top-0 h-screen bg-slate-50 border-r border-slate-200 flex flex-col p-4 z-40">
                <div className="flex items-center gap-3 px-3 py-4 border-b border-slate-200 mb-4">
                    <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[24px]">shield_person</span>
                    </div>
                    <div>
                        <h2 className="text-primary text-sm font-bold">Super Admin</h2>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{adminCred?.email}</span>
                    </div>
                </div>

                <nav className="flex-grow space-y-1">
                    <button 
                        onClick={() => setActiveTab('overview')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left font-bold ${
                            activeTab === 'overview' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-blue-50 hover:text-primary'
                        }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">dashboard</span>
                        System Overview
                    </button>
                    <button 
                        onClick={() => setActiveTab('schools')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left font-bold ${
                            activeTab === 'schools' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-blue-50 hover:text-primary'
                        }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">school</span>
                        Registered Schools
                    </button>
                    <button 
                        onClick={() => setActiveTab('organizations')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left font-bold ${
                            activeTab === 'organizations' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-blue-50 hover:text-primary'
                        }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">domain</span>
                        Organizations
                    </button>
                    <button 
                        onClick={() => setActiveTab('students')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left font-bold ${
                            activeTab === 'students' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-blue-50 hover:text-primary'
                        }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">groups</span>
                        Global Students
                    </button>
                </nav>

                <div className="border-t border-slate-200 pt-4">
                    <button 
                        onClick={() => navigate('/Admin')} 
                        className="w-full flex items-center gap-3 px-3 py-2 text-error hover:bg-error/10 font-bold text-sm rounded-lg transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                        Secure Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8 space-y-8">
                {/* Header */}
                <header className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full border-4 border-slate-50 shadow-sm overflow-hidden bg-slate-100 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-primary">Welcome back, Super Admin</h2>
                            <p className="text-sm text-slate-500 mt-1">{adminCred?.email}</p>
                        </div>
                    </div>
                </header>

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-3xl">groups</span>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Students</p>
                                <h3 className="text-3xl font-black text-primary">{stats.students}</h3>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-3xl">domain</span>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Organizations</p>
                                <h3 className="text-3xl font-black text-primary">{stats.organizations}</h3>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-3xl">school</span>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Institutions</p>
                                <h3 className="text-3xl font-black text-primary">{stats.schools}</h3>
                            </div>
                        </div>
                    </div>
                )}

                {/* SCHOOLS TAB */}
                {activeTab === 'schools' && (
                    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-200 bg-slate-50">
                            <h2 className="text-lg font-bold text-primary">Registered Institutions</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                        <th className="p-4 font-bold">ID</th>
                                        <th className="p-4 font-bold">Institution Name</th>
                                        <th className="p-4 font-bold">Admin Email</th>
                                        <th className="p-4 font-bold">Location</th>
                                        <th className="p-4 font-bold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 text-sm">
                                    {schools.map(school => (
                                        <tr key={school.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 font-mono text-xs text-slate-500">#{school.id}</td>
                                            <td className="p-4 font-bold text-primary">{school.Name}</td>
                                            <td className="p-4 text-slate-600">{school.Mail}</td>
                                            <td className="p-4 text-slate-600">{school.Location || 'N/A'}</td>
                                            <td className="p-4 text-right flex justify-end gap-2">
                                                <button onClick={() => openEditModal('schools', school)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:opacity-80 transition-opacity" title="Edit">
                                                    <span className="material-symbols-outlined text-sm">edit</span>
                                                </button>
                                                <button onClick={() => handleDelete('schools', school.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:opacity-80 transition-opacity" title="Delete">
                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {schools.length === 0 && (
                                        <tr><td colSpan="5" className="p-8 text-center text-slate-500 font-medium">No institutions registered yet.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* ORGANIZATIONS TAB */}
                {activeTab === 'organizations' && (
                    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-200 bg-slate-50">
                            <h2 className="text-lg font-bold text-primary">Registered Organizations</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                        <th className="p-4 font-bold">ID</th>
                                        <th className="p-4 font-bold">Organization Name</th>
                                        <th className="p-4 font-bold">Coordinator Email</th>
                                        <th className="p-4 font-bold">Address</th>
                                        <th className="p-4 font-bold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 text-sm">
                                    {organizations.map(org => (
                                        <tr key={org.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 font-mono text-xs text-slate-500">#{org.id}</td>
                                            <td className="p-4 font-bold text-primary">{org.Name}</td>
                                            <td className="p-4 text-slate-600">{org.Email_Address}</td>
                                            <td className="p-4 text-slate-600">{org.Contact_Address || 'N/A'}</td>
                                            <td className="p-4 text-right flex justify-end gap-2">
                                                <button onClick={() => openEditModal('organizations', org)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:opacity-80 transition-opacity" title="Edit">
                                                    <span className="material-symbols-outlined text-sm">edit</span>
                                                </button>
                                                <button onClick={() => handleDelete('organizations', org.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:opacity-80 transition-opacity" title="Delete">
                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {organizations.length === 0 && (
                                        <tr><td colSpan="5" className="p-8 text-center text-slate-500 font-medium">No organizations registered yet.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* STUDENTS TAB */}
                {activeTab === 'students' && (
                    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-200 bg-slate-50">
                            <h2 className="text-lg font-bold text-primary">Global Student Directory</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                        <th className="p-4 font-bold">ID</th>
                                        <th className="p-4 font-bold">Student Name</th>
                                        <th className="p-4 font-bold">Matric No</th>
                                        <th className="p-4 font-bold">Email</th>
                                        <th className="p-4 font-bold">Department</th>
                                        <th className="p-4 font-bold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 text-sm">
                                    {students.map(student => (
                                        <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 font-mono text-xs text-slate-500">#{student.id}</td>
                                            <td className="p-4 font-bold text-primary">{student.Full_Name}</td>
                                            <td className="p-4 font-mono text-slate-600">{student.Matriculation_No}</td>
                                            <td className="p-4 text-slate-600">{student.email_address}</td>
                                            <td className="p-4 text-slate-600">{student.department || 'N/A'}</td>
                                            <td className="p-4 text-right flex justify-end gap-2">
                                                <button onClick={() => openEditModal('students', student)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:opacity-80 transition-opacity" title="Edit">
                                                    <span className="material-symbols-outlined text-sm">edit</span>
                                                </button>
                                                <button onClick={() => handleDelete('students', student.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:opacity-80 transition-opacity" title="Delete">
                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {students.length === 0 && (
                                        <tr><td colSpan="5" className="p-8 text-center text-slate-500 font-medium">No students registered yet.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </main>

            {/* EDIT MODAL */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-primary">Edit Record</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 flex items-center justify-center transition-colors">
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        </div>
                        <form onSubmit={submitEdit} className="p-6 space-y-4">
                            {editType === 'schools' && (
                                <>
                                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Institution Name</label><input type="text" name="Name" value={editData.Name || ''} onChange={handleEditChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary outline-none" required /></div>
                                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label><input type="email" name="Mail" value={editData.Mail || ''} onChange={handleEditChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary outline-none" required /></div>
                                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Location</label><input type="text" name="Location" value={editData.Location || ''} onChange={handleEditChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary outline-none" /></div>
                                </>
                            )}
                            {editType === 'organizations' && (
                                <>
                                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Organization Name</label><input type="text" name="Name" value={editData.Name || ''} onChange={handleEditChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary outline-none" required /></div>
                                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label><input type="email" name="Email_Address" value={editData.Email_Address || ''} onChange={handleEditChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary outline-none" required /></div>
                                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Address</label><input type="text" name="Contact_Address" value={editData.Contact_Address || ''} onChange={handleEditChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary outline-none" /></div>
                                </>
                            )}
                            {editType === 'students' && (
                                <>
                                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label><input type="text" name="Full_Name" value={editData.Full_Name || ''} onChange={handleEditChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary outline-none" required /></div>
                                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label><input type="email" name="email_address" value={editData.email_address || ''} onChange={handleEditChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary outline-none" required /></div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="block text-sm font-bold text-slate-700 mb-1">Matric No</label><input type="text" name="Matriculation_No" value={editData.Matriculation_No || ''} onChange={handleEditChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary outline-none" required /></div>
                                        <div><label className="block text-sm font-bold text-slate-700 mb-1">Department</label><input type="text" name="department" value={editData.department || ''} onChange={handleEditChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary outline-none" /></div>
                                    </div>
                                </>
                            )}
                            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
                                <button type="submit" disabled={submitting} className="px-5 py-2.5 font-bold text-white bg-primary rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50">
                                    {submitting ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
