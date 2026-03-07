"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  School,
  LayoutDashboard,
  Users,
  UserCheck,
  CreditCard,
  BookOpen,
  Megaphone,
  BarChart3,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Download,
  Plus,
  ChevronRight,
  LogOut,
  User,
  GraduationCap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";


const attendanceData = [
  { day: "Mon", present: 95, absent: 5 },
  { day: "Tue", present: 88, absent: 12 },
  { day: "Wed", present: 92, absent: 8 },
  { day: "Thu", present: 97, absent: 3 },
  { day: "Fri", present: 84, absent: 16 },
  { day: "Sat", present: 78, absent: 22 },
];

const feeData = [
  { month: "Aug", collected: 1200000, outstanding: 400000 },
  { month: "Sep", collected: 1800000, outstanding: 320000 },
  { month: "Oct", collected: 1500000, outstanding: 500000 },
  { month: "Nov", collected: 2100000, outstanding: 280000 },
  { month: "Dec", collected: 1900000, outstanding: 350000 },
  { month: "Jan", collected: 2400000, outstanding: 200000 },
];

const classDistribution = [
  { name: "JSS 1", value: 120, color: "#10b981" },
  { name: "JSS 2", value: 98, color: "#3b82f6" },
  { name: "JSS 3", value: 115, color: "#8b5cf6" },
  { name: "SS 1", value: 88, color: "#f59e0b" },
  { name: "SS 2", value: 95, color: "#ef4444" },
  { name: "SS 3", value: 76, color: "#14b8a6" },
];

const recentPayments = [
  { name: "Amara Okafor", class: "SS 2A", amount: 45000, date: "Today, 9:14 AM", status: "paid" },
  { name: "Emmanuel Adeyemi", class: "JSS 1B", amount: 32000, date: "Today, 8:52 AM", status: "paid" },
  { name: "Fatima Bello", class: "SS 3A", amount: 45000, date: "Yesterday", status: "paid" },
  { name: "Chidi Nwosu", class: "JSS 2C", amount: 32000, date: "Yesterday", status: "pending" },
  { name: "Grace Eze", class: "SS 1B", amount: 40000, date: "2 days ago", status: "failed" },
];

const recentAttendance = [
  { class: "SS 1A", teacher: "Mr. Abubakar", present: 38, total: 42, rate: 90 },
  { class: "SS 2B", teacher: "Mrs. Okonkwo", present: 35, total: 40, rate: 88 },
  { class: "JSS 3A", teacher: "Mr. Ibrahim", present: 44, total: 45, rate: 98 },
  { class: "JSS 1C", teacher: "Ms. Adeyemi", present: 30, total: 38, rate: 79 },
  { class: "SS 3A", teacher: "Dr. Eze", present: 36, total: 36, rate: 100 },
];

const announcements = [
  {
    title: "Second Term Examination Timetable",
    audience: "All Students",
    date: "2 hours ago",
    type: "exam",
  },
  {
    title: "PTA Meeting — Saturday 10 AM",
    audience: "Parents",
    date: "Yesterday",
    type: "event",
  },
  {
    title: "Staff Meeting Reminder",
    audience: "Teachers",
    date: "2 days ago",
    type: "staff",
  },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", active: true },
  { icon: Users, label: "Students", href: "/dashboard/students", active: false },
  { icon: GraduationCap, label: "Teachers", href: "/dashboard/teachers", active: false },
  { icon: UserCheck, label: "Attendance", href: "/dashboard/attendance", active: false },
  { icon: CreditCard, label: "Fees", href: "/dashboard/fees", active: false },
  { icon: BookOpen, label: "Results", href: "/dashboard/results", active: false },
  { icon: Megaphone, label: "Announcements", href: "/dashboard/announcements", active: false },
  { icon: BarChart3, label: "Reports", href: "/dashboard/reports", active: false },
  { icon: Settings, label: "Settings", href: "/dashboard/settings", active: false },
];

