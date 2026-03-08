"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  School, LayoutDashboard, Users, UserCheck, CreditCard, BookOpen,
  Megaphone, BarChart3, Settings, Search, Menu, X, Plus, Download,
  Filter, ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock,
  GraduationCap, LogOut, ArrowUpDown, Loader2, Send, AlertTriangle,
  TrendingUp, Wallet, Receipt, Banknote, Eye, Pencil, Trash2,
  MessageSquare, MoreHorizontal,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

type FeeStatus = "Paid" | "Partial" | "Unpaid";
type PaymentMethod = "Bank Transfer" | "Cash" | "POS" | "Online" | "Cheque";

interface FeeRecord {
  id: string;
  studentName: string;
  admissionNo: string;
  class: string;
  avatar: string;
  avatarColor: string;
  parentName: string;
  parentPhone: string;
  termFee: number;
  amountPaid: number;
  balance: number;
  status: FeeStatus;
  lastPayment: string;
  paymentMethod: PaymentMethod | null;
}

interface Payment {
  id: string;
  studentName: string;
  class: string;
  avatar: string;
  avatarColor: string;
  amount: number;
  method: PaymentMethod;
  date: string;
  receiptNo: string;
  status: "confirmed" | "pending";
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const TERM_FEE_MAP: Record<string, number> = {
  "JSS 1A":32000,"JSS 1B":32000,"JSS 1C":32000,
  "JSS 2A":32000,"JSS 2B":32000,"JSS 2C":32000,
  "JSS 3A":32000,"JSS 3B":32000,
  "SS 1A":45000,"SS 1B":45000,
  "SS 2A":45000,"SS 2B":45000,
  "SS 3A":50000,"SS 3B":50000,
};

const FEE_RECORDS: FeeRecord[] = [
  { id:"1", studentName:"Amara Okafor", admissionNo:"GFC/2024/001", class:"SS 2A", avatar:"AO", avatarColor:"bg-emerald-500", parentName:"Mrs. Ngozi Okafor", parentPhone:"+234 803 111 2222", termFee:45000, amountPaid:45000, balance:0, status:"Paid", lastPayment:"12 Jan 2025", paymentMethod:"Bank Transfer" },
  { id:"2", studentName:"Emmanuel Adeyemi", admissionNo:"GFC/2024/002", class:"JSS 1B", avatar:"EA", avatarColor:"bg-blue-500", parentName:"Mr. Tunde Adeyemi", parentPhone:"+234 807 223 3344", termFee:32000, amountPaid:20000, balance:12000, status:"Partial", lastPayment:"5 Jan 2025", paymentMethod:"Cash" },
  { id:"3", studentName:"Fatima Bello", admissionNo:"GFC/2024/003", class:"SS 3A", avatar:"FB", avatarColor:"bg-violet-500", parentName:"Alhaji Musa Bello", parentPhone:"+234 811 334 4455", termFee:50000, amountPaid:50000, balance:0, status:"Paid", lastPayment:"8 Jan 2025", paymentMethod:"Online" },
  { id:"4", studentName:"Chidi Nwosu", admissionNo:"GFC/2024/004", class:"JSS 2C", avatar:"CN", avatarColor:"bg-orange-500", parentName:"Dr. Ikenna Nwosu", parentPhone:"+234 815 445 5566", termFee:32000, amountPaid:0, balance:32000, status:"Unpaid", lastPayment:"—", paymentMethod:null },
  { id:"5", studentName:"Grace Eze", admissionNo:"GFC/2024/005", class:"SS 1B", avatar:"GE", avatarColor:"bg-pink-500", parentName:"Mrs. Ada Eze", parentPhone:"+234 819 556 6677", termFee:45000, amountPaid:45000, balance:0, status:"Paid", lastPayment:"3 Jan 2025", paymentMethod:"POS" },
  { id:"6", studentName:"Ibrahim Hassan", admissionNo:"GFC/2024/006", class:"JSS 3A", avatar:"IH", avatarColor:"bg-red-500", parentName:"Alhaji Hassan Usman", parentPhone:"+234 823 667 7788", termFee:32000, amountPaid:0, balance:32000, status:"Unpaid", lastPayment:"—", paymentMethod:null },
  { id:"7", studentName:"Blessing Okonkwo", admissionNo:"GFC/2024/007", class:"SS 2B", avatar:"BO", avatarColor:"bg-teal-500", parentName:"Chief Emeka Okonkwo", parentPhone:"+234 827 778 8899", termFee:45000, amountPaid:45000, balance:0, status:"Paid", lastPayment:"10 Jan 2025", paymentMethod:"Bank Transfer" },
  { id:"8", studentName:"Tunde Afolabi", admissionNo:"GFC/2024/008", class:"JSS 1A", avatar:"TA", avatarColor:"bg-indigo-500", parentName:"Mr. Seun Afolabi", parentPhone:"+234 831 889 9900", termFee:32000, amountPaid:15000, balance:17000, status:"Partial", lastPayment:"2 Jan 2025", paymentMethod:"Cash" },
  { id:"9", studentName:"Chioma Obi", admissionNo:"GFC/2024/009", class:"SS 1A", avatar:"CO", avatarColor:"bg-emerald-600", parentName:"Mr. Chukwu Obi", parentPhone:"+234 835 990 0011", termFee:45000, amountPaid:45000, balance:0, status:"Paid", lastPayment:"9 Jan 2025", paymentMethod:"Online" },
  { id:"10", studentName:"Yusuf Abubakar", admissionNo:"GFC/2024/010", class:"JSS 2A", avatar:"YA", avatarColor:"bg-amber-500", parentName:"Mal. Abubakar Yusuf", parentPhone:"+234 839 001 1122", termFee:32000, amountPaid:32000, balance:0, status:"Paid", lastPayment:"7 Jan 2025", paymentMethod:"Bank Transfer" },
  { id:"11", studentName:"Adaeze Igwe", admissionNo:"GFC/2024/011", class:"SS 3A", avatar:"AI", avatarColor:"bg-purple-500", parentName:"Prof. Obiora Igwe", parentPhone:"+234 843 112 2233", termFee:50000, amountPaid:50000, balance:0, status:"Paid", lastPayment:"4 Jan 2025", paymentMethod:"Online" },
  { id:"12", studentName:"Solomon Dike", admissionNo:"GFC/2024/012", class:"JSS 3B", avatar:"SD", avatarColor:"bg-cyan-500", parentName:"Pastor Dike Solomon", parentPhone:"+234 847 223 3344", termFee:32000, amountPaid:10000, balance:22000, status:"Partial", lastPayment:"6 Jan 2025", paymentMethod:"Cash" },
];

const RECENT_PAYMENTS: Payment[] = [
  { id:"p1", studentName:"Amara Okafor", class:"SS 2A", avatar:"AO", avatarColor:"bg-emerald-500", amount:45000, method:"Bank Transfer", date:"Today, 9:14 AM", receiptNo:"RCP-20250114-001", status:"confirmed" },
  { id:"p2", studentName:"Emmanuel Adeyemi", class:"JSS 1B", avatar:"EA", avatarColor:"bg-blue-500", amount:20000, method:"Cash", date:"Today, 8:52 AM", receiptNo:"RCP-20250114-002", status:"confirmed" },
  { id:"p3", studentName:"Fatima Bello", class:"SS 3A", avatar:"FB", avatarColor:"bg-violet-500", amount:50000, method:"Online", date:"Yesterday", receiptNo:"RCP-20250113-001", status:"confirmed" },
  { id:"p4", studentName:"Chioma Obi", class:"SS 1A", avatar:"CO", avatarColor:"bg-emerald-600", amount:45000, method:"Online", date:"Yesterday", receiptNo:"RCP-20250113-002", status:"confirmed" },
  { id:"p5", studentName:"Solomon Dike", class:"JSS 3B", avatar:"SD", avatarColor:"bg-cyan-500", amount:10000, method:"Cash", date:"2 days ago", receiptNo:"RCP-20250112-001", status:"pending" },
];

const MONTHLY_COLLECTION = [
  { month:"Sep", collected:3200000, target:5800000 },
  { month:"Oct", collected:4100000, target:5800000 },
  { month:"Nov", collected:3800000, target:5800000 },
  { month:"Dec", collected:4500000, target:5800000 },
  { month:"Jan", collected:5200000, target:5800000 },
  { month:"Feb", collected:2400000, target:5800000 },
];

// ─── Shared Sidebar ───────────────────────────────────────────────────────────

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Students", href: "/dashboard/students" },
  { icon: GraduationCap, label: "Teachers", href: "/dashboard/teachers" },
  { icon: UserCheck, label: "Attendance", href: "/dashboard/attendance" },
  { icon: CreditCard, label: "Fees", href: "/dashboard/fees", active: true },
  { icon: BookOpen, label: "Results", href: "/dashboard/results" },
  { icon: Megaphone, label: "Announcements", href: "/dashboard/announcements" },
  { icon: BarChart3, label: "Reports", href: "/dashboard/reports" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
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
          <div className="w-9 h-9 bg-emerald-500/20 rounded-lg flex items-center justify-center">
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
        {NAV.map(item => (
          <Link key={item.label} href={item.href} onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${"active" in item ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/50" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}>
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {item.label}
            {"active" in item && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />}
          </Link>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 cursor-pointer group transition-all">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-xs font-black">CO</div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-bold truncate">Dr. Chidinma Okonkwo</p>
            <p className="text-slate-500 text-xs truncate">chidinma@school.edu.ng</p>
          </div>
          <LogOut className="w-4 h-4 text-slate-600 group-hover:text-red-400 transition-colors" />
        </div>
      </div>
    </aside>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: FeeStatus }) {
  const map = {
    Paid: { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", Icon: CheckCircle },
    Partial: { cls: "bg-amber-50 text-amber-700 border-amber-200", Icon: Clock },
    Unpaid: { cls: "bg-red-50 text-red-600 border-red-200", Icon: XCircle },
  };
  const { cls, Icon } = map[status];
  return <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${cls}`}><Icon className="w-3 h-3" />{status}</span>;
}

// ─── Record Payment Modal ─────────────────────────────────────────────────────

function RecordPaymentModal({ record, onClose, onSave }: {
  record: FeeRecord | null; onClose: () => void;
  onSave: (id: string, amount: number, method: PaymentMethod) => void;
}) {
  const [studentSearch, setStudentSearch] = useState(record?.studentName ?? "");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("Bank Transfer");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const selectedRecord = record ?? FEE_RECORDS.find(r => r.studentName.toLowerCase().includes(studentSearch.toLowerCase()));
  const maxAmount = selectedRecord ? selectedRecord.balance : 0;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!selectedRecord) e.student = "Student not found";
    const amt = parseFloat(amount);
    if (!amount || isNaN(amt) || amt <= 0) e.amount = "Enter a valid amount";
    else if (amt > maxAmount + 0.01) e.amount = `Max balance is ₦${maxAmount.toLocaleString()}`;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !selectedRecord) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    onSave(selectedRecord.id, parseFloat(amount), method);
    setLoading(false);
    setDone(true);
    setTimeout(onClose, 1000);
  };

  const fc = (err?: string) =>
    `w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 bg-white outline-none transition-all ${err ? "border-red-300 ring-2 ring-red-100" : "border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"}`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 20 }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Receipt className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-black text-slate-900">Record Payment</h2>
              <p className="text-xs text-slate-400">Post a new fee payment</p>
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
            <h3 className="font-black text-slate-900 text-lg mb-1">Payment Recorded!</h3>
            <p className="text-sm text-slate-500">₦{parseFloat(amount || "0").toLocaleString()} paid via {method}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5" noValidate>
            {/* Student search */}
            {!record && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Student Name or Admission No.</label>
                <input value={studentSearch} onChange={e => setStudentSearch(e.target.value)}
                  placeholder="Search student…" className={fc(errors.student)} />
                {errors.student && <p className="text-xs text-red-500 mt-1">{errors.student}</p>}
              </div>
            )}

            {/* Student summary */}
            {selectedRecord && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 ${selectedRecord.avatarColor} rounded-xl flex items-center justify-center text-white text-sm font-black`}>
                    {selectedRecord.avatar}
                  </div>
                  <div>
                    <p className="font-black text-slate-900">{selectedRecord.studentName}</p>
                    <p className="text-xs text-slate-500">{selectedRecord.class} · {selectedRecord.admissionNo}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-white rounded-xl p-2.5 border border-slate-100">
                    <p className="font-black text-slate-900">₦{selectedRecord.termFee.toLocaleString()}</p>
                    <p className="text-slate-500 mt-0.5">Term Fee</p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-2.5 border border-emerald-100">
                    <p className="font-black text-emerald-700">₦{selectedRecord.amountPaid.toLocaleString()}</p>
                    <p className="text-emerald-600 mt-0.5">Paid</p>
                  </div>
                  <div className={`rounded-xl p-2.5 border ${selectedRecord.balance > 0 ? "bg-red-50 border-red-100" : "bg-emerald-50 border-emerald-100"}`}>
                    <p className={`font-black ${selectedRecord.balance > 0 ? "text-red-700" : "text-emerald-700"}`}>₦{selectedRecord.balance.toLocaleString()}</p>
                    <p className={`mt-0.5 ${selectedRecord.balance > 0 ? "text-red-600" : "text-emerald-600"}`}>Balance</p>
                  </div>
                </div>
              </div>
            )}

            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Amount Paid (₦)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-sm">₦</span>
                <input type="number" min="0" placeholder="0.00" value={amount}
                  onChange={e => { setAmount(e.target.value); setErrors(p => ({ ...p, amount: "" })); }}
                  className={`${fc(errors.amount)} pl-8`} />
              </div>
              {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
              {selectedRecord && selectedRecord.balance > 0 && (
                <div className="flex gap-2 mt-2">
                  {[selectedRecord.balance, Math.floor(selectedRecord.balance / 2)].filter(Boolean).map(v => (
                    <button key={v} type="button" onClick={() => setAmount(v.toString())}
                      className="text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-all border border-emerald-200">
                      {v === selectedRecord.balance ? "Pay full" : "Pay half"} (₦{v.toLocaleString()})
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Payment method */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {(["Bank Transfer","Cash","POS","Online","Cheque"] as PaymentMethod[]).map(m => (
                  <button key={m} type="button" onClick={() => setMethod(m)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border-2 transition-all ${method === m ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="flex-1 py-3 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl text-sm transition-all">
                Cancel
              </button>
              <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-colors">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><Receipt className="w-4 h-4" /> Record Payment</>}
              </motion.button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Send Reminder Modal ──────────────────────────────────────────────────────

function SendReminderModal({ defaulters, onClose }: { defaulters: FeeRecord[]; onClose: () => void }) {
  const [selected, setSelected] = useState<string[]>(defaulters.map(d => d.id));
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const toggle = (id: string) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const all = selected.length === defaulters.length;

  const send = async () => {
    setSending(true);
    await new Promise(r => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
    setTimeout(onClose, 1200);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 20 }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-black text-slate-900">Send Fee Reminders</h2>
              <p className="text-xs text-slate-400">WhatsApp / SMS to parents</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"><X className="w-5 h-5" /></button>
        </div>

        {sent ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 220 }}
              className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </motion.div>
            <h3 className="font-black text-slate-900 text-lg mb-1">Reminders Sent!</h3>
            <p className="text-sm text-slate-500">{selected.length} parents have been notified.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-slate-500">{selected.length} of {defaulters.length} selected</p>
                <button onClick={() => setSelected(all ? [] : defaulters.map(d => d.id))}
                  className="text-xs font-bold text-emerald-600 hover:underline">{all ? "Deselect all" : "Select all"}</button>
              </div>
              {defaulters.map(d => (
                <div key={d.id}
                  onClick={() => toggle(d.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${selected.includes(d.id) ? "border-blue-400 bg-blue-50" : "border-slate-100 bg-slate-50 hover:border-slate-200"}`}>
                  <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${selected.includes(d.id) ? "bg-blue-500 border-blue-500" : "border-slate-300"}`}>
                    {selected.includes(d.id) && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <div className={`w-8 h-8 ${d.avatarColor} rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
                    {d.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{d.studentName}</p>
                    <p className="text-xs text-slate-500">{d.parentName} · {d.parentPhone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-red-600">₦{d.balance.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">{d.status}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex gap-3 flex-shrink-0">
              <button onClick={onClose} className="flex-1 py-3 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl text-sm transition-all">
                Cancel
              </button>
              <motion.button onClick={send} disabled={sending || selected.length === 0} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-colors">
                {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : <><Send className="w-4 h-4" /> Send to {selected.length}</>}
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs shadow-xl">
      <p className="text-slate-400 font-semibold mb-1">{label}</p>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-bold capitalize">
          {p.name}: ₦{(p.value / 1000000).toFixed(1)}M
        </p>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 8;

export default function FeesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "records" | "transactions">("overview");
  const [records, setRecords] = useState<FeeRecord[]>(FEE_RECORDS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | FeeStatus>("All");
  const [filterClass, setFilterClass] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<keyof FeeRecord>("studentName");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [recordingFor, setRecordingFor] = useState<FeeRecord | null | "new">(null);
  const [sendingReminder, setSendingReminder] = useState(false);

  const totals = useMemo(() => {
    const totalFees = records.reduce((a, r) => a + r.termFee, 0);
    const collected = records.reduce((a, r) => a + r.amountPaid, 0);
    const outstanding = records.reduce((a, r) => a + r.balance, 0);
    const paid = records.filter(r => r.status === "Paid").length;
    const partial = records.filter(r => r.status === "Partial").length;
    const unpaid = records.filter(r => r.status === "Unpaid").length;
    return { totalFees, collected, outstanding, paid, partial, unpaid, rate: Math.round(collected / totalFees * 100) };
  }, [records]);

  const filtered = useMemo(() => {
    let list = records.filter(r => {
      const q = search.toLowerCase();
      if (q && !r.studentName.toLowerCase().includes(q) && !r.admissionNo.toLowerCase().includes(q) && !r.class.toLowerCase().includes(q)) return false;
      if (filterStatus !== "All" && r.status !== filterStatus) return false;
      if (filterClass !== "All" && r.class !== filterClass) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      const av = String(a[sortField] ?? "").toLowerCase();
      const bv = String(b[sortField] ?? "").toLowerCase();
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return list;
  }, [records, search, filterStatus, filterClass, sortField, sortAsc]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const toggleSort = (f: keyof FeeRecord) => { if (sortField === f) setSortAsc(!sortAsc); else { setSortField(f); setSortAsc(true); } };

  const handlePaymentSave = (id: string, amount: number, method: PaymentMethod) => {
    setRecords(prev => prev.map(r => {
      if (r.id !== id) return r;
      const newPaid = r.amountPaid + amount;
      const newBalance = r.termFee - newPaid;
      return { ...r, amountPaid: newPaid, balance: newBalance,
        status: newBalance <= 0 ? "Paid" : newPaid > 0 ? "Partial" : "Unpaid",
        lastPayment: new Date().toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" }),
        paymentMethod: method,
      };
    }));
  };

  const defaulters = records.filter(r => r.status !== "Paid");
  const classes = [...new Set(records.map(r => r.class))].sort();

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
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 gap-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 rounded-lg hover:bg-slate-100">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-black text-slate-900">Fee Management</h1>
              <p className="text-xs text-slate-400 mt-0.5">Second Term 2024/2025 · {totals.rate}% collected</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setSendingReminder(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 border-2 border-slate-200 hover:border-blue-300 hover:text-blue-700 text-slate-700 font-bold rounded-xl text-sm transition-all">
              <Send className="w-4 h-4" /> Send Reminders
              {defaulters.length > 0 && <span className="w-5 h-5 bg-red-500 text-white rounded-full text-xs font-black flex items-center justify-center">{defaulters.length}</span>}
            </button>
            <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl text-sm transition-all">
              <Download className="w-4 h-4" /> Export
            </button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setRecordingFor("new")}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-100 transition-colors">
              <Plus className="w-4 h-4" /> Record Payment
            </motion.button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6">

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label:"Total Expected", value:`₦${(totals.totalFees/1000000).toFixed(1)}M`, sub:"This term", icon:Banknote, color:"bg-slate-900 text-white", iconCls:"bg-white/10 text-white" },
              { label:"Collected", value:`₦${(totals.collected/1000000).toFixed(1)}M`, sub:`${totals.rate}% of total`, icon:Wallet, color:"bg-white border border-slate-100", iconCls:"bg-emerald-100 text-emerald-600", valCls:"text-emerald-700" },
              { label:"Outstanding", value:`₦${(totals.outstanding/1000000).toFixed(1)}M`, sub:`${defaulters.length} students`, icon:AlertTriangle, color:"bg-white border border-slate-100", iconCls:"bg-red-100 text-red-600", valCls:"text-red-700" },
              { label:"Collection Rate", value:`${totals.rate}%`, sub:"Term target: 100%", icon:TrendingUp, color:"bg-white border border-slate-100", iconCls:"bg-blue-100 text-blue-600", valCls:"text-blue-700" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22,1,0.36,1] }}
                className={`${s.color} rounded-2xl p-5 shadow-sm`}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-11 h-11 ${s.iconCls} rounded-xl flex items-center justify-center`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  {i === 3 && (
                    <div className="text-right">
                      <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${totals.rate}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-blue-500 rounded-full" />
                      </div>
                    </div>
                  )}
                </div>
                <p className={`text-2xl font-black mb-0.5 ${"valCls" in s ? s.valCls : "text-white"}`}>{s.value}</p>
                <p className={`text-sm font-bold ${"valCls" in s ? "text-slate-700" : "text-white/90"}`}>{s.label}</p>
                <p className={`text-xs mt-0.5 ${"valCls" in s ? "text-slate-400" : "text-white/60"}`}>{s.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Status pills */}
          <div className="flex flex-wrap gap-3">
            {[
              { label:"Fully Paid", count:totals.paid, color:"bg-emerald-50 text-emerald-700 border-emerald-200" },
              { label:"Partial Payment", count:totals.partial, color:"bg-amber-50 text-amber-700 border-amber-200" },
              { label:"Unpaid", count:totals.unpaid, color:"bg-red-50 text-red-700 border-red-200" },
            ].map(s => (
              <div key={s.label} className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold ${s.color}`}>
                <span className="text-xl font-black">{s.count}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
            {(["overview","records","transactions"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                {tab === "records" ? "Fee Records" : tab === "transactions" ? "Transactions" : "Overview"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* ── OVERVIEW TAB ── */}
            {activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="space-y-5">
                {/* Collection chart */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="font-black text-slate-900 text-sm">Monthly Collection vs Target</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Fee income — Second Term 2024/2025</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-500" /><span className="text-slate-500 font-medium">Collected</span></div>
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-slate-200" /><span className="text-slate-500 font-medium">Target</span></div>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={MONTHLY_COLLECTION} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `₦${v/1000000}M`} />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="target" fill="#e2e8f0" radius={[6,6,0,0]} name="target" maxBarSize={36} />
                      <Bar dataKey="collected" fill="#10b981" radius={[6,6,0,0]} name="collected" maxBarSize={36} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Top defaulters */}
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-slate-900 text-sm">Outstanding Balances</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Students with unpaid or partial fees</p>
                    </div>
                    <button onClick={() => setSendingReminder(true)}
                      className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all border border-blue-200">
                      <Send className="w-3 h-3" /> Notify All
                    </button>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {defaulters.slice(0, 6).map((r, i) => (
                      <motion.div key={r.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                        <div className={`w-10 h-10 ${r.avatarColor} rounded-xl flex items-center justify-center text-white text-sm font-black flex-shrink-0`}>
                          {r.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 text-sm">{r.studentName}</p>
                          <p className="text-xs text-slate-400">{r.class} · {r.parentName}</p>
                        </div>
                        <div className="text-right mr-3">
                          <p className="font-black text-red-600 text-sm">₦{r.balance.toLocaleString()}</p>
                          <StatusBadge status={r.status} />
                        </div>
                        <button onClick={() => setRecordingFor(r)}
                          className="text-xs font-bold bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm flex-shrink-0">
                          Pay
                        </button>
                      </motion.div>
                    ))}
                  </div>
                  {defaulters.length > 6 && (
                    <div className="px-5 py-3 border-t border-slate-100 text-center">
                      <button onClick={() => { setActiveTab("records"); setFilterStatus("Unpaid"); }}
                        className="text-xs text-slate-500 font-bold hover:text-slate-800">
                        View {defaulters.length - 6} more →
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── FEE RECORDS TAB ── */}
            {activeTab === "records" && (
              <motion.div key="records" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="space-y-4">
                {/* Filters */}
                <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
                      <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Search student, admission no or class…"
                        className="text-sm text-slate-700 placeholder:text-slate-400 bg-transparent outline-none w-full" />
                      {search && <button onClick={() => setSearch("")}><X className="w-4 h-4 text-slate-400" /></button>}
                    </div>
                    <button onClick={() => setShowFilters(!showFilters)}
                      className={`flex items-center gap-2 px-4 py-2.5 border-2 rounded-xl text-sm font-bold transition-all ${showFilters ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600"}`}>
                      <Filter className="w-4 h-4" /> Filter
                    </button>
                  </div>
                  <AnimatePresence>
                    {showFilters && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Fee Status</label>
                            <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value as "All" | FeeStatus); setPage(1); }}
                              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 outline-none focus:border-emerald-400">
                              {["All","Paid","Partial","Unpaid"].map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Class</label>
                            <select value={filterClass} onChange={e => { setFilterClass(e.target.value); setPage(1); }}
                              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 outline-none focus:border-emerald-400">
                              <option value="All">All Classes</option>
                              {classes.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <p className="text-xs text-slate-400">
                    Showing <span className="font-bold text-slate-700">{filtered.length}</span> of <span className="font-bold text-slate-700">{records.length}</span> records
                  </p>
                </div>

                {/* Table */}
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50">
                          {[
                            { label:"Student", field:"studentName" as keyof FeeRecord },
                            { label:"Class", field:"class" as keyof FeeRecord },
                            { label:"Term Fee", field:"termFee" as keyof FeeRecord },
                            { label:"Paid", field:"amountPaid" as keyof FeeRecord },
                            { label:"Balance", field:"balance" as keyof FeeRecord },
                            { label:"Last Payment", field:"lastPayment" as keyof FeeRecord },
                            { label:"Status", field:"status" as keyof FeeRecord },
                          ].map(col => (
                            <th key={col.label} onClick={() => toggleSort(col.field)}
                              className="text-left px-4 py-3.5 text-xs font-black text-slate-500 uppercase tracking-wide cursor-pointer hover:text-slate-800 select-none whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                {col.label}
                                <ArrowUpDown className={`w-3 h-3 ${sortField === col.field ? "text-emerald-500" : "text-slate-300"}`} />
                              </div>
                            </th>
                          ))}
                          <th className="px-4 py-3.5 text-right text-xs font-black text-slate-500 uppercase tracking-wide">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {paginated.map((r, i) => (
                          <motion.tr key={r.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 ${r.avatarColor} rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
                                  {r.avatar}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900 whitespace-nowrap">{r.studentName}</p>
                                  <p className="text-xs text-slate-400">{r.admissionNo}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">{r.class}</span>
                            </td>
                            <td className="px-4 py-3.5 font-semibold text-slate-700 whitespace-nowrap">₦{r.termFee.toLocaleString()}</td>
                            <td className="px-4 py-3.5 font-black text-emerald-700 whitespace-nowrap">₦{r.amountPaid.toLocaleString()}</td>
                            <td className="px-4 py-3.5">
                              <span className={`font-black text-sm whitespace-nowrap ${r.balance > 0 ? "text-red-600" : "text-slate-400"}`}>
                                {r.balance > 0 ? `₦${r.balance.toLocaleString()}` : "—"}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">{r.lastPayment}</td>
                            <td className="px-4 py-3.5"><StatusBadge status={r.status} /></td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center justify-end gap-1">
                                {r.status !== "Paid" && (
                                  <button onClick={() => setRecordingFor(r)}
                                    className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors" title="Record payment">
                                    <CreditCard className="w-4 h-4" />
                                  </button>
                                )}
                                <button className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors" title="View">
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                    {filtered.length === 0 && (
                      <div className="py-16 text-center">
                        <CreditCard className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                        <p className="font-bold text-slate-500">No fee records found</p>
                      </div>
                    )}
                  </div>
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3.5 border-t border-slate-100">
                      <p className="text-xs text-slate-500">Page <span className="font-bold">{page}</span> of <span className="font-bold">{totalPages}</span></p>
                      <div className="flex items-center gap-1.5">
                        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                          className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 text-slate-600">
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                          <button key={p} onClick={() => setPage(p)}
                            className={`w-8 h-8 rounded-lg text-xs font-bold ${page === p ? "bg-emerald-600 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                            {p}
                          </button>
                        ))}
                        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                          className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 text-slate-600">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── TRANSACTIONS TAB ── */}
            {activeTab === "transactions" && (
              <motion.div key="transactions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-slate-900 text-sm">Recent Transactions</h3>
                      <p className="text-xs text-slate-400 mt-0.5">All fee payments this term</p>
                    </div>
                    <button className="flex items-center gap-1.5 text-xs font-bold text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-all">
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {RECENT_PAYMENTS.map((p, i) => (
                      <motion.div key={p.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                        <div className={`w-10 h-10 ${p.avatarColor} rounded-xl flex items-center justify-center text-white text-sm font-black flex-shrink-0`}>
                          {p.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900">{p.studentName}</p>
                          <p className="text-xs text-slate-400">{p.class} · {p.receiptNo}</p>
                        </div>
                        <div className="hidden sm:block text-center">
                          <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">{p.method}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-slate-900 text-base">₦{p.amount.toLocaleString()}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{p.date}</p>
                        </div>
                        <div className="flex-shrink-0">
                          {p.status === "confirmed"
                            ? <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200"><CheckCircle className="w-3 h-3" /> Confirmed</span>
                            : <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-200"><Clock className="w-3 h-3" /> Pending</span>
                          }
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {recordingFor !== null && (
          <RecordPaymentModal
            record={recordingFor === "new" ? null : recordingFor}
            onClose={() => setRecordingFor(null)}
            onSave={handlePaymentSave}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {sendingReminder && (
          <SendReminderModal defaulters={defaulters} onClose={() => setSendingReminder(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}