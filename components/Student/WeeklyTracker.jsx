import React from "react";

const WeeklyTracker = ({ logbooks }) => {
  if (!logbooks || logbooks.length === 0) return null;

  // Group by week
  const weeksMap = {};
  logbooks.forEach(log => {
    const wk = log.week_number;
    if (!weeksMap[wk]) {
      weeksMap[wk] = {
        week: wk,
        logs: [],
        signedCount: 0,
        graded: log.school_supervisor_grade || null
      };
    }
    weeksMap[wk].logs.push(log);
    if (log.org_supervisor_signed) {
      weeksMap[wk].signedCount++;
    }
    if (log.school_supervisor_grade && !weeksMap[wk].graded) {
        weeksMap[wk].graded = log.school_supervisor_grade;
    }
  });

  const weeks = Object.values(weeksMap).sort((a, b) => a.week - b.week);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <h3 className="text-lg font-bold text-primary flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">view_timeline</span>
        Weekly Progress Tracker
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {weeks.map((w) => {
          const isFullySigned = w.signedCount === w.logs.length;
          let statusColor = "bg-slate-50 border-slate-200 text-slate-700";
          let icon = "pending_actions";
          
          if (w.graded) {
            statusColor = "bg-green-50 border-green-200 text-green-800";
            icon = "task_alt";
          } else if (isFullySigned) {
            statusColor = "bg-blue-50 border-blue-200 text-blue-800";
            icon = "check_circle";
          } else if (w.signedCount > 0) {
            statusColor = "bg-yellow-50 border-yellow-200 text-yellow-800";
            icon = "rule";
          }

          return (
            <div key={w.week} className={`p-3 border rounded-xl flex flex-col items-center text-center space-y-1 transition-all ${statusColor}`}>
              <span className="material-symbols-outlined text-2xl opacity-80">{icon}</span>
              <span className="text-sm font-bold">Week {w.week}</span>
              <span className="text-xs opacity-75">{w.logs.length} logs</span>
              {w.graded && <span className="text-xs font-black px-2 py-0.5 bg-white/50 rounded-full mt-1">Grade: {w.graded}</span>}
            </div>
          );
        })}
      </div>
      
      <div className="flex gap-4 text-xs text-slate-500 justify-center pt-2 border-t mt-4">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-200"></span> Pending</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400"></span> Partial Sign</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400"></span> Fully Signed</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400"></span> Graded</span>
      </div>
    </div>
  );
};

export default WeeklyTracker;
