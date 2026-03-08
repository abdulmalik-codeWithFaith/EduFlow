"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, ChevronDown, Download, Printer, Award, TrendingUp, TrendingDown, Star, BookOpen } from "lucide-react";
import { ParentSidebar } from "../page";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line,
} from "recharts";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const TERMS = ["Second Term 2024/2025", "First Term 2024/2025", "Third Term 2023/2024", "Second Term 2023/2024"];

interface SubjectResult {
  subject: string;
  ca1: number;
  ca2: number;
  exam: number;
  total: number;
  grade: string;
  remark: string;
  position: number;
  classAvg: number;
}

const RESULTS: SubjectResult[] = [
  { subject: "Mathematics",        ca1: 18, ca2: 17, exam: 43, total: 78, grade: "A", remark: "Excellent",  position: 2,  classAvg: 61 },
  { subject: "English Language",   ca1: 16, ca2: 18, exam: 40, total: 74, grade: "B", remark: "Very Good",  position: 4,  classAvg: 58 },
  { subject: "Physics",            ca1: 14, ca2: 15, exam: 39, total: 68, grade: "B", remark: "Good",       position: 5,  classAvg: 54 },
  { subject: "Chemistry",          ca1: 15, ca2: 13, exam: 43, total: 71, grade: "B", remark: "Good",       position: 3,  classAvg: 55 },
  { subject: "Biology",            ca1: 17, ca2: 16, exam: 46, total: 79, grade: "A", remark: "Excellent",  position: 2,  classAvg: 60 },
  { subject: "Economics",          ca1: 19, ca2: 18, exam: 51, total: 88, grade: "A", remark: "Excellent",  position: 1,  classAvg: 63 },
  { subject: "Further Maths",      ca1: 13, ca2: 14, exam: 36, total: 63, grade: "B", remark: "Good",       position: 6,  classAvg: 50 },
  { subject: "Geography",          ca1: 15, ca2: 14, exam: 40, total: 69, grade: "B", remark: "Good",       position: 4,  classAvg: 57 },
  { subject: "Literature in Eng.", ca1: 16, ca2: 15, exam: 37, total: 68, grade: "B", remark: "Good",       position: 5,  classAvg: 55 },
  { subject: "Civic Education",    ca1: 17, ca2: 18, exam: 44, total: 79, grade: "A", remark: "Excellent",  position: 3,  classAvg: 62 },
];

const TERM_HISTORY = [
  { term: "2nd 2023",  avg: 68.4, position: 4 },
  { term: "3rd 2023",  avg: 71.2, position: 3 },
  { term: "1st 2024",  avg: 74.5, position: 2 },
  { term: "2nd 2024",  avg: 78.2, position: 1 },
];

const RADAR_DATA = RESULTS.slice(0, 7).map(r => ({
  subject: r.subject.split(" ")[0],
  score: r.total,
  classAvg: r.classAvg,
  fullMark: 100,
}));

