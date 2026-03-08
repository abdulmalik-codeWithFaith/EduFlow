"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, TrendingUp, TrendingDown, Users, School, DollarSign,
  Activity, Globe, ChevronDown, BarChart3, UserCheck, BookOpen,
  Zap, ArrowUpRight, Download,
} from "lucide-react";
import { SuperSidebar } from "../page";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ComposedChart, Scatter,
} from "recharts";

// ─── Data ─────────────────────────────────────────────────────────────────────

const RANGES = ["Last 7 days", "Last 30 days", "Last 90 days", "Last 12 months", "All time"];

const GROWTH_12M = [
  { month: "Mar '24", schools: 28, users: 1420, mrr: 4200000 },
  { month: "Apr '24", schools: 31, users: 1610, mrr: 4680000 },
  { month: "May '24", schools: 33, users: 1770, mrr: 5040000 },
  { month: "Jun '24", schools: 35, users: 1890, mrr: 5400000 },
  { month: "Jul '24", schools: 37, users: 2040, mrr: 5760000 },
  { month: "Aug '24", schools: 39, users: 2190, mrr: 6120000 },
  { month: "Sep '24", schools: 41, users: 2340, mrr: 6480000 },
  { month: "Oct '24", schools: 42, users: 2430, mrr: 6840000 },
  { month: "Nov '24", schools: 43, users: 2520, mrr: 7200000 },
  { month: "Dec '24", schools: 44, users: 2630, mrr: 7560000 },
  { month: "Jan '25", schools: 46, users: 2760, mrr: 8100000 },
  { month: "Feb '25", schools: 47, users: 2841, mrr: 8475000 },
];

const DAILY_ACTIVE = [
  { day: "Mon", active: 2140 }, { day: "Tue", active: 2380 },
  { day: "Wed", active: 2510 }, { day: "Thu", active: 2460 },
  { day: "Fri", active: 2290 }, { day: "Sat", active: 980 },
  { day: "Sun", active: 720 },
];

const FEATURE_USAGE = [
  { feature: "Attendance",   usage: 94, sessions: 28400 },
  { feature: "Results",      usage: 88, sessions: 26600 },
  { feature: "Fees",         usage: 81, sessions: 24500 },
  { feature: "Reports",      usage: 67, sessions: 20200 },
  { feature: "Announcements",usage: 73, sessions: 22100 },
  { feature: "Analytics",    usage: 59, sessions: 17800 },
];

const STATE_DATA = [
  { state: "Lagos",   schools: 12, color: "#7c3aed" },
  { state: "Abuja",   schools: 8,  color: "#8b5cf6" },
  { state: "Rivers",  schools: 6,  color: "#a78bfa" },
  { state: "Oyo",     schools: 5,  color: "#c4b5fd" },
  { state: "Anambra", schools: 5,  color: "#ddd6fe" },
  { state: "Others",  schools: 11, color: "#ede9fe" },
];

const CHURN_RETENTION = [
  { month: "Sep", retained: 96, churned: 4 },
  { month: "Oct", retained: 97, churned: 3 },
  { month: "Nov", retained: 95, churned: 5 },
  { month: "Dec", retained: 98, churned: 2 },
  { month: "Jan", retained: 97, churned: 3 },
  { month: "Feb", retained: 98, churned: 2 },
];

const RADAR_DATA = [
  { metric: "Uptime",      value: 99.97 },
  { metric: "NPS",         value: 82 },
  { metric: "Retention",   value: 97 },
  { metric: "DAU/MAU",     value: 68 },
  { metric: "Feature Adp", value: 74 },
  { metric: "Onboarding",  value: 88 },
];

const TOP_SCHOOLS = [
  { name: "Royal Academy",          students: 2140, dau: 94, mrr: 350000, growth: "+12%" },
  { name: "Destiny International",  students: 1890, dau: 91, mrr: 350000, growth: "+8%"  },
  { name: "Premier Academy",        students: 1560, dau: 89, mrr: 180000, growth: "+15%" },
  { name: "Greenfield College",     students: 1284, dau: 87, mrr: 180000, growth: "+6%"  },
  { name: "Crown Excellence",       students: 1020, dau: 85, mrr: 180000, growth: "+9%"  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Tip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-zinc-400 mb-1.5 font-semibold">{label}</p>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((p: any) => (
        <p key={p.name} className="font-bold" style={{ color: p.stroke || p.fill || p.color }}>
          {p.name}: {typeof p.value === "number" && p.value > 100000 ? `₦${(p.value / 1_000_000).toFixed(2)}M` : p.value}{typeof p.value === "number" && (p.name === "retained" || p.name === "churned") ? "%" : ""}
        </p>
      ))}
    </div>
  );
}

