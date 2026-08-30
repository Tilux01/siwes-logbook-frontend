import React, { useState } from "react";
import axios from "axios";

const BankDetailsModal = ({ profile, onClose, onSuccess }) => {
  const [bankName, setBankName] = useState(profile?.bank_name || "");
  const [accountNumber, setAccountNumber] = useState(profile?.account_number || "");
  const [accountName, setAccountName] = useState(profile?.account_name || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5687/user/student/update-details", {
        student_id: profile.student_id,
        bank_name: bankName,
        account_number: accountNumber,
        account_name: accountName
      });
      alert("Bank details updated successfully!");
      onSuccess();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h3 className="font-bold text-lg text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">account_balance</span>
            Update Bank Details
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Bank Name</label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="e.g. First Bank"
              required
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Account Number</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="10 digit account number"
              required
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Account Name</label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="e.g. John Doe"
              required
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Details"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BankDetailsModal;
