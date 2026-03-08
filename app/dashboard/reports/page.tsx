"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  School, LayoutDashboard, Users, UserCheck, CreditCard, BookOpen,
  Megaphone, BarChart3, Settings, Menu, X, Download, GraduationCap,
  LogOut, TrendingUp, TrendingDown, FileText, Calendar, Filter,
  ChevronDown, Printer, Share2, RefreshCw, Clock, CheckCircle,
  AlertTriangle, ArrowUpRight, ArrowDownRight, Loader2, Eye,
  BookMarked, Wallet, Award, Activity,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ATTENDANCE_TREND = [
  { month: "Sep", rate: 91, present: 1168, absent: 116 },
  { month: "Oct", rate: 88, present: 1130, absent: 154 },
  { month: "Nov", rate: 93, present: 1195, absent: 89 },
  { month: "Dec", rate: 86, present: 1104, absent: 180 },
  { month: "Jan", rate: 90, present: 1156, absent: 128 },
  { month: "Feb", rate: 94, present: 1207, absent: 77 },
];

const FEE_TREND = [
  { month: "Sep", collected: 3200000, outstanding: 2600000 },
  { month: "Oct", collected: 4100000, outstanding: 1700000 },
  { month: "Nov", collected: 3800000, outstanding: 2000000 },
  { month: "Dec", collected: 4500000, outstanding: 1300000 },
  { month: "Jan", collected: 5200000, outstanding: 600000 },
  { month: "Feb", collected: 2400000, outstanding: 3400000 },
];

const RESULT_TREND = [
  { term: "1st 2023", avg: 62.4 },
  { term: "2nd 2023", avg: 65.1 },
  { term: "3rd 2023", avg: 60.8 },
  { term: "1st 2024", avg: 67.3 },
  { term: "2nd 2024", avg: 70.2 },
  { term: "3rd 2024", avg: 68.9 },
  { term: "1st 2025", avg: 71.5 },
  { term: "2nd 2025", avg: 73.4 },
];

const CLASS_PERFORMANCE = [
  { class: "JSS 1A", attendance: 88, feeRate: 82, avgScore: 58 },
  { class: "JSS 2A", attendance: 91, feeRate: 88, avgScore: 62 },
  { class: "JSS 3A", attendance: 94, feeRate: 91, avgScore: 66 },
  { class: "SS 1A",  attendance: 87, feeRate: 85, avgScore: 67 },
  { class: "SS 2A",  attendance: 93, feeRate: 94, avgScore: 72 },
  { class: "SS 3A",  attendance: 96, feeRate: 97, avgScore: 73 },
];

const GENDER_DIST = [
  { name: "Male", value: 638, color: "#3b82f6" },
  { name: "Female", value: 646, color: "#ec4899" },
];

const SUBJECT_RADAR = [
  { subject: "Maths", score: 58, fullMark: 100 },
  { subject: "English", score: 67, fullMark: 100 },
  { subject: "Physics", score: 54, fullMark: 100 },
  { subject: "Chemistry", score: 56, fullMark: 100 },
  { subject: "Biology", score: 63, fullMark: 100 },
  { subject: "Economics", score: 71, fullMark: 100 },
];

const TOP_STUDENTS = [
  { name: "Fatima Bello",    class: "SS 3A", avg: 80.1, avatar: "FB", color: "bg-violet-500" },
  { name: "Amara Okafor",   class: "SS 2A", avg: 78.2, avatar: "AO", color: "bg-emerald-500" },
  { name: "Adaeze Igwe",    class: "SS 3A", avg: 76.5, avatar: "AI", color: "bg-purple-500" },
  { name: "Chioma Obi",     class: "SS 1A", avg: 74.8, avatar: "CO", color: "bg-emerald-600" },
  { name: "Blessing Okonkwo",class:"SS 2B", avg: 72.4, avatar: "BO", color: "bg-teal-500" },
];

