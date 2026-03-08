"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Search, CreditCard, CheckCircle, AlertTriangle, Clock,
  TrendingUp, DollarSign, Download, RefreshCw, Filter,
  ArrowUpRight, Building2, Eye,
} from "lucide-react";
import { SuperSidebar } from "../page";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from "recharts";

// ─── Data ─────────────────────────────────────────────────────────────────────

type PayStatus = "Paid" | "Failed" | "Pending" | "Refunded";
type Plan = "Enterprise" | "Professional" | "Free Trial";

interface BillingRecord {
  id: string;
  school: string;
  plan: Plan;
  amount: number;
  status: PayStatus;
  date: string;
  method: string;
  ref: string;
  nextDue: string;
}

const RECORDS: BillingRecord[] = [
  { id:"1",  school:"Royal Academy",          plan:"Enterprise",   amount:350000, status:"Paid",    date:"Feb 1, 2025",  method:"Bank Transfer", ref:"GTB-20250201-11223", nextDue:"May 1, 2025" },
  { id:"2",  school:"Greenfield College",     plan:"Professional", amount:180000, status:"Paid",    date:"Jan 28, 2025", method:"Card",           ref:"FLW-20250128-44512", nextDue:"Apr 28, 2025" },
  { id:"3",  school:"Premier Academy",        plan:"Professional", amount:180000, status:"Paid",    date:"Jan 25, 2025", method:"Bank Transfer",  ref:"UBA-20250125-77831", nextDue:"Apr 25, 2025" },
  { id:"4",  school:"Destiny International",  plan:"Enterprise",   amount:350000, status:"Paid",    date:"Jan 20, 2025", method:"Card",           ref:"FLW-20250120-33901", nextDue:"Apr 20, 2025" },
  { id:"5",  school:"Crown Excellence",       plan:"Professional", amount:180000, status:"Paid",    date:"Jan 18, 2025", method:"Bank Transfer",  ref:"GTB-20250118-22014", nextDue:"Apr 18, 2025" },
  { id:"6",  school:"Evergreen Academy",      plan:"Professional", amount:180000, status:"Failed",  date:"Feb 3, 2025",  method:"Card",           ref:"FLW-20250203-99821", nextDue:"Overdue" },
  { id:"7",  school:"Sunshine International", plan:"Professional", amount:180000, status:"Paid",    date:"Jan 15, 2025", method:"Bank Transfer",  ref:"ZNB-20250115-55432", nextDue:"Apr 15, 2025" },
  { id:"8",  school:"Legacy College",         plan:"Professional", amount:180000, status:"Pending", date:"Feb 5, 2025",  method:"Bank Transfer",  ref:"GTB-20250205-88123", nextDue:"Feb 10, 2025" },
  { id:"9",  school:"Heritage High School",   plan:"Free Trial",   amount:0,      status:"Paid",    date:"Feb 2, 2025",  method:"—",              ref:"TRIAL-20250202",     nextDue:"Mar 2, 2025" },
  { id:"10", school:"Prestige Academy",       plan:"Free Trial",   amount:0,      status:"Pending", date:"Mar 1, 2025",  method:"—",              ref:"TRIAL-20250301",     nextDue:"Apr 1, 2025" },
];

const MONTHLY_REV = [
  { month:"Jul", rev:5580000 },{ month:"Aug", rev:6120000 },{ month:"Sep", rev:6840000 },
  { month:"Oct", rev:7200000 },{ month:"Nov", rev:7740000 },{ month:"Dec", rev:7920000 },
  { month:"Jan", rev:8280000 },{ month:"Feb", rev:8475000 },
];

const PLAN_REV = [
  { plan:"Enterprise",   count:9,  mrr:3150000 },
  { plan:"Professional", count:34, mrr:6120000 },
  { plan:"Free Trial",   count:4,  mrr:0 },
];

const STATUS_CFG: Record<PayStatus, { color:string; bg:string; border:string; icon:React.ElementType }> = {
  Paid:     { color:"text-emerald-700", bg:"bg-emerald-50", border:"border-emerald-200", icon:CheckCircle },
  Failed:   { color:"text-red-700",     bg:"bg-red-50",     border:"border-red-200",     icon:AlertTriangle },
  Pending:  { color:"text-amber-700",   bg:"bg-amber-50",   border:"border-amber-200",   icon:Clock },
  Refunded: { color:"text-blue-700",    bg:"bg-blue-50",    border:"border-blue-200",    icon:RefreshCw },
};

