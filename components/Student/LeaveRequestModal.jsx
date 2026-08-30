import React, { useState } from "react";
import axios from "axios";

const LeaveRequestModal = ({ profile, onClose, onSuccess }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) return alert("Please fill all fields");
    
    setLoading(true);
    try {
      await axios.post("http://localhost:5687/leave/request", {
        student_id: profile.student_id,
        start_date: startDate,
        end_date: endDate,
        reason: reason
      });
      alert("Leave request submitted successfully!");
      onSuccess();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to submit leave request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h3 className="font-bold text-lg text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">event_busy</span>
            Request Leave of Absence
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-600 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-600 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Reason for Leave</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide a detailed reason for your absence..."
              required
              rows={4}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveRequestModal;