const gradeColor = (g: string) => {
  switch(g) {
    case "A": return "bg-teal-50 text-teal-700 border-teal-200";
    case "B": return "bg-blue-50 text-blue-700 border-blue-200";
    case "C": return "bg-amber-50 text-amber-700 border-amber-200";
    default:  return "bg-red-50 text-red-700 border-red-200";
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-stone-400 mb-1.5 font-semibold">{label}</p>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((p: any) => (
        <p key={p.name} className="font-bold" style={{ color: p.stroke || p.fill }}>{p.name}: {p.value}{p.name === "avg" || p.name === "classAvg" || p.name === "score" ? "" : ""}</p>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ParentResultsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState(TERMS[0]);
  const [termOpen, setTermOpen] = useState(false);

  const totalMarks = RESULTS.reduce((a, r) => a + r.total, 0);
  const average = (totalMarks / RESULTS.length).toFixed(1);
  const aCount  = RESULTS.filter(r => r.grade === "A").length;
  const bCount  = RESULTS.filter(r => r.grade === "B").length;

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">
      <div className="hidden lg:flex flex-shrink-0"><ParentSidebar active="/parent/results" /></div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-50 lg:hidden">
              <ParentSidebar active="/parent/results" mobile onClose={() => setSidebarOpen(false)} />
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
              <h1 className="text-lg font-black text-stone-900">Academic Results</h1>
              <p className="text-xs text-stone-400 mt-0.5">Amara Okafor · SS 2A</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setTermOpen(!termOpen)}
                className="flex items-center gap-2 px-4 py-2.5 border border-stone-200 hover:border-teal-400 rounded-xl text-sm font-bold text-stone-700 bg-white transition-all">
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
            <button className="flex items-center gap-2 px-4 py-2.5 border border-stone-200 hover:border-stone-300 rounded-xl text-sm font-bold text-stone-600 bg-white transition-all">
              <Download className="w-4 h-4" /><span className="hidden sm:inline">Download</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-stone-200 hover:border-stone-300 rounded-xl text-sm font-bold text-stone-600 bg-white transition-all">
              <Printer className="w-4 h-4" /><span className="hidden sm:inline">Print</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-5">

          {/* Report card header */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="bg-gradient-to-br from-teal-600 to-emerald-500 rounded-3xl p-6 shadow-xl shadow-teal-200/40 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full pointer-events-none" />
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg flex-shrink-0">AO</div>
                <div>
                  <h2 className="text-white text-xl font-black">Amara Okafor</h2>
                  <p className="text-teal-100 text-sm">SS 2A · {selectedTerm}</p>
                  <p className="text-teal-200 text-xs mt-0.5">GFC/2024/001 · Greenfield College</p>
                </div>
              </div>
              <div className="flex gap-3 flex-wrap">
                {[
                  { label: "Position",   value: "1st / 42" },
                  { label: "Average",    value: `${average}%` },
                  { label: "Total",      value: totalMarks },
                ].map(s => (
                  <div key={s.label} className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3 text-center">
                    <p className="text-white text-xl font-black">{s.value}</p>
                    <p className="text-teal-100 text-xs mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative z-10 flex flex-wrap gap-2 mt-4">
              <span className="flex items-center gap-1.5 text-xs font-bold text-white bg-white/20 px-3 py-1.5 rounded-full">
                <Star className="w-3 h-3 fill-white" /> {aCount} A grades
              </span>
              <span className="text-xs font-bold text-teal-100 bg-white/15 px-3 py-1.5 rounded-full">{bCount} B grades</span>
              <span className="text-xs font-bold text-teal-100 bg-white/15 px-3 py-1.5 rounded-full">
                Teacher&apos;s Remark: Outstanding performance — keep it up!
              </span>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Class Position", value: "1st",     sub: "Out of 42 students",   color: "border-amber-200 bg-amber-50",   text: "text-amber-700" },
              { label: "Average Score",  value: `${average}%`, sub: "Across all subjects", color: "border-teal-200 bg-teal-50",   text: "text-teal-700" },
              { label: "Highest Score",  value: "88%",     sub: "Economics",             color: "border-emerald-200 bg-emerald-50",text: "text-emerald-700" },
              { label: "Grade As",       value: aCount,    sub: `Out of ${RESULTS.length} subjects`, color: "border-violet-200 bg-violet-50", text: "text-violet-700" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`border-2 rounded-2xl p-5 shadow-sm ${s.color}`}>
                <p className={`text-3xl font-black ${s.text}`}>{s.value}</p>
                <p className={`text-sm font-bold mt-1 ${s.text}`}>{s.label}</p>
                <p className="text-xs text-stone-400 mt-0.5">{s.sub}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-5 gap-5">
            {/* Radar chart */}
            <div className="lg:col-span-2 bg-white border border-stone-100 rounded-2xl p-5 shadow-sm">
              <h3 className="font-black text-stone-900 text-sm mb-1">Performance Radar</h3>
              <p className="text-xs text-stone-400 mb-3">Amara vs class average</p>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={RADAR_DATA}>
                  <PolarGrid stroke="#f5f5f4" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#a8a29e" }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: "#a8a29e" }} />
                  <Radar name="Amara" dataKey="score" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.25} strokeWidth={2} />
                  <Radar name="Class Avg" dataKey="classAvg" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="4 3" />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
              <div className="flex gap-4 justify-center mt-2 text-xs">
                <span className="flex items-center gap-1.5 text-stone-500"><span className="w-3 h-1.5 bg-teal-500 rounded inline-block" />Amara</span>
                <span className="flex items-center gap-1.5 text-stone-500"><span className="w-3 h-1.5 bg-slate-300 rounded inline-block" />Class Avg</span>
              </div>
            </div>

            {/* Score vs class avg bar chart */}
            <div className="lg:col-span-3 bg-white border border-stone-100 rounded-2xl p-5 shadow-sm">
              <h3 className="font-black text-stone-900 text-sm mb-1">Subject Scores vs Class Average</h3>
              <p className="text-xs text-stone-400 mb-4">Amara (teal) vs class average (grey)</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={RESULTS.map(r => ({ name: r.subject.split(" ")[0], score: r.total, classAvg: r.classAvg }))} barGap={3}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#a8a29e" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#a8a29e" }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip content={<ChartTip />} />
                  <Bar dataKey="score"    fill="#14b8a6" radius={[4,4,0,0]} maxBarSize={22} name="score" />
                  <Bar dataKey="classAvg" fill="#e7e5e4" radius={[4,4,0,0]} maxBarSize={22} name="classAvg" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance trend */}
          <div className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-black text-stone-900 text-sm">Academic Progress Over Time</h3>
                <p className="text-xs text-stone-400 mt-0.5">Average score and class position per term</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-black text-teal-700 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-200">
                <TrendingUp className="w-3.5 h-3.5" /> Improving
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={TERM_HISTORY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                <XAxis dataKey="term" tick={{ fontSize: 10, fill: "#a8a29e" }} axisLine={false} tickLine={false} />
                <YAxis domain={[60, 85]} tick={{ fontSize: 11, fill: "#a8a29e" }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip content={<ChartTip />} />
                <Line type="monotone" dataKey="avg" stroke="#14b8a6" strokeWidth={2.5} dot={{ fill: "#14b8a6", r: 5, strokeWidth: 2, stroke: "#fff" }} name="avg" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Subject result table */}
          <div className="bg-white border border-stone-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
              <h3 className="font-black text-stone-900 text-sm">Full Subject Breakdown</h3>
              <span className="text-xs text-stone-400 font-medium">{RESULTS.length} subjects</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-100">
                    {["Subject","CA 1","CA 2","Exam","Total","Grade","Remark","Position","vs Class"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-black text-stone-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {RESULTS.map((r, i) => (
                    <motion.tr key={r.subject} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }} className="hover:bg-stone-50/70 transition-colors">
                      <td className="px-4 py-3 font-bold text-stone-900 whitespace-nowrap">{r.subject}</td>
                      <td className="px-4 py-3 text-stone-600 text-xs">{r.ca1}<span className="text-stone-300">/20</span></td>
                      <td className="px-4 py-3 text-stone-600 text-xs">{r.ca2}<span className="text-stone-300">/20</span></td>
                      <td className="px-4 py-3 text-stone-600 text-xs">{r.exam}<span className="text-stone-300">/60</span></td>
                      <td className="px-4 py-3">
                        <span className="text-base font-black text-stone-900">{r.total}</span>
                        <span className="text-stone-300 text-xs">/100</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center justify-center w-8 h-8 text-sm font-black rounded-lg border ${gradeColor(r.grade)}`}>
                          {r.grade}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-stone-500 whitespace-nowrap">{r.remark}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-black text-stone-700 bg-stone-100 px-2 py-1 rounded-md">{r.position}{["st","nd","rd"][r.position-1] || "th"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {r.total > r.classAvg
                            ? <TrendingUp className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                            : <TrendingDown className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />}
                          <span className={`text-xs font-bold ${r.total > r.classAvg ? "text-teal-600" : "text-red-500"}`}>
                            +{r.total - r.classAvg}
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-teal-50 border-t-2 border-teal-200">
                    <td className="px-4 py-3 font-black text-teal-800" colSpan={3}>Total / Average</td>
                    <td colSpan={1} />
                    <td className="px-4 py-3 font-black text-teal-800">{totalMarks}</td>
                    <td className="px-4 py-3 font-black text-teal-700">{average}%</td>
                    <td colSpan={3} />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}