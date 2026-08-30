import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { context } from "../src/App";
import axios from "axios";
import SupervisorContacts from "../components/Student/SupervisorContacts";
import WeeklyTracker from "../components/Student/WeeklyTracker";
import BankDetailsModal from "../components/Student/BankDetailsModal";
import DocumentUploadModal from "../components/Student/DocumentUploadModal";
import LeaveRequestModal from "../components/Student/LeaveRequestModal";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { studentCred } = useContext(context);
  const [showPlacementModal, setShowPlacementModal] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [logbooks, setLogs] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [detailedProfile, setDetailedProfile] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const getInternshipStatus = () => {
    if (!studentCred?.Start_Date || !studentCred?.End_Date) {
      return { status: "not_configured", message: "SIWES Dates Not Configured", desc: "Your SIWES start and end dates are not configured yet.", subMessage: "Please check with your coordinator." };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(studentCred.Start_Date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(studentCred.End_Date);
    end.setHours(0, 0, 0, 0);

    const timeRemaining = end.getTime() - today.getTime();
    const timeBeforeStart = start.getTime() - today.getTime();

    const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
    const daysBeforeStart = Math.ceil(timeBeforeStart / (1000 * 60 * 60 * 24));

    if (today < start) {
      return {
        status: "not_started",
        message: "Not Started",
        desc: `Your internship is scheduled to start in ${daysBeforeStart} day${daysBeforeStart !== 1 ? 's' : ''}.`,
        subMessage: `Schedule: ${start.toLocaleDateString()} to ${end.toLocaleDateString()}`,
        badgeColor: "bg-yellow-100 text-yellow-900 border border-yellow-200"
      };
    } else if (today > end) {
      return {
        status: "ended",
        message: "Ended",
        desc: "The registered SIWES internship period has expired.",
        subMessage: `Completed on: ${end.toLocaleDateString()}`,
        badgeColor: "bg-red-100 text-red-950 border border-red-200"
      };
    } else {
      return {
        status: "active",
        message: "Active",
        desc: `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining of your training.`,
        subMessage: `Ends on: ${end.toLocaleDateString()}`,
        badgeColor: "bg-green-100 text-green-950 border border-green-200 font-bold"
      };
    }
  };

  const timeline = getInternshipStatus();

  useEffect(() => {
    if (!studentCred) {
      navigate("/signin");
      return;
    }
    fetchLogs();
    fetchPlacements();
    fetchDetailedProfile();
    fetchLeaves();
  }, [studentCred]);

  const fetchDetailedProfile = () => {
    axios.post("http://localhost:5687/student/fetch-detailed", { student_id: studentCred?.id })
      .then((res) => {
        if (res?.data?.message?.length > 0) {
          setDetailedProfile(res.data.message[0]);
        }
      })
      .catch((err) => console.log(err));
  };

  const fetchLeaves = () => {
    axios.post("http://localhost:5687/leave/fetch/student", { student_id: studentCred?.id })
      .then((res) => setLeaveRequests(res?.data?.message || []))
      .catch((err) => console.log(err));
  };

  const fetchLogs = () => {
    axios.post("http://localhost:5687/user/student/logbook/fetch", { student_id: studentCred?.id })
      .then((res) => setLogs(res?.data?.message || []))
      .catch((err) => console.log(err));
  };

  const fetchPlacements = () => {
    axios.post("http://localhost:5687/organization/placements/fetch", { student_id: studentCred?.id })
      .then((res) => {
        setPlacements(res?.data?.message || []);
      })
      .catch((err) => console.log(err));
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    axios.post("http://localhost:5687/organization/search", { query: value })
      .then((res) => {
        setOrganizations(res?.data?.message || []);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (showPlacementModal) {
      handleSearchChange("");
    }
  }, [showPlacementModal]);

  const handleApplyPlacement = (e) => {
    e.preventDefault();
    if (!selectedOrg) return alert("Please select a company to apply");

    axios.post("http://localhost:5687/user/student/placement/apply", {
      student_id: studentCred?.id,
      organization_id: selectedOrg.id
    })
    .then(() => {
      alert("Placement application submitted successfully!");
      setShowPlacementModal(false);
      setSelectedOrg(null);
      setSearchQuery("");
      fetchPlacements();
    })
    .catch((err) => alert(err?.response?.data?.message || "Error submitting application"));
  };

  return (
    <div className="flex bg-surface min-h-screen">
      {/* Sidebar */}
      <aside className="h-screen w-64 border-r fixed left-0 top-0 bg-slate-50 flex flex-col py-6 border-slate-200 z-50">
        <div className="px-6 mb-8">
          <h1 className="text-xl font-black text-primary">SIWES Portal</h1>
          <p className="text-slate-600 text-xs font-medium">Student Dashboard</p>
        </div>

        <nav className="flex-grow flex flex-col gap-1 px-3">
          <Link
            className="flex items-center gap-3 px-3 py-2 text-white font-bold bg-primary rounded-lg shadow-sm"
            to="/student-dashboard"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm">Dashboard</span>
          </Link>
          <Link
            className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-primary hover:bg-blue-50 transition-all rounded-lg"
            to="/student-dashboard/daily-logs"
          >
            <span className="material-symbols-outlined">edit_note</span>
            <span className="text-sm">Daily Logbook</span>
          </Link>
          <button
            onClick={() => setShowPlacementModal(true)}
            className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-primary hover:bg-blue-50 transition-all rounded-lg text-left"
          >
            <span className="material-symbols-outlined">domain_add</span>
            <span className="text-sm">Apply Placement</span>
          </button>
        </nav>

        <div className="mt-auto px-3">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-3 py-2 text-error hover:bg-error/10 rounded-lg font-bold text-sm"
          >
            <span className="material-symbols-outlined">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8 space-y-8">
        {/* Header */}
        <header className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-primary">
              Welcome back, {studentCred?.Full_Name || "Student"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Matric No: {studentCred?.Matriculation_No || "Enrolled"} | Department: {studentCred?.department || "General"}
            </p>
          </div>
          <button
            onClick={() => navigate("/student-dashboard/daily-logs")}
            className="bg-primary text-white font-bold px-4 py-2.5 rounded-xl shadow hover:opacity-90 transition-all flex items-center gap-2 text-sm"
          >
            <span className="material-symbols-outlined">edit_note</span>
            View Daily Logs
          </button>
        </header>

        {/* Internship Timeline & Countdown Widget */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">schedule</span>
              SIWES Internship Timeline
            </h3>
            {studentCred?.Start_Date && studentCred?.End_Date && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${timeline.badgeColor}`}>
                {timeline.message}
              </span>
            )}
          </div>
          
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-sm font-bold text-slate-700">{timeline.desc}</p>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">calendar_today</span>
                {timeline.subMessage}
              </p>
            </div>
            {timeline.status === "active" && (
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-2xl font-black text-primary">{timeline.desc.split(" ")[0]}</span>
                <span className="text-xs text-slate-500 font-bold uppercase leading-tight">Days<br/>Left</span>
              </div>
            )}
          </div>
        </div>

        {/* Supervisor Contacts */}
        <SupervisorContacts profile={detailedProfile} />

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">menu_book</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase font-bold">Total Work Logs</span>
              <h3 className="text-2xl font-black text-primary">{logbooks.length} Entries</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">verified</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase font-bold">Signed by Mentor</span>
              <h3 className="text-2xl font-black text-primary">
                {logbooks.filter(l => l.org_supervisor_signed).length} Signed
              </h3>
            </div>
          </div>
        </div>

        {/* Weekly Tracker */}
        <WeeklyTracker logbooks={logbooks} />

        {/* Placement Status Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">domain</span>
            IT Placement Status
          </h3>
          
          {placements.length === 0 ? (
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-700">No Placement Request Submitted</p>
                <p className="text-xs text-slate-500 mt-0.5">Apply for a workplace target to start your SIWES supervisor onboarding.</p>
              </div>
              <button 
                onClick={() => setShowPlacementModal(true)} 
                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all shadow-sm"
              >
                Apply for Placement
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {placements.map((p) => (
                <div key={p.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-primary flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base">corporate_fare</span>
                        {p.Organization_Name}
                      </h4>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        p.status === 'Approved' ? 'bg-blue-100 text-blue-900' :
                        p.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {p.status || 'Pending'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">mail</span>
                      Email: {p.Organization_Email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-primary">SIWES Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link
              to="/student-dashboard/daily-logs"
              className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-blue-50/50 transition-all flex items-center gap-3"
            >
              <span className="material-symbols-outlined text-primary text-3xl">edit_note</span>
              <div>
                <h4 className="font-bold text-sm text-primary">Fill Daily Logbook</h4>
                <p className="text-xs text-slate-500">Record today's tasks & hours</p>
              </div>
            </Link>

            <button
              onClick={() => setShowPlacementModal(true)}
              className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-blue-50/50 transition-all flex items-center gap-3 text-left"
            >
              <span className="material-symbols-outlined text-primary text-3xl">how_to_reg</span>
              <div>
                <h4 className="font-bold text-sm text-primary">Apply Placement</h4>
                <p className="text-xs text-slate-500">Submit IT placement request</p>
              </div>
            </button>

            <Link
              to={`/student-performance/${studentCred?.id}`}
              className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-blue-50/50 transition-all flex items-center gap-3"
            >
              <span className="material-symbols-outlined text-primary text-3xl">query_stats</span>
              <div>
                <h4 className="font-bold text-sm text-primary">Performance View</h4>
                <p className="text-xs text-slate-500">View your grades & metrics</p>
              </div>
            </Link>

            <button
              onClick={() => setShowBankModal(true)}
              className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-blue-50/50 transition-all flex items-center gap-3 text-left"
            >
              <span className="material-symbols-outlined text-primary text-3xl">account_balance</span>
              <div>
                <h4 className="font-bold text-sm text-primary">Bank Details</h4>
                <p className="text-xs text-slate-500">Update ITF stipend account</p>
              </div>
            </button>

            <button
              onClick={() => setShowUploadModal(true)}
              className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-blue-50/50 transition-all flex items-center gap-3 text-left"
            >
              <span className="material-symbols-outlined text-primary text-3xl">upload_file</span>
              <div>
                <h4 className="font-bold text-sm text-primary">Upload Documents</h4>
                <p className="text-xs text-slate-500">Acceptance Letter / Form 8</p>
              </div>
            </button>

            <button
              onClick={() => setShowLeaveModal(true)}
              className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-blue-50/50 transition-all flex items-center gap-3 text-left"
            >
              <span className="material-symbols-outlined text-primary text-3xl">event_busy</span>
              <div>
                <h4 className="font-bold text-sm text-primary">Request Leave</h4>
                <p className="text-xs text-slate-500">Apply for absence</p>
              </div>
            </button>
          </div>
        </div>

        {/* Modals */}
        {showBankModal && (
          <BankDetailsModal
            profile={detailedProfile}
            onClose={() => setShowBankModal(false)}
            onSuccess={() => {
              setShowBankModal(false);
              fetchDetailedProfile();
            }}
          />
        )}
        
        {showUploadModal && (
          <DocumentUploadModal
            profile={detailedProfile}
            onClose={() => setShowUploadModal(false)}
            onSuccess={() => {
              setShowUploadModal(false);
              fetchDetailedProfile();
            }}
          />
        )}

        {showLeaveModal && (
          <LeaveRequestModal
            profile={detailedProfile}
            onClose={() => setShowLeaveModal(false)}
            onSuccess={() => {
              setShowLeaveModal(false);
              fetchLeaves();
            }}
          />
        )}

        {/* Apply Placement Modal */}
        {showPlacementModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined">domain_add</span>
                  Apply for Industrial Placement
                </h3>
                <button onClick={() => setShowPlacementModal(false)} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-600">Search Partner Company *</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 text-lg">search</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search by company name or state location..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Company Directory List */}
              <div className="max-h-60 overflow-y-auto space-y-2 border p-2 rounded-xl bg-slate-50">
                {organizations.length === 0 ? (
                  <p className="text-center text-xs text-slate-500 py-6">No matching partner companies registered.</p>
                ) : (
                  organizations.map((org) => (
                    <div
                      key={org.id}
                      onClick={() => setSelectedOrg(org)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedOrg?.id === org.id
                          ? "bg-blue-50 border-primary shadow-sm"
                          : "bg-white border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <h4 className="font-bold text-sm text-primary flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm">corporate_fare</span>
                        {org.Name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">location_on</span>
                        Location: {org.Location || "N/A"}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">mail</span>
                        Email: {org.Email_Address}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleApplyPlacement} className="space-y-4">
                {selectedOrg && (
                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs">
                    <p className="text-primary font-bold">Selected Placement target:</p>
                    <p className="font-semibold text-slate-700 mt-0.5">{selectedOrg.Name}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={!selectedOrg}
                    className="flex-1 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Application
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPlacementModal(false);
                      setSelectedOrg(null);
                      setSearchQuery("");
                    }}
                    className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl"
                  >
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

export default StudentDashboard;
