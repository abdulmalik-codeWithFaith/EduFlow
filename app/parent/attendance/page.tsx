"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Bell, ChevronDown, Filter, Search, CheckCircle, XCircle, Clock, CalendarDays, TrendingUp, AlertTriangle } from "lucide-react";
import { ParentSidebar } from "../page";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

// ─── Mock Data ────────────────────────────────────────────────────────────────

type Status = "Present" | "Absent" | "Late" | "Holiday";

interface AttRecord {
  date: string;
  day: string;
  status: Status;
  arrival?: string;
  note?: string;
}

const MONTHLY_SUMMARY = [
  { month: "Sep", present: 22, absent: 1, late: 0, total: 23, rate: 96 },
  { month: "Oct", present: 19, absent: 2, late: 2, total: 23, rate: 83 },
  { month: "Nov", present: 22, absent: 0, late: 1, total: 23, rate: 96 },
  { month: "Dec", present: 15, absent: 0, late: 0, total: 15, rate: 100 },
  { month: "Jan", present: 20, absent: 1, late: 0, total: 21, rate: 95 },
  { month: "Feb", present: 17, absent: 1, late: 0, total: 18, rate: 94 },
];

const RECORDS: AttRecord[] = [
  { date: "Mon, 10 Feb 2025", day: "Mon", status: "Present", arrival: "7:48 AM" },
  { date: "Tue, 11 Feb 2025", day: "Tue", status: "Present", arrival: "7:52 AM" },
  { date: "Wed, 12 Feb 2025", day: "Wed", status: "Late",    arrival: "8:34 AM", note: "Traffic delay" },
  { date: "Thu, 13 Feb 2025", day: "Thu", status: "Present", arrival: "7:45 AM" },
  { date: "Fri, 14 Feb 2025", day: "Fri", status: "Present", arrival: "7:49 AM" },
  { date: "Mon, 17 Feb 2025", day: "Mon", status: "Present", arrival: "7:51 AM" },
  { date: "Tue, 18 Feb 2025", day: "Tue", status: "Present", arrival: "7:47 AM" },
  { date: "Wed, 19 Feb 2025", day: "Wed", status: "Absent",  note: "Sick leave (medical cert. submitted)" },
  { date: "Thu, 20 Feb 2025", day: "Thu", status: "Present", arrival: "7:50 AM" },
  { date: "Fri, 21 Feb 2025", day: "Fri", status: "Present", arrival: "7:53 AM" },
  { date: "Mon, 24 Feb 2025", day: "Mon", status: "Present", arrival: "7:44 AM" },
  { date: "Tue, 25 Feb 2025", day: "Tue", status: "Present", arrival: "7:48 AM" },
  { date: "Wed, 26 Feb 2025", day: "Wed", status: "Present", arrival: "7:50 AM" },
  { date: "Thu, 27 Feb 2025", day: "Thu", status: "Present", arrival: "7:46 AM" },
  { date: "Fri, 28 Feb 2025", day: "Fri", status: "Present", arrival: "7:52 AM" },
  { date: "Mon, 20 Jan 2025", day: "Mon", status: "Present", arrival: "7:49 AM" },
  { date: "Tue, 21 Jan 2025", day: "Tue", status: "Present", arrival: "7:51 AM" },
  { date: "Wed, 22 Jan 2025", day: "Wed", status: "Absent",  note: "Family emergency" },
  { date: "Thu, 23 Jan 2025", day: "Thu", status: "Present", arrival: "7:47 AM" },
  { date: "Fri, 24 Jan 2025", day: "Fri", status: "Present", arrival: "7:50 AM" },
];

const TERMS = ["Second Term 2024/2025", "First Term 2024/2025", "Third Term 2023/2024"];

