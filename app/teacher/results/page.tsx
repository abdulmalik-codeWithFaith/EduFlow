"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Save, Loader2, CheckCircle, AlertCircle,
  ChevronDown, Search, BookOpen, Award, TrendingUp,
  RefreshCw, Eye, Download, ArrowUpDown,
} from "lucide-react";
import { TeacherSidebar } from "../page";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StudentScore {
  id: string;
  name: string;
  admNo: string;
  avatar: string;
  avatarColor: string;
  ca1: number | null;
  ca2: number | null;
  exam: number | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const gradeInfo = (total: number | null) => {
  if (total === null) return { grade:"—", remark:"—", color:"text-slate-300" };
  if (total >= 70) return { grade:"A", remark:"Excellent",    color:"text-emerald-600" };
  if (total >= 60) return { grade:"B", remark:"Very Good",    color:"text-blue-600" };
  if (total >= 50) return { grade:"C", remark:"Good",         color:"text-amber-600" };
  if (total >= 45) return { grade:"D", remark:"Pass",         color:"text-orange-600" };
  if (total >= 40) return { grade:"E", remark:"Below Avg",    color:"text-red-500" };
  return             { grade:"F", remark:"Fail",          color:"text-red-700" };
};

const calcTotal = (s: StudentScore): number | null => {
  if (s.ca1 === null || s.ca2 === null || s.exam === null) return null;
  return s.ca1 + s.ca2 + s.exam;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CLASSES = ["SS 2A","SS 1B","SS 3A","JSS 3B"];
const TERMS   = ["Second Term 2024/2025","First Term 2024/2025"];

const STUDENT_BASE = [
  ["Amara Okafor","AO","bg-emerald-500"], ["Emmanuel Adeyemi","EA","bg-blue-500"],
  ["Fatima Bello","FB","bg-violet-500"], ["Chidi Nwosu","CN","bg-orange-500"],
  ["Grace Eze","GE","bg-pink-500"], ["Ibrahim Hassan","IH","bg-red-500"],
  ["Blessing Okonkwo","BO","bg-teal-500"], ["Tunde Afolabi","TA","bg-indigo-500"],
  ["Chioma Obi","CO","bg-emerald-600"], ["Yusuf Abubakar","YA","bg-amber-500"],
  ["Adaeze Igwe","AI","bg-purple-500"], ["Solomon Dike","SD","bg-cyan-500"],
  ["Ngozi Williams","NW","bg-rose-500"], ["Emeka Johnson","EJ","bg-lime-600"],
];

const makeScores = (cls: string): StudentScore[] =>
  STUDENT_BASE.slice(0, 12).map(([name, av, col], idx) => {
    const filled = Math.random() > 0.25;
    return {
      id: `${cls}-${idx}`, name, admNo: `GFC/2024/${String(idx+1).padStart(3,"0")}`,
      avatar: av, avatarColor: col,
      ca1:  filled ? Math.floor(Math.random()*11)+5  : null,
      ca2:  filled ? Math.floor(Math.random()*11)+5  : null,
      exam: filled ? Math.floor(Math.random()*41)+20 : null,
    };
  });

const INITIAL_SCORES: Record<string, StudentScore[]> = {
  "SS 2A":  makeScores("SS 2A"),
  "SS 1B":  makeScores("SS 1B"),
  "SS 3A":  makeScores("SS 3A"),
  "JSS 3B": makeScores("JSS 3B"),
};

const STATUS: Record<string, "Submitted"|"Draft"|"Pending"> = {
  "SS 2A":"Submitted", "SS 1B":"Draft", "SS 3A":"Draft", "JSS 3B":"Pending",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TeacherResultsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(CLASSES[1]);
  const [selectedTerm, setSelectedTerm]   = useState(TERMS[0]);
  const [scores, setScores] = useState<Record<string, StudentScore[]>>(INITIAL_SCORES);
  const [status, setStatus] = useState(STATUS);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [classOpen, setClassOpen]   = useState(false);
  const [sortField, setSortField]   = useState<"name"|"total">("name");
  const [sortAsc, setSortAsc]       = useState(true);

  const currentScores = scores[selectedClass] ?? [];

  const filtered = useMemo(() => {
    let list = currentScores.filter(s =>
      !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.admNo.includes(search)
    );
    list = [...list].sort((a, b) => {
      if (sortField === "name") return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      const at = calcTotal(a) ?? -1, bt = calcTotal(b) ?? -1;
      return sortAsc ? at - bt : bt - at;
    });
    return list;
  }, [currentScores, search, sortField, sortAsc]);

  const stats = useMemo(() => {
    const totals = currentScores.map(calcTotal).filter((t): t is number => t !== null);
    const avg = totals.length ? totals.reduce((a,b)=>a+b,0)/totals.length : 0;
    const passed = totals.filter(t => t >= 50).length;
    const filled = totals.length;
    return { avg: parseFloat(avg.toFixed(1)), passed, filled, total: currentScores.length };
  }, [currentScores]);

  const updateScore = (studentId: string, field: "ca1"|"ca2"|"exam", raw: string) => {
    const max = field === "exam" ? 60 : 20;
    const val = raw === "" ? null : Math.min(max, Math.max(0, parseInt(raw)||0));
    setScores(prev => ({
      ...prev,
      [selectedClass]: prev[selectedClass].map(s =>
        s.id === studentId ? { ...s, [field]: val } : s
      ),
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1100));
    setStatus(p => ({ ...p, [selectedClass]: "Draft" }));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1400));
    setStatus(p => ({ ...p, [selectedClass]: "Submitted" }));
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  };

  const statusStyle: Record<string, string> = {
    Submitted: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Draft:     "bg-amber-50 text-amber-700 border-amber-200",
    Pending:   "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <div className="hidden lg:flex flex-shrink-0"><TeacherSidebar active="/teacher/results" /></div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-40 lg:hidden" />
            <motion.div initial={{ x:-260 }} animate={{ x:0 }} exit={{ x:-260 }}
              transition={{ type:"spring", damping:28, stiffness:260 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50 lg:hidden">
              <TeacherSidebar active="/teacher/results" mobile onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 gap-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 rounded-lg hover:bg-slate-100"><Menu className="w-5 h-5" /></button>
            <div>
              <h1 className="text-lg font-black text-slate-900">Results Entry</h1>
              <p className="text-xs text-slate-400 mt-0.5">Mathematics · Enter CA and exam scores</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Term selector */}
            <select value={selectedTerm} onChange={e => setSelectedTerm(e.target.value)}
              className="hidden sm:block px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 outline-none focus:border-indigo-400 font-semibold">
              {TERMS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-5">

          {/* Class selector */}
          <div className="flex flex-wrap gap-3">
            {CLASSES.map(cls => (
              <button key={cls} onClick={() => { setSelectedClass(cls); setSaved(false); setSearch(""); }}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 transition-all font-bold text-sm
                  ${selectedClass === cls
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`}>
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black
                  ${selectedClass === cls ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-600"}`}>
                  {cls.split(" ").map(w=>w[0]).join("")}
                </span>
                {cls}
                <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${statusStyle[status[cls]]}`}>
                  {status[cls]}
                </span>
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label:"Class",        value: selectedClass,         color:"text-indigo-700 bg-indigo-50 border-indigo-100" },
              { label:"Scores Entered",value:`${stats.filled}/${stats.total}`, color: stats.filled === stats.total ? "text-emerald-700 bg-emerald-50 border-emerald-100" : "text-amber-700 bg-amber-50 border-amber-100" },
              { label:"Class Average", value: stats.avg > 0 ? `${stats.avg}%` : "—", color:"text-blue-700 bg-blue-50 border-blue-100" },
              { label:"Passing Rate",  value: stats.filled > 0 ? `${Math.round(stats.passed/stats.filled*100)}%` : "—", color:"text-violet-700 bg-violet-50 border-violet-100" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.06 }}
                className={`border rounded-2xl p-4 shadow-sm ${s.color}`}>
                <p className="text-xl font-black">{s.value}</p>
                <p className="text-xs font-bold mt-0.5 opacity-80">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Score entry note */}
          <div className="flex items-start gap-3 px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-xl">
            <AlertCircle className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-700 font-medium">
              <span className="font-black">Score breakdown:</span> CA1 (20 marks) + CA2 (20 marks) + Exam (60 marks) = 100 total.
              Save draft anytime. Submit when all scores are entered.
            </p>
          </div>

          {/* Score table */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 flex-1 max-w-xs">
                <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student…"
                  className="text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400 w-full" />
              </div>
              <button onClick={() => { setSortField("total"); setSortAsc(!sortAsc); }}
                className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                <ArrowUpDown className="w-3.5 h-3.5" /> Sort by score
              </button>
              <div className="ml-auto flex items-center gap-2">
                <motion.button onClick={handleSave} disabled={saving}
                  whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-slate-200 hover:border-indigo-300 text-slate-700 font-bold rounded-xl text-sm transition-all disabled:opacity-60">
                  {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving…</>
                    : saved ? <><CheckCircle className="w-3.5 h-3.5 text-emerald-500" />Saved</>
                    : <><Save className="w-3.5 h-3.5" />Save Draft</>}
                </motion.button>
                <motion.button onClick={handleSubmit} disabled={submitting || status[selectedClass]==="Submitted"}
                  whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-black rounded-xl text-sm shadow-md transition-colors">
                  {submitting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Submitting…</>
                    : submitted || status[selectedClass]==="Submitted" ? <><CheckCircle className="w-3.5 h-3.5" />Submitted</>
                    : <><BookOpen className="w-3.5 h-3.5" />Submit to Admin</>}
                </motion.button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-4 py-3.5 text-xs font-black text-slate-500 uppercase tracking-wide">Student</th>
                    <th className="px-4 py-3.5 text-xs font-black text-slate-500 uppercase tracking-wide text-center">
                      CA 1<span className="text-slate-300 font-normal">/20</span>
                    </th>
                    <th className="px-4 py-3.5 text-xs font-black text-slate-500 uppercase tracking-wide text-center">
                      CA 2<span className="text-slate-300 font-normal">/20</span>
                    </th>
                    <th className="px-4 py-3.5 text-xs font-black text-slate-500 uppercase tracking-wide text-center">
                      Exam<span className="text-slate-300 font-normal">/60</span>
                    </th>
                    <th className="px-4 py-3.5 text-xs font-black text-slate-500 uppercase tracking-wide text-center">
                      Total<span className="text-slate-300 font-normal">/100</span>
                    </th>
                    <th className="px-4 py-3.5 text-xs font-black text-slate-500 uppercase tracking-wide text-center">Grade</th>
                    <th className="px-4 py-3.5 text-xs font-black text-slate-500 uppercase tracking-wide text-center">Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((student, i) => {
                    const total = calcTotal(student);
                    const { grade, remark, color } = gradeInfo(total);
                    const isSubmitted = status[selectedClass] === "Submitted";
                    return (
                      <motion.tr key={student.id} initial={{ opacity:0 }} animate={{ opacity:1 }}
                        transition={{ delay: i*0.03 }}
                        className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 ${student.avatarColor} rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
                              {student.avatar}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm whitespace-nowrap">{student.name}</p>
                              <p className="text-xs text-slate-400">{student.admNo}</p>
                            </div>
                          </div>
                        </td>
                        {(["ca1","ca2","exam"] as const).map(field => (
                          <td key={field} className="px-3 py-3 text-center">
                            <input
                              type="number"
                              min={0} max={field==="exam"?60:20}
                              value={student[field] ?? ""}
                              onChange={e => updateScore(student.id, field, e.target.value)}
                              disabled={isSubmitted}
                              placeholder="—"
                              className="w-14 text-center px-2 py-1.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed transition-all"
                            />
                          </td>
                        ))}
                        <td className="px-4 py-3 text-center">
                          <span className={`text-sm font-black ${color}`}>{total ?? "—"}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {grade !== "—" ? (
                            <span className={`inline-flex items-center justify-center w-8 h-8 text-sm font-black rounded-lg border
                              ${grade==="A"?"bg-emerald-50 text-emerald-700 border-emerald-200"
                              : grade==="B"?"bg-blue-50 text-blue-700 border-blue-200"
                              : grade==="C"?"bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-red-50 text-red-700 border-red-200"}`}>
                              {grade}
                            </span>
                          ) : <span className="text-slate-300">—</span>}
                        </td>
                        <td className="px-4 py-3 text-center text-xs font-semibold text-slate-500 whitespace-nowrap">{remark}</td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-12 text-center">
                  <BookOpen className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-400">No students found</p>
                </div>
              )}
            </div>
          </div>

          {/* Summary cards per class */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-black text-slate-900 text-sm mb-4">Submission Status — All Classes</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CLASSES.map(cls => (
                <div key={cls}
                  className={`p-4 rounded-xl border-2 text-center transition-all cursor-pointer
                    ${selectedClass === cls ? "border-indigo-400 bg-indigo-50" : "border-slate-100 hover:border-slate-200"}` }
                  onClick={() => setSelectedClass(cls)}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black mx-auto mb-2
                    ${status[cls]==="Submitted"?"bg-emerald-100 text-emerald-700":status[cls]==="Draft"?"bg-amber-100 text-amber-700":"bg-slate-100 text-slate-600"}`}>
                    {cls.split(" ").map(w=>w[0]).join("")}
                  </div>
                  <p className="font-black text-slate-900 text-sm">{cls}</p>
                  <span className={`inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-full border ${statusStyle[status[cls]]}`}>
                    {status[cls]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}