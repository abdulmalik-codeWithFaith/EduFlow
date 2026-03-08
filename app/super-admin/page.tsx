"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Shield, LayoutDashboard, School, Users, CreditCard, BarChart3,
  Megaphone, Settings, Menu, X, LogOut, Bell, TrendingUp,
  TrendingDown, AlertTriangle, CheckCircle, Clock, Globe,
  Zap, Activity, DollarSign, UserCheck, ChevronRight, ArrowUpRight,
} from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

// ─── Super Admin Nav (exported) ───────────────────────────────────────────────

export const SUPER_NAV = [
  { icon: LayoutDashboard, label: "Dashboard",     href: "/super-admin" },
  { icon: School,          label: "Schools",        href: "/super-admin/schools" },
  { icon: Users,           label: "Admins",         href: "/super-admin/admins" },
  { icon: CreditCard,      label: "Billing",        href: "/super-admin/billing" },
  { icon: BarChart3,       label: "Analytics",      href: "/super-admin/analytics" },
  { icon: Megaphone,       label: "Announcements",  href: "/super-admin/announcements" },
  { icon: Settings,        label: "Settings",       href: "/super-admin/settings" },
];

// ─── Shared Sidebar ───────────────────────────────────────────────────────────

export function SuperSidebar({ active, mobile, onClose }: {
  active: string; mobile?: boolean; onClose?: () => void;
}) {
  return (
    <aside className={`flex flex-col h-full bg-zinc-950 border-r border-zinc-800/60 ${mobile ? "w-full" : "w-64"}`}>
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800/60">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-900/50">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-black text-lg text-white tracking-tight">Edu<span className="text-violet-400">Flow</span></span>
            <div className="flex items-center gap-1 -mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              <span className="text-xs font-bold text-violet-400 tracking-widest uppercase">Super Admin</span>
            </div>
          </div>
        </Link>
        {mobile && <button onClick={onClose} className="text-zinc-500 hover:text-white p-1"><X className="w-5 h-5" /></button>}
      </div>

      {/* Platform health badge */}
      <div className="mx-4 mt-4 px-4 py-3 bg-zinc-900/80 rounded-xl border border-zinc-800/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Platform Status</span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-400">Operational</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div><p className="text-zinc-500">Schools</p><p className="font-black text-white">47</p></div>
          <div><p className="text-zinc-500">Active Users</p><p className="font-black text-white">2,841</p></div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest px-3 mb-3">Control Panel</p>
        {SUPER_NAV.map(item => {
          const isActive = active === item.href;
          return (
            <Link key={item.href} href={item.href} onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-900/60"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/70"
              }`}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-zinc-800/60">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-800/60 cursor-pointer group transition-all">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0">SA</div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-black truncate">Super Admin</p>
            <p className="text-zinc-500 text-xs truncate">admin@eduflow.app</p>
          </div>
          <LogOut className="w-4 h-4 text-zinc-600 group-hover:text-red-400 transition-colors flex-shrink-0" />
        </div>
      </div>
    </aside>
  );
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const GROWTH = [
  { month: "Jul", schools: 31, users: 1840 },
  { month: "Aug", schools: 34, users: 2010 },
  { month: "Sep", schools: 38, users: 2240 },
  { month: "Oct", schools: 40, users: 2390 },
  { month: "Nov", schools: 43, users: 2560 },
  { month: "Dec", schools: 44, users: 2630 },
  { month: "Jan", schools: 46, users: 2760 },
  { month: "Feb", schools: 47, users: 2841 },
];

const REVENUE = [
  { month: "Jul", rev: 5580000 },
  { month: "Aug", rev: 6120000 },
  { month: "Sep", rev: 6840000 },
  { month: "Oct", rev: 7200000 },
  { month: "Nov", rev: 7740000 },
  { month: "Dec", rev: 7920000 },
  { month: "Jan", rev: 8280000 },
  { month: "Feb", rev: 8475000 },
];

const PLAN_DIST = [
  { name: "Professional", value: 34, color: "#7c3aed" },
  { name: "Enterprise",   value: 9,  color: "#10b981" },
  { name: "Free Trial",   value: 4,  color: "#f59e0b" },
];

const RECENT_SCHOOLS = [
  { name: "Greenfield College",     state: "Lagos",    plan: "Professional", students: 1284, status: "Active",    joined: "Jan 2024" },
  { name: "Royal Academy",          state: "Abuja",    plan: "Enterprise",   students: 2140, status: "Active",    joined: "Mar 2024" },
  { name: "Sunshine International", state: "Enugu",    plan: "Professional", students: 890,  status: "Active",    joined: "Sep 2024" },
  { name: "Heritage High School",   state: "Kano",     plan: "Free Trial",   students: 340,  status: "Trial",     joined: "Feb 2025" },
  { name: "Premier Academy",        state: "PH",       plan: "Professional", students: 1560, status: "Active",    joined: "Jun 2024" },
];

const ALERTS = [
  { type: "warn",  text: "Heritage High School trial expires in 3 days", time: "Now" },
  { type: "info",  text: "4 new school registrations pending approval", time: "1h ago" },
  { type: "error", text: "Payment failure for Evergreen Academy — retry needed", time: "3h ago" },
  { type: "ok",    text: "Platform uptime 99.97% this month", time: "Today" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Tip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-zinc-400 mb-1.5 font-semibold">{label}</p>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((p: any) => (
        <p key={p.name} className="font-bold" style={{ color: p.stroke || p.fill }}>
          {p.name}: {typeof p.value === "number" && p.value > 10000
            ? `₦${(p.value/1_000_000).toFixed(2)}M`
            : p.value}
        </p>
      ))}
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KPI({ label, value, sub, trend, trendUp, icon: Icon, accent, delay }: {
  label: string; value: string; sub: string; trend: string; trendUp: boolean;
  icon: React.ElementType; accent: string; delay: number;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-1/2 translate-x-1/2 ${accent} opacity-10 group-hover:opacity-20 transition-opacity`} />
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accent} bg-opacity-15`}>
          <Icon className={`w-5 h-5`} style={{ color: "currentColor" }} />
        </div>
        <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${trendUp ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
          {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trend}
        </span>
      </div>
      <p className="text-2xl font-black text-zinc-900 mb-0.5 relative z-10">{value}</p>
      <p className="text-sm font-bold text-zinc-700 relative z-10">{label}</p>
      <p className="text-xs text-zinc-400 mt-0.5 relative z-10">{sub}</p>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SuperAdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      <div className="hidden lg:flex flex-shrink-0"><SuperSidebar active="/super-admin" /></div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-50 lg:hidden">
              <SuperSidebar active="/super-admin" mobile onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-zinc-100 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-zinc-100 text-zinc-500"><Menu className="w-5 h-5" /></button>
            <div>
              <h1 className="text-lg font-black text-zinc-900">Platform Dashboard</h1>
              <p className="text-xs text-zinc-400 mt-0.5">EduFlow Super Admin · {new Date().toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2.5 rounded-xl hover:bg-zinc-100 text-zinc-500 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full" />
            </button>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-black shadow-lg shadow-violet-200 cursor-pointer hover:bg-violet-700 transition-colors">
              <Zap className="w-4 h-4" />
              Live Platform
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6">

          {/* KPI Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPI label="Total Schools"    value="47"         sub="4 pending approval"    trend="+3 this month" trendUp icon={School}      accent="bg-violet-500 text-violet-600" delay={0} />
            <KPI label="Total Students"   value="58,240"     sub="Across all schools"    trend="+1,240 MTD"    trendUp icon={UserCheck}   accent="bg-blue-500 text-blue-600"     delay={0.06} />
            <KPI label="MRR"              value="₦8.47M"     sub="Monthly recurring"     trend="+12.4% MoM"    trendUp icon={DollarSign}  accent="bg-emerald-500 text-emerald-600"delay={0.12} />
            <KPI label="Platform Uptime"  value="99.97%"     sub="Last 30 days"          trend="+0.02%"        trendUp icon={Activity}    accent="bg-amber-500 text-amber-600"   delay={0.18} />
          </div>

          {/* Alert bar */}
          <div className="flex flex-col sm:flex-row gap-2">
            {ALERTS.map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl flex-1 text-xs font-semibold
                  ${a.type === "warn"  ? "bg-amber-50 border border-amber-200 text-amber-800"
                  : a.type === "error" ? "bg-red-50 border border-red-200 text-red-800"
                  : a.type === "ok"    ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                  : "bg-blue-50 border border-blue-200 text-blue-800"}`}>
                {a.type === "warn" ? <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  : a.type === "error" ? <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  : a.type === "ok" ? <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  : <Clock className="w-3.5 h-3.5 flex-shrink-0" />}
                <span className="truncate">{a.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Charts row 1 */}
          <div className="grid lg:grid-cols-3 gap-5">
            {/* School & user growth */}
            <div className="lg:col-span-2 bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-black text-zinc-900 text-sm">Platform Growth</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Schools onboarded & total users</p>
                </div>
                <div className="flex gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-zinc-500"><span className="w-3 h-1 bg-violet-500 rounded inline-block" />Schools</span>
                  <span className="flex items-center gap-1.5 text-zinc-500"><span className="w-3 h-1 bg-blue-400 rounded inline-block" />Users</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={210}>
                <LineChart data={GROWTH}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left"  tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<Tip />} />
                  <Line yAxisId="left"  type="monotone" dataKey="schools" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: "#7c3aed", r: 4 }} name="schools" />
                  <Line yAxisId="right" type="monotone" dataKey="users"   stroke="#60a5fa" strokeWidth={2}   dot={{ fill: "#60a5fa", r: 3 }} name="users" strokeDasharray="5 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Plan distribution */}
            <div className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm">
              <h3 className="font-black text-zinc-900 text-sm mb-1">Subscription Plans</h3>
              <p className="text-xs text-zinc-400 mb-4">Distribution across 47 schools</p>
              <div className="flex justify-center">
                <div className="relative w-40 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={PLAN_DIST} cx="50%" cy="50%" innerRadius={46} outerRadius={68} paddingAngle={4} dataKey="value">
                        {PLAN_DIST.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-zinc-900">47</span>
                    <span className="text-xs text-zinc-400">schools</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 mt-3">
                {PLAN_DIST.map(p => (
                  <div key={p.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                      <span className="text-xs font-semibold text-zinc-600">{p.name}</span>
                    </div>
                    <span className="text-xs font-black text-zinc-900">{p.value} <span className="text-zinc-400 font-normal">({Math.round(p.value/47*100)}%)</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Revenue chart */}
          <div className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-black text-zinc-900 text-sm">Monthly Recurring Revenue</h3>
                <p className="text-xs text-zinc-400 mt-0.5">₦ — last 8 months</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-zinc-900">₦8.47M</p>
                <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 justify-end"><TrendingUp className="w-3 h-3" />+12.4% MoM</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={REVENUE}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} tickFormatter={v => `₦${v/1_000_000}M`} />
                <Tooltip content={<Tip />} />
                <Area type="monotone" dataKey="rev" stroke="#7c3aed" strokeWidth={2.5} fill="url(#revGrad)" name="rev" dot={{ fill: "#7c3aed", r: 4, strokeWidth: 2, stroke: "#fff" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Recent schools table */}
          <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
              <h3 className="font-black text-zinc-900 text-sm">Recent Schools</h3>
              <Link href="/super-admin/schools" className="flex items-center gap-1 text-xs font-black text-violet-600 hover:underline">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-100">
                    {["School","State","Plan","Students","Status","Joined"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-black text-zinc-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {RECENT_SCHOOLS.map((s, i) => (
                    <motion.tr key={s.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                      className="hover:bg-zinc-50/60 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <School className="w-4 h-4 text-violet-600" />
                          </div>
                          <span className="font-bold text-zinc-900 text-sm whitespace-nowrap">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-zinc-500">{s.state}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                          s.plan === "Enterprise" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : s.plan === "Professional" ? "bg-violet-50 text-violet-700 border-violet-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                          {s.plan}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-zinc-700">{s.students.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${s.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-400">{s.joined}</td>
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