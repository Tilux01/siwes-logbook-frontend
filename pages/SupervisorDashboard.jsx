import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { context } from "../src/App";
import axios from "axios";
import user from "../public/profile.png";

const SupervisorDashboard = () => {
  const navigate = useNavigate();
  const { schoolSupervisorCred } = useContext(context);
  const [logbooks, setLogbooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState("roster"); // "roster" or "grading"
  const [selectedLog, setSelectedLog] = useState(null);
  const [grade, setGrade] = useState(85);
  const [comment, setComment] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentLogs, setSelectedStudentLogs] = useState([]);

  const handleOpenStudentDetails = (student) => {
    navigate(`/student-performance/${student.id}`);
  };

  useEffect(() => {
    if (!schoolSupervisorCred) {
      navigate("/Supervisor-Login");
      return;
    }
    fetchLogbooks();
    fetchAssignedStudents();
  }, [schoolSupervisorCred]);

  const fetchLogbooks = () => {
    if (!schoolSupervisorCred?.id) return;
    axios.post("http://localhost:5687/user/student/logbook/fetch", {
      school_supervisor_id: schoolSupervisorCred?.id
    })
    .then((res) => {
      setLogbooks(res?.data?.message || []);
    })
    .catch((err) => console.log(err));
  };

  const fetchAssignedStudents = () => {
    if (!schoolSupervisorCred?.id) return;
    axios.post("http://localhost:5687/student/fetch-detailed", {
      school_supervisor_id: schoolSupervisorCred?.id
    })
    .then((res) => {
      setStudents(res?.data?.message || []);
    })
    .catch((err) => console.log(err));
  };

  const handleGradeSubmission = (e) => {
    e.preventDefault();
    if (!selectedLog) return;

    axios.post("http://localhost:5687/school-supervisor/logbook/grade", {
      id: selectedLog.id,
      school_supervisor_id: schoolSupervisorCred?.id,
      school_supervisor_grade: grade.toString()
    })
    .then(() => {
      alert("Academic grade saved successfully!");
      setSelectedLog(null);
      fetchLogbooks();
    })
    .catch((err) => alert(err?.response?.data?.message || "Error submitting grade"));
  };

  const unsignedCount = logbooks.filter(l => !l.school_supervisor_grade).length;
  const verifiedLogsCount = logbooks.filter(l => l.org_supervisor_signed).length;

  return (
    <div className="bg-surface min-h-screen flex">
      {/* Sidebar */}
      <aside className="h-screen w-64 border-r fixed left-0 top-0 bg-slate-50 flex flex-col py-6 border-slate-200 z-50">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
              <span className="material-symbols-outlined">school</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-primary leading-none truncate max-w-[130px]">{schoolSupervisorCred?.Full_Name}</h1>
              <span className="text-[10px] text-slate-500 font-medium">Academic Mentor</span>
            </div>
          </div>
        </div>

        <nav className="flex-grow px-3 space-y-1">
          <button
            onClick={() => setActiveTab("roster")}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all text-left ${
              activeTab === "roster" ? "bg-primary text-white font-bold shadow-sm" : "text-slate-600 hover:bg-blue-50 hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined">groups</span>
            Assigned Interns ({students.length})
          </button>
          <button
            onClick={() => setActiveTab("grading")}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all text-left ${
              activeTab === "grading" ? "bg-primary text-white font-bold shadow-sm" : "text-slate-600 hover:bg-blue-50 hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined">edit_document</span>
            Grade Logbooks ({unsignedCount} Pending)
          </button>
        </nav>

        <div className="mt-auto px-3">
          <button onClick={() => navigate("/")} className="w-full flex items-center gap-3 px-3 py-2 text-error hover:bg-error/10 font-bold text-sm rounded-lg">
            <span className="material-symbols-outlined">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8 space-y-8">
        <header className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-primary">Academic Supervision Dashboard</h2>
            <p className="text-sm text-slate-500 mt-1">Grade student logs, monitor company mentor verification, and review training progress.</p>
          </div>
          <span className="px-4 py-2 bg-blue-50 text-blue-900 rounded-xl text-xs font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">verified_user</span>
            {schoolSupervisorCred?.department || "Department Mentor"}
          </span>
        </header>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">groups</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase font-bold">Students Assigned</span>
              <h3 className="text-2xl font-black text-primary">{students.length} Interns</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">draw</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase font-bold">Unsigned by Mentor</span>
              <h3 className="text-2xl font-black text-primary">{logbooks.length - verifiedLogsCount} Logs</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">pending_actions</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase font-bold">Pending Grading</span>
              <h3 className="text-2xl font-black text-primary">{unsignedCount} Submissions</h3>
            </div>
          </div>
        </div>

        {/* Roster Tab Content */}
        {activeTab === "roster" && (
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">directory_sync</span>
              Assigned Intern Directory
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 uppercase tracking-wider font-bold">
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Matric No</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">SIWES Duration</th>
                    <th className="p-3">Training Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-6 text-center text-slate-500">No students currently assigned to your supervision profile.</td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-primary font-bold overflow-hidden border">
                              <img src={student.Profile_Img || user} alt="" className="w-full h-full object-cover" />
                            </div>
                            <span 
                              onClick={() => handleOpenStudentDetails(student)}
                              className="font-bold text-slate-900 cursor-pointer hover:underline hover:text-primary"
                            >
                              {student.Full_Name}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-xs">{student.Matriculation_No}</td>
                        <td className="p-3">{student.department || "General"}</td>
                        <td className="p-3 text-xs text-slate-600">
                          {student.Start_Date ? new Date(student.Start_Date).toLocaleDateString() : 'N/A'} - {student.End_Date ? new Date(student.End_Date).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="p-3">
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-900 rounded-full text-xs font-bold">SIWES Active</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Grading Tab Content */}
        {activeTab === "grading" && (
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">fact_check</span>
              SIWES Logbook Grading Center
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 uppercase tracking-wider font-bold">
                    <th className="p-3">Date / Week</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Activity Description</th>
                    <th className="p-3">Mentor Verification</th>
                    <th className="p-3">Current Grade</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {logbooks.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-6 text-center text-slate-500">No logbook entries found for your assigned students.</td>
                    </tr>
                  ) : (
                    logbooks.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3">
                          <p className="font-mono text-xs">{log.date ? new Date(log.date).toLocaleDateString() : ""}</p>
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-900 text-[10px] font-bold rounded-full">Week {log.week_number}</span>
                        </td>
                        <td className="p-3">
                          <span 
                            onClick={() => {
                              const target = students.find(s => s.id === log.student_id);
                              if (target) {
                                handleOpenStudentDetails(target);
                              }
                            }}
                            className="font-bold text-slate-900 cursor-pointer hover:underline hover:text-primary"
                          >
                            {log.Student_Name}
                          </span>
                        </td>
                        <td className="p-3 max-w-xs truncate" title={log.activity_description}>
                          {log.activity_description}
                        </td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            log.org_supervisor_signed ? "bg-blue-100 text-blue-900" : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {log.org_supervisor_signed ? "Signed" : "Pending Sign-off"}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-primary">
                          {log.school_supervisor_grade ? `${log.school_supervisor_grade}%` : "Not Graded"}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedLog(log);
                              setGrade(log.school_supervisor_grade || 85);
                            }}
                            className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all flex items-center gap-1 ml-auto shadow-sm"
                          >
                            <span className="material-symbols-outlined text-xs">edit_note</span>
                            {log.school_supervisor_grade ? "Update Grade" : "Grade Entry"}
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

        {/* Grade Modal */}
        {selectedLog && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-primary text-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">grade</span>
                  Record Academic Grade
                </h3>
                <button onClick={() => setSelectedLog(null)} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="space-y-2 text-sm bg-slate-50 p-4 rounded-xl">
                <p><strong className="text-primary">Student Name:</strong> {selectedLog.Student_Name}</p>
                <p><strong className="text-primary">SIWES Logbook Week:</strong> Week {selectedLog.week_number}</p>
                <p><strong className="text-primary">Activity Log:</strong> {selectedLog.activity_description}</p>
                <p><strong className="text-primary">Company Mentor Signed:</strong> {selectedLog.org_supervisor_signed ? "Verified" : "Pending"}</p>
              </div>

              <form onSubmit={handleGradeSubmission} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Academic Score (%) *</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="flex-1 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:opacity-90 shadow-md">
                    Confirm & Save Grade
                  </button>
                  <button type="button" onClick={() => setSelectedLog(null)} className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}


      </main>
    </div>
  );
};

export default SupervisorDashboard;