const REPORT_EXPORTS = [
  { label: "Full Academic Report",    desc: "Results, attendance, fees for all students",   icon: FileText, color: "bg-blue-50 text-blue-700 border-blue-200" },
  { label: "Attendance Summary",      desc: "Daily & monthly attendance breakdown",         icon: UserCheck, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { label: "Fee Collection Report",   desc: "Payment history, balances, defaulters list",   icon: Wallet, color: "bg-amber-50 text-amber-700 border-amber-200" },
  { label: "Results Transcript",      desc: "Compiled result sheets for all classes",       icon: Award, color: "bg-violet-50 text-violet-700 border-violet-200" },
  { label: "Class Performance Report",desc: "Per-class comparison across all metrics",      icon: BarChart3, color: "bg-teal-50 text-teal-700 border-teal-200" },
  { label: "Student Progress Report", desc: "Individual student report cards",              icon: Activity, color: "bg-rose-50 text-rose-700 border-rose-200" },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard",     href: "/dashboard" },
  { icon: Users,           label: "Students",      href: "/dashboard/students" },
  { icon: GraduationCap,   label: "Teachers",      href: "/dashboard/teachers" },
  { icon: UserCheck,       label: "Attendance",    href: "/dashboard/attendance" },
  { icon: CreditCard,      label: "Fees",          href: "/dashboard/fees" },
  { icon: BookOpen,        label: "Results",       href: "/dashboard/results" },
  { icon: Megaphone,       label: "Announcements", href: "/dashboard/announcements" },
  { icon: BarChart3,       label: "Reports",       href: "/dashboard/reports", active: true },
  { icon: Settings,        label: "Settings",      href: "/dashboard/settings" },
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

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs shadow-xl">
      <p className="text-slate-400 font-semibold mb-1.5">{label}</p>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color ?? p.stroke }} className="font-bold capitalize">
          {p.name}: {typeof p.value === "number" && p.value > 1000
            ? `₦${(p.value / 1_000_000).toFixed(1)}M`
            : `${p.value}${p.name?.includes("rate") || p.name?.includes("avg") || p.name?.includes("Rate") || p.name?.includes("attendance") || p.name?.includes("feeRate") || p.name?.includes("avgScore") ? "%" : ""}`}
        </p>
      ))}
    </div>
  );
}

// ─── Export Report Button ─────────────────────────────────────────────────────

function ExportCard({ label, desc, icon: Icon, color, delay }: {
  label: string; desc: string; icon: React.ElementType; color: string; delay: number;
}) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setDone(true);
    setTimeout(() => setDone(false), 2500);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`bg-white border-2 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group flex flex-col gap-4 ${color.includes("border") ? "" : "border-slate-100"}`}>
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <motion.button onClick={handleExport} disabled={loading}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all
            ${done ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}>
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : done ? <><CheckCircle className="w-3.5 h-3.5" />Done</> : <><Download className="w-3.5 h-3.5" />Export</>}
        </motion.button>
      </div>
      <div>
        <p className="font-black text-slate-900 text-sm">{label}</p>
        <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
      </div>
    </motion.div>
  );
}

// ─── Metric Card ──────────────────────────────────────────────────────────────

