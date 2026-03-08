"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Menu, X, Search, CheckCircle, XCircle, Clock, Save,
  Loader2, RefreshCw, Users, ChevronDown, Filter,
  AlertTriangle, BarChart3, CalendarDays, ArrowLeft,
} from "lucide-react";
import { TeacherSidebar } from "../page";

// ─── Types ────────────────────────────────────────────────────────────────────

type AttendanceStatus = "present" | "absent" | "late" | null;

interface ClassStudent {
  id: string;
  name: string;
  admNo: string;
  avatar: string;
  avatarColor: string;
  status: AttendanceStatus;
  attendanceRate: number;
}

interface MyClass {
  id: string;
  name: string;
  subject: string;
  students: number;
  period: string;
  room: string;
  marked: boolean;
  attendanceRate: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MY_CLASSES: MyClass[] = [
  { id:"ss2a",  name:"SS 2A",  subject:"Mathematics", students:42, period:"Period 1 · 8:00–9:00 AM",   room:"Room 12",  marked:true,  attendanceRate:96 },
  { id:"ss1b",  name:"SS 1B",  subject:"Mathematics", students:40, period:"Period 3 · 10:00–11:00 AM",  room:"Room 8",   marked:false, attendanceRate:88 },
  { id:"ss3a",  name:"SS 3A",  subject:"Mathematics", students:36, period:"Period 5 · 12:30–1:30 PM",   room:"Room 15",  marked:true,  attendanceRate:94 },
  { id:"jss3b", name:"JSS 3B", subject:"Mathematics", students:41, period:"Period 6 · 1:30–2:30 PM",    room:"Room 6",   marked:false, attendanceRate:83 },
];

const STUDENT_NAMES = [
  ["Amara Okafor","AO","bg-emerald-500"], ["Emmanuel Adeyemi","EA","bg-blue-500"],
  ["Fatima Bello","FB","bg-violet-500"], ["Chidi Nwosu","CN","bg-orange-500"],
  ["Grace Eze","GE","bg-pink-500"], ["Ibrahim Hassan","IH","bg-red-500"],
  ["Blessing Okonkwo","BO","bg-teal-500"], ["Tunde Afolabi","TA","bg-indigo-500"],
  ["Chioma Obi","CO","bg-emerald-600"], ["Yusuf Abubakar","YA","bg-amber-500"],
  ["Adaeze Igwe","AI","bg-purple-500"], ["Solomon Dike","SD","bg-cyan-500"],
  ["Ngozi Williams","NW","bg-rose-500"], ["Emeka Johnson","EJ","bg-lime-600"],
  ["Aisha Mohammed","AM","bg-fuchsia-500"], ["Uche Okoye","UO","bg-sky-500"],
  ["Kemi Adeola","KA","bg-emerald-400"], ["Bayo Adeleke","BA","bg-blue-600"],
];

const makeStudents = (classId: string, count: number): ClassStudent[] =>
  STUDENT_NAMES.slice(0, count).map(([name, av, col], idx) => ({
    id: `${classId}-${idx}`,
    name, admNo: `GFC/2024/${String(idx+1).padStart(3,"0")}`,
    avatar: av, avatarColor: col,
    status: null,
    attendanceRate: Math.floor(Math.random() * 30) + 70,
  }));

const HISTORY = [
  { date:"Mon, 13 Jan", ss2a:96, ss1b:88, ss3a:100, jss3b:85 },
  { date:"Tue, 14 Jan", ss2a:100, ss1b:90, ss3a:94, jss3b:80 },
  { date:"Wed, 15 Jan", ss2a:93, ss1b:85, ss3a:97, jss3b:88 },
  { date:"Thu, 16 Jan", ss2a:98, ss1b:93, ss3a:100, jss3b:90 },
  { date:"Fri, 17 Jan", ss2a:88, ss1b:78, ss3a:89, jss3b:75 },
];

// ─── Mark Attendance Modal ────────────────────────────────────────────────────

function MarkModal({ cls, onClose, onSave }: {
  cls: MyClass; onClose: () => void;
  onSave: (id: string) => void;
}) {
  const [students] = useState<ClassStudent[]>(() => makeStudents(cls.id, cls.students > 18 ? 18 : cls.students));
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState("");

  const mark = (id: string, status: AttendanceStatus) =>
    setAttendance(p => ({ ...p, [id]: p[id] === status ? null : status }));

  const markAll = (status: AttendanceStatus) => {
    const all: Record<string, AttendanceStatus> = {};
    students.forEach(s => { all[s.id] = status; });
    setAttendance(all);
  };

  const counts = useMemo(() => ({
    present: Object.values(attendance).filter(v => v === "present").length,
    absent:  Object.values(attendance).filter(v => v === "absent").length,
    late:    Object.values(attendance).filter(v => v === "late").length,
    unmarked: students.length - Object.values(attendance).filter(Boolean).length,
  }), [attendance, students]);

  const filtered = students.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.admNo.includes(search)
  );

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    onSave(cls.id);
    setSaved(true);
    setTimeout(onClose, 800);
  };

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale:0.94, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.94, y:20 }}
        transition={{ type:"spring", damping:28, stiffness:280 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="font-black text-slate-900 text-lg">Mark Attendance — {cls.name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{cls.subject} · {cls.period} · {cls.room}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"><X className="w-5 h-5" /></button>
        </div>

        {/* Counters */}
        <div className="grid grid-cols-4 gap-3 px-6 py-3 border-b border-slate-100 flex-shrink-0 bg-slate-50">
          {[
            { label:"Present", count:counts.present, cls:"text-emerald-700 bg-emerald-100" },
            { label:"Absent",  count:counts.absent,  cls:"text-red-700 bg-red-100" },
            { label:"Late",    count:counts.late,    cls:"text-amber-700 bg-amber-100" },
            { label:"Unmarked",count:counts.unmarked,cls:"text-slate-600 bg-slate-200" },
          ].map(s => (
            <div key={s.label} className={`${s.cls} rounded-xl px-3 py-2 text-center`}>
              <div className="text-xl font-black">{s.count}</div>
              <div className="text-xs font-semibold">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search student…"
              className="text-xs bg-transparent outline-none text-slate-700 placeholder:text-slate-400 w-full" />
          </div>
          <span className="text-xs font-bold text-slate-400">Mark all:</span>
          {(["present","absent","late"] as AttendanceStatus[]).map(s => (
            <button key={s as string} onClick={() => markAll(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border
                ${s==="present"?"border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : s==="absent" ?"border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                :"border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"}`}>
              {(s as string)[0].toUpperCase() + (s as string).slice(1)}
            </button>
          ))}
          <button onClick={() => setAttendance({})}
            className="text-xs text-slate-400 hover:text-slate-700 font-semibold flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Student list */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-2">
            {filtered.map((student, i) => {
              const s = attendance[student.id] ?? null;
              return (
                <motion.div key={student.id} initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }}
                  transition={{ delay: i * 0.025 }}
                  className={`flex items-center gap-4 p-3 rounded-xl border-2 transition-all
                    ${s==="present"?"bg-emerald-50 border-emerald-200"
                    : s==="absent" ?"bg-red-50 border-red-200"
                    : s==="late"   ?"bg-amber-50 border-amber-200"
                    :"bg-white border-slate-100 hover:border-slate-200"}`}>
                  <div className={`w-9 h-9 ${student.avatarColor} rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
                    {student.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-sm">{student.name}</p>
                    <p className="text-xs text-slate-400">{student.admNo} · <span className={`font-semibold ${student.attendanceRate >= 75 ? "text-emerald-600" : "text-red-500"}`}>{student.attendanceRate}% rate</span></p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {([["present","P","emerald"],["absent","A","red"],["late","L","amber"]] as [AttendanceStatus,string,string][]).map(([val,lbl,col]) => (
                      <button key={lbl} onClick={() => mark(student.id, val)}
                        className={`w-8 h-8 rounded-lg text-xs font-black transition-all border-2
                          ${s===val
                            ? col==="emerald"?"bg-emerald-500 text-white border-emerald-500"
                            : col==="red"    ?"bg-red-500 text-white border-red-500"
                            :"bg-amber-500 text-white border-amber-500"
                            : col==="emerald"?"border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                            : col==="red"    ?"border-red-200 text-red-600 hover:bg-red-50"
                            :"border-amber-200 text-amber-600 hover:bg-amber-50"}`}>
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
          <p className="text-xs text-slate-400"><span className="font-bold text-slate-700">{counts.unmarked}</span> not yet marked</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-2.5 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl text-sm transition-all">
              Cancel
            </button>
            <motion.button onClick={handleSave} disabled={saving || saved} whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-black rounded-xl text-sm flex items-center gap-2 shadow-md transition-colors">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</>
                : saved ? <><CheckCircle className="w-4 h-4" />Saved!</>
                : <><Save className="w-4 h-4" />Save Attendance</>}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TeacherClassesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [classes, setClasses]   = useState<MyClass[]>(MY_CLASSES);
  const [marking, setMarking]   = useState<MyClass | null>(null);
  const [activeTab, setActiveTab] = useState<"today"|"history">("today");

  const handleSave = (id: string) =>
    setClasses(prev => prev.map(c => c.id === id ? { ...c, marked:true } : c));

  const unmarked = classes.filter(c => !c.marked);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <div className="hidden lg:flex flex-shrink-0"><TeacherSidebar active="/teacher/classes" /></div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-40 lg:hidden" />
            <motion.div initial={{ x:-260 }} animate={{ x:0 }} exit={{ x:-260 }}
              transition={{ type:"spring", damping:28, stiffness:260 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50 lg:hidden">
              <TeacherSidebar active="/teacher/classes" mobile onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 gap-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 rounded-lg hover:bg-slate-100"><Menu className="w-5 h-5" /></button>
            <div>
              <h1 className="text-lg font-black text-slate-900">My Classes &amp; Attendance</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"})} · {classes.filter(c=>c.marked).length}/{classes.length} classes marked
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-5">

          {/* Alert */}
          {unmarked.length > 0 && (
            <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
              className="flex items-center gap-3 px-5 py-4 bg-amber-50 border border-amber-200 rounded-2xl">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <p className="text-sm font-bold text-amber-800 flex-1">
                Pending: <span className="font-black">{unmarked.map(c=>c.name).join(", ")}</span>
              </p>
            </motion.div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label:"Total Students", value:classes.reduce((a,c)=>a+c.students,0), color:"text-indigo-700 bg-indigo-50 border-indigo-200" },
              { label:"Marked Today",   value:`${classes.filter(c=>c.marked).length}/${classes.length}`, color:"text-emerald-700 bg-emerald-50 border-emerald-200" },
              { label:"Best Attendance",value:"SS 3A · 94%", color:"text-blue-700 bg-blue-50 border-blue-200" },
              { label:"Needs Attention",value:"JSS 3B · 83%", color:"text-amber-700 bg-amber-50 border-amber-200" },
            ].map((s,i) => (
              <motion.div key={s.label} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.06 }}
                className={`border rounded-2xl p-4 shadow-sm ${s.color}`}>
                <p className="text-xl font-black">{s.value}</p>
                <p className="text-xs font-bold mt-0.5 opacity-80">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
            {(["today","history"] as const).map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab===t?"bg-white text-slate-900 shadow-sm":"text-slate-500 hover:text-slate-700"}`}>
                {t === "today" ? "Today's Classes" : "Attendance History"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "today" && (
              <motion.div key="today" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                className="grid sm:grid-cols-2 gap-4">
                {classes.map((cls, i) => (
                  <motion.div key={cls.id} initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
                    transition={{ delay: i*0.07 }}
                    className={`bg-white border-2 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all
                      ${cls.marked ? "border-emerald-200" : "border-slate-200 hover:border-indigo-300"}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black
                        ${cls.marked ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"}`}>
                        {cls.name.split(" ").map(w=>w[0]).join("")}
                      </div>
                      {cls.marked
                        ? <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            <CheckCircle className="w-3 h-3" /> Marked
                          </span>
                        : <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                      }
                    </div>
                    <h3 className="font-black text-slate-900 text-lg">{cls.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{cls.subject}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{cls.students} students</span>
                      <span>·</span>
                      <span>{cls.room}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{cls.period}</p>

                    {/* Attendance bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-500 font-medium">Term attendance</span>
                        <span className={`font-black ${cls.attendanceRate >= 90 ? "text-emerald-600" : cls.attendanceRate >= 80 ? "text-amber-600" : "text-red-600"}`}>
                          {cls.attendanceRate}%
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div initial={{ width:0 }} animate={{ width:`${cls.attendanceRate}%` }}
                          transition={{ duration:0.8, ease:"easeOut", delay: i*0.1 }}
                          className={`h-full rounded-full ${cls.attendanceRate>=90?"bg-emerald-500":cls.attendanceRate>=80?"bg-amber-400":"bg-red-400"}`} />
                      </div>
                    </div>

                    <button onClick={() => setMarking(cls)}
                      className={`mt-4 w-full py-2.5 rounded-xl text-sm font-black transition-all
                        ${cls.marked
                          ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100"}`}>
                      {cls.marked ? "Re-mark Attendance" : "Mark Attendance"}
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === "history" && (
              <motion.div key="history" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100">
                    <h3 className="font-black text-slate-900 text-sm">Weekly Attendance History</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Attendance rate per class per day</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="text-left px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wide">Date</th>
                          {MY_CLASSES.map(c => (
                            <th key={c.id} className="px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wide text-center">{c.name}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {HISTORY.map((row, i) => (
                          <motion.tr key={row.date} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.05 }}
                            className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 text-xs font-bold text-slate-700">{row.date}</td>
                            {([row.ss2a, row.ss1b, row.ss3a, row.jss3b] as number[]).map((rate, j) => (
                              <td key={j} className="px-4 py-3 text-center">
                                <span className={`text-xs font-black px-2.5 py-1 rounded-full
                                  ${rate>=90?"bg-emerald-50 text-emerald-700":rate>=80?"bg-amber-50 text-amber-700":"bg-red-50 text-red-700"}`}>
                                  {rate}%
                                </span>
                              </td>
                            ))}
                          </motion.tr>
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

      <AnimatePresence>
        {marking && (
          <MarkModal cls={marking} onClose={() => setMarking(null)} onSave={handleSave} />
        )}
      </AnimatePresence>
    </div>
  );
}