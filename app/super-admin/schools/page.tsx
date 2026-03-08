"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Search, School, CheckCircle, XCircle, Clock, AlertTriangle,
  MoreHorizontal, Filter, ChevronDown, Eye, Ban, RefreshCw, Plus,
  Users, CreditCard, Mail, Phone, MapPin, Globe, ArrowUpDown,
  Loader2, Shield, ExternalLink,
} from "lucide-react";
import { SuperSidebar } from "../page";

// ─── Types & Data ─────────────────────────────────────────────────────────────

type SchoolStatus = "Active" | "Trial" | "Suspended" | "Pending";
type Plan = "Enterprise" | "Professional" | "Free Trial";

interface SchoolRecord {
  id: string;
  name: string;
  state: string;
  lga: string;
  email: string;
  phone: string;
  admin: string;
  plan: Plan;
  status: SchoolStatus;
  students: number;
  teachers: number;
  joined: string;
  lastActive: string;
  mrr: number;
  logo: string;
}

const SCHOOLS: SchoolRecord[] = [
  { id:"1",  name:"Greenfield College",        state:"Lagos",   lga:"Lekki",       email:"info@greenfield.edu.ng",    phone:"+234 1 234 5678",  admin:"Dr. C. Okonkwo",  plan:"Professional", status:"Active",    students:1284, teachers:48,  joined:"Jan 2024", lastActive:"Today",    mrr:180000, logo:"GC" },
  { id:"2",  name:"Royal Academy",             state:"Abuja",   lga:"Garki",       email:"admin@royalacademy.edu.ng", phone:"+234 9 876 5432",  admin:"Prof. A. Bello",  plan:"Enterprise",   status:"Active",    students:2140, teachers:82,  joined:"Mar 2024", lastActive:"Today",    mrr:350000, logo:"RA" },
  { id:"3",  name:"Sunshine International",    state:"Enugu",   lga:"GRA",         email:"info@sunshine.edu.ng",      phone:"+234 42 330 215",  admin:"Mrs. E. Eze",     plan:"Professional", status:"Active",    students:890,  teachers:34,  joined:"Sep 2024", lastActive:"Today",    mrr:180000, logo:"SI" },
  { id:"4",  name:"Heritage High School",      state:"Kano",    lga:"Nassarawa",   email:"admin@heritage.edu.ng",     phone:"+234 64 660 812",  admin:"Mr. I. Hassan",   plan:"Free Trial",   status:"Trial",     students:340,  teachers:14,  joined:"Feb 2025", lastActive:"Yesterday",mrr:0,      logo:"HH" },
  { id:"5",  name:"Premier Academy",           state:"Rivers",  lga:"Port Harcourt",email:"info@premier.edu.ng",      phone:"+234 84 230 456",  admin:"Dr. F. Williams", plan:"Professional", status:"Active",    students:1560, teachers:58,  joined:"Jun 2024", lastActive:"Today",    mrr:180000, logo:"PA" },
  { id:"6",  name:"Evergreen Academy",         state:"Ogun",    lga:"Sagamu",      email:"admin@evergreen.edu.ng",    phone:"+234 37 440 789",  admin:"Mr. T. Adeyemi",  plan:"Professional", status:"Suspended", students:720,  teachers:28,  joined:"May 2024", lastActive:"3 days ago",mrr:0,      logo:"EA" },
  { id:"7",  name:"Crown Excellence",          state:"Oyo",     lga:"Ibadan North",email:"info@crown.edu.ng",         phone:"+234 2 888 1234",  admin:"Mrs. B. Okonkwo", plan:"Professional", status:"Active",    students:1020, teachers:38,  joined:"Aug 2024", lastActive:"Today",    mrr:180000, logo:"CE" },
  { id:"8",  name:"Destiny International",     state:"Anambra", lga:"Awka",        email:"admin@destiny.edu.ng",      phone:"+234 48 550 312",  admin:"Prof. C. Nwosu",  plan:"Enterprise",   status:"Active",    students:1890, teachers:71,  joined:"Apr 2024", lastActive:"Today",    mrr:350000, logo:"DI" },
  { id:"9",  name:"Legacy College",            state:"Delta",   lga:"Asaba",       email:"info@legacy.edu.ng",        phone:"+234 56 230 567",  admin:"Dr. O. Ike",      plan:"Professional", status:"Active",    students:980,  teachers:36,  joined:"Nov 2024", lastActive:"Today",    mrr:180000, logo:"LC" },
  { id:"10", name:"Prestige Academy",          state:"Kwara",   lga:"Ilorin",      email:"admin@prestige.edu.ng",     phone:"+234 31 220 891",  admin:"Mr. A. Afolabi",  plan:"Free Trial",   status:"Pending",   students:0,    teachers:0,   joined:"Mar 2025", lastActive:"Never",    mrr:0,      logo:"PA" },
];