function MetricCard({ label, value, sub, trend, trendUp, icon: Icon, color, delay }: {
  label: string; value: string; sub: string; trend: string; trendUp: boolean;
  icon: React.ElementType; color: string; delay: number;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full
          ${trendUp ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
          {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trend}
        </span>
      </div>
      <p className="text-2xl font-black text-slate-900 mb-0.5">{value}</p>
      <p className="text-sm font-semibold text-slate-700 mb-0.5">{label}</p>
      <p className="text-xs text-slate-400">{sub}</p>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TERMS = ["Second Term 2024/2025", "First Term 2024/2025", "Third Term 2023/2024", "Second Term 2023/2024"];

export default function ReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "attendance" | "fees" | "results" | "export">("overview");
  const [selectedTerm, setSelectedTerm] = useState(TERMS[0]);
  const [termOpen, setTermOpen] = useState(false);

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
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 rounded-lg hover:bg-slate-100">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-black text-slate-900">Reports & Analytics</h1>
              <p className="text-xs text-slate-400 mt-0.5">Greenfield College — data insights & exports</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Term selector */}
            <div className="relative">
              <button onClick={() => setTermOpen(!termOpen)}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl text-sm transition-all bg-white">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline">{selectedTerm}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${termOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {termOpen && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                    className="absolute right-0 top-12 bg-white border border-slate-200 rounded-xl shadow-xl z-20 min-w-56 overflow-hidden">
                    {TERMS.map(t => (
                      <button key={t} onClick={() => { setSelectedTerm(t); setTermOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedTerm === t ? "bg-emerald-50 text-emerald-700 font-bold" : "text-slate-700 hover:bg-slate-50 font-medium"}`}>
                        {t}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl text-sm transition-all">
              <Printer className="w-4 h-4" /> Print
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6">

          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard label="Total Students" value="1,284" sub="Enrolled this session" trend="+12 this term" trendUp icon={Users} color="bg-blue-100 text-blue-600" delay={0} />
            <MetricCard label="Avg Attendance" value="90.3%" sub="This term average" trend="+2.1% vs last term" trendUp icon={UserCheck} color="bg-emerald-100 text-emerald-600" delay={0.06} />
            <MetricCard label="Fee Collection" value="₦24.2M" sub="86% of total expected" trend="+₦3.4M vs last term" trendUp icon={Wallet} color="bg-amber-100 text-amber-600" delay={0.12} />
            <MetricCard label="Academic Average" value="73.4%" sub="All classes combined" trend="+3.2% vs last term" trendUp icon={Award} color="bg-violet-100 text-violet-600" delay={0.18} />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit flex-wrap">
            {(["overview","attendance","fees","results","export"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all
                  ${activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                {tab === "export" ? "Export Reports" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* ── OVERVIEW ── */}
            {activeTab === "overview" && (
              <motion.div key="ov" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="space-y-5">

                <div className="grid lg:grid-cols-3 gap-5">
                  {/* Attendance line */}
                  <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h3 className="font-black text-slate-900 text-sm">Attendance vs Fee Collection</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Monthly trend — {selectedTerm}</p>
                      </div>
                      <div className="flex gap-4 text-xs">
                        <span className="flex items-center gap-1.5 text-slate-500 font-medium"><span className="w-3 h-1 bg-emerald-500 rounded inline-block" />Attendance</span>
                        <span className="flex items-center gap-1.5 text-slate-500 font-medium"><span className="w-3 h-1 bg-amber-500 rounded inline-block" />Fee Rate</span>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={210}>
                      <LineChart data={ATTENDANCE_TREND.map((a, i) => ({ ...a, feeRate: [55, 70, 65, 77, 89, 41][i] }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                        <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} unit="%" />
                        <Tooltip content={<ChartTip />} />
                        <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2.5} dot={{ fill: "#10b981", r: 4 }} name="attendance" />
                        <Line type="monotone" dataKey="feeRate" stroke="#f59e0b" strokeWidth={2.5} dot={{ fill: "#f59e0b", r: 4 }} name="feeRate" strokeDasharray="6 3" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Gender distribution */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                    <h3 className="font-black text-slate-900 text-sm mb-1">Student Demographics</h3>
                    <p className="text-xs text-slate-400 mb-4">Gender breakdown</p>
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie data={GENDER_DIST} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={4} dataKey="value">
                          {GENDER_DIST.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v) => [`${v} students`]} contentStyle={{ borderRadius: 10, fontSize: 11 }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-2">
                      {GENDER_DIST.map(g => (
                        <div key={g.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.color }} />
                            <span className="text-xs font-semibold text-slate-600">{g.name}</span>
                          </div>
                          <span className="text-xs font-black text-slate-800">{g.value} <span className="text-slate-400 font-normal">({Math.round(g.value / 1284 * 100)}%)</span></span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Class performance comparison */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="font-black text-slate-900 text-sm">Class Performance Comparison</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Attendance rate, fee collection rate & academic average per class</p>
                    </div>
                    <div className="flex gap-3 text-xs">
                      {[["#10b981","Attendance"],["#f59e0b","Fee Rate"],["#6366f1","Avg Score"]].map(([c,l]) => (
                        <span key={l} className="flex items-center gap-1.5 text-slate-500 font-medium">
                          <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: c }} />{l}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={CLASS_PERFORMANCE} barGap={3}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="class" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} unit="%" />
                      <Tooltip content={<ChartTip />} />
                      <Bar dataKey="attendance" fill="#10b981" radius={[4,4,0,0]} name="attendance" maxBarSize={22} />
                      <Bar dataKey="feeRate"    fill="#f59e0b" radius={[4,4,0,0]} name="feeRate"    maxBarSize={22} />
                      <Bar dataKey="avgScore"   fill="#6366f1" radius={[4,4,0,0]} name="avgScore"   maxBarSize={22} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid lg:grid-cols-2 gap-5">
                  {/* Subject radar */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                    <h3 className="font-black text-slate-900 text-sm mb-1">Subject Performance Radar</h3>
                    <p className="text-xs text-slate-400 mb-3">Average score per subject — SS classes</p>
                    <ResponsiveContainer width="100%" height={220}>
                      <RadarChart data={SUBJECT_RADAR}>
                        <PolarGrid stroke="#f1f5f9" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: "#94a3b8" }} />
                        <Radar name="Avg Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Top students */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <Award className="w-5 h-5 text-amber-500" />
                      <h3 className="font-black text-slate-900 text-sm">Top 5 Students This Term</h3>
                    </div>
                    <div className="space-y-3">
                      {TOP_STUDENTS.map((s, i) => (
                        <motion.div key={s.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.07 }}
                          className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0
                            ${i === 0 ? "bg-amber-400 text-white" : i === 1 ? "bg-slate-300 text-slate-700" : i === 2 ? "bg-orange-400 text-white" : "bg-slate-200 text-slate-600"}`}>
                            {i + 1}
                          </div>
                          <div className={`w-9 h-9 ${s.color} rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
                            {s.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-900 text-sm truncate">{s.name}</p>
                            <p className="text-xs text-slate-400">{s.class}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-emerald-600 text-sm">{s.avg}%</p>
                            <p className="text-xs text-slate-400">Avg</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── ATTENDANCE REPORT ── */}
            {activeTab === "attendance" && (
              <motion.div key="att" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="space-y-5">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label:"Total School Days", value:"86", sub:"This term so far", up:true, trend:"On track" },
                    { label:"Term Average",       value:"90.3%", sub:"Across all classes", up:true, trend:"+2.1% vs last" },
                    { label:"Best Class",         value:"SS 3A", sub:"96% average rate", up:true, trend:"Excellent" },
                    { label:"Needs Attention",    value:"JSS 1A", sub:"88% — lowest class", up:false, trend:"-3% vs avg" },
                  ].map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                      className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                      <p className="text-2xl font-black text-slate-900 mb-0.5">{s.value}</p>
                      <p className="text-sm font-bold text-slate-700">{s.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
                      <span className={`mt-2 inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${s.up ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                        {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{s.trend}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                  <h3 className="font-black text-slate-900 text-sm mb-1">Monthly Attendance Trend</h3>
                  <p className="text-xs text-slate-400 mb-5">Present vs Absent students per month</p>
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={ATTENDANCE_TREND}>
                      <defs>
                        <linearGradient id="pGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTip />} />
                      <Area type="monotone" dataKey="present" stroke="#10b981" strokeWidth={2.5} fill="url(#pGrad)" name="present" />
                      <Area type="monotone" dataKey="absent"  stroke="#ef4444" strokeWidth={2}   fill="url(#aGrad)" name="absent" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Class attendance table */}
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100">
                    <h3 className="font-black text-slate-900 text-sm">Class-by-Class Breakdown</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          {["Class","Teacher","Rate","Present","Absent","Trend"].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-xs font-black text-slate-500 uppercase tracking-wide">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {CLASS_PERFORMANCE.map((c, i) => (
                          <tr key={c.class} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3"><span className="font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg text-xs">{c.class}</span></td>
                            <td className="px-4 py-3 text-xs text-slate-600">Mr./Mrs. Teacher</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full ${c.attendance >= 90 ? "bg-emerald-500" : c.attendance >= 80 ? "bg-amber-400" : "bg-red-400"}`}
                                    style={{ width: `${c.attendance}%` }} />
                                </div>
                                <span className={`text-xs font-black ${c.attendance >= 90 ? "text-emerald-600" : "text-amber-600"}`}>{c.attendance}%</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-xs font-semibold text-emerald-700">{Math.round(40 * c.attendance / 100)}</td>
                            <td className="px-4 py-3 text-xs font-semibold text-red-600">{40 - Math.round(40 * c.attendance / 100)}</td>
                            <td className="px-4 py-3">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${c.attendance >= 90 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                                {c.attendance >= 90 ? "▲ Good" : "▼ Monitor"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── FEES REPORT ── */}
            {activeTab === "fees" && (
              <motion.div key="fees" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="space-y-5">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label:"Total Expected", value:"₦28.1M", sub:"All term fees", trend:"+₦2.3M vs last", up:true },
                    { label:"Collected",      value:"₦24.2M", sub:"86% of target",  trend:"+₦3.4M vs last", up:true },
                    { label:"Outstanding",    value:"₦3.9M",  sub:"47 defaulters",   trend:"-₦1.2M vs last", up:true },
                    { label:"Defaulters",     value:"47",     sub:"Students unpaid",  trend:"-8 vs last term",up:true },
                  ].map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                      className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                      <p className="text-2xl font-black text-slate-900 mb-0.5">{s.value}</p>
                      <p className="text-sm font-bold text-slate-700">{s.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
                      <span className={`mt-2 inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${s.up ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                        {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{s.trend}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                  <h3 className="font-black text-slate-900 text-sm mb-1">Monthly Collection vs Outstanding</h3>
                  <p className="text-xs text-slate-400 mb-5">₦ values — {selectedTerm}</p>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={FEE_TREND} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `₦${v/1_000_000}M`} />
                      <Tooltip content={<ChartTip />} />
                      <Bar dataKey="collected"   fill="#10b981" radius={[6,6,0,0]} name="collected"   maxBarSize={38} />
                      <Bar dataKey="outstanding" fill="#f97316" radius={[6,6,0,0]} name="outstanding" maxBarSize={38} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="flex gap-4 mt-3 justify-center text-xs">
                    <span className="flex items-center gap-1.5 text-slate-500 font-medium"><span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />Collected</span>
                    <span className="flex items-center gap-1.5 text-slate-500 font-medium"><span className="w-3 h-3 rounded-sm bg-orange-500 inline-block" />Outstanding</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── RESULTS REPORT ── */}
            {activeTab === "results" && (
              <motion.div key="res" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="space-y-5">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label:"School Average", value:"73.4%", sub:"All classes combined", trend:"+3.2% vs last", up:true },
                    { label:"Passed (≥50%)",  value:"1,089", sub:"84.8% of students",    trend:"+4.1% vs last", up:true },
                    { label:"Failed (<40%)",  value:"86",    sub:"Need intervention",     trend:"-12 vs last",   up:true },
                    { label:"Grade A Students",value:"195",  sub:"Scored 70% and above", trend:"+28 vs last",   up:true },
                  ].map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                      className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                      <p className="text-2xl font-black text-slate-900 mb-0.5">{s.value}</p>
                      <p className="text-sm font-bold text-slate-700">{s.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                        <TrendingUp className="w-3 h-3" />{s.trend}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                  <h3 className="font-black text-slate-900 text-sm mb-1">Academic Performance History</h3>
                  <p className="text-xs text-slate-400 mb-5">School average — last 8 terms</p>
                  <ResponsiveContainer width="100%" height={230}>
                    <AreaChart data={RESULT_TREND}>
                      <defs>
                        <linearGradient id="resGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="term" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <YAxis domain={[55, 80]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} unit="%" />
                      <Tooltip content={<ChartTip />} />
                      <Area type="monotone" dataKey="avg" stroke="#6366f1" strokeWidth={2.5} fill="url(#resGrad)" name="avg" dot={{ fill: "#6366f1", r: 5 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {/* ── EXPORT ── */}
            {activeTab === "export" && (
              <motion.div key="exp" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="space-y-6">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-black text-white text-base mb-1">Bulk Export — {selectedTerm}</h3>
                    <p className="text-slate-400 text-sm">Download all reports as a single ZIP file</p>
                  </div>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-xl text-sm shadow-lg shadow-emerald-900/40 transition-colors flex-shrink-0">
                    <Download className="w-4 h-4" /> Download All
                  </motion.button>
                </div>

                <div>
                  <h3 className="font-black text-slate-800 text-sm mb-4">Individual Reports</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {REPORT_EXPORTS.map((r, i) => (
                      <ExportCard key={r.label} {...r} delay={i * 0.06} />
                    ))}
                  </div>
                </div>

                {/* Format options */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                  <h3 className="font-black text-slate-900 text-sm mb-4">Export Format Options</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { fmt:"PDF", desc:"Best for printing", active:true },
                      { fmt:"Excel (.xlsx)", desc:"For data analysis", active:false },
                      { fmt:"CSV", desc:"Raw data export", active:false },
                      { fmt:"Word (.docx)", desc:"Editable report", active:false },
                    ].map(f => (
                      <div key={f.fmt} className={`p-3 rounded-xl border-2 text-center cursor-pointer transition-all
                        ${f.active ? "border-emerald-400 bg-emerald-50" : "border-slate-200 hover:border-slate-300"}`}>
                        <p className={`text-sm font-black ${f.active ? "text-emerald-700" : "text-slate-700"}`}>{f.fmt}</p>
                        <p className={`text-xs mt-0.5 ${f.active ? "text-emerald-600" : "text-slate-400"}`}>{f.desc}</p>
                        {f.active && <span className="text-xs font-bold text-emerald-600 mt-1 inline-block">✓ Selected</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}