const PLAN_CFG: Record<Plan, { color:string; bg:string }> = {
  Enterprise:   { color:"text-emerald-700", bg:"bg-emerald-50" },
  Professional: { color:"text-violet-700",  bg:"bg-violet-50" },
  "Free Trial": { color:"text-amber-700",   bg:"bg-amber-50" },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Tip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-zinc-400 mb-1">{label}</p>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((p: any) => (
        <p key={p.name} className="font-black" style={{ color: p.stroke||p.fill }}>
          {p.value > 1000 ? `₦${(p.value/1_000_000).toFixed(2)}M` : p.value}
        </p>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SuperAdminBillingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<PayStatus | "All">("All");

  const totalMRR = RECORDS.filter(r => r.status === "Paid").reduce((a, r) => a + r.amount, 0);
  const failedCount = RECORDS.filter(r => r.status === "Failed").length;
  const pendingRev = RECORDS.filter(r => r.status === "Pending").reduce((a, r) => a + r.amount, 0);

  const filtered = useMemo(() => {
    let list = [...RECORDS];
    if (search) list = list.filter(r => r.school.toLowerCase().includes(search.toLowerCase()) || r.ref.includes(search));
    if (filterStatus !== "All") list = list.filter(r => r.status === filterStatus);
    return list;
  }, [search, filterStatus]);

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      <div className="hidden lg:flex flex-shrink-0"><SuperSidebar active="/super-admin/billing" /></div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="fixed inset-0 bg-black/70 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.div initial={{ x:-280 }} animate={{ x:0 }} exit={{ x:-280 }}
              transition={{ type:"spring", damping:28, stiffness:260 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-50 lg:hidden">
              <SuperSidebar active="/super-admin/billing" mobile onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-zinc-100 flex-shrink-0 gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-zinc-100 text-zinc-500"><Menu className="w-5 h-5" /></button>
            <div>
              <h1 className="text-lg font-black text-zinc-900">Billing & Revenue</h1>
              <p className="text-xs text-zinc-400 mt-0.5">Subscription management & payment tracking</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-zinc-200 hover:border-zinc-300 text-zinc-700 font-bold rounded-xl text-sm bg-white transition-all">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-5">

          {/* Failed payment alert */}
          {failedCount > 0 && (
            <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
              className="flex items-center gap-3 px-5 py-4 bg-red-50 border border-red-200 rounded-2xl">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm font-bold text-red-800 flex-1">
                {failedCount} payment failure{failedCount > 1 ? "s" : ""} detected — Evergreen Academy. Immediate action required.
              </p>
              <button onClick={() => setFilterStatus("Failed")}
                className="text-xs font-black text-red-700 bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-all flex-shrink-0">
                View →
              </button>
            </motion.div>
          )}

          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label:"Current MRR",       value:`₦${(totalMRR/1_000_000).toFixed(2)}M`, sub:"This billing cycle",         color:"bg-violet-50 border-violet-200 text-violet-800", trend:"+12.4%" },
              { label:"ARR (Projected)",   value:`₦${(totalMRR*12/1_000_000).toFixed(1)}M`, sub:"Annualized estimate",    color:"bg-emerald-50 border-emerald-200 text-emerald-800", trend:"+18.2%" },
              { label:"Failed Payments",   value:failedCount,                             sub:"Requires retry",              color:"bg-red-50 border-red-200 text-red-800", trend:"Action needed" },
              { label:"Pending Revenue",   value:`₦${(pendingRev/1000).toFixed(0)}K`,   sub:"Awaiting confirmation",       color:"bg-amber-50 border-amber-200 text-amber-800", trend:`${RECORDS.filter(r=>r.status==="Pending").length} payments` },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
                className={`border-2 rounded-2xl p-5 shadow-sm ${s.color}`}>
                <p className="text-2xl font-black mb-1">{s.value}</p>
                <p className="text-sm font-bold">{s.label}</p>
                <p className="text-xs mt-0.5 opacity-70">{s.sub}</p>
                <p className="text-xs font-bold mt-2 opacity-80">{s.trend}</p>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-black text-zinc-900 text-sm">Monthly Revenue Growth</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">₦ MRR — last 8 months</p>
                </div>
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +51.9% YTD
                </span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={MONTHLY_REV}>
                  <defs>
                    <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                  <XAxis dataKey="month" tick={{ fontSize:11, fill:"#a1a1aa" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize:11, fill:"#a1a1aa" }} axisLine={false} tickLine={false} tickFormatter={v=>`₦${v/1_000_000}M`} />
                  <Tooltip content={<Tip />} />
                  <Area type="monotone" dataKey="rev" stroke="#7c3aed" strokeWidth={2.5} fill="url(#revGrad2)" dot={{ fill:"#7c3aed", r:4, strokeWidth:2, stroke:"#fff" }} name="rev" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm">
              <h3 className="font-black text-zinc-900 text-sm mb-4">Revenue by Plan</h3>
              <div className="space-y-4">
                {PLAN_REV.map(p => (
                  <div key={p.plan}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className={`font-bold px-2 py-0.5 rounded-md ${PLAN_CFG[p.plan as Plan].bg} ${PLAN_CFG[p.plan as Plan].color}`}>{p.plan}</span>
                      <span className="font-black text-zinc-800">{p.mrr > 0 ? `₦${(p.mrr/1_000_000).toFixed(2)}M` : "—"}</span>
                    </div>
                    <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${p.plan === "Enterprise" ? "bg-emerald-500" : p.plan === "Professional" ? "bg-violet-500" : "bg-zinc-300"}`}
                        style={{ width:`${totalMRR > 0 ? (p.mrr/totalMRR*100) : 0}%` }} />
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">{p.count} schools</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-zinc-100">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-500">Total MRR</span>
                  <span className="font-black text-violet-700">₦{(totalMRR/1_000_000).toFixed(2)}M</span>
                </div>
              </div>
            </div>
          </div>

          {/* Billing records */}
          <div className="bg-white border border-zinc-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-100 flex-wrap">
              <h3 className="font-black text-zinc-900 text-sm flex-shrink-0">Payment Records</h3>
              <div className="flex items-center gap-2.5 bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2 flex-1 min-w-40">
                <Search className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search school or ref…"
                  className="text-xs bg-transparent outline-none text-zinc-700 placeholder:text-zinc-400 w-full" />
              </div>
              <div className="flex gap-1 bg-zinc-100 p-1 rounded-xl flex-shrink-0">
                {(["All","Paid","Pending","Failed","Refunded"] as const).map(f => (
                  <button key={f} onClick={() => setFilterStatus(f as PayStatus | "All")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterStatus===f?"bg-white text-zinc-900 shadow-sm":"text-zinc-500"}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-100">
                    {["School","Plan","Amount","Status","Date","Method","Reference","Next Due"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-black text-zinc-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {filtered.map((r, i) => {
                    const scfg = STATUS_CFG[r.status];
                    const pcfg = PLAN_CFG[r.plan];
                    return (
                      <motion.tr key={r.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.03 }}
                        className="hover:bg-zinc-50/60 transition-colors">
                        <td className="px-4 py-3 font-bold text-zinc-900 whitespace-nowrap">{r.school}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${pcfg.bg} ${pcfg.color}`}>{r.plan}</span>
                        </td>
                        <td className="px-4 py-3 font-black text-zinc-900 whitespace-nowrap">
                          {r.amount > 0 ? `₦${r.amount.toLocaleString()}` : <span className="text-zinc-300">Free</span>}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${scfg.color} ${scfg.bg} ${scfg.border}`}>
                            <scfg.icon className="w-3 h-3" />{r.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-zinc-500 whitespace-nowrap">{r.date}</td>
                        <td className="px-4 py-3 text-xs text-zinc-500 whitespace-nowrap">{r.method}</td>
                        <td className="px-4 py-3 text-xs text-zinc-400 font-mono whitespace-nowrap">{r.ref}</td>
                        <td className="px-4 py-3 text-xs font-semibold whitespace-nowrap">
                          <span className={r.nextDue === "Overdue" ? "text-red-600 font-black" : "text-zinc-600"}>{r.nextDue}</span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}