"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  School, LayoutDashboard, UserCheck, BookOpen, Megaphone,
  Menu, X, LogOut, Bell, Search, ChevronRight, TrendingUp,
  Users, Clock, CheckCircle, AlertTriangle, BookMarked,
  CalendarDays, Award, BarChart3, ArrowRight, Pin,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from "recharts";

// ─── Shared Nav ───────────────────────────────────────────────────────────────

export const TEACHER_NAV = [
  { icon: LayoutDashboard, label: "Dashboard",    href: "/teacher" },
  { icon: UserCheck,       label: "My Classes",   href: "/teacher/classes" },
  { icon: BookOpen,        label: "Results Entry",href: "/teacher/results" },
  { icon: Megaphone,       label: "Notices",      href: "/teacher/notices" },
];

export function TeacherSidebar({ active, mobile, onClose }: {
  active: string; mobile?: boolean; onClose?: () => void;
}) {
  return (
    <aside className={`flex flex-col h-full bg-indigo-950 border-r border-indigo-900/60 ${mobile ? "w-full" : "w-60"}`}>
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-indigo-900/60">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-lg flex items-center justify-center">
            <School className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-lg text-white tracking-tight">Edu<span className="text-indigo-300">Flow</span></span>
        </Link>
        {mobile && <button onClick={onClose} className="text-indigo-400 hover:text-white"><X className="w-5 h-5" /></button>}
      </div>

      {/* Teacher badge */}
      <div className="mx-3 mt-4 px-4 py-3 bg-indigo-900/50 rounded-xl border border-indigo-800/50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0">
            EA
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-black truncate">Mr. Emmanuel Abubakar</p>
            <p className="text-indigo-400 text-xs">Mathematics · Senior School</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest px-3 mb-3">Menu</p>
        {TEACHER_NAV.map(item => (
          <Link key={item.label} href={item.href} onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${active === item.href
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-900/50"
                : "text-indigo-300 hover:text-white hover:bg-indigo-900/60"}`}>
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {item.label}
            {active === item.href && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-indigo-900/60">
        <Link href="/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-indigo-900/60 cursor-pointer group transition-all">
          <LogOut className="w-4 h-4 text-indigo-500 group-hover:text-red-400 transition-colors" />
          <span className="text-indigo-400 group-hover:text-white text-sm font-semibold transition-colors">Sign Out</span>
        </Link>
      </div>
    </aside>
  );
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ATTENDANCE_WEEK = [
  { day: "Mon", rate: 96 }, { day: "Tue", rate: 88 }, { day: "Wed", rate: 94 },
  { day: "Thu", rate: 100 }, { day: "Fri", rate: 82 }, { day: "Today", rate: 91 },
];

const CLASS_SCORES = [
  { class: "SS 2A", avg: 74 },
  { class: "SS 1B", avg: 61 },
  { class: "SS 3A", avg: 79 },
  { class: "JSS 3B", avg: 55 },
];

const MY_CLASSES = [
  { name: "SS 2A",  subject: "Mathematics", students: 42, marked: true,  avgScore: 74, period: "Period 1 · 8:00 AM" },
  { name: "SS 1B",  subject: "Mathematics", students: 40, marked: false, avgScore: 61, period: "Period 3 · 10:00 AM" },
  { name: "SS 3A",  subject: "Mathematics", students: 36, marked: true,  avgScore: 79, period: "Period 5 · 12:30 PM" },
  { name: "JSS 3B", subject: "Mathematics", students: 41, marked: false, avgScore: 55, period: "Period 6 · 1:30 PM" },
];

const RECENT_ACTIVITIES = [
  { icon: CheckCircle, color: "text-emerald-500 bg-emerald-50",  text: "Marked attendance for SS 2A", time: "9:14 AM" },
  { icon: BookOpen,    color: "text-blue-500 bg-blue-50",        text: "Submitted CA scores for SS 3A", time: "Yesterday" },
  { icon: AlertTriangle,color:"text-amber-500 bg-amber-50",      text: "3 students absent in SS 1B", time: "Yesterday" },
  { icon: Award,       color: "text-violet-500 bg-violet-50",    text: "Results published for JSS 3B", time: "2 days ago" },
  { icon: Pin,         color: "text-rose-500 bg-rose-50",        text: "New announcement: Staff meeting Thursday", time: "2 days ago" },
];

const NOTICES = [
  { title: "Staff Meeting — Thursday 4 PM", from: "Dr. C. Okonkwo", time: "2 days ago", urgent: true },
  { title: "Second Term Result Submission Deadline: Jan 31", from: "Admin", time: "5 days ago", urgent: true },
  { title: "Mid-Term Break: Feb 7–10", from: "Admin", time: "1 week ago", urgent: false },
];

// ─── Tooltip ──────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Tip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-indigo-950 border border-indigo-800 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-indigo-400 mb-1">{label}</p>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((p: any) => <p key={p.name} className="font-black text-white">{p.value}%</p>)}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TeacherDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const today = new Date().toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long" });
  const unmarked = MY_CLASSES.filter(c => !c.marked).length;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <div className="hidden lg:flex flex-shrink-0"><TeacherSidebar active="/teacher" /></div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-40 lg:hidden" />
            <motion.div initial={{ x:-260 }} animate={{ x:0 }} exit={{ x:-260 }}
              transition={{ type:"spring", damping:28, stiffness:260 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50 lg:hidden">
              <TeacherSidebar active="/teacher" mobile onClose={() => setSidebarOpen(false)} />
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
              <h1 className="text-lg font-black text-slate-900">Good morning, Mr. Abubakar 👋</h1>
              <p className="text-xs text-slate-400 mt-0.5">{today} · Second Term 2024/2025</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6">

          {/* Urgent alert */}
          {unmarked > 0 && (
            <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
              className="flex items-center gap-3 px-5 py-4 bg-amber-50 border border-amber-200 rounded-2xl">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <p className="text-sm font-bold text-amber-800 flex-1">
                {unmarked} class{unmarked > 1 ? "es haven't" : " hasn't"} been marked today —&nbsp;
                <span className="font-black">{MY_CLASSES.filter(c => !c.marked).map(c => c.name).join(", ")}</span>
              </p>
              <Link href="/teacher/classes"
                className="text-xs font-black text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap">
                Mark now →
              </Link>
            </motion.div>
          )}

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label:"My Classes",        value:"4",    sub:"This term",          icon:Users,        color:"bg-indigo-100 text-indigo-600" },
              { label:"Total Students",    value:"159",  sub:"Across all classes", icon:BookMarked,   color:"bg-blue-100 text-blue-600" },
              { label:"Avg Attendance",    value:"91.3%",sub:"This week",          icon:UserCheck,    color:"bg-emerald-100 text-emerald-600" },
              { label:"Results Pending",   value:"2",    sub:"Classes to submit",  icon:Clock,        color:"bg-amber-100 text-amber-600" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                transition={{ delay: i * 0.07, ease:[0.22,1,0.36,1] }}
                className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                <div className={`w-11 h-11 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-black text-slate-900">{s.value}</p>
                <p className="text-sm font-bold text-slate-700 mt-0.5">{s.label}</p>
                <p className="text-xs text-slate-400">{s.sub}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            {/* Today's classes */}
            <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div>
                  <h3 className="font-black text-slate-900 text-sm">Today&apos;s Classes</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Mark attendance for each period</p>
                </div>
                <Link href="/teacher/classes"
                  className="text-xs font-black text-indigo-600 hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="divide-y divide-slate-50">
                {MY_CLASSES.map((cls, i) => (
                  <motion.div key={cls.name} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/70 transition-colors">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0
                      ${cls.marked ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"}`}>
                      {cls.name.split(" ").map(w => w[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-black text-slate-900 text-sm">{cls.name}</p>
                        <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{cls.subject}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{cls.period} · {cls.students} students</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {cls.marked
                        ? <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            <CheckCircle className="w-3 h-3" /> Marked
                          </span>
                        : <Link href="/teacher/classes"
                            className="text-xs font-black bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                            Mark
                          </Link>
                      }
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Notices */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h3 className="font-black text-slate-900 text-sm">Notices</h3>
                <Link href="/teacher/notices" className="text-xs font-black text-indigo-600 hover:underline">See all</Link>
              </div>
              <div className="divide-y divide-slate-50">
                {NOTICES.map((n, i) => (
                  <motion.div key={i} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: i * 0.07 }}
                    className="px-5 py-3.5 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-2">
                      {n.urgent && <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />}
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-snug">{n.title}</p>
                        <p className="text-xs text-slate-400 mt-1">{n.from} · {n.time}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            {/* Attendance trend */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <h3 className="font-black text-slate-900 text-sm mb-1">My Classes — Attendance This Week</h3>
              <p className="text-xs text-slate-400 mb-4">Combined attendance rate across all 4 classes</p>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={ATTENDANCE_WEEK}>
                  <defs>
                    <linearGradient id="tGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize:11, fill:"#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[70,100]} tick={{ fontSize:11, fill:"#94a3b8" }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip content={<Tip />} />
                  <Area type="monotone" dataKey="rate" stroke="#6366f1" strokeWidth={2.5} fill="url(#tGrad)" dot={{ fill:"#6366f1", r:4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Class avg scores */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              <h3 className="font-black text-slate-900 text-sm mb-1">Class Average Scores</h3>
              <p className="text-xs text-slate-400 mb-4">Mathematics — Second Term</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={CLASS_SCORES}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="class" tick={{ fontSize:11, fill:"#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0,100]} tick={{ fontSize:11, fill:"#94a3b8" }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip content={<Tip />} />
                  <Bar dataKey="avg" fill="#6366f1" radius={[6,6,0,0]} maxBarSize={44} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-sm">Recent Activity</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {RECENT_ACTIVITIES.map((a, i) => (
                <motion.div key={i} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: i*0.05 }}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className={`w-9 h-9 ${a.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <a.icon className="w-4 h-4" />
                  </div>
                  <p className="flex-1 text-sm text-slate-700 font-medium">{a.text}</p>
                  <p className="text-xs text-slate-400 flex-shrink-0">{a.time}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}