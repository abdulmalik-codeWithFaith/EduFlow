"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, CreditCard, CheckCircle, Clock, AlertTriangle,
  Download, ChevronRight, Loader2, Smartphone, Building2,
  Receipt, Calendar, ArrowRight, Shield,
} from "lucide-react";
import { ParentSidebar } from "../page";

// ─── Types & Data ─────────────────────────────────────────────────────────────

type PaymentStatus = "Paid" | "Partial" | "Unpaid";
type PayMethod = "Bank Transfer" | "Card" | "POS" | "Online";

interface FeeItem {
  label: string;
  amount: number;
  paid: number;
  dueDate: string;
  status: PaymentStatus;
}

interface Transaction {
  id: string;
  date: string;
  amount: number;
  method: PayMethod;
  ref: string;
  confirmed: boolean;
}

const FEES: FeeItem[] = [
  { label: "School Fees",         amount: 45000, paid: 45000, dueDate: "Oct 1, 2024",  status: "Paid" },
  { label: "Development Levy",    amount: 8000,  paid: 8000,  dueDate: "Oct 1, 2024",  status: "Paid" },
  { label: "Exam Registration",   amount: 6500,  paid: 6500,  dueDate: "Dec 1, 2024",  status: "Paid" },
  { label: "Library Fee",         amount: 2000,  paid: 2000,  dueDate: "Oct 1, 2024",  status: "Paid" },
  { label: "ICT Levy",            amount: 3500,  paid: 3500,  dueDate: "Oct 1, 2024",  status: "Paid" },
  { label: "Third Term Fees",     amount: 45000, paid: 20000, dueDate: "Mar 1, 2025",  status: "Partial" },
  { label: "Sports & Activity",   amount: 2500,  paid: 0,     dueDate: "Mar 1, 2025",  status: "Unpaid" },
];

const TRANSACTIONS: Transaction[] = [
  { id: "1", date: "Jan 12, 2025",  amount: 45000, method: "Bank Transfer", ref: "GTB-20250112-88412", confirmed: true },
  { id: "2", date: "Dec 2, 2024",   amount: 6500,  method: "Card",          ref: "FLW-20241202-22714", confirmed: true },
  { id: "3", date: "Oct 5, 2024",   amount: 45000, method: "Bank Transfer", ref: "GTB-20241005-55309", confirmed: true },
  { id: "4", date: "Oct 5, 2024",   amount: 13500, method: "Card",          ref: "FLW-20241005-11203", confirmed: true },
  { id: "5", date: "Feb 14, 2025",  amount: 20000, method: "Online",        ref: "EDF-20250214-99105", confirmed: true },
];

const TERMS = ["Second Term 2024/2025", "First Term 2024/2025", "Third Term 2023/2024"];

