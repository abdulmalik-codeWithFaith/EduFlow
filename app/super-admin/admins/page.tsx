"use client";
// ─── ADMINS PAGE (/super-admin/admins) ───────────────────────────────────────

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Search, Users, Shield, CheckCircle, Ban, Mail,
  Phone, Clock, Plus, Eye, RefreshCw, Key, Loader2, AlertTriangle,
} from "lucide-react";
import { SuperSidebar } from "../page";

type AdminStatus = "Active" | "Suspended" | "Invited";

interface AdminRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  school: string;
  schoolId: string;
  status: AdminStatus;
  joinedAt: string;
  lastLogin: string;
  role: string;
}

const ADMINS: AdminRecord[] = [
  { id:"1",  name:"Dr. Chidinma Okonkwo",  email:"chidinma@greenfield.edu.ng",   phone:"+234 803 456 7890", school:"Greenfield College",        schoolId:"1",  status:"Active",    joinedAt:"Jan 2024", lastLogin:"Today, 9:14 AM",    role:"School Admin" },
  { id:"2",  name:"Prof. Adamu Bello",      email:"adamu@royalacademy.edu.ng",     phone:"+234 812 234 5678", school:"Royal Academy",             schoolId:"2",  status:"Active",    joinedAt:"Mar 2024", lastLogin:"Today, 8:30 AM",    role:"School Admin" },
  { id:"3",  name:"Mrs. Emeka Eze",         email:"emeka@sunshine.edu.ng",         phone:"+234 803 777 8899", school:"Sunshine International",    schoolId:"3",  status:"Active",    joinedAt:"Sep 2024", lastLogin:"Today, 10:02 AM",   role:"School Admin" },
  { id:"4",  name:"Mr. Ibrahim Hassan",     email:"ibrahim@heritage.edu.ng",       phone:"+234 814 555 3421", school:"Heritage High School",      schoolId:"4",  status:"Active",    joinedAt:"Feb 2025", lastLogin:"Yesterday",         role:"School Admin" },
  { id:"5",  name:"Dr. Funmi Williams",     email:"funmi@premier.edu.ng",          phone:"+234 805 999 1234", school:"Premier Academy",           schoolId:"5",  status:"Active",    joinedAt:"Jun 2024", lastLogin:"Today, 7:55 AM",    role:"School Admin" },
  { id:"6",  name:"Mr. Tunde Adeyemi",      email:"tunde@evergreen.edu.ng",        phone:"+234 816 123 4567", school:"Evergreen Academy",         schoolId:"6",  status:"Suspended", joinedAt:"May 2024", lastLogin:"3 days ago",        role:"School Admin" },
  { id:"7",  name:"Mrs. Blessing Okonkwo",  email:"blessing@crown.edu.ng",         phone:"+234 803 246 8000", school:"Crown Excellence",          schoolId:"7",  status:"Active",    joinedAt:"Aug 2024", lastLogin:"Today, 8:45 AM",    role:"School Admin" },
  { id:"8",  name:"Prof. Chidi Nwosu",      email:"chidi@destiny.edu.ng",          phone:"+234 807 345 6789", school:"Destiny International",     schoolId:"8",  status:"Active",    joinedAt:"Apr 2024", lastLogin:"Today, 9:38 AM",    role:"School Admin" },
  { id:"9",  name:"Dr. Obiageli Ike",       email:"obiageli@legacy.edu.ng",        phone:"+234 803 888 2222", school:"Legacy College",            schoolId:"9",  status:"Active",    joinedAt:"Nov 2024", lastLogin:"Yesterday",         role:"School Admin" },
  { id:"10", name:"Mr. Akin Afolabi",       email:"akin@prestige.edu.ng",          phone:"+234 813 654 3210", school:"Prestige Academy",          schoolId:"10", status:"Invited",   joinedAt:"Mar 2025", lastLogin:"Never",             role:"School Admin" },
];

const STATUS_CFG: Record<AdminStatus, { color:string; bg:string; border:string; icon:React.ElementType }> = {
  Active:    { color:"text-emerald-700", bg:"bg-emerald-50", border:"border-emerald-200", icon:CheckCircle },
  Suspended: { color:"text-red-700",     bg:"bg-red-50",     border:"border-red-200",     icon:Ban },
  Invited:   { color:"text-blue-700",    bg:"bg-blue-50",    border:"border-blue-200",    icon:Mail },
};