const STATUS_CONFIG: Record<SchoolStatus, { color:string; bg:string; border:string; icon: React.ElementType }> = {
  Active:    { color:"text-emerald-700", bg:"bg-emerald-50", border:"border-emerald-200", icon:CheckCircle },
  Trial:     { color:"text-amber-700",   bg:"bg-amber-50",   border:"border-amber-200",   icon:Clock },
  Suspended: { color:"text-red-700",     bg:"bg-red-50",     border:"border-red-200",     icon:Ban },
  Pending:   { color:"text-blue-700",    bg:"bg-blue-50",    border:"border-blue-200",    icon:RefreshCw },
};

const PLAN_CONFIG: Record<Plan, { color:string; bg:string; border:string }> = {
  Enterprise:   { color:"text-emerald-700", bg:"bg-emerald-50", border:"border-emerald-200" },
  Professional: { color:"text-violet-700",  bg:"bg-violet-50",  border:"border-violet-200" },
  "Free Trial": { color:"text-amber-700",   bg:"bg-amber-50",   border:"border-amber-200" },
};

// ─── School Detail Drawer ─────────────────────────────────────────────────────

function SchoolDrawer({ school, onClose, onSuspend, onActivate, onApprove }: {
  school: SchoolRecord; onClose: () => void;
  onSuspend:(id:string)=>void; onActivate:(id:string)=>void; onApprove:(id:string)=>void;
}) {
  const sCfg = STATUS_CONFIG[school.status];
  const pCfg = PLAN_CONFIG[school.plan];

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 bg-black/60 z-50 flex justify-end" onClick={onClose}>
      <motion.div initial={{ x:480 }} animate={{ x:0 }} exit={{ x:480 }}
        transition={{ type:"spring", damping:28, stiffness:260 }}
        className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}>

        <div className="sticky top-0 bg-white border-b border-zinc-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-black text-zinc-900">School Details</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-zinc-100 text-zinc-500"><X className="w-5 h-5" /></button>
        </div>

        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-100 bg-zinc-50">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center text-violet-700 text-lg font-black flex-shrink-0">
              {school.logo}
            </div>
            <div>
              <h3 className="font-black text-zinc-900 text-lg">{school.name}</h3>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${sCfg.color} ${sCfg.bg} ${sCfg.border} flex items-center gap-1`}>
                  <sCfg.icon className="w-3 h-3" />{school.status}
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${pCfg.color} ${pCfg.bg} ${pCfg.border}`}>{school.plan}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label:"Students",  value:school.students.toLocaleString() },
              { label:"Teachers",  value:school.teachers },
              { label:"MRR",       value:school.mrr > 0 ? `₦${(school.mrr/1000).toFixed(0)}K` : "₦0" },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl p-3 text-center border border-zinc-100">
                <p className="text-xl font-black text-zinc-900">{s.value}</p>
                <p className="text-xs text-zinc-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="px-6 py-5 space-y-4 border-b border-zinc-100">
          <h4 className="font-black text-zinc-700 text-xs uppercase tracking-widest">School Information</h4>
          {[
            { icon: Shield,   label:"Admin",       value:school.admin },
            { icon: Mail,     label:"Email",        value:school.email },
            { icon: Phone,    label:"Phone",        value:school.phone },
            { icon: MapPin,   label:"Location",     value:`${school.lga}, ${school.state}` },
            { icon: Clock,    label:"Joined",       value:school.joined },
            { icon: RefreshCw,label:"Last Active",  value:school.lastActive },
          ].map(row => (
            <div key={row.label} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <row.icon className="w-3.5 h-3.5 text-zinc-500" />
              </div>
              <div>
                <p className="text-xs text-zinc-400">{row.label}</p>
                <p className="text-sm font-bold text-zinc-800">{row.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="px-6 py-5 space-y-2">
          <h4 className="font-black text-zinc-700 text-xs uppercase tracking-widest mb-3">Actions</h4>
          <button className="w-full flex items-center gap-2 px-4 py-3 bg-violet-600 hover:bg-violet-700 text-white font-black rounded-xl text-sm transition-colors shadow-md">
            <ExternalLink className="w-4 h-4" /> View as School Admin
          </button>
          {school.status === "Active" && (
            <button onClick={() => { onSuspend(school.id); onClose(); }}
              className="w-full flex items-center gap-2 px-4 py-3 border-2 border-red-200 text-red-700 hover:bg-red-50 font-bold rounded-xl text-sm transition-all">
              <Ban className="w-4 h-4" /> Suspend School
            </button>
          )}
          {school.status === "Suspended" && (
            <button onClick={() => { onActivate(school.id); onClose(); }}
              className="w-full flex items-center gap-2 px-4 py-3 border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-bold rounded-xl text-sm transition-all">
              <CheckCircle className="w-4 h-4" /> Reactivate School
            </button>
          )}
          {school.status === "Pending" && (
            <button onClick={() => { onApprove(school.id); onClose(); }}
              className="w-full flex items-center gap-2 px-4 py-3 border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-bold rounded-xl text-sm transition-all">
              <CheckCircle className="w-4 h-4" /> Approve & Activate
            </button>
          )}
          <button className="w-full flex items-center gap-2 px-4 py-3 border-2 border-zinc-200 text-zinc-600 hover:bg-zinc-50 font-bold rounded-xl text-sm transition-all">
            <Mail className="w-4 h-4" /> Send Email to Admin
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SuperAdminSchoolsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [schools, setSchools] = useState<SchoolRecord[]>(SCHOOLS);
  const [viewing, setViewing] = useState<SchoolRecord | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<SchoolStatus | "All">("All");
  const [filterPlan, setFilterPlan] = useState<Plan | "All">("All");
  const [sortField, setSortField] = useState<"name"|"students"|"mrr">("students");
  const [sortAsc, setSortAsc] = useState(false);

  const updateStatus = (id:string, status:SchoolStatus) =>
    setSchools(prev => prev.map(s => s.id === id ? { ...s, status } : s));

  const filtered = useMemo(() => {
    let list = [...schools];
    if (search) list = list.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.state.toLowerCase().includes(search.toLowerCase()) || s.admin.toLowerCase().includes(search.toLowerCase()));
    if (filterStatus !== "All") list = list.filter(s => s.status === filterStatus);
    if (filterPlan !== "All") list = list.filter(s => s.plan === filterPlan);
    list.sort((a, b) => {
      const av = sortField === "name" ? a.name : sortField === "students" ? a.students : a.mrr;
      const bv = sortField === "name" ? b.name : sortField === "students" ? b.students : b.mrr;
      return sortAsc ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return list;
  }, [schools, search, filterStatus, filterPlan, sortField, sortAsc]);

  const counts = {
    total: schools.length,
    active: schools.filter(s => s.status === "Active").length,
    trial: schools.filter(s => s.status === "Trial").length,
    pending: schools.filter(s => s.status === "Pending").length,
    suspended: schools.filter(s => s.status === "Suspended").length,
  };

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      <div className="hidden lg:flex flex-shrink-0"><SuperSidebar active="/super-admin/schools" /></div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="fixed inset-0 bg-black/70 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.div initial={{ x:-280 }} animate={{ x:0 }} exit={{ x:-280 }}
              transition={{ type:"spring", damping:28, stiffness:260 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-50 lg:hidden">
              <SuperSidebar active="/super-admin/schools" mobile onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-zinc-100 flex-shrink-0 gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-zinc-100 text-zinc-500"><Menu className="w-5 h-5" /></button>
            <div>
              <h1 className="text-lg font-black text-zinc-900">Schools Management</h1>
              <p className="text-xs text-zinc-400 mt-0.5">{counts.total} schools · {counts.active} active · {counts.pending} pending approval</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-black rounded-xl text-sm shadow-md transition-colors">
            <Plus className="w-4 h-4" /> Add School
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-5">

          {/* Status summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label:"Active",    value:counts.active,    color:"bg-emerald-50 border-emerald-200 text-emerald-800" },
              { label:"Trial",     value:counts.trial,     color:"bg-amber-50 border-amber-200 text-amber-800" },
              { label:"Pending",   value:counts.pending,   color:"bg-blue-50 border-blue-200 text-blue-800" },
              { label:"Suspended", value:counts.suspended, color:"bg-red-50 border-red-200 text-red-800" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
                className={`border-2 rounded-2xl p-4 text-center shadow-sm cursor-pointer hover:shadow-md transition-all ${s.color}`}
                onClick={() => setFilterStatus(s.label as SchoolStatus)}>
                <p className="text-3xl font-black">{s.value}</p>
                <p className="text-xs font-bold mt-1 opacity-80">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Pending approval banner */}
          {counts.pending > 0 && (
            <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
              className="flex items-center gap-3 px-5 py-4 bg-blue-50 border border-blue-200 rounded-2xl">
              <RefreshCw className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <p className="text-sm font-bold text-blue-800 flex-1">
                {counts.pending} school{counts.pending > 1 ? "s" : ""} pending approval — review and activate to give access.
              </p>
              <button onClick={() => setFilterStatus("Pending")}
                className="text-xs font-black text-blue-700 bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded-lg transition-all flex-shrink-0">
                Review →
              </button>
            </motion.div>
          )}

          {/* Filters & search */}
          <div className="bg-white border border-zinc-100 rounded-2xl p-4 shadow-sm flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2.5 bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 flex-1 min-w-48">
              <Search className="w-4 h-4 text-zinc-400 flex-shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search schools, states, admins…"
                className="text-sm bg-transparent outline-none text-zinc-700 placeholder:text-zinc-400 w-full" />
              {search && <button onClick={() => setSearch("")}><X className="w-4 h-4 text-zinc-400" /></button>}
            </div>
            {/* Status filter */}
            <div className="flex gap-1 bg-zinc-100 p-1 rounded-xl flex-wrap">
              {(["All","Active","Trial","Pending","Suspended"] as const).map(f => (
                <button key={f} onClick={() => setFilterStatus(f as SchoolStatus | "All")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterStatus===f ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500"}`}>
                  {f}
                </button>
              ))}
            </div>
            {/* Plan filter */}
            <div className="flex gap-1 bg-zinc-100 p-1 rounded-xl flex-wrap">
              {(["All","Enterprise","Professional","Free Trial"] as const).map(f => (
                <button key={f} onClick={() => setFilterPlan(f as Plan | "All")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterPlan===f ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500"}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Schools table */}
          <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-zinc-100 flex items-center justify-between">
              <p className="text-xs font-bold text-zinc-500">{filtered.length} school{filtered.length !== 1 ? "s" : ""}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Sort by:</span>
                {(["name","students","mrr"] as const).map(f => (
                  <button key={f} onClick={() => { if(sortField===f) setSortAsc(!sortAsc); else { setSortField(f); setSortAsc(false); } }}
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-all ${sortField===f ? "bg-violet-50 text-violet-700" : "text-zinc-400 hover:text-zinc-700"}`}>
                    {f} {sortField===f ? (sortAsc?"↑":"↓") : ""}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-100">
                    {["School","Location","Admin","Plan","Students","Status","MRR","Last Active",""].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-black text-zinc-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {filtered.map((s, i) => {
                    const sCfg = STATUS_CONFIG[s.status];
                    const pCfg = PLAN_CONFIG[s.plan];
                    return (
                      <motion.tr key={s.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.03 }}
                        className="hover:bg-zinc-50/60 transition-colors cursor-pointer" onClick={() => setViewing(s)}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center text-violet-700 text-xs font-black flex-shrink-0">
                              {s.logo}
                            </div>
                            <span className="font-black text-zinc-900 text-sm whitespace-nowrap">{s.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs font-semibold text-zinc-500 whitespace-nowrap">{s.lga}, {s.state}</td>
                        <td className="px-4 py-3 text-xs text-zinc-600 whitespace-nowrap">{s.admin}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border whitespace-nowrap ${pCfg.color} ${pCfg.bg} ${pCfg.border}`}>{s.plan}</span>
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-zinc-700">{s.students > 0 ? s.students.toLocaleString() : "—"}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${sCfg.color} ${sCfg.bg} ${sCfg.border}`}>
                            <sCfg.icon className="w-3 h-3" />{s.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-black text-zinc-900 text-sm whitespace-nowrap">
                          {s.mrr > 0 ? `₦${(s.mrr/1000).toFixed(0)}K` : <span className="text-zinc-300">—</span>}
                        </td>
                        <td className="px-4 py-3 text-xs text-zinc-400 whitespace-nowrap">{s.lastActive}</td>
                        <td className="px-4 py-3">
                          <button onClick={e => { e.stopPropagation(); setViewing(s); }}
                            className="p-1.5 rounded-lg hover:bg-violet-50 hover:text-violet-600 text-zinc-400 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-16 text-center">
                  <School className="w-12 h-12 text-zinc-200 mx-auto mb-3" />
                  <p className="font-bold text-zinc-400">No schools found</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {viewing && (
          <SchoolDrawer school={viewing} onClose={() => setViewing(null)}
            onSuspend={id => updateStatus(id, "Suspended")}
            onActivate={id => updateStatus(id, "Active")}
            onApprove={id => updateStatus(id, "Active")} />
        )}
      </AnimatePresence>
    </div>
  );
}