const STATUS_CONFIG: Record<PaymentStatus, { color: string; bg: string; border: string; icon: React.ElementType }> = {
  Paid:    { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", icon: CheckCircle },
  Partial: { color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200",   icon: Clock },
  Unpaid:  { color: "text-red-700",     bg: "bg-red-50",     border: "border-red-200",     icon: AlertTriangle },
};

const METHOD_CONFIG: Record<PayMethod, { icon: React.ElementType; color: string; bg: string }> = {
  "Bank Transfer": { icon: Building2,    color: "text-blue-700",    bg: "bg-blue-50" },
  "Card":          { icon: CreditCard,   color: "text-violet-700",  bg: "bg-violet-50" },
  "POS":           { icon: Receipt,      color: "text-orange-700",  bg: "bg-orange-50" },
  "Online":        { icon: Smartphone,   color: "text-teal-700",    bg: "bg-teal-50" },
};

function fmt(n: number) { return `₦${n.toLocaleString()}`; }

// ─── Payment Modal ────────────────────────────────────────────────────────────

function PaymentModal({ fee, onClose, onSuccess }: {
  fee: FeeItem; onClose: () => void; onSuccess: (feeLabel: string, amount: number) => void;
}) {
  const balance = fee.amount - fee.paid;
  const [amount, setAmount] = useState(String(balance));
  const [method, setMethod] = useState<PayMethod>("Bank Transfer");
  const [step, setStep] = useState<"form" | "confirm" | "success">("form");
  const [processing, setProcessing] = useState(false);

  const amountNum = parseFloat(amount) || 0;
  const valid = amountNum > 0 && amountNum <= balance;

  const handlePay = async () => {
    setProcessing(true);
    setStep("confirm");
    await new Promise(r => setTimeout(r, 1800));
    setProcessing(false);
    setStep("success");
    setTimeout(() => { onSuccess(fee.label, amountNum); onClose(); }, 1500);
  };

  const BANK_DETAILS = {
    bank: "First Bank Nigeria",
    accountName: "Greenfield College",
    accountNo: "3012345678",
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}>
      <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}>

        {step === "success" ? (
          <div className="p-8 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 14, stiffness: 300, delay: 0.1 }}
              className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-teal-600" />
            </motion.div>
            <h3 className="font-black text-stone-900 text-xl mb-1">Payment Recorded!</h3>
            <p className="text-stone-500 text-sm">Your payment of <span className="font-black text-teal-700">{fmt(amountNum)}</span> has been submitted.</p>
            <p className="text-xs text-stone-400 mt-2">The school office will confirm within 24 hours.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <div>
                <h2 className="font-black text-stone-900">Make Payment</h2>
                <p className="text-xs text-stone-400 mt-0.5">{fee.label} · Balance: {fmt(balance)}</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-stone-100 text-stone-500"><X className="w-5 h-5" /></button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Amount */}
              <div>
                <label className="block text-xs font-black text-stone-600 mb-2 uppercase tracking-wide">Amount to Pay</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-stone-400 text-lg">₦</span>
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                    min={1} max={balance}
                    className="w-full pl-10 pr-4 py-3.5 border-2 border-stone-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-50 rounded-2xl text-xl font-black text-stone-900 outline-none transition-all" />
                </div>
                <div className="flex gap-2 mt-2">
                  {[balance, Math.ceil(balance/2)].map((preset, i) => (
                    <button key={preset} onClick={() => setAmount(String(preset))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${parseFloat(amount) === preset ? "bg-teal-500 text-white border-teal-500" : "border-stone-200 text-stone-600 hover:border-teal-300"}`}>
                      {i === 0 ? "Full amount" : "Half"} ({fmt(preset)})
                    </button>
                  ))}
                </div>
              </div>

              {/* Method */}
              <div>
                <label className="block text-xs font-black text-stone-600 mb-2 uppercase tracking-wide">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["Bank Transfer","Card","POS","Online"] as PayMethod[]).map(m => {
                    const cfg = METHOD_CONFIG[m];
                    return (
                      <button key={m} onClick={() => setMethod(m)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border-2 text-sm font-bold transition-all text-left ${method === m ? "border-teal-400 bg-teal-50" : "border-stone-200 hover:border-stone-300"}`}>
                        <div className={`w-8 h-8 ${cfg.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <cfg.icon className={`w-4 h-4 ${cfg.color}`} />
                        </div>
                        <span className={method === m ? "text-teal-800" : "text-stone-700"}>{m}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bank details if bank transfer */}
              {method === "Bank Transfer" && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-2">
                  <p className="text-xs font-black text-blue-800 uppercase tracking-wide mb-3">Bank Transfer Details</p>
                  {Object.entries(BANK_DETAILS).map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center">
                      <span className="text-xs text-blue-600 capitalize">{k.replace(/([A-Z])/g, " $1")}</span>
                      <span className="text-sm font-black text-blue-900">{v}</span>
                    </div>
                  ))}
                  <p className="text-xs text-blue-600 mt-2 border-t border-blue-200 pt-2">
                    Use your ward&apos;s name and admission number as payment description.
                  </p>
                </motion.div>
              )}

              {/* Security note */}
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <Shield className="w-4 h-4 flex-shrink-0" />
                <span>All payment records are reviewed and confirmed by the school bursary office.</span>
              </div>

              <motion.button onClick={handlePay} disabled={!valid || processing}
                whileHover={valid && !processing ? { scale: 1.02 } : {}}
                whileTap={valid && !processing ? { scale: 0.98 } : {}}
                className="w-full py-4 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-2xl text-base shadow-lg shadow-teal-200 transition-colors flex items-center justify-center gap-2">
                {processing ? <><Loader2 className="w-5 h-5 animate-spin" />Processing…</>
                  : <>{fmt(amountNum || 0)} — Submit Payment <ArrowRight className="w-5 h-5" /></>}
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ParentFeesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState(TERMS[0]);
  const [termOpen, setTermOpen] = useState(false);
  const [payingFee, setPayingFee] = useState<FeeItem | null>(null);
  const [fees, setFees] = useState<FeeItem[]>(FEES);
  const [transactions, setTransactions] = useState<Transaction[]>(TRANSACTIONS);

  const totalExpected = fees.reduce((a, f) => a + f.amount, 0);
  const totalPaid     = fees.reduce((a, f) => a + f.paid, 0);
  const totalOutstanding = totalExpected - totalPaid;
  const paidPct = Math.round(totalPaid / totalExpected * 100);

  const handleSuccess = (feeLabel: string, amount: number) => {
    setFees(prev => prev.map(f => {
      if (f.label !== feeLabel) return f;
      const newPaid = Math.min(f.paid + amount, f.amount);
      return { ...f, paid: newPaid, status: newPaid >= f.amount ? "Paid" : "Partial" };
    }));
    setTransactions(prev => [{
      id: String(Date.now()), date: "Just now", amount, method: "Online",
      ref: `EDF-${Date.now()}`, confirmed: false,
    }, ...prev]);
  };

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">
      <div className="hidden lg:flex flex-shrink-0"><ParentSidebar active="/parent/fees" /></div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-50 lg:hidden">
              <ParentSidebar active="/parent/fees" mobile onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-stone-100 flex-shrink-0 gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-stone-100 text-stone-500">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-black text-stone-900">Fee Payments</h1>
              <p className="text-xs text-stone-400 mt-0.5">Amara Okafor · SS 2A</p>
            </div>
          </div>
          <div className="relative">
            <button onClick={() => setTermOpen(!termOpen)}
              className="flex items-center gap-2 px-4 py-2.5 border border-stone-200 hover:border-teal-400 rounded-xl text-sm font-bold text-stone-700 bg-white transition-all">
              <Calendar className="w-4 h-4 text-stone-400" />
              <span className="hidden sm:inline">{selectedTerm}</span>
              <ChevronRight className={`w-4 h-4 text-stone-400 transition-transform ${termOpen ? "rotate-90" : ""}`} />
            </button>
            <AnimatePresence>
              {termOpen && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  className="absolute right-0 top-12 bg-white border border-stone-200 rounded-xl shadow-xl z-20 min-w-56 overflow-hidden">
                  {TERMS.map(t => (
                    <button key={t} onClick={() => { setSelectedTerm(t); setTermOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedTerm === t ? "bg-teal-50 text-teal-700 font-bold" : "text-stone-700 hover:bg-stone-50 font-medium"}`}>
                      {t}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-5">

          {/* Summary hero */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white border border-stone-100 rounded-3xl p-6 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-teal-50 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">{selectedTerm}</p>
                  <h2 className="text-2xl font-black text-stone-900">Fee Summary</h2>
                  <p className="text-stone-500 text-sm mt-0.5">Amara Okafor · Greenfield College</p>
                </div>
                {totalOutstanding > 0 ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-center flex-shrink-0">
                    <p className="text-amber-700 text-xs font-bold mb-0.5">Outstanding</p>
                    <p className="text-amber-800 text-xl font-black">{fmt(totalOutstanding)}</p>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 text-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                    <p className="text-emerald-700 text-sm font-black">All Paid</p>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-bold text-stone-600">Amount paid</span>
                  <span className="font-black text-teal-700">{paidPct}%</span>
                </div>
                <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${paidPct}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Total Expected", value: fmt(totalExpected),    color: "text-stone-900" },
                  { label: "Total Paid",     value: fmt(totalPaid),        color: "text-teal-700" },
                  { label: "Outstanding",    value: fmt(totalOutstanding), color: totalOutstanding > 0 ? "text-amber-700" : "text-stone-400" },
                ].map(s => (
                  <div key={s.label} className="bg-stone-50 rounded-xl p-3 text-center">
                    <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Fee items */}
          <div className="bg-white border border-stone-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-100">
              <h3 className="font-black text-stone-900 text-sm">Fee Breakdown</h3>
            </div>
            <div className="divide-y divide-stone-50">
              {fees.map((fee, i) => {
                const cfg = STATUS_CONFIG[fee.status];
                const balance = fee.amount - fee.paid;
                return (
                  <motion.div key={fee.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-stone-50/60 transition-colors">
                    <div className={`w-10 h-10 ${cfg.bg} rounded-xl flex items-center justify-center flex-shrink-0 border ${cfg.border}`}>
                      <cfg.icon className={`w-4.5 h-4.5 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-black text-stone-900 text-sm">{fee.label}</p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                          {fee.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-stone-400">
                        <span>{fmt(fee.paid)} paid of {fmt(fee.amount)}</span>
                        <span>·</span>
                        <span>Due: {fee.dueDate}</span>
                      </div>
                      {fee.status === "Partial" && (
                        <div className="mt-2 h-1.5 bg-stone-100 rounded-full overflow-hidden w-40">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${fee.paid/fee.amount*100}%` }} />
                        </div>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-black text-stone-900 text-sm">{fmt(fee.amount)}</p>
                      {fee.status !== "Paid" && (
                        <button onClick={() => setPayingFee(fee)}
                          className="mt-1 text-xs font-black text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 transition-all">
                          Pay {fmt(balance)}
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Transaction history */}
          <div className="bg-white border border-stone-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
              <h3 className="font-black text-stone-900 text-sm">Payment History</h3>
              <button className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-700 border border-stone-200 px-3 py-1.5 rounded-lg transition-all">
                <Download className="w-3.5 h-3.5" /> Receipt
              </button>
            </div>
            <div className="divide-y divide-stone-50">
              {transactions.map((tx, i) => {
                const mcfg = METHOD_CONFIG[tx.method];
                return (
                  <motion.div key={tx.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-stone-50/60 transition-colors">
                    <div className={`w-10 h-10 ${mcfg.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <mcfg.icon className={`w-4 h-4 ${mcfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-stone-900 text-sm">{tx.method}</p>
                      <p className="text-xs text-stone-400 mt-0.5 truncate">Ref: {tx.ref}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-black text-stone-900 text-sm">{fmt(tx.amount)}</p>
                      <div className="flex items-center gap-1.5 mt-1 justify-end">
                        {tx.confirmed
                          ? <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Confirmed
                            </span>
                          : <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Pending
                            </span>
                        }
                        <span className="text-xs text-stone-400">{tx.date}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Bank details card */}
          <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-stone-300" />
              <h3 className="font-black text-white text-sm">School Bank Details</h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { label: "Bank",           value: "First Bank Nigeria" },
                { label: "Account Name",   value: "Greenfield College" },
                { label: "Account Number", value: "3012345678" },
              ].map(d => (
                <div key={d.label} className="bg-white/10 rounded-xl px-4 py-3">
                  <p className="text-stone-400 text-xs mb-0.5">{d.label}</p>
                  <p className="text-white font-black text-sm">{d.value}</p>
                </div>
              ))}
            </div>
            <p className="text-stone-400 text-xs mt-4">
              Use your ward&apos;s name and admission number as the transfer description. All transfers must be confirmed by the school bursary before they reflect on this portal.
            </p>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {payingFee && (
          <PaymentModal fee={payingFee} onClose={() => setPayingFee(null)} onSuccess={handleSuccess} />
        )}
      </AnimatePresence>
    </div>
  );
}