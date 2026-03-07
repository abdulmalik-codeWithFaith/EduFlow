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
  Search,
  Menu,
  X,
  Plus,
  Download,
  Filter,
  Pencil,
  Trash2,
  Eye,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Loader2,
  GraduationCap,
  LogOut,
  UserPlus,
  ArrowUpDown,
  BookMarked,
  Award,
  Clock,
  Upload,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Teacher {
  id: string;
  name: string;
  staffId: string;
  email: string;
  phone: string;
  subjects: string[];
  classes: string[];
  qualification: string;
  gender: "Male" | "Female";
  status: "Active" | "On Leave" | "Suspended";
  joinDate: string;
  avatar: string;
  attendanceRate: number;
}

interface AddTeacherForm {
  name: string;
  staffId: string;
  email: string;
  phone: string;
  gender: string;
  qualification: string;
  subjects: string[];
  classes: string[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ALL_SUBJECTS = ["Mathematics", "English Language", "Physics", "Chemistry", "Biology", "Economics", "Geography", "History", "Civic Education", "Agricultural Science", "Computer Science", "Further Mathematics", "Literature in English", "Government", "Islamic Studies"];
const ALL_CLASSES = ["JSS 1A", "JSS 1B", "JSS 1C", "JSS 2A", "JSS 2B", "JSS 2C", "JSS 3A", "JSS 3B", "SS 1A", "SS 1B", "SS 2A", "SS 2B", "SS 3A", "SS 3B"];
const QUALIFICATIONS = ["B.Ed.", "B.Sc. (Ed)", "M.Ed.", "M.Sc.", "PGDE", "NCE", "Ph.D."];

const MOCK_TEACHERS: Teacher[] = [
  { id: "1", name: "Mr. Emeka Abubakar", staffId: "GFC/TCH/001", email: "emeka.abubakar@school.edu.ng", phone: "+234 803 111 0001", subjects: ["Mathematics", "Further Mathematics"], classes: ["SS 1A", "SS 2A", "SS 3A"], qualification: "M.Sc.", gender: "Male", status: "Active", joinDate: "Jan 2019", avatar: "EA", attendanceRate: 97 },
  { id: "2", name: "Mrs. Ngozi Okonkwo", staffId: "GFC/TCH/002", email: "ngozi.okonkwo@school.edu.ng", phone: "+234 807 222 0002", subjects: ["English Language", "Literature in English"], classes: ["JSS 2A", "JSS 3A", "SS 1B"], qualification: "M.Ed.", gender: "Female", status: "Active", joinDate: "Aug 2017", avatar: "NO", attendanceRate: 94 },
  { id: "3", name: "Mr. Ibrahim Musa", staffId: "GFC/TCH/003", email: "ibrahim.musa@school.edu.ng", phone: "+234 811 333 0003", subjects: ["Physics", "Chemistry"], classes: ["SS 2A", "SS 2B", "SS 3A"], qualification: "B.Sc. (Ed)", gender: "Male", status: "Active", joinDate: "Sep 2020", avatar: "IM", attendanceRate: 91 },
  { id: "4", name: "Dr. Adaobi Eze", staffId: "GFC/TCH/004", email: "adaobi.eze@school.edu.ng", phone: "+234 815 444 0004", subjects: ["Biology", "Agricultural Science"], classes: ["SS 1A", "SS 1B", "SS 3B"], qualification: "Ph.D.", gender: "Female", status: "Active", joinDate: "Mar 2016", avatar: "AE", attendanceRate: 99 },
  { id: "5", name: "Mr. Segun Adeyemi", staffId: "GFC/TCH/005", email: "segun.adeyemi@school.edu.ng", phone: "+234 819 555 0005", subjects: ["Economics", "Government"], classes: ["SS 2B", "SS 3A", "SS 3B"], qualification: "B.Ed.", gender: "Male", status: "On Leave", joinDate: "Jun 2021", avatar: "SA", attendanceRate: 78 },
  { id: "6", name: "Miss Fatima Aliyu", staffId: "GFC/TCH/006", email: "fatima.aliyu@school.edu.ng", phone: "+234 823 666 0006", subjects: ["Computer Science", "Mathematics"], classes: ["JSS 1A", "JSS 1B", "JSS 2B"], qualification: "B.Sc. (Ed)", gender: "Female", status: "Active", joinDate: "Nov 2022", avatar: "FA", attendanceRate: 96 },
  { id: "7", name: "Mr. Chukwu Dike", staffId: "GFC/TCH/007", email: "chukwu.dike@school.edu.ng", phone: "+234 827 777 0007", subjects: ["History", "Civic Education", "Geography"], classes: ["JSS 3A", "JSS 3B", "SS 1A"], qualification: "PGDE", gender: "Male", status: "Active", joinDate: "Apr 2020", avatar: "CD", attendanceRate: 88 },
  { id: "8", name: "Mrs. Blessing Obi", staffId: "GFC/TCH/008", email: "blessing.obi@school.edu.ng", phone: "+234 831 888 0008", subjects: ["English Language", "Civic Education"], classes: ["JSS 1C", "JSS 2C", "JSS 3B"], qualification: "NCE", gender: "Female", status: "Active", joinDate: "Sep 2023", avatar: "BO", attendanceRate: 92 },
  { id: "9", name: "Mr. Tunde Nwosu", staffId: "GFC/TCH/009", email: "tunde.nwosu@school.edu.ng", phone: "+234 835 999 0009", subjects: ["Physics", "Computer Science"], classes: ["JSS 2A", "SS 1A", "SS 1B"], qualification: "M.Sc.", gender: "Male", status: "Suspended", joinDate: "Jan 2022", avatar: "TN", attendanceRate: 61 },
  { id: "10", name: "Miss Grace Hassan", staffId: "GFC/TCH/010", email: "grace.hassan@school.edu.ng", phone: "+234 839 000 0010", subjects: ["Biology", "Chemistry"], classes: ["JSS 1A", "JSS 1B", "JSS 1C"], qualification: "B.Sc. (Ed)", gender: "Female", status: "Active", joinDate: "Aug 2021", avatar: "GH", attendanceRate: 95 },
];

const AVATAR_COLORS: Record<string, string> = {
  "EA": "bg-blue-600", "NO": "bg-violet-600", "IM": "bg-teal-600",
  "AE": "bg-rose-600", "SA": "bg-amber-600", "FA": "bg-emerald-600",
  "CD": "bg-indigo-600", "BO": "bg-pink-600", "TN": "bg-red-600",
  "GH": "bg-cyan-600",
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", active: false },
  { icon: Users, label: "Students", href: "/dashboard/students", active: false },
  { icon: GraduationCap, label: "Teachers", href: "/dashboard/teachers", active: true },
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

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Teacher["status"] }) {
  const map = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    "On Leave": "bg-amber-50 text-amber-700 border-amber-200",
    Suspended: "bg-red-50 text-red-700 border-red-200",
  };
  const dots = { Active: "bg-emerald-500", "On Leave": "bg-amber-500", Suspended: "bg-red-500" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${map[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status]}`} />
      {status}
    </span>
  );
}

// ─── Add Teacher Modal ────────────────────────────────────────────────────────

function MultiSelect({ label, options, selected, onChange }: {
  label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const toggle = (opt: string) => {
    onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt]);
  };
  return (
    <div className="relative">
      <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-left flex items-center justify-between hover:border-emerald-400 transition-all outline-none">
        <span className={selected.length ? "text-slate-900" : "text-slate-400"}>
          {selected.length ? selected.slice(0, 2).join(", ") + (selected.length > 2 ? ` +${selected.length - 2} more` : "") : `Select ${label.toLowerCase()}…`}
        </span>
        <ChevronLeft className={`w-4 h-4 text-slate-400 transition-transform ${open ? "-rotate-90" : "rotate-180"}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="absolute z-20 top-full mt-1 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-xl max-h-44 overflow-y-auto">
            {options.map(opt => (
              <button key={opt} type="button" onClick={() => toggle(opt)}
                className="w-full flex items-center justify-between px-3.5 py-2 hover:bg-slate-50 text-sm text-slate-700 transition-colors">
                {opt}
                {selected.includes(opt) && <Check className="w-4 h-4 text-emerald-600" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AddTeacherModal({ onClose, onAdd }: { onClose: () => void; onAdd: (t: Teacher) => void }) {
  const empty: AddTeacherForm = { name: "", staffId: "", email: "", phone: "", gender: "", qualification: "", subjects: [], classes: [] };
  const [form, setForm] = useState<AddTeacherForm>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof AddTeacherForm, string>>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: keyof AddTeacherForm, v: string | string[]) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => ({ ...p, [k]: undefined }));
  };

  const validate = () => {
    const e: Partial<Record<keyof AddTeacherForm, string>> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.staffId.trim()) e.staffId = "Required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.gender) e.gender = "Required";
    if (!form.qualification) e.qualification = "Required";
    if (form.subjects.length === 0) e.subjects = "Select at least one subject";
    if (form.classes.length === 0) e.classes = "Assign at least one class";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const initials = form.name.replace(/^(Mr\.|Mrs\.|Miss|Dr\.|Prof\.)\s*/i, "").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
    const newTeacher: Teacher = {
      id: Date.now().toString(), name: form.name, staffId: form.staffId,
      email: form.email, phone: form.phone, subjects: form.subjects,
      classes: form.classes, qualification: form.qualification,
      gender: form.gender as "Male" | "Female", status: "Active",
      joinDate: new Date().toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
      avatar: initials, attendanceRate: 100,
    };
    setLoading(false);
    setDone(true);
    setTimeout(() => { onAdd(newTeacher); onClose(); }, 1000);
  };

  const fc = (err?: string) =>
    `w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 bg-white outline-none transition-all ${err ? "border-red-300 ring-2 ring-red-100" : "border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"}`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 20 }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-black text-slate-900">Add New Teacher</h2>
              <p className="text-xs text-slate-400">Fill in the teacher&apos;s details below</p>
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
            <h3 className="font-black text-slate-900 text-lg mb-1">Teacher Added!</h3>
            <p className="text-sm text-slate-500">{form.name} has been added to the staff.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5" noValidate>
            {/* Personal info */}
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Personal Information</p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name *</label>
                    <input placeholder="e.g. Mr. Emeka Abubakar" value={form.name} onChange={e => set("name", e.target.value)} className={fc(errors.name)} />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Staff ID *</label>
                    <input placeholder="e.g. GFC/TCH/011" value={form.staffId} onChange={e => set("staffId", e.target.value)} className={fc(errors.staffId)} />
                    {errors.staffId && <p className="text-xs text-red-500 mt-1">{errors.staffId}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address *</label>
                    <input type="email" placeholder="name@school.edu.ng" value={form.email} onChange={e => set("email", e.target.value)} className={fc(errors.email)} />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number *</label>
                    <input type="tel" placeholder="+234 803 000 0000" value={form.phone} onChange={e => set("phone", e.target.value)} className={fc(errors.phone)} />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Gender *</label>
                    <select value={form.gender} onChange={e => set("gender", e.target.value)} className={fc(errors.gender)}>
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Qualification *</label>
                    <select value={form.qualification} onChange={e => set("qualification", e.target.value)} className={fc(errors.qualification)}>
                      <option value="">Select qualification</option>
                      {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                    </select>
                    {errors.qualification && <p className="text-xs text-red-500 mt-1">{errors.qualification}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Assignments */}
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Class & Subject Assignment</p>
              <div className="space-y-3">
                <div>
                  <MultiSelect label="Subjects *" options={ALL_SUBJECTS} selected={form.subjects} onChange={v => set("subjects", v)} />
                  {errors.subjects && <p className="text-xs text-red-500 mt-1">{errors.subjects}</p>}
                </div>
                <div>
                  <MultiSelect label="Classes *" options={ALL_CLASSES} selected={form.classes} onChange={v => set("classes", v)} />
                  {errors.classes && <p className="text-xs text-red-500 mt-1">{errors.classes}</p>}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-3 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl text-sm transition-all">
                Cancel
              </button>
              <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-colors">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding…</> : <><Plus className="w-4 h-4" /> Add Teacher</>}
              </motion.button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Teacher Detail Drawer ────────────────────────────────────────────────────

function TeacherDrawer({ teacher, onClose, onDelete }: { teacher: Teacher; onClose: () => void; onDelete: (id: string) => void }) {
  const color = AVATAR_COLORS[teacher.avatar] || "bg-slate-600";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex justify-end" onClick={onClose}>
      <motion.div initial={{ x: 420 }} animate={{ x: 0 }} exit={{ x: 420 }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-black text-slate-900">Teacher Profile</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"><X className="w-5 h-5" /></button>
        </div>

        {/* Header */}
        <div className="px-6 py-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center text-white text-xl font-black flex-shrink-0`}>
              {teacher.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-slate-900 text-lg leading-tight">{teacher.name}</h3>
              <p className="text-sm text-slate-500">{teacher.staffId}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <StatusBadge status={teacher.status} />
                <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-full border border-blue-200">
                  {teacher.qualification}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <div className="text-lg font-black text-slate-900">{teacher.classes.length}</div>
              <div className="text-xs text-slate-500 mt-0.5">Classes</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <div className="text-lg font-black text-slate-900">{teacher.subjects.length}</div>
              <div className="text-xs text-slate-500 mt-0.5">Subjects</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <div className={`text-lg font-black ${teacher.attendanceRate >= 90 ? "text-emerald-600" : teacher.attendanceRate >= 75 ? "text-amber-600" : "text-red-600"}`}>
                {teacher.attendanceRate}%
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Attendance</div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="px-6 py-5 space-y-5">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Contact</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-slate-500" />
                </div>
                <span className="text-sm text-slate-700">{teacher.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-slate-500" />
                </div>
                <span className="text-sm text-slate-700">{teacher.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-slate-500" />
                </div>
                <span className="text-sm text-slate-700">Joined {teacher.joinDate}</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Subjects Teaching</p>
            <div className="flex flex-wrap gap-2">
              {teacher.subjects.map(s => (
                <span key={s} className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-lg">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Assigned Classes</p>
            <div className="flex flex-wrap gap-2">
              {teacher.classes.map(c => (
                <span key={c} className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-lg">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Attendance This Term</p>
            <div className="bg-slate-50 rounded-2xl p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-slate-700">Punctuality Rate</span>
                <span className={`font-black ${teacher.attendanceRate >= 90 ? "text-emerald-600" : teacher.attendanceRate >= 75 ? "text-amber-600" : "text-red-600"}`}>
                  {teacher.attendanceRate}%
                </span>
              </div>
              <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${teacher.attendanceRate}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-full rounded-full ${teacher.attendanceRate >= 90 ? "bg-emerald-500" : teacher.attendanceRate >= 75 ? "bg-amber-400" : "bg-red-400"}`} />
              </div>
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
              <Mail className="w-4 h-4" /> Send Email
            </button>
          </div>
          <button onClick={() => { onDelete(teacher.id); onClose(); }}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-sm transition-all">
            <Trash2 className="w-4 h-4" /> Remove Teacher
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 8;

export default function TeachersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>(MOCK_TEACHERS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterSubject, setFilterSubject] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<keyof Teacher>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const filtered = useMemo(() => {
    let list = teachers.filter(t => {
      const q = search.toLowerCase();
      if (q && !t.name.toLowerCase().includes(q) && !t.staffId.toLowerCase().includes(q) && !t.email.toLowerCase().includes(q)) return false;
      if (filterStatus !== "All" && t.status !== filterStatus) return false;
      if (filterSubject !== "All" && !t.subjects.includes(filterSubject)) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      const av = String(a[sortField] ?? "").toLowerCase();
      const bv = String(b[sortField] ?? "").toLowerCase();
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return list;
  }, [teachers, search, filterStatus, filterSubject, sortField, sortAsc]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const toggleSort = (field: keyof Teacher) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(true); }
  };

  const stats = {
    total: teachers.length,
    active: teachers.filter(t => t.status === "Active").length,
    onLeave: teachers.filter(t => t.status === "On Leave").length,
    totalSubjects: [...new Set(teachers.flatMap(t => t.subjects))].length,
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
              <h1 className="text-lg font-black text-slate-900">Teacher Management</h1>
              <p className="text-xs text-slate-400 mt-0.5">{stats.total} staff members · 2024/2025 Session</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl text-sm transition-all">
              <Download className="w-4 h-4" /> Export
            </button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-100 transition-colors">
              <Plus className="w-4 h-4" /> Add Teacher
            </motion.button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Teachers", value: stats.total, icon: GraduationCap, color: "bg-blue-100 text-blue-600", sub: "On staff" },
              { label: "Active", value: stats.active, icon: CheckCircle, color: "bg-emerald-100 text-emerald-600", sub: "Currently teaching" },
              { label: "On Leave", value: stats.onLeave, icon: Clock, color: "bg-amber-100 text-amber-600", sub: "Temporarily away" },
              { label: "Subjects Covered", value: stats.totalSubjects, icon: BookMarked, color: "bg-violet-100 text-violet-600", sub: "Across all classes" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center gap-4">
                <div className={`w-12 h-12 ${s.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">{s.value}</div>
                  <div className="text-xs font-bold text-slate-600">{s.label}</div>
                  <div className="text-xs text-slate-400">{s.sub}</div>
                </div>
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
                  placeholder="Search by name, staff ID or email…"
                  className="text-sm text-slate-700 placeholder:text-slate-400 bg-transparent outline-none w-full" />
                {search && <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button>}
              </div>
              <button onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 border-2 rounded-xl text-sm font-bold transition-all ${showFilters ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}>
                <Filter className="w-4 h-4" /> Filter
              </button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {[
                      { label: "Status", value: filterStatus, onChange: (v: string) => { setFilterStatus(v); setPage(1); }, options: ["All", "Active", "On Leave", "Suspended"] },
                      { label: "Subject", value: filterSubject, onChange: (v: string) => { setFilterSubject(v); setPage(1); }, options: ["All", ...ALL_SUBJECTS.slice(0, 8)] },
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
                </motion.div>
              )}
            </AnimatePresence>
            <p className="text-xs text-slate-400">
              Showing <span className="font-bold text-slate-700">{filtered.length}</span> of{" "}
              <span className="font-bold text-slate-700">{teachers.length}</span> teachers
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
                      { label: "Teacher", field: "name" as keyof Teacher },
                      { label: "Subjects", field: "subjects" as keyof Teacher },
                      { label: "Classes", field: "classes" as keyof Teacher },
                      { label: "Qualification", field: "qualification" as keyof Teacher },
                      { label: "Attendance", field: "attendanceRate" as keyof Teacher },
                      { label: "Status", field: "status" as keyof Teacher },
                    ].map(col => (
                      <th key={col.label} onClick={() => toggleSort(col.field)}
                        className="text-left px-4 py-3.5 text-xs font-black text-slate-500 uppercase tracking-wide cursor-pointer hover:text-slate-800 select-none whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {col.label}
                          <ArrowUpDown className={`w-3 h-3 ${sortField === col.field ? "text-emerald-500" : "text-slate-300"}`} />
                        </div>
                      </th>
                    ))}
                    <th className="px-4 py-3.5 text-xs font-black text-slate-500 uppercase tracking-wide text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginated.map((teacher, i) => (
                    <motion.tr key={teacher.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="hover:bg-slate-50/80 transition-colors">
                      {/* Teacher */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 ${AVATAR_COLORS[teacher.avatar] || "bg-slate-400"} rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
                            {teacher.avatar}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 whitespace-nowrap">{teacher.name}</p>
                            <p className="text-xs text-slate-400">{teacher.staffId} · {teacher.email}</p>
                          </div>
                        </div>
                      </td>
                      {/* Subjects */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {teacher.subjects.slice(0, 2).map(s => (
                            <span key={s} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-semibold">{s}</span>
                          ))}
                          {teacher.subjects.length > 2 && (
                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">+{teacher.subjects.length - 2}</span>
                          )}
                        </div>
                      </td>
                      {/* Classes */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {teacher.classes.slice(0, 2).map(c => (
                            <span key={c} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-semibold">{c}</span>
                          ))}
                          {teacher.classes.length > 2 && (
                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">+{teacher.classes.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">{teacher.qualification}</span>
                      </td>
                      {/* Attendance */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${teacher.attendanceRate >= 90 ? "bg-emerald-500" : teacher.attendanceRate >= 75 ? "bg-amber-400" : "bg-red-400"}`}
                              style={{ width: `${teacher.attendanceRate}%` }} />
                          </div>
                          <span className={`text-xs font-black ${teacher.attendanceRate >= 90 ? "text-emerald-600" : teacher.attendanceRate >= 75 ? "text-amber-600" : "text-red-600"}`}>
                            {teacher.attendanceRate}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5"><StatusBadge status={teacher.status} /></td>
                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setSelectedTeacher(teacher)}
                            className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => setTeachers(p => p.filter(t => t.id !== teacher.id))}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors">
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
                  <GraduationCap className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                  <p className="font-bold text-slate-500">No teachers found</p>
                  <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3.5 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Page <span className="font-bold">{page}</span> of <span className="font-bold">{totalPages}</span>
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

      <AnimatePresence>
        {showAddModal && (
          <AddTeacherModal onClose={() => setShowAddModal(false)}
            onAdd={t => setTeachers(p => [t, ...p])} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedTeacher && (
          <TeacherDrawer teacher={selectedTeacher} onClose={() => setSelectedTeacher(null)}
            onDelete={id => setTeachers(p => p.filter(t => t.id !== id))} />
        )}
      </AnimatePresence>
    </div>
  );
}