const STATUS_CONFIG: Record<Status, { icon: React.ElementType; color: string; bg: string; border: string; label: string }> = {
  Present: { icon: CheckCircle, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", label: "Present" },
  Absent:  { icon: XCircle,     color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200",     label: "Absent" },
  Late:    { icon: Clock,       color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200",   label: "Late" },
  Holiday: { icon: CalendarDays,color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200",    label: "Holiday" },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BarTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-stone-900 border border-stone-700 rounded-xl px-3 py-2.5 text-xs shadow-xl">
      <p className="text-stone-400 font-semibold mb-1.5">{label}</p>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((p: any) => (
        <p key={p.name} className="font-bold capitalize" style={{ color: p.fill }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ParentAttendancePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState(TERMS[0]);
  const [termOpen, setTermOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<Status | "All">("All");
  const [search, setSearch] = useState("");

  // Overall stats
  const totalPresent = MONTHLY_SUMMARY.reduce((a, m) => a + m.present, 0);
  const totalAbsent  = MONTHLY_SUMMARY.reduce((a, m) => a + m.absent, 0);
  const totalLate    = MONTHLY_SUMMARY.reduce((a, m) => a + m.late, 0);
  const totalDays    = MONTHLY_SUMMARY.reduce((a, m) => a + m.total, 0);
  const overallRate  = Math.round(totalPresent / totalDays * 100);

  const filtered = useMemo(() => RECORDS.filter(r => {
    if (filterStatus !== "All" && r.status !== filterStatus) return false;
    if (search && !r.date.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [filterStatus, search]);

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">
      <div className="hidden lg:flex flex-shrink-0"><ParentSidebar active="/parent/attendance" /></div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-50 lg:hidden">
              <ParentSidebar active="/parent/attendance" mobile onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-stone-100 flex-shrink-0 gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-stone-100 text-stone-500">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-black text-stone-900">Attendance Record</h1>
              <p className="text-xs text-stone-400 mt-0.5">Amara Okafor · SS 2A</p>
            </div>
          </div>
          <div className="relative">
            <button onClick={() => setTermOpen(!termOpen)}
              className="flex items-center gap-2 px-4 py-2.5 border border-stone-200 hover:border-teal-400 rounded-xl text-sm font-bold text-stone-700 bg-white transition-all">
              <CalendarDays className="w-4 h-4 text-stone-400" />
              <span className="hidden sm:inline">{selectedTerm}</span>
              <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${termOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {termOpen && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  className="absolute right-0 top-12 bg-white border border-stone-200 rounded-xl shadow-xl z-20 min-w-56 overflow-hidden">
                  {TERMS.map(t => (
                    <button key={t} onClick={() => { setSelectedTerm(t); setTermOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedTerm === t ? "bg-teal-50 text-teal-700 font-bold" : "text-stone-700 hover:bg-stone-50 font-medium"}`}>
                      {t}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-5">

          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Overall Rate",    value: `${overallRate}%`,  color: overallRate >= 90 ? "bg-teal-50 border-teal-200 text-teal-700" : "bg-amber-50 border-amber-200 text-amber-700", valueColor: overallRate >= 90 ? "text-teal-700" : "text-amber-700" },
              { label: "Days Present",    value: totalPresent,        color: "bg-emerald-50 border-emerald-200 text-emerald-700", valueColor: "text-emerald-700" },
              { label: "Days Absent",     value: totalAbsent,         color: totalAbsent > 3 ? "bg-red-50 border-red-200 text-red-700" : "bg-stone-50 border-stone-200 text-stone-700", valueColor: totalAbsent > 3 ? "text-red-700" : "text-stone-700" },
              { label: "Times Late",      value: totalLate,           color: "bg-amber-50 border-amber-200 text-amber-700", valueColor: "text-amber-700" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className={`border-2 rounded-2xl p-5 shadow-sm ${s.color}`}>
                <p className={`text-3xl font-black ${s.valueColor}`}>{s.value}</p>
                <p className="text-sm font-bold mt-1 opacity-80">{s.label}</p>
                <p className="text-xs mt-0.5 opacity-60">{selectedTerm}</p>
              </motion.div>
            ))}
          </div>

          {/* Alert if low attendance */}
          {overallRate < 90 && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 px-5 py-4 bg-amber-50 border border-amber-200 rounded-2xl">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-black text-amber-900">Attendance Below Recommended Level</p>
                <p className="text-xs text-amber-700 mt-0.5">Greenfield College requires a minimum 90% attendance rate. Please contact the school office if there are special circumstances.</p>
              </div>
            </motion.div>
          )}

          {/* Monthly bar chart */}
          <div className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-black text-stone-900 text-sm">Monthly Breakdown</h3>
                <p className="text-xs text-stone-400 mt-0.5">Present · Absent · Late per month</p>
              </div>
              <div className="flex gap-4 text-xs">
                {[["#14b8a6","Present"],["#ef4444","Absent"],["#f59e0b","Late"]].map(([c, l]) => (
                  <span key={l} className="flex items-center gap-1.5 text-stone-500 font-medium">
                    <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: c }} />{l}
                  </span>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={MONTHLY_SUMMARY} barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#a8a29e" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#a8a29e" }} axisLine={false} tickLine={false} />
                <Tooltip content={<BarTip />} />
                <Bar dataKey="present" fill="#14b8a6" radius={[4,4,0,0]} maxBarSize={28} name="present" />
                <Bar dataKey="absent"  fill="#ef4444" radius={[4,4,0,0]} maxBarSize={28} name="absent" />
                <Bar dataKey="late"    fill="#f59e0b" radius={[4,4,0,0]} maxBarSize={28} name="late" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly rate row */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {MONTHLY_SUMMARY.map((m, i) => (
              <motion.div key={m.month} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`bg-white border-2 rounded-2xl p-4 text-center shadow-sm ${m.rate >= 90 ? "border-teal-200" : m.rate >= 75 ? "border-amber-200" : "border-red-200"}`}>
                <p className="text-xs font-bold text-stone-400 mb-1">{m.month}</p>
                <p className={`text-xl font-black ${m.rate >= 90 ? "text-teal-600" : m.rate >= 75 ? "text-amber-600" : "text-red-600"}`}>{m.rate}%</p>
                <p className="text-xs text-stone-400 mt-0.5">{m.present}/{m.total} days</p>
              </motion.div>
            ))}
          </div>

          {/* Attendance log */}
          <div className="bg-white border border-stone-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 gap-3 flex-wrap">
              <h3 className="font-black text-stone-900 text-sm">Daily Attendance Log</h3>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2">
                  <Search className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by date…"
                    className="text-xs bg-transparent outline-none text-stone-700 placeholder:text-stone-400 w-28" />
                </div>
                {(["All","Present","Absent","Late"] as const).map(f => (
                  <button key={f} onClick={() => setFilterStatus(f as Status | "All")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterStatus === f ? "bg-teal-500 text-white shadow-sm" : "bg-stone-100 text-stone-500 hover:bg-stone-200"}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-100">
                    {["Date","Day","Status","Arrival Time","Note"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-black text-stone-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {filtered.map((r, i) => {
                    const cfg = STATUS_CONFIG[r.status];
                    return (
                      <motion.tr key={r.date} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.025 }} className="hover:bg-stone-50/70 transition-colors">
                        <td className="px-4 py-3 text-sm font-semibold text-stone-700 whitespace-nowrap">{r.date}</td>
                        <td className="px-4 py-3 text-xs font-bold text-stone-400">{r.day}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                            <cfg.icon className="w-3 h-3" />{r.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs font-semibold text-stone-600">{r.arrival ?? "—"}</td>
                        <td className="px-4 py-3 text-xs text-stone-400 max-w-xs">{r.note ?? "—"}</td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-12 text-center">
                  <CalendarDays className="w-10 h-10 text-stone-200 mx-auto mb-2" />
                  <p className="text-sm font-bold text-stone-400">No records found</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}