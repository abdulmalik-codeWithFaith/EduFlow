"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  School, LayoutDashboard, UserCheck, BookOpen, CreditCard,
  Menu, X, LogOut, Bell, ChevronRight, Award,
  Megaphone, AlertTriangle, CheckCircle, TrendingUp, BookMarked,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";

// ─── Shared Sidebar (exported for other parent pages) ─────────────────────────

export const PARENT_NAV = [
  { icon: LayoutDashboard, label: "Overview",   href: "/parent" },
  { icon: UserCheck,       label: "Attendance", href: "/parent/attendance" },
  { icon: BookOpen,        label: "Results",    href: "/parent/results" },
  { icon: CreditCard,      label: "Fees",       href: "/parent/fees" },
];

export function ParentSidebar({
  active, mobile, onClose,
}: {
  active: string; mobile?: boolean; onClose?: () => void;
}) {
  return (
    <aside className={`flex flex-col h-full bg-white border-r border-stone-100 ${mobile ? "w-full" : "w-64"}`}>
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md shadow-teal-100">
            <School className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-lg text-stone-900 tracking-tight">
            Edu<span className="text-teal-500">Flow</span>
          </span>
        </Link>
        {mobile && (
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 p-1">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Child card */}
      <div className="mx-4 mt-5 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-gradient-to-br from-teal-500 to-emerald-500 p-4">
          <p className="text-teal-100 text-xs font-bold uppercase tracking-widest mb-3">My Child</p>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/25 backdrop-blur-sm rounded-xl flex items-center justify-center text-white text-base font-black shadow-lg flex-shrink-0">
              AO
            </div>
            <div className="min-w-0">
              <p className="text-white font-black text-sm truncate">Amara Okafor</p>
              <p className="text-teal-100 text-xs font-semibold">SS 2A · Greenfield College</p>
              <p className="text-teal-200 text-xs mt-0.5">GFC/2024/001</p>
            </div>
          </div>
        </div>
        <div className="bg-teal-50 border-x border-b border-teal-100 px-4 py-2 flex items-center justify-between">
          <span className="text-xs font-bold text-teal-700">Second Term 2024/2025</span>
          <span className="text-xs font-bold text-teal-600 bg-teal-100 px-2 py-0.5 rounded-full">Active</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest px-2 mb-3">Dashboard</p>
        {PARENT_NAV.map((item) => {
          const isActive = active === item.href;
          return (
            <Link key={item.href} href={item.href} onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? "bg-teal-500 text-white shadow-lg shadow-teal-100"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
              }`}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-stone-100 space-y-1">
        <div className="px-3 py-2.5 bg-stone-50 rounded-xl">
          <p className="text-xs font-black text-stone-800">Mrs. Ngozi Okafor</p>
          <p className="text-xs text-stone-400 mt-0.5">ngozi.okafor@gmail.com</p>
        </div>
        <Link href="/login"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-stone-500 hover:text-red-600 hover:bg-red-50 transition-all group">
          <LogOut className="w-4 h-4 group-hover:text-red-500 transition-colors" />
          <span className="text-sm font-semibold">Sign Out</span>
        </Link>
      </div>
    </aside>
  );
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ATTENDANCE_TREND = [
  { month: "Sep", rate: 95 }, { month: "Oct", rate: 88 },
  { month: "Nov", rate: 96 }, { month: "Dec", rate: 100 },
  { month: "Jan", rate: 97 }, { month: "Feb", rate: 94 },
];

const SUBJECT_SCORES = [
  { subject: "Mathematics",   total: 78, grade: "A" },
  { subject: "English Lang.", total: 74, grade: "B" },
  { subject: "Physics",       total: 68, grade: "B" },
  { subject: "Chemistry",     total: 71, grade: "B" },
  { subject: "Biology",       total: 79, grade: "A" },
  { subject: "Economics",     total: 88, grade: "A" },
];

const TIMELINE = [
  { icon: CheckCircle,   color: "bg-emerald-100 text-emerald-600 border-emerald-200", text: "Amara was present in school today",     time: "Today, 7:48 AM" },
  { icon: Award,         color: "bg-amber-100 text-amber-600 border-amber-200",       text: "Second term results published",          time: "Yesterday" },
  { icon: CreditCard,    color: "bg-teal-100 text-teal-600 border-teal-200",          text: "Fee payment of ₦45,000 confirmed",       time: "Jan 12" },
  { icon: AlertTriangle, color: "bg-red-100 text-red-500 border-red-200",             text: "Amara was absent (excused leave)",       time: "Jan 9" },
  { icon: BookMarked,    color: "bg-blue-100 text-blue-600 border-blue-200",          text: "CA scores submitted by teachers",        time: "Jan 7" },
];

const RECENT_NOTICES = [
  { title: "Second Term Examination Timetable Released", time: "Today",      urgent: true  },
  { title: "PTA Meeting — Saturday, 1st February",       time: "Yesterday",  urgent: false },
  { title: "Mid-Term Break: Feb 7–10",                   time: "3 days ago", urgent: false },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-stone-400 mb-1">{label}</p>
      <p className="font-black text-white">{payload[0].value}%</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ParentOverviewPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">
      <div className="hidden lg:flex flex-shrink-0"><ParentSidebar active="/parent" /></div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-50 lg:hidden">
              <ParentSidebar active="/parent" mobile onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-stone-100 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-stone-100 text-stone-500">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-black text-stone-900">Good morning, Mrs. Okafor 👋</h1>
              <p className="text-xs text-stone-400 mt-0.5">{today} · Greenfield College</p>
            </div>
          </div>
          <button className="relative p-2.5 rounded-xl hover:bg-stone-100 text-stone-500 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6">

          {/* Hero card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-400 p-6 shadow-xl shadow-teal-200/50">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full pointer-events-none" />
            <div className="absolute -bottom-16 right-8 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/25 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg flex-shrink-0">AO</div>
                <div>
                  <p className="text-teal-100 text-xs font-bold uppercase tracking-widest mb-1">My Child</p>
                  <h2 className="text-white text-2xl font-black">Amara Okafor</h2>
                  <p className="text-teal-100 text-sm font-medium mt-0.5">SS 2A · Second Term 2024/2025</p>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-3 text-center flex-shrink-0">
                <p className="text-teal-100 text-xs font-bold">Class Position</p>
                <p className="text-white text-3xl font-black leading-none mt-1">1<span className="text-xl">st</span></p>
                <p className="text-teal-200 text-xs mt-0.5">of 42 students</p>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-3 gap-3 mt-5">
              {[
                { label: "Attendance",   value: "97%"     },
                { label: "Term Average", value: "78.2%"   },
                { label: "Fee Status",   value: "✓ Paid"  },
              ].map((s) => (
                <div key={s.label} className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
                  <p className="text-white text-lg font-black">{s.value}</p>
                  <p className="text-teal-100 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick-access cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { href: "/parent/attendance", icon: UserCheck, label: "Attendance", val: "97%",   sub: "This term",      iconBg: "bg-teal-500",    border: "border-teal-100 hover:border-teal-300"    },
              { href: "/parent/results",    icon: Award,      label: "Results",    val: "1st",   sub: "Class position", iconBg: "bg-violet-500",  border: "border-violet-100 hover:border-violet-300" },
              { href: "/parent/fees",       icon: CreditCard, label: "Fees",       val: "Paid",  sub: "₦45,000",        iconBg: "bg-emerald-500", border: "border-emerald-100 hover:border-emerald-300"},
              { href: "/parent/notices",    icon: Megaphone,  label: "Notices",    val: "3",     sub: "Unread",         iconBg: "bg-amber-500",   border: "border-amber-100 hover:border-amber-300"   },
            ].map((card, i) => (
              <motion.div key={card.href} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}>
                <Link href={card.href}
                  className={`group flex flex-col gap-3 p-5 rounded-2xl border-2 bg-white shadow-sm hover:shadow-md transition-all ${card.border}`}>
                  <div className={`w-11 h-11 ${card.iconBg} rounded-xl flex items-center justify-center shadow-md`}>
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-stone-900">{card.val}</p>
                    <p className="text-sm font-bold text-stone-700 mt-0.5">{card.label}</p>
                    <p className="text-xs text-stone-400">{card.sub}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-black text-stone-300 group-hover:text-teal-600 transition-colors">
                    View <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-5 gap-5">
            <div className="lg:col-span-3 bg-white border border-stone-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-black text-stone-900 text-sm">Monthly Attendance</h3>
                  <p className="text-xs text-stone-400 mt-0.5">2024/2025 session</p>
                </div>
                <span className="text-xs font-black text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">97% avg</span>
              </div>
              <ResponsiveContainer width="100%" height={190}>
                <AreaChart data={ATTENDANCE_TREND}>
                  <defs>
                    <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#a8a29e" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[75, 100]} tick={{ fontSize: 11, fill: "#a8a29e" }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip content={<ChartTip />} />
                  <Area type="monotone" dataKey="rate" stroke="#14b8a6" strokeWidth={2.5} fill="url(#attGrad)"
                    dot={{ fill: "#14b8a6", r: 4, strokeWidth: 2, stroke: "#fff" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="lg:col-span-2 bg-white border border-stone-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-stone-900 text-sm">Subject Scores</h3>
                <Link href="/parent/results" className="text-xs font-black text-teal-600 hover:underline flex items-center gap-1">
                  Details <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {SUBJECT_SCORES.map((s, i) => (
                  <motion.div key={s.subject} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }} className="flex items-center gap-2.5">
                    <span className="text-xs text-stone-500 w-24 truncate flex-shrink-0">{s.subject}</span>
                    <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${s.total}%` }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.07 + 0.3 }}
                        className={`h-full rounded-full ${s.grade === "A" ? "bg-teal-500" : "bg-blue-400"}`} />
                    </div>
                    <span className="text-sm font-black text-stone-800 w-7 text-right flex-shrink-0">{s.total}</span>
                    <span className={`w-6 h-6 flex items-center justify-center text-xs font-black rounded-md flex-shrink-0 ${s.grade === "A" ? "bg-teal-50 text-teal-700" : "bg-blue-50 text-blue-700"}`}>
                      {s.grade}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid lg:grid-cols-2 gap-5">
            {/* Notices */}
            <div className="bg-white border border-stone-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
                <h3 className="font-black text-stone-900 text-sm">School Notices</h3>
                <Link href="/parent/notices" className="text-xs font-black text-teal-600 hover:underline">View all</Link>
              </div>
              <div className="divide-y divide-stone-50">
                {RECENT_NOTICES.map((n, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3 px-5 py-4 hover:bg-stone-50 transition-colors cursor-pointer">
                    {n.urgent && <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold leading-snug ${n.urgent ? "text-stone-900" : "text-stone-700"}`}>{n.title}</p>
                      <p className="text-xs text-stone-400 mt-1">{n.time}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-300 flex-shrink-0 mt-0.5" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm">
              <h3 className="font-black text-stone-900 text-sm mb-4">Recent Activity</h3>
              <div className="relative">
                <div className="absolute left-4 top-2 bottom-2 w-px bg-stone-100" />
                <div className="space-y-4">
                  {TIMELINE.map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }} className="flex items-start gap-3 relative">
                      <div className={`w-8 h-8 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0 border relative z-10 shadow-sm`}>
                        <item.icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 pt-1 min-w-0">
                        <p className="text-sm text-stone-700 font-medium leading-snug">{item.text}</p>
                        <p className="text-xs text-stone-400 mt-0.5">{item.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}