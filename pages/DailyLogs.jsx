import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { context } from "../src/App";
import axios from "axios";
import { uploadImg } from "../Cloudinary";

const DailyLogs = () => {
  const navigate = useNavigate();
  const { studentCred } = useContext(context);
  const [logs, setLogs] = useState([]);
  
  // New/Edit Log state
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split("T")[0]);
  const [weekNumber, setWeekNumber] = useState(1);
  const [activityDescription, setActivityDescription] = useState("");
  const [imageAttachment, setImageAttachment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingLogId, setEditingLogId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleImageSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      return alert("Please select an image file.");
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleImageSelect(file);
  };

  const getLogBlockReason = () => {
    if (!profile) return null;
    
    // Check registration first
    if (!profile.Organization_Id || !profile.Organization_Supervisor_Id || !profile.School_Supervisor_Id) {
      return {
        title: "Logbook Entry Blocked",
        desc: "You cannot fill your SIWES logbook yet because your training profile is not fully registered. Please ensure you have been accepted at a company, and both your industry supervisor and school supervisor have been assigned by your administrators."
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (profile.Start_Date) {
      const start = new Date(profile.Start_Date);
      start.setHours(0, 0, 0, 0);
      if (today < start) {
        const daysBeforeStart = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return {
          title: "Logbook Entry Blocked: Internship Not Started",
          desc: `Your internship is scheduled to start on ${start.toLocaleDateString()} (in ${daysBeforeStart} day${daysBeforeStart !== 1 ? 's' : ''}). You cannot record daily log entries before this date.`
        };
      }
    }

    if (profile.End_Date) {
      const end = new Date(profile.End_Date);
      end.setHours(0, 0, 0, 0);
      if (today > end) {
        return {
          title: "Logbook Entry Blocked: Internship Period Ended",
          desc: `Your internship period ended on ${end.toLocaleDateString()}. Submitting new logs is now locked.`
        };
      }
    }

    return null;
  };

  const blockReason = getLogBlockReason();

  useEffect(() => {
    if (!studentCred) {
      navigate("/signin");
      return;
    }
    axios.post("http://localhost:5687/user/student/profile", { id: studentCred?.id })
      .then((res) => {
        setProfile(res?.data?.message || null);
      })
      .catch((err) => console.log(err));
    fetchLogs();
  }, [studentCred]);

  const fetchLogs = () => {
    if (!studentCred?.id) return;
    axios.post("http://localhost:5687/user/student/logbook/fetch", {
      student_id: studentCred?.id
    })
    .then((res) => {
      setLogs(res?.data?.message || []);
    })
    .catch((err) => console.log(err));
  };

  const handleSubmitLog = async (e) => {
    e.preventDefault();
    if (!entryDate || !activityDescription) return alert("Please fill in entry date and description");

    // Client-side locks:
    // 1. Prevent duplicate logs for the same date
    const dateExists = logs.some(log => {
      if (isEditing && log.id === editingLogId) return false;
      return new Date(log.date).toISOString().split('T')[0] === entryDate;
    });
    if (dateExists) {
      return alert("You have already recorded a logbook entry for this date.");
    }

    // 2. Prevent future date submission
    const selectedTime = new Date(entryDate).setHours(0,0,0,0);
    const todayTime = new Date().setHours(0,0,0,0);
    if (selectedTime > todayTime) {
      return alert("Cannot record a logbook entry for a future date.");
    }

    // 3. Prevent dates beyond the SIWES End Date
    if (profile?.End_Date) {
      const endTime = new Date(profile.End_Date).setHours(0,0,0,0);
      if (selectedTime > endTime) {
        return alert("Cannot record a logbook entry after your SIWES end date.");
      }
    }

    setUploading(true);
    let uploadedUrl = imageAttachment;
    try {
      if (selectedFile) {
        // Upload to Cloudinary in the background
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(selectedFile);
        });
        const secureUrl = await uploadImg(base64);
        if (!secureUrl) {
          alert("Image upload failed. Please try again.");
          setUploading(false);
          return;
        }
        uploadedUrl = secureUrl;
      }

      if (isEditing) {
        await axios.post("http://localhost:5687/user/student/logbook/update", {
          id: editingLogId,
          activity_description: activityDescription,
          image_attachment: uploadedUrl || null
        });
        alert("Log entry updated successfully!");
        resetForm();
        fetchLogs();
      } else {
        await axios.post("http://localhost:5687/user/student/logbook/create", {
          student_id: studentCred?.id,
          date: entryDate,
          week_number: weekNumber,
          activity_description: activityDescription,
          image_attachment: uploadedUrl || null
        });
        alert("Daily log entry recorded!");
        resetForm();
        fetchLogs();
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Error submitting log entry");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setEntryDate(new Date().toISOString().split("T")[0]);
    setWeekNumber(1);
    setActivityDescription("");
    setImageAttachment("");
    setSelectedFile(null);
    setPreviewUrl("");
    setIsEditing(false);
    setEditingLogId(null);
  };

  const handleEditClick = (log) => {
    setIsEditing(true);
    setEditingLogId(log.id);
    setEntryDate(log.date ? new Date(log.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);
    setWeekNumber(log.week_number || 1);
    setActivityDescription(log.activity_description || "");
    setImageAttachment(log.image_attachment || "");
    setPreviewUrl(log.image_attachment || "");
    setSelectedFile(null);
  };

  const handleDeleteClick = (id) => {
    if (!window.confirm("Are you sure you want to delete this logbook entry?")) return;
    axios.post("http://localhost:5687/user/student/logbook/delete", { id })
      .then(() => {
        alert("Log entry deleted");
        fetchLogs();
      })
      .catch((err) => alert(err?.response?.data?.message || "Error deleting entry"));
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex">
      {/* Sidebar Navigation */}
      <aside className="flex flex-col fixed left-0 top-0 h-full py-4 px-3 bg-slate-50 border-r border-slate-200 h-screen w-64 hidden md:flex z-50">
        <div className="flex items-center gap-3 px-3 mb-8">
          <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-lg text-white">
            <span className="material-symbols-outlined">school</span>
          </div>
          <div>
            <h2 className="text-xl font-black text-primary leading-tight">
              SIWES Portal
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Student Dashboard
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <Link
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-primary rounded-md transition-all"
            to="/student-dashboard"
          >
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </Link>
          <Link
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium bg-primary text-white rounded-md font-bold shadow-sm"
            to="/student-dashboard/daily-logs"
          >
            <span className="material-symbols-outlined">edit_note</span>
            Daily Logbook
          </Link>
        </nav>

        <div className="mt-auto border-t border-slate-200 pt-4">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-error hover:bg-error/10 rounded-md font-bold"
          >
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:ml-64 flex-1 p-6 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-primary">Daily Logbook Journal</h1>
            <p className="text-sm text-slate-500 mt-1">Record your daily practical training activities, tasks accomplished, and work hours.</p>
          </div>
          <span className="px-4 py-2 bg-blue-50 text-blue-900 rounded-xl text-xs font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">person</span>
            {studentCred?.Full_Name || "Student"}
          </span>
        </header>

        {/* Create / Edit Form or Alert Block */}
        {blockReason ? (
          <section className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center space-y-3">
            <span className="material-symbols-outlined text-yellow-600 text-4xl">warning</span>
            <h3 className="font-bold text-yellow-950 text-lg">{blockReason.title}</h3>
            <p className="text-sm text-yellow-800 max-w-lg mx-auto">
              {blockReason.desc}
            </p>
          </section>
        ) : (
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">{isEditing ? "edit" : "add_circle"}</span>
              {isEditing ? "Edit Logbook Entry" : "Record New Activity Log"}
            </h2>
            <form onSubmit={handleSubmitLog} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    disabled={isEditing}
                    min={profile?.Start_Date ? new Date(profile.Start_Date).toISOString().split("T")[0] : undefined}
                    max={(() => {
                      const todayStr = new Date().toISOString().split("T")[0];
                      if (!profile?.End_Date) return todayStr;
                      const endStr = new Date(profile.End_Date).toISOString().split("T")[0];
                      return endStr < todayStr ? endStr : todayStr;
                    })()}
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">SIWES Week Number *</label>
                  <select
                    required
                    disabled={isEditing}
                    value={weekNumber}
                    onChange={(e) => setWeekNumber(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm disabled:opacity-50"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>Week {i + 1}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Image Attachment (Optional)</label>
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-slate-300 hover:border-primary rounded-xl p-4 bg-slate-50 flex flex-col items-center justify-center cursor-pointer transition-all space-y-2 relative"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      id="logbook-image-file"
                      className="hidden"
                      onChange={(e) => handleImageSelect(e.target.files[0])}
                    />
                    {previewUrl ? (
                      <div className="flex items-center gap-4 w-full justify-between">
                        <div className="flex items-center gap-3">
                          <img src={previewUrl} alt="Attachment Preview" className="w-16 h-16 object-cover rounded-lg border shadow-sm" />
                          <div>
                            <p className="text-xs font-bold text-slate-700">
                              {selectedFile ? "Ready for upload on submit" : "Current Log Image"}
                            </p>
                            <span className="text-[10px] text-slate-400 block truncate max-w-xs">{selectedFile ? selectedFile.name : "Attached Image"}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl("");
                            setImageAttachment("");
                          }}
                          className="px-2 py-1 bg-error/10 hover:bg-error/20 text-error text-xs font-bold rounded-lg flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label htmlFor="logbook-image-file" className="w-full h-full flex flex-col items-center justify-center py-4 cursor-pointer">
                        <span className="material-symbols-outlined text-slate-400 text-3xl mb-1">cloud_upload</span>
                        <p className="text-xs font-semibold text-slate-600">Drag & Drop or <span className="text-primary hover:underline">browse</span> to select image</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Image will be uploaded on form submission</p>
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Description of Practical Work / Tasks Conducted *</label>
                <textarea
                  rows="4"
                  required
                  value={activityDescription}
                  onChange={(e) => setActivityDescription(e.target.value)}
                  placeholder="Detailed explanation of activities, tools used, and technical experience gained today..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                ></textarea>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-sm">
                    {uploading ? "sync" : (isEditing ? "save" : "post_add")}
                  </span>
                  {uploading ? "Saving & Uploading..." : (isEditing ? "Save Changes" : "Submit Daily Log")}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={resetForm}
                    className="px-6 py-2.5 bg-slate-200 text-slate-800 font-bold text-sm rounded-xl hover:bg-slate-300 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>
        )}

        {/* Log Entries History */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">history</span>
              Logbook Entries History ({logs.length})
            </h2>
          </div>

          <div className="space-y-4">
            {logs.length === 0 ? (
              <p className="text-center text-slate-500 py-8 text-sm">No daily logbook entries recorded yet. Fill out the form above to post your first log!</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-primary text-sm">
                        {log.date ? new Date(log.date).toLocaleDateString() : ""}
                      </span>
                      <span className="px-2.5 py-0.5 bg-blue-50 text-blue-900 border border-blue-200 rounded-full text-xs font-bold">Week {log.week_number}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        log.org_supervisor_signed ? "bg-blue-100 text-blue-900 font-bold" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {log.org_supervisor_signed ? "Signed Off" : "Unsigned"}
                      </span>
                    </div>
                    <p className="text-slate-700 text-sm">{log.activity_description}</p>
                    {log.image_attachment && (
                      <a href={log.image_attachment} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1 mt-1 font-bold text-xs">
                        <span className="material-symbols-outlined text-xs">image</span>
                        View Image Attachment
                      </a>
                    )}
                    {log.org_supervisor_comment && (
                      <p className="text-xs text-primary font-medium italic">Supervisor Remarks: "{log.org_supervisor_comment}"</p>
                    )}
                    {log.school_supervisor_grade && (
                      <p className="text-xs text-blue-900 font-bold">Academic Assessment Grade: {log.school_supervisor_grade}%</p>
                    )}
                  </div>

                  {!log.org_supervisor_signed && new Date(log.date).setHours(0,0,0,0) === new Date().setHours(0,0,0,0) && (
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEditClick(log)} className="p-2 text-primary hover:bg-blue-50 rounded-lg" title="Edit">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button onClick={() => handleDeleteClick(log.id)} className="p-2 text-error hover:bg-error/10 rounded-lg" title="Delete">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DailyLogs;
