"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  School, LayoutDashboard, Users, UserCheck, CreditCard, BookOpen,
  Megaphone, BarChart3, Settings, Search, Menu, X, Plus, Download,
  Filter, ChevronLeft, ChevronRight, GraduationCap, LogOut,
  ArrowUpDown, Loader2, CheckCircle, AlertTriangle, Eye, Pencil,
  Trash2, Save, TrendingUp, TrendingDown, Award, Star, FileText,
  ClipboardList, RefreshCw, ChevronDown,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubjectScore {
  subject: string;
  ca: number | null;
  exam: number | null;
  total: number | null;
  grade: string;
  remark: string;
}

interface StudentResult {
  id: string;
  name: string;
  admissionNo: string;
  class: string;
  avatar: string;
  avatarColor: string;
  gender: "Male" | "Female";
  scores: SubjectScore[];
  totalScore: number;
  average: number;
  position: number;
  outOf: number;
  grade: string;
  teacherRemark: string;
  status: "Published" | "Draft" | "Pending";
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const SUBJECTS_SS2 = ["Mathematics","English Language","Physics","Chemistry","Biology","Economics","Geography","Government","Civic Education","Computer Science"];
const SUBJECTS_JSS1 = ["Mathematics","English Language","Basic Science","Basic Technology","Social Studies","Civic Education","Computer Studies","Agricultural Science","Home Economics","Business Studies"];

const gradeFromScore = (s: number | null): { grade: string; remark: string } => {
  if (s === null) return { grade: "—", remark: "—" };
  if (s >= 70) return { grade: "A", remark: "Excellent" };
  if (s >= 60) return { grade: "B", remark: "Very Good" };
  if (s >= 50) return { grade: "C", remark: "Good" };
  if (s >= 45) return { grade: "D", remark: "Pass" };
  if (s >= 40) return { grade: "E", remark: "Below Average" };
  return { grade: "F", remark: "Fail" };
};

const makeScores = (subjects: string[], filled = true): SubjectScore[] =>
  subjects.map(subject => {
    if (!filled) return { subject, ca: null, exam: null, total: null, grade: "—", remark: "—" };
    const ca = Math.floor(Math.random() * 21) + 10;
    const exam = Math.floor(Math.random() * 51) + 20;
    const total = ca + exam;
    return { subject, ca, exam, total, ...gradeFromScore(total) };
  });

const MOCK_RESULTS: StudentResult[] = [
  { id:"1", name:"Amara Okafor", admissionNo:"GFC/2024/001", class:"SS 2A", avatar:"AO", avatarColor:"bg-emerald-500", gender:"Female", scores: makeScores(SUBJECTS_SS2), totalScore:782, average:78.2, position:1, outOf:42, grade:"A", teacherRemark:"Outstanding performance. Keep it up!", status:"Published" },
  { id:"2", name:"Fatima Bello", admissionNo:"GFC/2024/003", class:"SS 3A", avatar:"FB", avatarColor:"bg-violet-500", gender:"Female", scores: makeScores(SUBJECTS_SS2), totalScore:801, average:80.1, position:1, outOf:36, grade:"A", teacherRemark:"Exceptional student. First in class!", status:"Published" },
  { id:"3", name:"Grace Eze", admissionNo:"GFC/2024/005", class:"SS 1B", avatar:"GE", avatarColor:"bg-pink-500", gender:"Female", scores: makeScores(SUBJECTS_SS2), totalScore:694, average:69.4, position:4, outOf:40, grade:"B", teacherRemark:"Very good effort. Improve in sciences.", status:"Draft" },
  { id:"4", name:"Blessing Okonkwo", admissionNo:"GFC/2024/007", class:"SS 2B", avatar:"BO", avatarColor:"bg-teal-500", gender:"Female", scores: makeScores(SUBJECTS_SS2), totalScore:724, average:72.4, position:3, outOf:39, grade:"A", teacherRemark:"Consistent and hardworking.", status:"Published" },
  { id:"5", name:"Adaeze Igwe", admissionNo:"GFC/2024/011", class:"SS 3A", avatar:"AI", avatarColor:"bg-purple-500", gender:"Female", scores: makeScores(SUBJECTS_SS2), totalScore:765, average:76.5, position:2, outOf:36, grade:"A", teacherRemark:"Brilliant student, maintain the standard.", status:"Published" },
  { id:"6", name:"Emmanuel Adeyemi", admissionNo:"GFC/2024/002", class:"JSS 1B", avatar:"EA", avatarColor:"bg-blue-500", gender:"Male", scores: makeScores(SUBJECTS_JSS1), totalScore:612, average:61.2, position:8, outOf:40, grade:"B", teacherRemark:"Good student. Put more effort in Maths.", status:"Draft" },
  { id:"7", name:"Chidi Nwosu", admissionNo:"GFC/2024/004", class:"JSS 2C", avatar:"CN", avatarColor:"bg-orange-500", gender:"Male", scores: makeScores(SUBJECTS_JSS1), totalScore:534, average:53.4, position:14, outOf:38, grade:"C", teacherRemark:"Average performance. Must work harder.", status:"Pending" },
  { id:"8", name:"Ibrahim Hassan", admissionNo:"GFC/2024/006", class:"JSS 3A", avatar:"IH", avatarColor:"bg-red-500", gender:"Male", scores: makeScores(SUBJECTS_JSS1), totalScore:478, average:47.8, position:20, outOf:45, grade:"D", teacherRemark:"Needs significant improvement.", status:"Pending" },
  { id:"9", name:"Tunde Afolabi", admissionNo:"GFC/2024/008", class:"JSS 1A", avatar:"TA", avatarColor:"bg-indigo-500", gender:"Male", scores: makeScores(SUBJECTS_JSS1, false), totalScore:0, average:0, position:0, outOf:42, grade:"—", teacherRemark:"", status:"Pending" },
  { id:"10", name:"Solomon Dike", admissionNo:"GFC/2024/012", class:"JSS 3B", avatar:"SD", avatarColor:"bg-cyan-500", gender:"Male", scores: makeScores(SUBJECTS_JSS1), totalScore:558, average:55.8, position:11, outOf:41, grade:"C", teacherRemark:"Fair result. Can do better.", status:"Draft" },
  { id:"11", name:"Chioma Obi", admissionNo:"GFC/2024/009", class:"SS 1A", avatar:"CO", avatarColor:"bg-emerald-600", gender:"Female", scores: makeScores(SUBJECTS_SS2), totalScore:748, average:74.8, position:2, outOf:38, grade:"A", teacherRemark:"Excellent all-round performance.", status:"Published" },
  { id:"12", name:"Yusuf Abubakar", admissionNo:"GFC/2024/010", class:"JSS 2A", avatar:"YA", avatarColor:"bg-amber-500", gender:"Male", scores: makeScores(SUBJECTS_JSS1), totalScore:641, average:64.1, position:5, outOf:44, grade:"B", teacherRemark:"Good work. Improve on English.", status:"Published" },
];

const CLASS_PERF = [
  { class:"JSS 1A", average:58.4, highest:91, lowest:24 },
  { class:"JSS 2A", average:62.1, highest:88, lowest:31 },
  { class:"JSS 3A", average:65.7, highest:94, lowest:38 },
  { class:"SS 1A",  average:67.3, highest:92, lowest:42 },
  { class:"SS 2A",  average:71.8, highest:95, lowest:45 },
  { class:"SS 3A",  average:73.4, highest:98, lowest:48 },
];

const GRADE_DIST = [
  { grade:"A (70–100)", count:38, color:"#10b981" },
  { grade:"B (60–69)",  count:52, color:"#3b82f6" },
  { grade:"C (50–59)",  count:67, color:"#f59e0b" },
  { grade:"D (45–49)",  count:29, color:"#f97316" },
  { grade:"E (40–44)",  count:18, color:"#ef4444" },
  { grade:"F (0–39)",   count:11, color:"#dc2626" },
];

const SUBJECT_PERF = [
  { subject:"Mathematics", average:58 },
  { subject:"English", average:67 },
  { subject:"Physics", average:54 },
  { subject:"Chemistry", average:56 },
  { subject:"Biology", average:63 },
  { subject:"Economics", average:71 },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Students", href: "/dashboard/students" },
  { icon: GraduationCap, label: "Teachers", href: "/dashboard/teachers" },
  { icon: UserCheck, label: "Attendance", href: "/dashboard/attendance" },
  { icon: CreditCard, label: "Fees", href: "/dashboard/fees" },
  { icon: BookOpen, label: "Results", href: "/dashboard/results", active: true },
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

// ─── Grade Badge ──────────────────────────────────────────────────────────────

function GradeBadge({ grade }: { grade: string }) {
  const map: Record<string, string> = {
    A: "bg-emerald-50 text-emerald-700 border-emerald-200",
    B: "bg-blue-50 text-blue-700 border-blue-200",
    C: "bg-amber-50 text-amber-700 border-amber-200",
    D: "bg-orange-50 text-orange-700 border-orange-200",
    E: "bg-red-50 text-red-600 border-red-200",
    F: "bg-red-100 text-red-700 border-red-300",
  };
  return (
    <span className={`inline-flex items-center justify-center w-8 h-8 text-sm font-black rounded-lg border ${map[grade] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}>
      {grade}
    </span>
  );
}

function StatusPill({ status }: { status: StudentResult["status"] }) {
  const map = {
    Published: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Draft: "bg-amber-50 text-amber-700 border-amber-200",
    Pending: "bg-slate-100 text-slate-600 border-slate-200",
  };
  const dots = { Published: "bg-emerald-500", Draft: "bg-amber-500", Pending: "bg-slate-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${map[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status]}`} />
      {status}
    </span>
  );
}

// ─── Enter Scores Modal ───────────────────────────────────────────────────────

function EnterScoresModal({ result, onClose, onSave }: {
  result: StudentResult; onClose: () => void;
  onSave: (id: string, scores: SubjectScore[], remark: string) => void;
}) {
  const [scores, setScores] = useState<SubjectScore[]>(
    result.scores.map(s => ({ ...s, ca: s.ca ?? null, exam: s.exam ?? null }))
  );
  const [remark, setRemark] = useState(result.teacherRemark);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (idx: number, field: "ca" | "exam", raw: string) => {
    const val = raw === "" ? null : Math.min(field === "ca" ? 30 : 70, Math.max(0, parseInt(raw) || 0));
    setScores(prev => prev.map((s, i) => {
      if (i !== idx) return s;
      const ca = field === "ca" ? val : s.ca;
      const exam = field === "exam" ? val : s.exam;
      const total = ca !== null && exam !== null ? ca + exam : null;
      return { ...s, ca, exam, total, ...gradeFromScore(total) };
    }));
  };

  const totals = useMemo(() => {
    const filled = scores.filter(s => s.total !== null);
    const sum = filled.reduce((a, s) => a + (s.total ?? 0), 0);
    const avg = filled.length > 0 ? sum / filled.length : 0;
    return { sum, avg: parseFloat(avg.toFixed(1)), filled: filled.length };
  }, [scores]);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    onSave(result.id, scores, remark);
    setSaved(true);
    setTimeout(onClose, 800);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 20 }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${result.avatarColor} rounded-xl flex items-center justify-center text-white text-sm font-black`}>
              {result.avatar}
            </div>
            <div>
              <h2 className="font-black text-slate-900">{result.name}</h2>
              <p className="text-xs text-slate-400">{result.class} · {result.admissionNo} · Second Term 2024/2025</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"><X className="w-5 h-5" /></button>
        </div>

        {/* Live summary */}
        <div className="grid grid-cols-3 gap-3 px-6 py-3 border-b border-slate-100 flex-shrink-0 bg-slate-50">
          <div className="text-center">
            <p className="text-xl font-black text-slate-900">{totals.sum}</p>
            <p className="text-xs text-slate-500">Total Score</p>
          </div>
          <div className="text-center">
            <p className={`text-xl font-black ${totals.avg >= 70 ? "text-emerald-600" : totals.avg >= 50 ? "text-amber-600" : "text-red-600"}`}>{totals.avg}%</p>
            <p className="text-xs text-slate-500">Average</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-black text-slate-900">{totals.filled}/{scores.length}</p>
            <p className="text-xs text-slate-500">Subjects Entered</p>
          </div>
        </div>

        {/* Score table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-black text-slate-500 uppercase tracking-wide">Subject</th>
                <th className="px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wide text-center">CA<span className="text-slate-300 font-normal">/30</span></th>
                <th className="px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wide text-center">Exam<span className="text-slate-300 font-normal">/70</span></th>
                <th className="px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wide text-center">Total<span className="text-slate-300 font-normal">/100</span></th>
                <th className="px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wide text-center">Grade</th>
                <th className="px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wide text-center">Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {scores.map((s, i) => (
                <tr key={s.subject} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-2.5 font-semibold text-slate-800 text-sm">{s.subject}</td>
                  <td className="px-4 py-2.5">
                    <input type="number" min={0} max={30} value={s.ca ?? ""}
                      onChange={e => update(i, "ca", e.target.value)}
                      placeholder="—"
                      className="w-16 text-center px-2 py-1.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all" />
                  </td>
                  <td className="px-4 py-2.5">
                    <input type="number" min={0} max={70} value={s.exam ?? ""}
                      onChange={e => update(i, "exam", e.target.value)}
                      placeholder="—"
                      className="w-16 text-center px-2 py-1.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all" />
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={`font-black text-sm ${s.total === null ? "text-slate-300" : s.total >= 50 ? "text-emerald-700" : "text-red-600"}`}>
                      {s.total ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {s.grade !== "—" ? <GradeBadge grade={s.grade} /> : <span className="text-slate-300 text-sm">—</span>}
                  </td>
                  <td className="px-4 py-2.5 text-center text-xs font-semibold text-slate-500">{s.remark !== "—" ? s.remark : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Remark + actions */}
        <div className="px-6 py-4 border-t border-slate-100 flex-shrink-0 space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Class Teacher&apos;s Remark</label>
            <textarea value={remark} onChange={e => setRemark(e.target.value)} rows={2}
              placeholder="Write a remark for this student…"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all resize-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl text-sm transition-all">
              Cancel
            </button>
            <motion.button onClick={handleSave} disabled={saving || saved} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-colors">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                : saved ? <><CheckCircle className="w-4 h-4" /> Saved!</>
                : <><Save className="w-4 h-4" /> Save Scores</>}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Result Viewer Drawer ─────────────────────────────────────────────────────

function ResultDrawer({ result, onClose, onPublish }: {
  result: StudentResult; onClose: () => void; onPublish: (id: string) => void;
}) {
  const radarData = result.scores.slice(0, 6).map(s => ({
    subject: s.subject.split(" ")[0],
    score: s.total ?? 0,
    fullMark: 100,
  }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex justify-end" onClick={onClose}>
      <motion.div initial={{ x: 500 }} animate={{ x: 0 }} exit={{ x: 500 }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}>

        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-black text-slate-900">Result Sheet</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"><X className="w-5 h-5" /></button>
        </div>

        {/* Student header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-14 h-14 ${result.avatarColor} rounded-2xl flex items-center justify-center text-white text-xl font-black`}>
              {result.avatar}
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-lg">{result.name}</h3>
              <p className="text-sm text-slate-500">{result.class} · {result.admissionNo}</p>
              <div className="mt-1"><StatusPill status={result.status} /></div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label:"Total", value: result.totalScore > 0 ? result.totalScore : "—" },
              { label:"Average", value: result.average > 0 ? `${result.average}%` : "—" },
              { label:"Position", value: result.position > 0 ? `${result.position}/${result.outOf}` : "—" },
              { label:"Grade", value: result.grade },
            ].map(s => (
              <div key={s.label} className="bg-white border border-slate-100 rounded-xl p-3 text-center shadow-sm">
                <p className="font-black text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Radar chart */}
        {result.scores.some(s => s.total !== null) && (
          <div className="px-6 py-4 border-b border-slate-100">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Performance Radar</p>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: "#94a3b8" }} />
                <Radar name="Score" dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Score breakdown */}
        <div className="px-6 py-4 border-b border-slate-100">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Subject Breakdown</p>
          <div className="space-y-2">
            {result.scores.map(s => (
              <div key={s.subject} className="flex items-center gap-3">
                <div className="w-28 text-xs font-semibold text-slate-600 flex-shrink-0 truncate">{s.subject}</div>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${s.total ?? 0}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className={`h-full rounded-full ${(s.total ?? 0) >= 70 ? "bg-emerald-500" : (s.total ?? 0) >= 50 ? "bg-amber-400" : "bg-red-400"}`} />
                </div>
                <div className="w-10 text-right">
                  <span className={`text-xs font-black ${(s.total ?? 0) >= 70 ? "text-emerald-600" : (s.total ?? 0) >= 50 ? "text-amber-600" : s.total === null ? "text-slate-300" : "text-red-600"}`}>
                    {s.total ?? "—"}
                  </span>
                </div>
                <div className="w-6 flex-shrink-0">
                  {s.grade !== "—" && <GradeBadge grade={s.grade} />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Teacher remark */}
        {result.teacherRemark && (
          <div className="px-6 py-4 border-b border-slate-100">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Teacher&apos;s Remark</p>
            <p className="text-sm text-slate-700 italic bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
              &ldquo;{result.teacherRemark}&rdquo;
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="px-6 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-2.5 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl text-sm transition-all">
              <Download className="w-4 h-4" /> Download PDF
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-sm transition-all">
              <FileText className="w-4 h-4" /> Print Result
            </button>
          </div>
          {result.status !== "Published" && (
            <button onClick={() => { onPublish(result.id); onClose(); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-sm shadow-md transition-colors">
              <CheckCircle className="w-4 h-4" /> Publish Result
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs shadow-xl">
      <p className="text-slate-400 font-semibold mb-1">{label}</p>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((p: any) => <p key={p.name} style={{ color: p.color }} className="font-bold">{p.name}: {p.value}{typeof p.value === "number" ? "%" : ""}</p>)}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 8;

export default function ResultsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "records" | "analysis">("overview");
  const [results, setResults] = useState<StudentResult[]>(MOCK_RESULTS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterClass, setFilterClass] = useState("All");
  const [sortField, setSortField] = useState<keyof StudentResult>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [enteringFor, setEnteringFor] = useState<StudentResult | null>(null);
  const [viewingResult, setViewingResult] = useState<StudentResult | null>(null);

  const stats = useMemo(() => {
    const published = results.filter(r => r.status === "Published").length;
    const draft = results.filter(r => r.status === "Draft").length;
    const pending = results.filter(r => r.status === "Pending").length;
    const avg = results.filter(r => r.average > 0).reduce((a, r) => a + r.average, 0) / (results.filter(r => r.average > 0).length || 1);
    return { published, draft, pending, avg: parseFloat(avg.toFixed(1)) };
  }, [results]);

  const filtered = useMemo(() => {
    let list = results.filter(r => {
      const q = search.toLowerCase();
      if (q && !r.name.toLowerCase().includes(q) && !r.admissionNo.toLowerCase().includes(q) && !r.class.toLowerCase().includes(q)) return false;
      if (filterStatus !== "All" && r.status !== filterStatus) return false;
      if (filterClass !== "All" && r.class !== filterClass) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      const av = String(a[sortField] ?? "").toLowerCase();
      const bv = String(b[sortField] ?? "").toLowerCase();
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return list;
  }, [results, search, filterStatus, filterClass, sortField, sortAsc]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const toggleSort = (f: keyof StudentResult) => { if (sortField === f) setSortAsc(!sortAsc); else { setSortField(f); setSortAsc(true); } };
  const classes = [...new Set(results.map(r => r.class))].sort();

  const handleScoreSave = (id: string, scores: SubjectScore[], remark: string) => {
    setResults(prev => prev.map(r => {
      if (r.id !== id) return r;
      const filled = scores.filter(s => s.total !== null);
      const totalScore = filled.reduce((a, s) => a + (s.total ?? 0), 0);
      const average = filled.length > 0 ? parseFloat((totalScore / filled.length).toFixed(1)) : 0;
      const { grade } = gradeFromScore(average);
      return { ...r, scores, teacherRemark: remark, totalScore, average, grade, status: "Draft" as const };
    }));
  };

  const handlePublish = (id: string) => setResults(prev => prev.map(r => r.id === id ? { ...r, status: "Published" as const } : r));

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
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 gap-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 rounded-lg hover:bg-slate-100"><Menu className="w-5 h-5" /></button>
            <div>
              <h1 className="text-lg font-black text-slate-900">Results Management</h1>
              <p className="text-xs text-slate-400 mt-0.5">Second Term 2024/2025 · {stats.published} results published</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl text-sm transition-all">
              <Download className="w-4 h-4" /> Export All
            </button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setResults(prev => prev.map(r => r.status === "Draft" ? { ...r, status: "Published" as const } : r))}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition-colors">
              <CheckCircle className="w-4 h-4" /> Publish All Drafts
            </motion.button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label:"Published", value:stats.published, sub:"Visible to parents", icon:CheckCircle, cls:"bg-emerald-100 text-emerald-600", val:"text-emerald-700" },
              { label:"Drafts", value:stats.draft, sub:"Ready to publish", icon:ClipboardList, cls:"bg-amber-100 text-amber-600", val:"text-amber-700" },
              { label:"Pending Entry", value:stats.pending, sub:"Scores not entered", icon:AlertTriangle, cls:"bg-red-100 text-red-600", val:"text-red-700" },
              { label:"Class Average", value:`${stats.avg}%`, sub:"All classes combined", icon:TrendingUp, cls:"bg-blue-100 text-blue-600", val:"text-blue-700" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                <div className={`w-12 h-12 ${s.cls} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className={`text-2xl font-black ${s.val}`}>{s.value}</div>
                  <div className="text-sm font-bold text-slate-700">{s.label}</div>
                  <div className="text-xs text-slate-400">{s.sub}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
            {(["overview","records","analysis"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                {tab === "records" ? "Student Results" : tab === "analysis" ? "Analysis" : "Overview"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* ── OVERVIEW ── */}
            {activeTab === "overview" && (
              <motion.div key="ov" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="space-y-5">
                <div className="grid lg:grid-cols-2 gap-5">
                  {/* Class performance */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                    <h3 className="font-black text-slate-900 text-sm mb-1">Average Score by Class</h3>
                    <p className="text-xs text-slate-400 mb-4">Second term class averages</p>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={CLASS_PERF} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} unit="%" />
                        <YAxis dataKey="class" type="category" tick={{ fontSize: 11, fill: "#64748b", fontWeight: 700 }} axisLine={false} tickLine={false} width={48} />
                        <Tooltip content={<ChartTooltip />} />
                        <Bar dataKey="average" fill="#10b981" radius={[0, 6, 6, 0]} name="average" maxBarSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Grade distribution */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                    <h3 className="font-black text-slate-900 text-sm mb-1">Grade Distribution</h3>
                    <p className="text-xs text-slate-400 mb-4">All students across all classes</p>
                    <div className="space-y-2.5">
                      {GRADE_DIST.map(g => {
                        const pct = Math.round(g.count / GRADE_DIST.reduce((a, x) => a + x.count, 0) * 100);
                        return (
                          <div key={g.grade}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-bold text-slate-700">{g.grade}</span>
                              <span className="text-slate-500">{g.count} students ({pct}%)</span>
                            </div>
                            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.7, ease: "easeOut" }}
                                className="h-full rounded-full" style={{ backgroundColor: g.color }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Top performers */}
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
                    <Award className="w-5 h-5 text-amber-500" />
                    <h3 className="font-black text-slate-900 text-sm">Top Performers This Term</h3>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {results.filter(r => r.average > 0).sort((a, b) => b.average - a.average).slice(0, 5).map((r, i) => (
                      <div key={r.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${i === 0 ? "bg-amber-400 text-white" : i === 1 ? "bg-slate-300 text-slate-700" : i === 2 ? "bg-orange-400 text-white" : "bg-slate-100 text-slate-600"}`}>
                          {i + 1}
                        </div>
                        <div className={`w-9 h-9 ${r.avatarColor} rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>{r.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 text-sm">{r.name}</p>
                          <p className="text-xs text-slate-400">{r.class}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-emerald-600">{r.average}%</p>
                          <GradeBadge grade={r.grade} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── STUDENT RESULTS ── */}
            {activeTab === "records" && (
              <motion.div key="rec" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="space-y-4">
                {/* Search/filter */}
                <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
                      <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Search student, admission no or class…"
                        className="text-sm text-slate-700 placeholder:text-slate-400 bg-transparent outline-none w-full" />
                      {search && <button onClick={() => setSearch("")}><X className="w-4 h-4 text-slate-400" /></button>}
                    </div>
                    <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
                      className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 outline-none focus:border-emerald-400 font-semibold">
                      {["All","Published","Draft","Pending"].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <select value={filterClass} onChange={e => { setFilterClass(e.target.value); setPage(1); }}
                      className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 outline-none focus:border-emerald-400 font-semibold">
                      <option value="All">All Classes</option>
                      {classes.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <p className="text-xs text-slate-400">Showing <span className="font-bold text-slate-700">{filtered.length}</span> of <span className="font-bold text-slate-700">{results.length}</span> students</p>
                </div>

                {/* Table */}
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50">
                          {[
                            { label:"Student", field:"name" as keyof StudentResult },
                            { label:"Class", field:"class" as keyof StudentResult },
                            { label:"Total", field:"totalScore" as keyof StudentResult },
                            { label:"Average", field:"average" as keyof StudentResult },
                            { label:"Position", field:"position" as keyof StudentResult },
                            { label:"Grade", field:"grade" as keyof StudentResult },
                            { label:"Status", field:"status" as keyof StudentResult },
                          ].map(col => (
                            <th key={col.label} onClick={() => toggleSort(col.field)}
                              className="text-left px-4 py-3.5 text-xs font-black text-slate-500 uppercase tracking-wide cursor-pointer hover:text-slate-800 select-none whitespace-nowrap">
                              <div className="flex items-center gap-1.5">{col.label}
                                <ArrowUpDown className={`w-3 h-3 ${sortField === col.field ? "text-emerald-500" : "text-slate-300"}`} />
                              </div>
                            </th>
                          ))}
                          <th className="px-4 py-3.5 text-right text-xs font-black text-slate-500 uppercase tracking-wide">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {paginated.map((r, i) => (
                          <motion.tr key={r.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 ${r.avatarColor} rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>{r.avatar}</div>
                                <div>
                                  <p className="font-bold text-slate-900 whitespace-nowrap">{r.name}</p>
                                  <p className="text-xs text-slate-400">{r.admissionNo}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3.5"><span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">{r.class}</span></td>
                            <td className="px-4 py-3.5 font-black text-slate-900">{r.totalScore > 0 ? r.totalScore : "—"}</td>
                            <td className="px-4 py-3.5">
                              <span className={`font-black text-sm ${r.average >= 70 ? "text-emerald-600" : r.average >= 50 ? "text-amber-600" : r.average === 0 ? "text-slate-300" : "text-red-600"}`}>
                                {r.average > 0 ? `${r.average}%` : "—"}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 font-semibold text-slate-700">{r.position > 0 ? `${r.position}/${r.outOf}` : "—"}</td>
                            <td className="px-4 py-3.5">{r.grade !== "—" ? <GradeBadge grade={r.grade} /> : <span className="text-slate-300 text-sm">—</span>}</td>
                            <td className="px-4 py-3.5"><StatusPill status={r.status} /></td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center justify-end gap-1">
                                <button onClick={() => setViewingResult(r)} className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors" title="View">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button onClick={() => setEnteringFor(r)} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors" title="Enter scores">
                                  <Pencil className="w-4 h-4" />
                                </button>
                                {r.status !== "Published" && (
                                  <button onClick={() => handlePublish(r.id)} className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors" title="Publish">
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                    {filtered.length === 0 && (
                      <div className="py-16 text-center">
                        <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                        <p className="font-bold text-slate-500">No results found</p>
                      </div>
                    )}
                  </div>
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3.5 border-t border-slate-100">
                      <p className="text-xs text-slate-500">Page <span className="font-bold">{page}</span> of <span className="font-bold">{totalPages}</span></p>
                      <div className="flex items-center gap-1.5">
                        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 text-slate-600"><ChevronLeft className="w-4 h-4" /></button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                          <button key={p} onClick={() => setPage(p)}
                            className={`w-8 h-8 rounded-lg text-xs font-bold ${page === p ? "bg-emerald-600 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{p}</button>
                        ))}
                        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 text-slate-600"><ChevronRight className="w-4 h-4" /></button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── ANALYSIS ── */}
            {activeTab === "analysis" && (
              <motion.div key="an" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="space-y-5">
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                  <h3 className="font-black text-slate-900 text-sm mb-1">Subject Performance Analysis</h3>
                  <p className="text-xs text-slate-400 mb-5">Average score per subject — SS classes</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={SUBJECT_PERF}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="subject" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} unit="%" />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="average" radius={[6,6,0,0]} name="average" maxBarSize={40}
                        fill="#6366f1" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { label:"Highest Scoring Subject", value:"Economics", sub:"71% class average", color:"text-emerald-600 bg-emerald-50", icon:TrendingUp },
                    { label:"Needs Attention", value:"Physics", sub:"54% class average", color:"text-red-600 bg-red-50", icon:TrendingDown },
                    { label:"Students at Risk", value:"11", sub:"Below 40% overall", color:"text-amber-600 bg-amber-50", icon:AlertTriangle },
                  ].map(s => (
                    <div key={s.label} className={`${s.color} rounded-2xl p-5 flex items-center gap-4`}>
                      <div className="w-12 h-12 bg-white/60 rounded-xl flex items-center justify-center flex-shrink-0">
                        <s.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold opacity-70">{s.label}</p>
                        <p className="text-xl font-black">{s.value}</p>
                        <p className="text-xs opacity-70">{s.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {enteringFor && <EnterScoresModal result={enteringFor} onClose={() => setEnteringFor(null)} onSave={handleScoreSave} />}
      </AnimatePresence>
      <AnimatePresence>
        {viewingResult && <ResultDrawer result={viewingResult} onClose={() => setViewingResult(null)} onPublish={handlePublish} />}
      </AnimatePresence>
    </div>
  );
}