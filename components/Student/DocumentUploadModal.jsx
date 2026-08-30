import React, { useState } from "react";
import axios from "axios";
import { uploadImg } from "../../Cloudinary";

const DocumentUploadModal = ({ profile, onClose, onSuccess }) => {
  const [docType, setDocType] = useState("acceptance"); // 'acceptance' or 'form8'
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a document");
    
    setLoading(true);
    try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            const base64 = reader.result;
            const secureUrl = await uploadImg(base64);

            const payload = { student_id: profile.student_id };
            if (docType === "acceptance") payload.acceptance_letter_url = secureUrl;
            if (docType === "form8") payload.itf_form8_url = secureUrl;

            await axios.post("http://localhost:5687/user/student/update-details", payload);
            
            alert("Document uploaded successfully!");
            onSuccess();
        };
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to upload document");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h3 className="font-bold text-lg text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">upload_file</span>
            Upload Official Documents
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Document Type</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="acceptance">Company Acceptance Letter</option>
              <option value="form8">ITF Form 8 (End of Program)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Select File (Image/PDF)</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              required
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={loading || !file}
              className="flex-1 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentUploadModal;