function Sidebar({ mobile, onClose }: { mobile?: boolean; onClose?: () => void }) {
  return (
    <aside
      className={`flex flex-col h-full bg-slate-950 border-r border-slate-800 ${
        mobile ? "w-full" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
            <School className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-lg text-white tracking-tight">
            Edu<span className="text-emerald-400">Flow</span>
          </span>
        </Link>
        {mobile && (
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* School info */}
      <div className="px-4 py-3 mx-3 mt-4 bg-slate-900 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <School className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-bold truncate">Greenfield College</p>
            <p className="text-slate-500 text-xs">School Admin</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-xs font-bold text-slate-600 uppercase tracking-widest px-3 mb-3">
          Main Menu
        </p>
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group
              ${
                item.active
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/50"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {item.label}
            {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />}
          </Link>
        ))}
      </nav>

      {/* User profile */}
      <div className="px-3 py-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 cursor-pointer group transition-all">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0">
            CO
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-bold truncate">Dr. Chidinma Okonkwo</p>
            <p className="text-slate-500 text-xs truncate">chidinma@school.edu.ng</p>
          </div>
          <LogOut className="w-4 h-4 text-slate-600 group-hover:text-red-400 transition-colors flex-shrink-0" />
        </div>
      </div>
    </aside>
  );
}

// ─── Top Header ───────────────────────────────────────────────────────────────

function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 gap-4">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-black text-slate-900 leading-none">Dashboard</h1>
          <p className="text-xs text-slate-400 mt-0.5">2024/2025 Academic Year · Second Term</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 w-60">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search students, fees…"
            className="text-sm text-slate-700 placeholder:text-slate-400 bg-transparent outline-none w-full"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 top-12 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/80 z-50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <p className="font-bold text-slate-900 text-sm">Notifications</p>
                  <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">3 new</span>
                </div>
                {[
                  { text: "SS 2B attendance not marked yet", time: "5 min ago", type: "warn" },
                  { text: "₦820K in outstanding fees this term", time: "1 hour ago", type: "alert" },
                  { text: "New student admission: Tunde Afolabi", time: "2 hours ago", type: "info" },
                ].map((n, i) => (
                  <div key={i} className="px-4 py-3 hover:bg-slate-50 border-b border-slate-50 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        n.type === "warn" ? "bg-orange-400" : n.type === "alert" ? "bg-red-400" : "bg-blue-400"
                      }`} />
                      <div>
                        <p className="text-xs text-slate-700 font-medium leading-snug">{n.text}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="px-4 py-3 text-center">
                  <button className="text-xs text-emerald-600 font-bold hover:underline">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-2.5 cursor-pointer group">
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-xs font-black">
            CO
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-bold text-slate-900 leading-none">Dr. Okonkwo</p>
            <p className="text-xs text-slate-400">Admin</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
        </div>
      </div>
    </header>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  trend,
  trendUp,
  color,
  delay = 0,
}: {
  title: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  trend: string;
  trendUp: boolean;
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
            trendUp ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
          }`}
        >
          {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      <p className="text-2xl font-black text-slate-900 mb-0.5">{value}</p>
      <p className="text-sm font-semibold text-slate-700 mb-0.5">{title}</p>
      <p className="text-xs text-slate-400">{sub}</p>
    </motion.div>
  );
}

// ─── Payment status badge ─────────────────────────────────────────────────────

function PaymentBadge({ status }: { status: string }) {
  if (status === "paid")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
        <CheckCircle className="w-3 h-3" /> Paid
      </span>
    );
  if (status === "pending")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">
        <Clock className="w-3 h-3" /> Pending
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold bg-red-50 text-red-600 px-2.5 py-1 rounded-full">
      <XCircle className="w-3 h-3" /> Failed
    </span>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 shadow-xl text-xs">
      <p className="text-slate-400 mb-1.5 font-semibold">{label}</p>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-bold">
          {p.name}: {typeof p.value === "number" && p.value > 1000
            ? `₦${(p.value / 1000000).toFixed(1)}M`
            : `${p.value}${p.name.includes("present") || p.name.includes("absent") ? "%" : ""}`}
        </p>
      ))}
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-50 lg:hidden"
            >
              <Sidebar mobile onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6">

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Students"
              value="1,284"
              sub="Across all classes"
              icon={Users}
              trend="+12 this term"
              trendUp={true}
              color="bg-emerald-100 text-emerald-600"
              delay={0}
            />
            <StatCard
              title="Total Teachers"
              value="48"
              sub="28 classes covered"
              icon={GraduationCap}
              trend="+3 this term"
              trendUp={true}
              color="bg-blue-100 text-blue-600"
              delay={0.05}
            />
            <StatCard
              title="Today's Attendance"
              value="94.2%"
              sub="1,210 of 1,284 present"
              icon={UserCheck}
              trend="-1.8% vs yesterday"
              trendUp={false}
              color="bg-violet-100 text-violet-600"
              delay={0.1}
            />
            <StatCard
              title="Outstanding Fees"
              value="₦820K"
              sub="From 47 students"
              icon={CreditCard}
              trend="-₦180K vs last term"
              trendUp={true}
              color="bg-orange-100 text-orange-600"
              delay={0.15}
            />
          </div>

          {/* Charts row */}
          <div className="grid lg:grid-cols-3 gap-5">
            {/* Attendance chart */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-black text-slate-900 text-sm">Weekly Attendance Rate</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Present vs Absent — this week</p>
                </div>
                <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-semibold border border-slate-200 px-3 py-1.5 rounded-lg hover:border-slate-300 transition-all">
                  <Download className="w-3.5 h-3.5" /> Export
                </button>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={attendanceData}>
                  <defs>
                    <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="absentGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="present" stroke="#10b981" strokeWidth={2.5} fill="url(#presentGrad)" name="present" />
                  <Area type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={2} fill="url(#absentGrad)" name="absent" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Class distribution */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm"
            >
              <div className="mb-4">
                <h3 className="font-black text-slate-900 text-sm">Students by Class</h3>
                <p className="text-xs text-slate-400 mt-0.5">Total: 592 students</p>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={classDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                    {classDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} students`]} contentStyle={{ borderRadius: 10, fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-3 gap-1.5 mt-2">
                {classDistribution.map((c) => (
                  <div key={c.name} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                    <span className="text-xs text-slate-500">{c.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Fee chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-black text-slate-900 text-sm">Fee Collection Trend</h3>
                <p className="text-xs text-slate-400 mt-0.5">Collected vs Outstanding — Aug 2024 to Jan 2025</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-500" /><span className="text-slate-500 font-medium">Collected</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-orange-400" /><span className="text-slate-500 font-medium">Outstanding</span></div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={feeData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₦${v / 1000000}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="collected" fill="#10b981" radius={[6, 6, 0, 0]} name="collected" maxBarSize={36} />
                <Bar dataKey="outstanding" fill="#fb923c" radius={[6, 6, 0, 0]} name="outstanding" maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Bottom 3-column grid */}
          <div className="grid lg:grid-cols-3 gap-5">
            {/* Recent payments */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-black text-slate-900 text-sm">Recent Fee Payments</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Latest transactions this term</p>
                </div>
                <Link
                  href="/dashboard/fees"
                  className="flex items-center gap-1 text-xs text-emerald-600 font-bold hover:underline"
                >
                  View all <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="space-y-0">
                {recentPayments.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-black text-slate-600 flex-shrink-0">
                        {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                        <p className="text-xs text-slate-400">{p.class} · {p.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-slate-900">₦{p.amount.toLocaleString()}</span>
                      <PaymentBadge status={p.status} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right column */}
            <div className="space-y-5">
              {/* Attendance by class */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-slate-900 text-sm">Today&apos;s Attendance</h3>
                  <Link href="/dashboard/attendance" className="text-xs text-emerald-600 font-bold hover:underline flex items-center gap-0.5">
                    All <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentAttendance.map((a, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div>
                          <span className="font-bold text-slate-800">{a.class}</span>
                          <span className="text-slate-400 ml-1.5">{a.teacher}</span>
                        </div>
                        <span className={`font-black ${a.rate >= 90 ? "text-emerald-600" : a.rate >= 80 ? "text-amber-600" : "text-red-500"}`}>
                          {a.rate}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${a.rate}%` }}
                          transition={{ duration: 0.8, delay: 0.5 + i * 0.08 }}
                          className={`h-full rounded-full ${a.rate >= 90 ? "bg-emerald-500" : a.rate >= 80 ? "bg-amber-400" : "bg-red-400"}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Announcements */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-slate-900 text-sm">Announcements</h3>
                  <button className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center hover:bg-emerald-700 transition-colors">
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div className="space-y-3">
                  {announcements.map((a, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        a.type === "exam" ? "bg-violet-500" : a.type === "event" ? "bg-blue-500" : "bg-orange-500"
                      }`} />
                      <div>
                        <p className="text-xs font-bold text-slate-800 leading-snug">{a.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {a.audience} · {a.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Quick actions */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 shadow-sm"
              >
                <h3 className="font-black text-white text-sm mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Add Student", icon: Users },
                    { label: "Record Fee", icon: CreditCard },
                    { label: "Mark Attendance", icon: UserCheck },
                    { label: "New Announcement", icon: Megaphone },
                  ].map((action) => (
                    <button
                      key={action.label}
                      className="flex items-center gap-2 px-3 py-2.5 bg-white/15 hover:bg-white/25 rounded-xl text-white text-xs font-bold transition-all"
                    >
                      <action.icon className="w-3.5 h-3.5 flex-shrink-0" />
                      {action.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Alerts row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="grid sm:grid-cols-3 gap-4"
          >
            {[
              {
                icon: AlertTriangle,
                color: "bg-amber-50 border-amber-200 text-amber-700",
                iconColor: "text-amber-500",
                title: "3 classes not marked",
                sub: "SS 2B, JSS 1A, JSS 3C haven't marked today's attendance",
                action: "Mark now",
              },
              {
                icon: CreditCard,
                color: "bg-red-50 border-red-200 text-red-700",
                iconColor: "text-red-500",
                title: "47 fee defaulters",
                sub: "₦820K outstanding from 47 students this term",
                action: "Send reminders",
              },
              {
                icon: BookOpen,
                color: "bg-blue-50 border-blue-200 text-blue-700",
                iconColor: "text-blue-500",
                title: "Results pending",
                sub: "14 teachers haven't submitted second term scores",
                action: "Notify teachers",
              },
            ].map((alert, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-4 rounded-2xl border ${alert.color}`}
              >
                <alert.icon className={`w-5 h-5 ${alert.iconColor} flex-shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold">{alert.title}</p>
                  <p className="text-xs opacity-80 mt-0.5 leading-snug">{alert.sub}</p>
                  <button className="text-xs font-black mt-2 underline">{alert.action}</button>
                </div>
              </div>
            ))}
          </motion.div>

        </main>
      </div>
    </div>
  );
}