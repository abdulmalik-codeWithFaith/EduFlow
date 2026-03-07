"use client";

import { useState, useMemo } from "react";
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
  Plus,
  Upload,
  Download,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Phone,
  Mail,
  MapPin,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  GraduationCap,
  LogOut,
  UserPlus,
  ArrowUpDown,
  Check,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Student {
  id: string;
  name: string;
  admissionNo: string;
  class: string;
  gender: "Male" | "Female";
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  status: "Active" | "Suspended" | "Graduated";
  feeStatus: "Paid" | "Partial" | "Unpaid";
  attendanceRate: number;
  joinDate: string;
  avatar: string;
}

interface AddStudentForm {
  name: string;
  admissionNo: string;
  class: string;
  gender: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CLASSES = ["JSS 1A", "JSS 1B", "JSS 1C", "JSS 2A", "JSS 2B", "JSS 2C", "JSS 3A", "JSS 3B", "SS 1A", "SS 1B", "SS 2A", "SS 2B", "SS 3A", "SS 3B"];

const MOCK_STUDENTS: Student[] = [
  { id: "1", name: "Amara Okafor", admissionNo: "GFC/2024/001", class: "SS 2A", gender: "Female", parentName: "Mrs. Ngozi Okafor", parentPhone: "+234 803 111 2222", parentEmail: "ngozi@gmail.com", address: "14 Broad Street, Lagos Island", status: "Active", feeStatus: "Paid", attendanceRate: 96, joinDate: "Sep 2022", avatar: "AO" },
  { id: "2", name: "Emmanuel Adeyemi", admissionNo: "GFC/2024/002", class: "JSS 1B", gender: "Male", parentName: "Mr. Tunde Adeyemi", parentPhone: "+234 807 223 3344", parentEmail: "tunde@yahoo.com", address: "7 Ikeja Avenue, Lagos", status: "Active", feeStatus: "Partial", attendanceRate: 82, joinDate: "Sep 2024", avatar: "EA" },
  { id: "3", name: "Fatima Bello", admissionNo: "GFC/2024/003", class: "SS 3A", gender: "Female", parentName: "Alhaji Musa Bello", parentPhone: "+234 811 334 4455", parentEmail: "musa.bello@gmail.com", address: "22 Wuse Zone 4, Abuja", status: "Active", feeStatus: "Paid", attendanceRate: 98, joinDate: "Sep 2021", avatar: "FB" },
  { id: "4", name: "Chidi Nwosu", admissionNo: "GFC/2024/004", class: "JSS 2C", gender: "Male", parentName: "Dr. Ikenna Nwosu", parentPhone: "+234 815 445 5566", parentEmail: "ikenna.nwosu@unec.edu.ng", address: "5 University Road, Enugu", status: "Active", feeStatus: "Unpaid", attendanceRate: 74, joinDate: "Sep 2023", avatar: "CN" },
  { id: "5", name: "Grace Eze", admissionNo: "GFC/2024/005", class: "SS 1B", gender: "Female", parentName: "Mrs. Ada Eze", parentPhone: "+234 819 556 6677", parentEmail: "ada.eze@hotmail.com", address: "10 Trans Amadi, Port Harcourt", status: "Active", feeStatus: "Paid", attendanceRate: 91, joinDate: "Sep 2023", avatar: "GE" },
  { id: "6", name: "Ibrahim Hassan", admissionNo: "GFC/2024/006", class: "JSS 3A", gender: "Male", parentName: "Alhaji Hassan Usman", parentPhone: "+234 823 667 7788", parentEmail: "hassan.usman@gmail.com", address: "3 Maiduguri Road, Kano", status: "Suspended", feeStatus: "Unpaid", attendanceRate: 55, joinDate: "Sep 2022", avatar: "IH" },
  { id: "7", name: "Blessing Okonkwo", admissionNo: "GFC/2024/007", class: "SS 2B", gender: "Female", parentName: "Chief Emeka Okonkwo", parentPhone: "+234 827 778 8899", parentEmail: "emeka.okonkwo@corporate.com", address: "18 GRA Estate, Onitsha", status: "Active", feeStatus: "Paid", attendanceRate: 94, joinDate: "Sep 2022", avatar: "BO" },
  { id: "8", name: "Tunde Afolabi", admissionNo: "GFC/2024/008", class: "JSS 1A", gender: "Male", parentName: "Mr. Seun Afolabi", parentPhone: "+234 831 889 9900", parentEmail: "seun.afolabi@gmail.com", address: "25 Bodija, Ibadan", status: "Active", feeStatus: "Partial", attendanceRate: 88, joinDate: "Sep 2024", avatar: "TA" },
  { id: "9", name: "Chioma Obi", admissionNo: "GFC/2024/009", class: "SS 1A", gender: "Female", parentName: "Mr. Chukwu Obi", parentPhone: "+234 835 990 0011", parentEmail: "chukwu.obi@gmail.com", address: "9 Douglas Road, Owerri", status: "Active", feeStatus: "Paid", attendanceRate: 99, joinDate: "Sep 2023", avatar: "CO" },
  { id: "10", name: "Yusuf Abubakar", admissionNo: "GFC/2024/010", class: "JSS 2A", gender: "Male", parentName: "Mal. Abubakar Yusuf", parentPhone: "+234 839 001 1122", parentEmail: "abubakar.yusuf@gmail.com", address: "6 Sokoto Road, Kaduna", status: "Active", feeStatus: "Paid", attendanceRate: 87, joinDate: "Sep 2023", avatar: "YA" },
  { id: "11", name: "Adaeze Igwe", admissionNo: "GFC/2024/011", class: "SS 3A", gender: "Female", parentName: "Prof. Obiora Igwe", parentPhone: "+234 843 112 2233", parentEmail: "obiora@unn.edu.ng", address: "1 Campus Road, Nsukka", status: "Active", feeStatus: "Paid", attendanceRate: 97, joinDate: "Sep 2021", avatar: "AI" },
  { id: "12", name: "Solomon Dike", admissionNo: "GFC/2024/012", class: "JSS 3B", gender: "Male", parentName: "Pastor Dike Solomon", parentPhone: "+234 847 223 3344", parentEmail: "dike.solomon@church.org", address: "15 Mission Road, Benin City", status: "Active", feeStatus: "Partial", attendanceRate: 79, joinDate: "Sep 2022", avatar: "SD" },
];

const AVATAR_COLORS: Record<string, string> = {
  "AO": "bg-emerald-500", "EA": "bg-blue-500", "FB": "bg-violet-500",
  "CN": "bg-orange-500", "GE": "bg-pink-500", "IH": "bg-red-500",
  "BO": "bg-teal-500", "TA": "bg-indigo-500", "CO": "bg-emerald-600",
  "YA": "bg-amber-500", "AI": "bg-purple-500", "SD": "bg-cyan-500",
};

// ─── Sidebar (shared layout) ──────────────────────────────────────────────────

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", active: false },
  { icon: Users, label: "Students", href: "/dashboard/students", active: true },
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
          <div className="w-9 h-9 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
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
        {navItems.map((item) => (
          <Link key={item.label} href={item.href} onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${item.active ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/50" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}>
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {item.label}
            {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />}
          </Link>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 cursor-pointer group transition-all">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0">CO</div>
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

// ─── Status Badges ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Student["status"] }) {
  const map = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Suspended: "bg-red-50 text-red-700 border-red-200",
    Graduated: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full border ${map[status]}`}>{status}</span>;
}

function FeeBadge({ status }: { status: Student["feeStatus"] }) {
  const map = {
    Paid: "bg-emerald-50 text-emerald-700",
    Partial: "bg-amber-50 text-amber-700",
    Unpaid: "bg-red-50 text-red-600",
  };
  const icons = { Paid: CheckCircle, Partial: AlertCircle, Unpaid: XCircle };
  const Icon = icons[status];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${map[status]}`}>
      <Icon className="w-3 h-3" />{status}
    </span>
  );
}

// ─── Add Student Modal ────────────────────────────────────────────────────────

function AddStudentModal({ onClose, onAdd }: { onClose: () => void; onAdd: (s: Student) => void }) {
  const empty: AddStudentForm = { name: "", admissionNo: "", class: "", gender: "", parentName: "", parentPhone: "", parentEmail: "", address: "" };
  const [form, setForm] = useState<AddStudentForm>(empty);
  const [errors, setErrors] = useState<Partial<AddStudentForm>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: keyof AddStudentForm, v: string) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => ({ ...p, [k]: undefined }));
  };

  const validate = () => {
    const e: Partial<AddStudentForm> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.admissionNo.trim()) e.admissionNo = "Required";
    if (!form.class) e.class = "Required";
    if (!form.gender) e.gender = "Required";
    if (!form.parentName.trim()) e.parentName = "Required";
    if (!form.parentPhone.trim()) e.parentPhone = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const initials = form.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
    const newStudent: Student = {
      id: Date.now().toString(), name: form.name, admissionNo: form.admissionNo,
      class: form.class, gender: form.gender as "Male" | "Female",
      parentName: form.parentName, parentPhone: form.parentPhone,
      parentEmail: form.parentEmail, address: form.address,
      status: "Active", feeStatus: "Unpaid", attendanceRate: 0,
      joinDate: new Date().toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
      avatar: initials,
    };
    setLoading(false);
    setDone(true);
    setTimeout(() => { onAdd(newStudent); onClose(); }, 1000);
  };

  const fieldClass = (err?: string) =>
    `w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 bg-white outline-none transition-all ${err ? "border-red-300 ring-2 ring-red-100" : "border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"}`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 20 }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-black text-slate-900">Add New Student</h2>
              <p className="text-xs text-slate-400">Fill in the student&apos;s details below</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"><X className="w-5 h-5" /></button>
        </div>

        {done ? (
          <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 220 }}
              className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </motion.div>
            <h3 className="font-black text-slate-900 text-lg mb-1">Student Added!</h3>
            <p className="text-sm text-slate-500">{form.name} has been enrolled successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5" noValidate>
            {/* Section: Student */}
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Student Information</p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name *</label>
                    <input placeholder="e.g. Amara Okafor" value={form.name} onChange={e => set("name", e.target.value)} className={fieldClass(errors.name)} />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Admission No. *</label>
                    <input placeholder="e.g. GFC/2024/013" value={form.admissionNo} onChange={e => set("admissionNo", e.target.value)} className={fieldClass(errors.admissionNo)} />
                    {errors.admissionNo && <p className="text-xs text-red-500 mt-1">{errors.admissionNo}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Class *</label>
                    <select value={form.class} onChange={e => set("class", e.target.value)} className={fieldClass(errors.class)}>
                      <option value="">Select class</option>
                      {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.class && <p className="text-xs text-red-500 mt-1">{errors.class}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Gender *</label>
                    <select value={form.gender} onChange={e => set("gender", e.target.value)} className={fieldClass(errors.gender)}>
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Address</label>
                  <input placeholder="e.g. 14 Broad Street, Lagos" value={form.address} onChange={e => set("address", e.target.value)} className={fieldClass()} />
                </div>
              </div>
            </div>

            {/* Section: Parent */}
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Parent / Guardian Information</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Parent/Guardian Name *</label>
                  <input placeholder="e.g. Mrs. Ngozi Okafor" value={form.parentName} onChange={e => set("parentName", e.target.value)} className={fieldClass(errors.parentName)} />
                  {errors.parentName && <p className="text-xs text-red-500 mt-1">{errors.parentName}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number *</label>
                    <input type="tel" placeholder="+234 803 000 0000" value={form.parentPhone} onChange={e => set("parentPhone", e.target.value)} className={fieldClass(errors.parentPhone)} />
                    {errors.parentPhone && <p className="text-xs text-red-500 mt-1">{errors.parentPhone}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                    <input type="email" placeholder="parent@email.com" value={form.parentEmail} onChange={e => set("parentEmail", e.target.value)} className={fieldClass()} />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-3 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl text-sm transition-all">
                Cancel
              </button>
              <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-100 transition-colors">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding…</> : <><Plus className="w-4 h-4" /> Add Student</>}
              </motion.button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Student Detail Drawer ────────────────────────────────────────────────────

function StudentDrawer({ student, onClose, onDelete }: { student: Student; onClose: () => void; onDelete: (id: string) => void }) {
  const avatarColor = AVATAR_COLORS[student.avatar] || "bg-slate-500";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex justify-end" onClick={onClose}>
      <motion.div initial={{ x: 420 }} animate={{ x: 0 }} exit={{ x: 420 }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-black text-slate-900">Student Profile</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"><X className="w-5 h-5" /></button>
        </div>

        {/* Profile */}
        <div className="px-6 py-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 ${avatarColor} rounded-2xl flex items-center justify-center text-white text-xl font-black flex-shrink-0`}>
              {student.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-slate-900 text-lg">{student.name}</h3>
              <p className="text-sm text-slate-500">{student.admissionNo}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <StatusBadge status={student.status} />
                <FeeBadge status={student.feeStatus} />
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <div className="text-lg font-black text-slate-900">{student.class}</div>
              <div className="text-xs text-slate-500 mt-0.5">Class</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <div className={`text-lg font-black ${student.attendanceRate >= 90 ? "text-emerald-600" : student.attendanceRate >= 75 ? "text-amber-600" : "text-red-600"}`}>
                {student.attendanceRate}%
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Attendance</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <div className="text-lg font-black text-slate-900">{student.joinDate}</div>
              <div className="text-xs text-slate-500 mt-0.5">Enrolled</div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="px-6 py-5 space-y-5">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Student Details</p>
            <div className="space-y-3">
              {[
                { icon: Users, label: "Gender", value: student.gender },
                { icon: MapPin, label: "Address", value: student.address || "Not provided" },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">{item.label}</p>
                    <p className="text-sm font-semibold text-slate-800">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Parent / Guardian</p>
            <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
              <p className="font-bold text-slate-900 text-sm">{student.parentName}</p>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone className="w-3.5 h-3.5 text-emerald-500" />{student.parentPhone}
              </div>
              {student.parentEmail && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-blue-500" />{student.parentEmail}
                </div>
              )}
            </div>
          </div>

          {/* Attendance bar */}
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Attendance This Term</p>
            <div className="bg-slate-50 rounded-2xl p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-slate-700">Overall Rate</span>
                <span className={`font-black ${student.attendanceRate >= 90 ? "text-emerald-600" : student.attendanceRate >= 75 ? "text-amber-600" : "text-red-600"}`}>
                  {student.attendanceRate}%
                </span>
              </div>
              <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${student.attendanceRate}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-full rounded-full ${student.attendanceRate >= 90 ? "bg-emerald-500" : student.attendanceRate >= 75 ? "bg-amber-400" : "bg-red-400"}`} />
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {student.attendanceRate >= 90 ? "Excellent attendance record" : student.attendanceRate >= 75 ? "Attendance needs improvement" : "Critical — parent notification sent"}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-2.5 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl text-sm transition-all">
              <Pencil className="w-4 h-4" /> Edit Profile
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-sm transition-all">
              <Mail className="w-4 h-4" /> Contact Parent
            </button>
          </div>
          <button onClick={() => { onDelete(student.id); onClose(); }}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-sm transition-all">
            <Trash2 className="w-4 h-4" /> Remove Student
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 8;

export default function StudentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterFee, setFilterFee] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<keyof Student>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = students.filter(s => {
      const q = search.toLowerCase();
      if (q && !s.name.toLowerCase().includes(q) && !s.admissionNo.toLowerCase().includes(q) && !s.class.toLowerCase().includes(q)) return false;
      if (filterClass !== "All" && s.class !== filterClass) return false;
      if (filterStatus !== "All" && s.status !== filterStatus) return false;
      if (filterFee !== "All" && s.feeStatus !== filterFee) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      const av = String(a[sortField] ?? "").toLowerCase();
      const bv = String(b[sortField] ?? "").toLowerCase();
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return list;
  }, [students, search, filterClass, filterStatus, filterFee, sortField, sortAsc]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const toggleSort = (field: keyof Student) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(true); }
  };

  const stats = {
    total: students.length,
    active: students.filter(s => s.status === "Active").length,
    unpaid: students.filter(s => s.feeStatus === "Unpaid").length,
    lowAttendance: students.filter(s => s.attendanceRate < 75).length,
  };

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
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-black text-slate-900">Student Management</h1>
              <p className="text-xs text-slate-400 mt-0.5">{stats.total} students enrolled · 2024/2025 Session</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl text-sm transition-all">
              <Upload className="w-4 h-4" /> Import CSV
            </button>
            <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl text-sm transition-all">
              <Download className="w-4 h-4" /> Export
            </button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-100 transition-colors">
              <Plus className="w-4 h-4" /> Add Student
            </motion.button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-5">
          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Students", value: stats.total, color: "bg-blue-50 text-blue-700", sub: "Enrolled this session" },
              { label: "Active Students", value: stats.active, color: "bg-emerald-50 text-emerald-700", sub: `${Math.round(stats.active / stats.total * 100)}% of total` },
              { label: "Fee Defaulters", value: stats.unpaid, color: "bg-red-50 text-red-700", sub: "Outstanding balance" },
              { label: "Low Attendance", value: stats.lowAttendance, color: "bg-amber-50 text-amber-700", sub: "Below 75% rate" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                <div className={`text-2xl font-black ${s.color.split(" ")[1]} mb-0.5`}>{s.value}</div>
                <div className="text-sm font-bold text-slate-700">{s.label}</div>
                <div className="text-xs text-slate-400 mt-0.5">{s.sub}</div>
              </motion.div>
            ))}
          </div>

          {/* Search + filters */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
                <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search by name, admission number or class…"
                  className="text-sm text-slate-700 placeholder:text-slate-400 bg-transparent outline-none w-full" />
                {search && <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button>}
              </div>
              <button onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 border-2 rounded-xl text-sm font-bold transition-all ${showFilters ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}>
                <Filter className="w-4 h-4" /> Filter
                {(filterClass !== "All" || filterStatus !== "All" || filterFee !== "All") && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                  className="overflow-hidden">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                    {[
                      { label: "Class", value: filterClass, onChange: (v: string) => { setFilterClass(v); setPage(1); }, options: ["All", ...CLASSES] },
                      { label: "Status", value: filterStatus, onChange: (v: string) => { setFilterStatus(v); setPage(1); }, options: ["All", "Active", "Suspended", "Graduated"] },
                      { label: "Fee Status", value: filterFee, onChange: (v: string) => { setFilterFee(v); setPage(1); }, options: ["All", "Paid", "Partial", "Unpaid"] },
                    ].map(f => (
                      <div key={f.label}>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">{f.label}</label>
                        <select value={f.value} onChange={e => f.onChange(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 outline-none focus:border-emerald-400">
                          {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-2">
                    <button onClick={() => { setFilterClass("All"); setFilterStatus("All"); setFilterFee("All"); setPage(1); }}
                      className="text-xs text-red-500 font-bold hover:underline">Clear filters</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-xs text-slate-400">
              Showing <span className="font-bold text-slate-700">{filtered.length}</span> of{" "}
              <span className="font-bold text-slate-700">{students.length}</span> students
            </p>
          </motion.div>

          {/* Table */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {[
                      { label: "Student", field: "name" as keyof Student },
                      { label: "Class", field: "class" as keyof Student },
                      { label: "Gender", field: "gender" as keyof Student },
                      { label: "Parent", field: "parentName" as keyof Student },
                      { label: "Attendance", field: "attendanceRate" as keyof Student },
                      { label: "Fee Status", field: "feeStatus" as keyof Student },
                      { label: "Status", field: "status" as keyof Student },
                    ].map(col => (
                      <th key={col.label} onClick={() => toggleSort(col.field)}
                        className="text-left px-4 py-3.5 text-xs font-black text-slate-500 uppercase tracking-wide cursor-pointer hover:text-slate-800 select-none whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {col.label}
                          <ArrowUpDown className={`w-3 h-3 transition-colors ${sortField === col.field ? "text-emerald-500" : "text-slate-300"}`} />
                        </div>
                      </th>
                    ))}
                    <th className="px-4 py-3.5 text-xs font-black text-slate-500 uppercase tracking-wide text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginated.map((student, i) => (
                    <motion.tr key={student.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="hover:bg-slate-50/80 transition-colors group">
                      {/* Student */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 ${AVATAR_COLORS[student.avatar] || "bg-slate-400"} rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
                            {student.avatar}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 whitespace-nowrap">{student.name}</p>
                            <p className="text-xs text-slate-400">{student.admissionNo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg text-xs">{student.class}</span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 text-xs font-medium">{student.gender}</td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-medium text-slate-700 whitespace-nowrap">{student.parentName}</p>
                        <p className="text-xs text-slate-400">{student.parentPhone}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${student.attendanceRate >= 90 ? "bg-emerald-500" : student.attendanceRate >= 75 ? "bg-amber-400" : "bg-red-400"}`}
                              style={{ width: `${student.attendanceRate}%` }} />
                          </div>
                          <span className={`text-xs font-black ${student.attendanceRate >= 90 ? "text-emerald-600" : student.attendanceRate >= 75 ? "text-amber-600" : "text-red-600"}`}>
                            {student.attendanceRate}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5"><FeeBadge status={student.feeStatus} /></td>
                      <td className="px-4 py-3.5"><StatusBadge status={student.status} /></td>
                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setSelectedStudent(student)}
                            className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors" title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => setStudents(p => p.filter(s => s.id !== student.id))}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div className="py-20 text-center">
                  <Users className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                  <p className="font-bold text-slate-500">No students found</p>
                  <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3.5 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Page <span className="font-bold">{page}</span> of <span className="font-bold">{totalPages}</span>
                  {" "}· {filtered.length} results
                </p>
                <div className="flex items-center gap-1.5">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                    className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 text-slate-600 transition-all">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${page === p ? "bg-emerald-600 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                      {p}
                    </button>
                  ))}
                  <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                    className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 text-slate-600 transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddModal && (
          <AddStudentModal onClose={() => setShowAddModal(false)}
            onAdd={s => setStudents(p => [s, ...p])} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedStudent && (
          <StudentDrawer student={selectedStudent} onClose={() => setSelectedStudent(null)}
            onDelete={id => setStudents(p => p.filter(s => s.id !== id))} />
        )}
      </AnimatePresence>
    </div>
  );
}