"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  School, LayoutDashboard, Users, UserCheck, CreditCard, BookOpen,
  Megaphone, BarChart3, Settings, Search, Menu, X, ChevronLeft,
  ChevronRight, CheckCircle, XCircle, Clock, GraduationCap, LogOut,
  Download, Filter, Calendar, TrendingUp, TrendingDown, AlertTriangle,
  Save, RefreshCw, ChevronDown, Loader2,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

type AttendanceStatus = "present" | "absent" | "late" | null;

interface Student {
  id: string;
  name: string;
  admissionNo: string;
  avatar: string;
  avatarColor: string;
  status: AttendanceStatus;
}

interface ClassRecord {
  class: string;
  teacher: string;
  total: number;
  present: number;
  absent: number;
  late: number;
  marked: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CLASSES = ["JSS 1A","JSS 1B","JSS 1C","JSS 2A","JSS 2B","JSS 2C","JSS 3A","JSS 3B","SS 1A","SS 1B","SS 2A","SS 2B","SS 3A","SS 3B"];

const WEEKLY_TREND = [
  { day: "Mon", rate: 95, present: 1219, absent: 65 },
  { day: "Tue", rate: 88, present: 1130, absent: 154 },
  { day: "Wed", rate: 92, present: 1181, absent: 103 },
  { day: "Thu", rate: 97, present: 1245, absent: 39 },
  { day: "Fri", rate: 84, present: 1078, absent: 206 },
  { day: "Today", rate: 94, present: 1207, absent: 77 },
];

const MONTHLY_TREND = [
  { month: "Sep", rate: 91 }, { month: "Oct", rate: 88 }, { month: "Nov", rate: 93 },
  { month: "Dec", rate: 86 }, { month: "Jan", rate: 90 }, { month: "Feb", rate: 94 },
];

const CLASS_SUMMARY: ClassRecord[] = [
  { class: "JSS 1A", teacher: "Ms. F. Aliyu", total: 42, present: 40, absent: 1, late: 1, marked: true },
  { class: "JSS 1B", teacher: "Mr. C. Dike", total: 40, present: 35, absent: 4, late: 1, marked: true },
  { class: "JSS 1C", teacher: "Mrs. B. Obi", total: 38, present: 38, absent: 0, late: 0, marked: true },
  { class: "JSS 2A", teacher: "Mr. T. Nwosu", total: 44, present: 36, absent: 6, late: 2, marked: false },
  { class: "JSS 2B", teacher: "Ms. F. Aliyu", total: 40, present: 33, absent: 7, late: 0, marked: true },
  { class: "JSS 2C", teacher: "Mrs. B. Obi", total: 38, present: 38, absent: 0, late: 0, marked: true },
  { class: "JSS 3A", teacher: "Mr. I. Musa", total: 45, present: 44, absent: 0, late: 1, marked: true },
  { class: "JSS 3B", teacher: "Mr. C. Dike", total: 41, present: 31, absent: 8, late: 2, marked: false },
  { class: "SS 1A",  teacher: "Mr. E. Abubakar", total: 38, present: 36, absent: 2, late: 0, marked: true },
  { class: "SS 1B",  teacher: "Mrs. N. Okonkwo", total: 40, present: 35, absent: 4, late: 1, marked: true },
  { class: "SS 2A",  teacher: "Mr. E. Abubakar", total: 42, present: 40, absent: 2, late: 0, marked: true },
  { class: "SS 2B",  teacher: "Mr. S. Adeyemi", total: 39, present: 37, absent: 2, late: 0, marked: false },
  { class: "SS 3A",  teacher: "Dr. A. Eze", total: 36, present: 36, absent: 0, late: 0, marked: true },
  { class: "SS 3B",  teacher: "Dr. A. Eze", total: 34, present: 28, absent: 5, late: 1, marked: true },
];

const generateStudents = (cls: string): Student[] => {
  const names = [
    ["Amara Okafor","AO","bg-emerald-500"], ["Emmanuel Adeyemi","EA","bg-blue-500"],
    ["Fatima Bello","FB","bg-violet-500"], ["Chidi Nwosu","CN","bg-orange-500"],
    ["Grace Eze","GE","bg-pink-500"], ["Ibrahim Hassan","IH","bg-red-500"],
    ["Blessing Okonkwo","BO","bg-teal-500"], ["Tunde Afolabi","TA","bg-indigo-500"],
    ["Chioma Obi","CO","bg-emerald-600"], ["Yusuf Abubakar","YA","bg-amber-500"],
    ["Adaeze Igwe","AI","bg-purple-500"], ["Solomon Dike","SD","bg-cyan-500"],
    ["Ngozi Williams","NW","bg-rose-500"], ["Emeka Johnson","EJ","bg-lime-600"],
    ["Aisha Mohammed","AM","bg-fuchsia-500"],
  ];
  return names.slice(0, 12 + Math.floor(Math.random() * 4)).map(([name, avatar, color], idx) => ({
    id: `${cls}-${idx}`, name, admissionNo: `GFC/2024/${String(idx + 1).padStart(3,"0")}`,
    avatar, avatarColor: color, status: null,
  }));
};

// ─── Shared Sidebar ───────────────────────────────────────────────────────────

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Students", href: "/dashboard/students" },
  { icon: GraduationCap, label: "Teachers", href: "/dashboard/teachers" },
  { icon: UserCheck, label: "Attendance", href: "/dashboard/attendance", active: true },
  { icon: CreditCard, label: "Fees", href: "/dashboard/fees" },
  { icon: BookOpen, label: "Results", href: "/dashboard/results" },
  { icon: Megaphone, label: "Announcements", href: "/dashboard/announcements" },
  { icon: BarChart3, label: "Reports", href: "/dashboard/reports" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

function Sidebar({ mobile, onClose }: { mobile?: boolean; onClose?: () => void }) {
  return (
    <aside className={`flex flex-col h-full bg-slate-950 border-r border-slate-800 ${mobile ? "w-full" : "w-64"}`}>
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
            <School className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-lg text-white tracking-tight">Edu<span className="text-emerald-400">Flow</span></span>
        </Link>
        {mobile && <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>}
      </div>
      <div className="px-4 py-3 mx-3 mt-4 bg-slate-900 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <School className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-bold truncate">Greenfield College</p>
            <p className="text-slate-500 text-xs">School Admin</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-xs font-bold text-slate-600 uppercase tracking-widest px-3 mb-3">Main Menu</p>
        {NAV.map(item => (
          <Link key={item.label} href={item.href} onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${"active" in item ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/50" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}>
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {item.label}
            {"active" in item && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />}
          </Link>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 cursor-pointer group transition-all">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-xs font-black">CO</div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-bold truncate">Dr. Chidinma Okonkwo</p>
            <p className="text-slate-500 text-xs truncate">chidinma@school.edu.ng</p>
          </div>
          <LogOut className="w-4 h-4 text-slate-600 group-hover:text-red-400 transition-colors" />
        </div>
      </div>
    </aside>
  );
}

// ─── Mark Attendance Modal ────────────────────────────────────────────────────

function MarkAttendanceModal({ cls, onClose, onSave }: {
  cls: ClassRecord; onClose: () => void;
  onSave: (cls: string, data: Record<string, AttendanceStatus>) => void;
}) {
  const [students] = useState<Student[]>(() => generateStudents(cls.class));
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const mark = (id: string, status: AttendanceStatus) =>
    setAttendance(p => ({ ...p, [id]: p[id] === status ? null : status }));

  const markAll = (status: AttendanceStatus) => {
    const all: Record<string, AttendanceStatus> = {};
    students.forEach(s => { all[s.id] = status; });
    setAttendance(all);
  };

  const counts = useMemo(() => {
    const present = Object.values(attendance).filter(v => v === "present").length;
    const absent = Object.values(attendance).filter(v => v === "absent").length;
    const late = Object.values(attendance).filter(v => v === "late").length;
    const unmarked = students.length - present - absent - late;
    return { present, absent, late, unmarked };
  }, [attendance, students]);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    onSave(cls.class, attendance);
    setSaved(true);
    setTimeout(onClose, 900);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 20 }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="font-black text-slate-900 text-lg">Mark Attendance — {cls.class}</h2>
            <p className="text-xs text-slate-400 mt-0.5">Teacher: {cls.teacher} · Today, {new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"})}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"><X className="w-5 h-5" /></button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-3 px-6 py-4 border-b border-slate-100 flex-shrink-0">
          {[
            { label: "Present", count: counts.present, color: "text-emerald-600 bg-emerald-50" },
            { label: "Absent", count: counts.absent, color: "text-red-600 bg-red-50" },
            { label: "Late", count: counts.late, color: "text-amber-600 bg-amber-50" },
            { label: "Unmarked", count: counts.unmarked, color: "text-slate-600 bg-slate-100" },
          ].map(s => (
            <div key={s.label} className={`${s.color} rounded-xl px-3 py-2.5 text-center`}>
              <div className="text-xl font-black">{s.count}</div>
              <div className="text-xs font-semibold mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-2 flex-shrink-0">
          <span className="text-xs font-bold text-slate-500 mr-1">Mark all as:</span>
          {(["present","absent","late"] as AttendanceStatus[]).map(s => (
            <button key={s as string} onClick={() => markAll(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border
                ${s === "present" ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100" :
                  s === "absent"  ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100" :
                  "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"}`}>
              {(s as string).charAt(0).toUpperCase() + (s as string).slice(1)}
            </button>
          ))}
          <button onClick={() => setAttendance({})} className="ml-auto text-xs text-slate-400 hover:text-slate-700 font-semibold flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5" /> Clear all
          </button>
        </div>

        {/* Student list */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-2">
            {students.map((student, i) => {
              const s = attendance[student.id] ?? null;
              return (
                <motion.div key={student.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`flex items-center gap-4 p-3 rounded-xl border-2 transition-all ${
                    s === "present" ? "bg-emerald-50 border-emerald-200" :
                    s === "absent"  ? "bg-red-50 border-red-200" :
                    s === "late"    ? "bg-amber-50 border-amber-200" :
                    "bg-white border-slate-100 hover:border-slate-200"}`}>
                  <div className={`w-9 h-9 ${student.avatarColor} rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
                    {student.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-sm">{student.name}</p>
                    <p className="text-xs text-slate-400">{student.admissionNo}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {([["present","P","emerald"],["absent","A","red"],["late","L","amber"]] as [AttendanceStatus, string, string][]).map(([val, lbl, col]) => (
                      <button key={lbl} onClick={() => mark(student.id, val)}
                        className={`w-8 h-8 rounded-lg text-xs font-black transition-all border-2
                          ${s === val
                            ? col === "emerald" ? "bg-emerald-500 text-white border-emerald-500"
                            : col === "red"     ? "bg-red-500 text-white border-red-500"
                            : "bg-amber-500 text-white border-amber-500"
                            : col === "emerald" ? "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                            : col === "red"     ? "border-red-200 text-red-600 hover:bg-red-50"
                            : "border-amber-200 text-amber-600 hover:bg-amber-50"
                          }`}>
                        {lbl}
                      </button>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between flex-shrink-0">
          <p className="text-xs text-slate-400">
            <span className="font-bold text-slate-700">{counts.unmarked}</span> students not yet marked
          </p>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-2.5 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl text-sm transition-all">
              Cancel
            </button>
            <motion.button onClick={handleSave} disabled={saving || saved} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white font-black rounded-xl text-sm flex items-center gap-2 shadow-md shadow-emerald-100 transition-colors">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                : saved ? <><CheckCircle className="w-4 h-4" /> Saved!</>
                : <><Save className="w-4 h-4" /> Save Attendance</>}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs shadow-xl">
      <p className="text-slate-400 font-semibold mb-1">{label}</p>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-bold capitalize">{p.name}: {p.value}{typeof p.value === "number" && p.value <= 100 ? "%" : ""}</p>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AttendancePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "mark" | "history">("overview");
  const [markingClass, setMarkingClass] = useState<ClassRecord | null>(null);
  const [classes, setClasses] = useState<ClassRecord[]>(CLASS_SUMMARY);
  const [filterMark, setFilterMark] = useState<"all" | "marked" | "unmarked">("all");
  const [searchClass, setSearchClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));

  const totals = useMemo(() => {
    const total  = classes.reduce((a, c) => a + c.total, 0);
    const present = classes.reduce((a, c) => a + c.present, 0);
    const absent  = classes.reduce((a, c) => a + c.absent, 0);
    const late    = classes.reduce((a, c) => a + c.late, 0);
    const marked  = classes.filter(c => c.marked).length;
    return { total, present, absent, late, marked, rate: Math.round(present / total * 100) };
  }, [classes]);

  const filteredClasses = useMemo(() => classes.filter(c => {
    if (filterMark === "marked" && !c.marked) return false;
    if (filterMark === "unmarked" && c.marked) return false;
    if (searchClass && !c.class.toLowerCase().includes(searchClass.toLowerCase()) && !c.teacher.toLowerCase().includes(searchClass.toLowerCase())) return false;
    return true;
  }), [classes, filterMark, searchClass]);

  const handleSave = (cls: string, _data: Record<string, AttendanceStatus>) => {
    setClasses(prev => prev.map(c => c.class === cls ? { ...c, marked: true } : c));
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <div className="hidden lg:flex flex-shrink-0"><Sidebar /></div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-40 lg:hidden" />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-50 lg:hidden">
              <Sidebar mobile onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 gap-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-black text-slate-900">Attendance Management</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                {" "}· Second Term
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
              className="hidden sm:block px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 outline-none focus:border-emerald-400 transition-all" />
            <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl text-sm transition-all">
              <Download className="w-4 h-4" /> Export Report
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6">

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: "Overall Rate", value: `${totals.rate}%`, sub: "Today", color: "bg-emerald-600 text-white", big: true },
              { label: "Present", value: totals.present.toLocaleString(), sub: "Students in", color: "bg-emerald-50", textColor: "text-emerald-700" },
              { label: "Absent", value: totals.absent, sub: "Not in school", color: "bg-red-50", textColor: "text-red-700" },
              { label: "Late", value: totals.late, sub: "Came late", color: "bg-amber-50", textColor: "text-amber-700" },
              { label: "Classes Marked", value: `${totals.marked}/${classes.length}`, sub: "Completed", color: "bg-blue-50", textColor: "text-blue-700" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22,1,0.36,1] }}
                className={`${s.color} rounded-2xl p-5 shadow-sm ${s.big ? "shadow-emerald-200" : "bg-white border border-slate-100"}`}>
                <div className={`text-2xl font-black mb-0.5 ${"textColor" in s ? s.textColor : "text-white"}`}>{s.value}</div>
                <div className={`text-sm font-bold ${"textColor" in s ? "text-slate-700" : "text-white/90"}`}>{s.label}</div>
                <div className={`text-xs mt-0.5 ${"textColor" in s ? "text-slate-400" : "text-white/70"}`}>{s.sub}</div>
                {s.big && (
                  <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${totals.rate}%` }}
                      transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                      className="h-full bg-white rounded-full" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Alert: unmarked classes */}
          {classes.filter(c => !c.marked).length > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-800 text-sm">
                  {classes.filter(c => !c.marked).length} classes haven&apos;t marked attendance yet
                </p>
                <p className="text-xs text-amber-700 mt-0.5">
                  {classes.filter(c => !c.marked).map(c => c.class).join(", ")}
                </p>
              </div>
              <button onClick={() => { setActiveTab("mark"); setFilterMark("unmarked"); }}
                className="ml-auto text-xs font-black text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap">
                Mark now
              </button>
            </motion.div>
          )}

          {/* Tabs */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
            {(["overview","mark","history"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                {tab === "mark" ? "Mark Attendance" : tab === "history" ? "History & Trends" : "Overview"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* ── OVERVIEW TAB ── */}
            {activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="space-y-5">
                <div className="grid lg:grid-cols-2 gap-5">
                  {/* Weekly chart */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                    <h3 className="font-black text-slate-900 text-sm mb-1">This Week</h3>
                    <p className="text-xs text-slate-400 mb-5">Daily attendance rate — current week</p>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={WEEKLY_TREND}>
                        <defs>
                          <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                        <YAxis domain={[70, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} unit="%" />
                        <Tooltip content={<ChartTooltip />} />
                        <Area type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2.5} fill="url(#aGrad)" name="rate" dot={{ fill: "#10b981", r: 4 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Monthly chart */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                    <h3 className="font-black text-slate-900 text-sm mb-1">Term Trend</h3>
                    <p className="text-xs text-slate-400 mb-5">Monthly average attendance — second term</p>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={MONTHLY_TREND}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                        <YAxis domain={[75, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} unit="%" />
                        <Tooltip content={<ChartTooltip />} />
                        <Bar dataKey="rate" fill="#6366f1" radius={[6,6,0,0]} name="rate" maxBarSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Class summary table */}
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-black text-slate-900 text-sm">Today&apos;s Class Summary</h3>
                    <div className="flex items-center gap-1 text-xs font-semibold">
                      <span className="text-slate-400">{totals.marked} marked</span>
                      <span className="text-slate-300 mx-1">·</span>
                      <span className="text-amber-600">{classes.length - totals.marked} pending</span>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-50 bg-slate-50">
                          {["Class","Teacher","Present","Absent","Late","Rate","Status"].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wide">{h}</th>
                          ))}
                          <th className="px-4 py-3 text-right text-xs font-black text-slate-500 uppercase tracking-wide">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {CLASS_SUMMARY.map((c, i) => {
                          const rate = Math.round(c.present / c.total * 100);
                          return (
                            <motion.tr key={c.class} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                              className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-3">
                                <span className="font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg text-xs">{c.class}</span>
                              </td>
                              <td className="px-4 py-3 text-xs text-slate-600 font-medium">{c.teacher}</td>
                              <td className="px-4 py-3"><span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">{c.present}</span></td>
                              <td className="px-4 py-3"><span className="text-xs font-black text-red-700 bg-red-50 px-2 py-1 rounded-md">{c.absent}</span></td>
                              <td className="px-4 py-3"><span className="text-xs font-black text-amber-700 bg-amber-50 px-2 py-1 rounded-md">{c.late}</span></td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${rate >= 90 ? "bg-emerald-500" : rate >= 75 ? "bg-amber-400" : "bg-red-400"}`}
                                      style={{ width: `${rate}%` }} />
                                  </div>
                                  <span className={`text-xs font-black ${rate >= 90 ? "text-emerald-600" : rate >= 75 ? "text-amber-600" : "text-red-600"}`}>{rate}%</span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                {c.marked
                                  ? <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200"><CheckCircle className="w-3 h-3" /> Marked</span>
                                  : <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-200"><Clock className="w-3 h-3" /> Pending</span>
                                }
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button onClick={() => setMarkingClass(c)}
                                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${c.marked ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"}`}>
                                  {c.marked ? "Re-mark" : "Mark"}
                                </button>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── MARK ATTENDANCE TAB ── */}
            {activeTab === "mark" && (
              <motion.div key="mark" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="space-y-5">
                {/* Filters */}
                <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex-1 min-w-48">
                    <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <input value={searchClass} onChange={e => setSearchClass(e.target.value)}
                      placeholder="Search class or teacher…"
                      className="text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400 w-full" />
                  </div>
                  <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                    {(["all","marked","unmarked"] as const).map(f => (
                      <button key={f} onClick={() => setFilterMark(f)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${filterMark === f ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Class cards grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredClasses.map((c, i) => {
                    const rate = Math.round(c.present / c.total * 100);
                    return (
                      <motion.div key={c.class} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`bg-white border-2 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group
                          ${c.marked ? "border-emerald-200 hover:border-emerald-300" : "border-slate-200 hover:border-amber-300"}`}
                        onClick={() => setMarkingClass(c)}>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-black text-slate-900 text-base">{c.class}</span>
                          {c.marked
                            ? <CheckCircle className="w-5 h-5 text-emerald-500" />
                            : <Clock className="w-5 h-5 text-amber-500" />
                          }
                        </div>
                        <p className="text-xs text-slate-500 mb-3">{c.teacher}</p>
                        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                          <div className="bg-emerald-50 rounded-lg py-1.5">
                            <div className="text-sm font-black text-emerald-700">{c.present}</div>
                            <div className="text-xs text-emerald-600">Present</div>
                          </div>
                          <div className="bg-red-50 rounded-lg py-1.5">
                            <div className="text-sm font-black text-red-700">{c.absent}</div>
                            <div className="text-xs text-red-600">Absent</div>
                          </div>
                          <div className="bg-amber-50 rounded-lg py-1.5">
                            <div className="text-sm font-black text-amber-700">{c.late}</div>
                            <div className="text-xs text-amber-600">Late</div>
                          </div>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                          <div className={`h-full rounded-full transition-all ${rate >= 90 ? "bg-emerald-500" : rate >= 75 ? "bg-amber-400" : "bg-red-400"}`}
                            style={{ width: `${rate}%` }} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-black ${rate >= 90 ? "text-emerald-600" : rate >= 75 ? "text-amber-600" : "text-red-600"}`}>{rate}%</span>
                          <span className="text-xs text-slate-400">{c.total} students</span>
                        </div>
                        <div className={`mt-4 w-full py-2 rounded-xl text-xs font-black text-center transition-all
                          ${c.marked ? "bg-slate-100 text-slate-600 group-hover:bg-slate-200" : "bg-emerald-600 text-white group-hover:bg-emerald-700 shadow-sm"}`}>
                          {c.marked ? "Re-mark Attendance" : "Mark Attendance"}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ── HISTORY TAB ── */}
            {activeTab === "history" && (
              <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="space-y-5">
                <div className="grid lg:grid-cols-3 gap-5">
                  {/* Trend summary cards */}
                  {[
                    { label: "Best Day This Week", value: "Thursday", sub: "97% attendance rate", icon: TrendingUp, color: "text-emerald-600 bg-emerald-100" },
                    { label: "Worst Day This Week", value: "Friday", sub: "84% attendance rate", icon: TrendingDown, color: "text-red-600 bg-red-100" },
                    { label: "Term Average", value: "90.3%", sub: "Above target of 85%", icon: BarChart3, color: "text-blue-600 bg-blue-100" },
                  ].map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                      <div className={`w-12 h-12 ${s.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <s.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium">{s.label}</p>
                        <p className="font-black text-slate-900 text-lg leading-tight">{s.value}</p>
                        <p className="text-xs text-slate-500">{s.sub}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Detailed history table */}
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100">
                    <h3 className="font-black text-slate-900 text-sm">Weekly Breakdown</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Day-by-day attendance summary — current week</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-50 bg-slate-50">
                          {["Day","Present","Absent","Rate","Status"].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wide">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {WEEKLY_TREND.map((d, i) => (
                          <tr key={d.day} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3">
                              <span className={`font-bold text-sm ${d.day === "Today" ? "text-emerald-600" : "text-slate-800"}`}>{d.day}</span>
                              {d.day === "Today" && <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">Today</span>}
                            </td>
                            <td className="px-4 py-3 font-semibold text-slate-700">{d.present.toLocaleString()}</td>
                            <td className="px-4 py-3 font-semibold text-slate-700">{d.absent}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full ${d.rate >= 90 ? "bg-emerald-500" : d.rate >= 80 ? "bg-amber-400" : "bg-red-400"}`}
                                    style={{ width: `${d.rate}%` }} />
                                </div>
                                <span className={`text-xs font-black ${d.rate >= 90 ? "text-emerald-600" : d.rate >= 80 ? "text-amber-600" : "text-red-600"}`}>{d.rate}%</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {d.rate >= 90 ? <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">Excellent</span>
                                : d.rate >= 80 ? <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">Good</span>
                                : <span className="text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-full">Low</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Mark Modal */}
      <AnimatePresence>
        {markingClass && (
          <MarkAttendanceModal cls={markingClass} onClose={() => setMarkingClass(null)} onSave={handleSave} />
        )}
      </AnimatePresence>
    </div>
  );
}