function StatCard({ label, value, sub, trend, trendUp, delay }: {
  label: string; value: string; sub: string; trend: string; trendUp: boolean; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wide">{label}</p>
        <span className={`text-xs font-bold flex items-center gap-1 px-2 py-0.5 rounded-full ${trendUp ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
          {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{trend}
        </span>
      </div>
      <p className="text-2xl font-black text-zinc-900">{value}</p>
      <p className="text-xs text-zinc-400 mt-1">{sub}</p>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SuperAdminAnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [range, setRange] = useState(RANGES[4]);
  const [rangeOpen, setRangeOpen] = useState(false);

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      <div className="hidden lg:flex flex-shrink-0"><SuperSidebar active="/super-admin/analytics" /></div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-50 lg:hidden">
              <SuperSidebar active="/super-admin/analytics" mobile onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-zinc-100 flex-shrink-0 gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-zinc-100 text-zinc-500">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-black text-zinc-900">Platform Analytics</h1>
              <p className="text-xs text-zinc-400 mt-0.5">Growth, engagement & health metrics</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Range picker */}
            <div className="relative">
              <button onClick={() => setRangeOpen(!rangeOpen)}
                className="flex items-center gap-2 px-4 py-2.5 border border-zinc-200 hover:border-violet-400 rounded-xl text-sm font-bold text-zinc-700 bg-white transition-all">
                {range}
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${rangeOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {rangeOpen && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                    className="absolute right-0 top-12 bg-white border border-zinc-200 rounded-xl shadow-xl z-20 min-w-44 overflow-hidden">
                    {RANGES.map(r => (
                      <button key={r} onClick={() => { setRange(r); setRangeOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${range === r ? "bg-violet-50 text-violet-700 font-bold" : "text-zinc-700 hover:bg-zinc-50 font-medium"}`}>
                        {r}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-zinc-200 hover:border-zinc-300 rounded-xl text-sm font-bold text-zinc-600 bg-white transition-all">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6">

          {/* KPI row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Schools"   value="47"         sub="4 added this month"          trend="+3 MTD"    trendUp delay={0} />
            <StatCard label="Active Users"    value="2,841"      sub="DAU avg: 2,280"               trend="+8.4%"     trendUp delay={0.06} />
            <StatCard label="Retention Rate"  value="97.8%"      sub="90-day cohort"                trend="+0.6pp"    trendUp delay={0.12} />
            <StatCard label="Churn This Month"value="2"          sub="Schools churned"              trend="−1 vs last" trendUp delay={0.18} />
          </div>

          {/* Growth chart — full width */}
          <div className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-black text-zinc-900">Platform Growth — 12 Months</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Schools · Users · Monthly Revenue</p>
              </div>
              <div className="flex gap-4 text-xs">
                {[["#7c3aed","Schools"],["#3b82f6","Users"],["#10b981","MRR"]].map(([c,l]) => (
                  <span key={l} className="flex items-center gap-1.5 text-zinc-500">
                    <span className="w-3 h-1 rounded inline-block" style={{ backgroundColor: c }} />{l}
                  </span>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <ComposedChart data={GROWTH_12M}>
                <defs>
                  <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#a1a1aa" }} axisLine={false} tickLine={false} tickFormatter={v => `₦${v / 1_000_000}M`} />
                <Tooltip content={<Tip />} />
                <Area yAxisId="right" type="monotone" dataKey="mrr" fill="url(#mrrGrad)" stroke="#10b981" strokeWidth={2} name="mrr" />
                <Line yAxisId="left" type="monotone" dataKey="schools" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: "#7c3aed", r: 3 }} name="schools" />
                <Line yAxisId="left" type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 3 }} strokeDasharray="5 3" name="users" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Row 2 */}
          <div className="grid lg:grid-cols-3 gap-5">

            {/* Daily active users */}
            <div className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm">
              <h3 className="font-black text-zinc-900 text-sm mb-1">Daily Active Users</h3>
              <p className="text-xs text-zinc-400 mb-4">This week · avg 2,280/day</p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={DAILY_ACTIVE} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<Tip />} />
                  <Bar dataKey="active" radius={[6, 6, 0, 0]} name="active">
                    {DAILY_ACTIVE.map((d, i) => (
                      <Cell key={i} fill={d.active > 2000 ? "#7c3aed" : "#e4e4e7"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Feature adoption */}
            <div className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm">
              <h3 className="font-black text-zinc-900 text-sm mb-1">Feature Adoption</h3>
              <p className="text-xs text-zinc-400 mb-4">% of schools using each module</p>
              <div className="space-y-3">
                {FEATURE_USAGE.map((f, i) => (
                  <motion.div key={f.feature} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-zinc-600">{f.feature}</span>
                      <span className="font-black text-zinc-800">{f.usage}%</span>
                    </div>
                    <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${f.usage}%` }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.08 + 0.3 }}
                        className={`h-full rounded-full ${f.usage >= 85 ? "bg-violet-500" : f.usage >= 70 ? "bg-blue-400" : "bg-zinc-400"}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Geographic distribution */}
            <div className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm">
              <h3 className="font-black text-zinc-900 text-sm mb-1">Schools by State</h3>
              <p className="text-xs text-zinc-400 mb-4">Top 5 states + others</p>
              <div className="relative flex justify-center mb-2">
                <ResponsiveContainer width={140} height={140}>
                  <PieChart>
                    <Pie data={STATE_DATA} cx="50%" cy="50%" innerRadius={38} outerRadius={60} paddingAngle={3} dataKey="schools">
                      {STATE_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {STATE_DATA.map(s => (
                  <div key={s.state} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: s.color }} />
                      <span className="text-zinc-600 font-medium">{s.state}</span>
                    </div>
                    <span className="font-black text-zinc-800">{s.schools} <span className="text-zinc-400 font-normal">schools</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid lg:grid-cols-5 gap-5">

            {/* Retention / churn */}
            <div className="lg:col-span-3 bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-black text-zinc-900 text-sm">Retention vs Churn</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Monthly school retention rate (%)</p>
                </div>
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  98% avg retention
                </span>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={CHURN_RETENTION}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip content={<Tip />} />
                  <Bar dataKey="retained" stackId="a" fill="#7c3aed" radius={[0, 0, 0, 0]} name="retained" maxBarSize={40} />
                  <Bar dataKey="churned"  stackId="a" fill="#fca5a5" radius={[4, 4, 0, 0]} name="churned"  maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Platform health radar */}
            <div className="lg:col-span-2 bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm">
              <h3 className="font-black text-zinc-900 text-sm mb-1">Platform Health</h3>
              <p className="text-xs text-zinc-400 mb-2">Key metrics scored 0–100</p>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={RADAR_DATA}>
                  <PolarGrid stroke="#f4f4f5" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: "#a1a1aa" }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: "#a1a1aa" }} />
                  <Radar name="Score" dataKey="value" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top performing schools */}
          <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
              <h3 className="font-black text-zinc-900 text-sm">Top Performing Schools</h3>
              <span className="text-xs text-zinc-400">Ranked by engagement</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-100">
                    {["#", "School", "Students", "DAU Rate", "MRR", "Growth"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-black text-zinc-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {TOP_SCHOOLS.map((s, i) => (
                    <motion.tr key={s.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                      className="hover:bg-zinc-50/60 transition-colors">
                      <td className="px-4 py-3">
                        <span className={`w-6 h-6 inline-flex items-center justify-center rounded-lg text-xs font-black
                          ${i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-zinc-200 text-zinc-600" : "bg-orange-100 text-orange-700"}`}>
                          {i + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center text-violet-700 text-xs font-black flex-shrink-0">
                            {s.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                          </div>
                          <span className="font-bold text-zinc-900 whitespace-nowrap">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-bold text-zinc-700">{s.students.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden w-20">
                            <div className="h-full bg-violet-500 rounded-full" style={{ width: `${s.dau}%` }} />
                          </div>
                          <span className="text-xs font-black text-zinc-700">{s.dau}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-black text-zinc-900">₦{(s.mrr / 1000).toFixed(0)}K</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1 w-fit">
                          <TrendingUp className="w-3 h-3" />{s.growth}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}