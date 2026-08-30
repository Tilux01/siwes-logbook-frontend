import React from "react";

const SupervisorContacts = ({ profile }) => {
  if (!profile) return null;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <h3 className="text-lg font-bold text-primary flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">contact_mail</span>
        Assigned Mentors & Contacts
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Industry Supervisor */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
          <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Industry Supervisor</h4>
          {profile.org_supervisor_name ? (
            <div className="space-y-1 text-sm">
              <p className="font-bold text-slate-700">{profile.org_supervisor_name}</p>
              <p className="text-slate-600 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">mail</span>
                {profile.org_supervisor_email}
              </p>
              <p className="text-slate-600 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">call</span>
                {profile.org_supervisor_contact || "N/A"}
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">Not yet assigned.</p>
          )}
        </div>

        {/* Academic Supervisor */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
          <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Academic Supervisor</h4>
          {profile.school_supervisor_name ? (
            <div className="space-y-1 text-sm">
              <p className="font-bold text-slate-700">{profile.school_supervisor_name}</p>
              <p className="text-slate-600 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">mail</span>
                {profile.school_supervisor_email}
              </p>
              <p className="text-slate-600 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">call</span>
                {profile.school_supervisor_contact || "N/A"}
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">Not yet assigned.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupervisorContacts;