function ResetPwdModal({ admin, onClose }: { admin: AdminRecord; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const handle = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false); setDone(true);
  };
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale:0.94, y:16 }} animate={{ scale:1, y:0 }} exit={{ scale:0.94 }}
        transition={{ type:"spring", damping:28, stiffness:300 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
        {done ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="font-black text-zinc-900 mb-1">Reset Link Sent!</h3>
            <p className="text-sm text-zinc-500">Password reset link sent to <span className="font-bold">{admin.email}</span></p>
            <button onClick={onClose} className="mt-4 px-6 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-xl text-sm transition-all">Close</button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Key className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-black text-zinc-900">Reset Password</h3>
                <p className="text-xs text-zinc-400">Send reset link to admin</p>
              </div>
            </div>
            <p className="text-sm text-zinc-600 mb-5">A password reset link will be sent to <span className="font-bold text-zinc-900">{admin.email}</span>. The link expires in 24 hours.</p>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-2.5 border-2 border-zinc-200 text-zinc-700 font-bold rounded-xl text-sm hover:bg-zinc-50 transition-all">Cancel</button>
              <motion.button onClick={handle} disabled={loading} whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-70 text-white font-black rounded-xl text-sm flex items-center justify-center gap-2 transition-colors shadow-md">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Sending…</> : <><Mail className="w-4 h-4" />Send Link</>}
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function SuperAdminAdminsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [admins, setAdmins] = useState<AdminRecord[]>(ADMINS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<AdminStatus | "All">("All");
  const [resetting, setResetting] = useState<AdminRecord | null>(null);

  const filtered = useMemo(() => {
    let list = [...admins];
    if (search) list = list.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.school.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase()));
    if (filterStatus !== "All") list = list.filter(a => a.status === filterStatus);
    return list;
  }, [admins, search, filterStatus]);

  const toggle = (id: string) =>
    setAdmins(prev => prev.map(a => a.id === id ? { ...a, status: a.status === "Active" ? "Suspended" : "Active" } : a));

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      <div className="hidden lg:flex flex-shrink-0"><SuperSidebar active="/super-admin/admins" /></div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="fixed inset-0 bg-black/70 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.div initial={{ x:-280 }} animate={{ x:0 }} exit={{ x:-280 }}
              transition={{ type:"spring", damping:28, stiffness:260 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-50 lg:hidden">
              <SuperSidebar active="/super-admin/admins" mobile onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-zinc-100 flex-shrink-0 gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-zinc-100 text-zinc-500"><Menu className="w-5 h-5" /></button>
            <div>
              <h1 className="text-lg font-black text-zinc-900">School Admins</h1>
              <p className="text-xs text-zinc-400 mt-0.5">{admins.length} admins across all schools</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-black rounded-xl text-sm shadow-md transition-colors">
            <Plus className="w-4 h-4" /> Invite Admin
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-5">

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label:"Active",   value:admins.filter(a=>a.status==="Active").length,    color:"bg-emerald-50 border-emerald-200 text-emerald-800" },
              { label:"Invited",  value:admins.filter(a=>a.status==="Invited").length,   color:"bg-blue-50 border-blue-200 text-blue-800" },
              { label:"Suspended",value:admins.filter(a=>a.status==="Suspended").length, color:"bg-red-50 border-red-200 text-red-800" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
                className={`border-2 rounded-2xl p-4 text-center shadow-sm ${s.color}`}>
                <p className="text-3xl font-black">{s.value}</p>
                <p className="text-xs font-bold mt-1 opacity-80">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white border border-zinc-100 rounded-2xl p-4 shadow-sm flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2.5 bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 flex-1 min-w-48">
              <Search className="w-4 h-4 text-zinc-400 flex-shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, school, email…"
                className="text-sm bg-transparent outline-none text-zinc-700 placeholder:text-zinc-400 w-full" />
              {search && <button onClick={() => setSearch("")}><X className="w-4 h-4 text-zinc-400" /></button>}
            </div>
            <div className="flex gap-1 bg-zinc-100 p-1 rounded-xl">
              {(["All","Active","Invited","Suspended"] as const).map(f => (
                <button key={f} onClick={() => setFilterStatus(f as AdminStatus | "All")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterStatus===f?"bg-white text-zinc-900 shadow-sm":"text-zinc-500"}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Admins table */}
          <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-100">
                    {["Admin","School","Contact","Status","Last Login","Joined","Actions"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-black text-zinc-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {filtered.map((a, i) => {
                    const cfg = STATUS_CFG[a.status];
                    return (
                      <motion.tr key={a.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.03 }}
                        className="hover:bg-zinc-50/60 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center text-violet-700 text-xs font-black flex-shrink-0">
                              {a.name.split(" ").slice(-2).map(n=>n[0]).join("")}
                            </div>
                            <div>
                              <p className="font-black text-zinc-900 text-sm whitespace-nowrap">{a.name}</p>
                              <p className="text-xs text-zinc-400">{a.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs font-semibold text-zinc-600 whitespace-nowrap">{a.school}</td>
                        <td className="px-4 py-3">
                          <p className="text-xs text-zinc-600 font-medium">{a.email}</p>
                          <p className="text-xs text-zinc-400">{a.phone}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                            <cfg.icon className="w-3 h-3" />{a.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-zinc-400 whitespace-nowrap">{a.lastLogin}</td>
                        <td className="px-4 py-3 text-xs text-zinc-400 whitespace-nowrap">{a.joinedAt}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => setResetting(a)}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-600 hover:bg-amber-50 transition-colors" title="Reset password">
                              <Key className="w-4 h-4" />
                            </button>
                            <button onClick={() => toggle(a.id)}
                              className={`p-1.5 rounded-lg transition-colors ${a.status === "Active" ? "text-zinc-400 hover:text-red-600 hover:bg-red-50" : "text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50"}`}
                              title={a.status === "Active" ? "Suspend" : "Reactivate"}>
                              {a.status === "Active" ? <Ban className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                            </button>
                            <button className="p-1.5 rounded-lg text-zinc-400 hover:text-violet-600 hover:bg-violet-50 transition-colors" title="Send email">
                              <Mail className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-16 text-center">
                  <Users className="w-12 h-12 text-zinc-200 mx-auto mb-3" />
                  <p className="font-bold text-zinc-400">No admins found</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {resetting && <ResetPwdModal admin={resetting} onClose={() => setResetting(null)} />}
      </AnimatePresence>
    </div>
  );
}