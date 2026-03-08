"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Plus, Megaphone, Pin, PinOff, Globe, School,
  Users, AlertTriangle, Info, CheckCircle, Clock, Search,
  Eye, Trash2, Edit2, Send, Loader2, ChevronDown, BookOpen,
  Bell, Calendar,
} from "lucide-react";
import { SuperSidebar } from "../page";

// ─── Types & Data ─────────────────────────────────────────────────────────────

type AnnType = "General" | "Maintenance" | "Feature" | "Policy" | "Urgent";
type AnnStatus = "Published" | "Draft" | "Scheduled";
type Audience = "All Schools" | "Enterprise" | "Professional" | "Free Trial";

interface Announcement {
  id: string;
  title: string;
  body: string;
  type: AnnType;
  status: AnnStatus;
  audience: Audience;
  pinned: boolean;
  publishedAt: string;
  scheduledFor?: string;
  readCount: number;
  totalRecipients: number;
  from: string;
}

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "1", pinned: true, status: "Published", type: "Urgent",
    title: "Scheduled Maintenance — Sunday 2AM–4AM WAT",
    body: "EduFlow will undergo scheduled maintenance on Sunday, 9th March 2025 between 2:00 AM and 4:00 AM WAT. All services will be temporarily unavailable during this window. Please ensure any critical operations (attendance marking, exam result entries) are completed before the maintenance window. We apologise for any inconvenience.",
    audience: "All Schools", publishedAt: "Today, 8:00 AM",
    readCount: 41, totalRecipients: 47, from: "Platform Team",
  },
  {
    id: "2", pinned: true, status: "Published", type: "Feature",
    title: "New Feature: AI-Powered Report Generation",
    body: "We are excited to announce the launch of AI-powered report generation across all EduFlow dashboards. School admins can now generate comprehensive term reports, attendance summaries, and fee collection analyses at the click of a button. Available immediately on Professional and Enterprise plans.",
    audience: "All Schools", publishedAt: "Feb 28, 2025",
    readCount: 44, totalRecipients: 47, from: "Product Team",
  },
  {
    id: "3", pinned: false, status: "Published", type: "Policy",
    title: "Updated Terms of Service — Effective April 1, 2025",
    body: "Our Terms of Service have been updated to reflect new data protection requirements under the Nigeria Data Protection Act (NDPA) 2023. The key changes include updated data retention policies, new provisions for parental consent management, and clarification on school data ownership. All school administrators are required to review and accept the updated terms before April 1, 2025.",
    audience: "All Schools", publishedAt: "Feb 24, 2025",
    readCount: 38, totalRecipients: 47, from: "Legal Team",
  },
  {
    id: "4", pinned: false, status: "Published", type: "General",
    title: "Q1 2025 Platform Performance Report Available",
    body: "Your Q1 2025 platform performance report is now available in your school analytics dashboard. The report includes attendance trends, academic performance summaries, fee collection rates, and platform usage metrics. Enterprise plan subscribers also have access to the comparative benchmarking report against similar schools on the platform.",
    audience: "Enterprise", publishedAt: "Feb 20, 2025",
    readCount: 9, totalRecipients: 9, from: "Analytics Team",
  },
  {
    id: "5", pinned: false, status: "Scheduled", type: "Maintenance",
    title: "API Rate Limit Update — March 15",
    body: "Effective March 15, 2025, API rate limits for Professional plan integrations will be updated from 500 to 1,000 requests per hour. Enterprise plans remain unlimited. This change is to accommodate growing usage patterns and improve platform stability.",
    audience: "Professional", publishedAt: "—", scheduledFor: "Mar 12, 2025",
    readCount: 0, totalRecipients: 34, from: "Engineering Team",
  },
  {
    id: "6", pinned: false, status: "Draft", type: "Feature",
    title: "Upcoming: Parent Mobile App Beta",
    body: "We are preparing to launch the EduFlow Parent Mobile App in beta. Schools on Professional and Enterprise plans will receive early access invitations. The app features real-time attendance notifications, result viewing, fee payment, and direct messaging with teachers.",
    audience: "All Schools", publishedAt: "—",
    readCount: 0, totalRecipients: 47, from: "Product Team",
  },
];

const TYPE_CONFIG: Record<AnnType, { icon: React.ElementType; color: string; bg: string; border: string }> = {
  General:     { icon: Globe,         color: "text-zinc-600",   bg: "bg-zinc-100",   border: "border-zinc-200"   },
  Maintenance: { icon: AlertTriangle, color: "text-orange-700", bg: "bg-orange-50",  border: "border-orange-200" },
  Feature:     { icon: Bell,          color: "text-violet-700", bg: "bg-violet-50",  border: "border-violet-200" },
  Policy:      { icon: BookOpen,      color: "text-blue-700",   bg: "bg-blue-50",    border: "border-blue-200"   },
  Urgent:      { icon: AlertTriangle, color: "text-red-700",    bg: "bg-red-50",     border: "border-red-200"    },
};

const STATUS_CONFIG: Record<AnnStatus, { color: string; bg: string; border: string; icon: React.ElementType }> = {
  Published:  { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", icon: CheckCircle },
  Draft:      { color: "text-zinc-600",    bg: "bg-zinc-100",   border: "border-zinc-200",    icon: Edit2 },
  Scheduled:  { color: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200",   icon: Calendar },
};

// ─── Compose Modal ────────────────────────────────────────────────────────────

function ComposeModal({ onClose, onPublish }: {
  onClose: () => void;
  onPublish: (ann: Omit<Announcement, "id" | "readCount" | "totalRecipients">) => void;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState<AnnType>("General");
  const [audience, setAudience] = useState<Audience>("All Schools");
  const [pinned, setPinned] = useState(false);
  const [step, setStep] = useState<"compose" | "preview" | "sending" | "done">("compose");

  const canPublish = title.trim().length > 0 && body.trim().length > 20;

  const handlePublish = async () => {
    setStep("sending");
    await new Promise(r => setTimeout(r, 1400));
    setStep("done");
    setTimeout(() => {
      onPublish({
        title, body, type, status: "Published", audience, pinned,
        publishedAt: "Just now", from: "Super Admin",
      });
      onClose();
    }, 1200);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}>
      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 280 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center">
              <Megaphone className="w-4 h-4 text-violet-700" />
            </div>
            <div>
              <h2 className="font-black text-zinc-900">New Announcement</h2>
              <p className="text-xs text-zinc-400">Broadcast to all schools on EduFlow</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-zinc-100 text-zinc-500"><X className="w-5 h-5" /></button>
        </div>

        {step === "done" ? (
          <div className="flex-1 flex items-center justify-center p-8 text-center">
            <div>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 14, stiffness: 300 }}
                className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </motion.div>
              <h3 className="font-black text-zinc-900 text-xl mb-1">Announcement Published!</h3>
              <p className="text-sm text-zinc-500">Sent to all {audience === "All Schools" ? "47" : audience === "Enterprise" ? "9" : "34"} recipient schools.</p>
            </div>
          </div>
        ) : step === "sending" ? (
          <div className="flex-1 flex items-center justify-center p-8 text-center">
            <div>
              <Loader2 className="w-10 h-10 text-violet-500 animate-spin mx-auto mb-4" />
              <p className="font-black text-zinc-900">Publishing announcement…</p>
              <p className="text-xs text-zinc-400 mt-1">Sending to all recipient schools</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {step === "compose" ? (
              <div className="p-6 space-y-5">
                {/* Type + Audience */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-zinc-600 uppercase tracking-wide mb-2">Type</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(["General","Maintenance","Feature","Policy","Urgent"] as AnnType[]).map(t => {
                        const cfg = TYPE_CONFIG[t];
                        return (
                          <button key={t} onClick={() => setType(t)}
                            className={`px-2 py-2 rounded-xl text-xs font-bold border-2 transition-all text-center ${type === t ? `${cfg.bg} ${cfg.color} ${cfg.border}` : "border-zinc-200 text-zinc-500 hover:border-zinc-300"}`}>
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-zinc-600 uppercase tracking-wide mb-2">Recipients</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(["All Schools","Enterprise","Professional","Free Trial"] as Audience[]).map(a => (
                        <button key={a} onClick={() => setAudience(a)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all ${audience === a ? "bg-violet-50 text-violet-700 border-violet-300" : "border-zinc-200 text-zinc-500 hover:border-zinc-300"}`}>
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-black text-zinc-600 uppercase tracking-wide mb-2">Title</label>
                  <input value={title} onChange={e => setTitle(e.target.value)}
                    placeholder="Clear, descriptive announcement title…"
                    className="w-full px-4 py-3 border-2 border-zinc-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-50 rounded-xl text-sm font-semibold text-zinc-900 outline-none transition-all placeholder:text-zinc-300" />
                </div>

                {/* Body */}
                <div>
                  <label className="block text-xs font-black text-zinc-600 uppercase tracking-wide mb-2">Message</label>
                  <textarea value={body} onChange={e => setBody(e.target.value)}
                    placeholder="Write your announcement. Be clear and concise. School admins will see this in their notice feed."
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-zinc-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-50 rounded-xl text-sm text-zinc-700 outline-none transition-all resize-none placeholder:text-zinc-300" />
                  <p className="text-xs text-zinc-400 mt-1 text-right">{body.length} chars</p>
                </div>

                {/* Pin toggle */}
                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div>
                    <p className="text-sm font-bold text-zinc-800">Pin to top</p>
                    <p className="text-xs text-zinc-400">Pinned announcements stay at the top of all school notice feeds</p>
                  </div>
                  <button onClick={() => setPinned(!pinned)}
                    className={`w-12 h-6 rounded-full transition-all flex items-center ${pinned ? "bg-violet-600 justify-end" : "bg-zinc-300 justify-start"}`}>
                    <div className="w-5 h-5 bg-white rounded-full shadow-sm mx-0.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Preview */
              <div className="p-6">
                <div className={`rounded-2xl border-2 p-5 ${TYPE_CONFIG[type].border} ${TYPE_CONFIG[type].bg}`}>
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md border ${TYPE_CONFIG[type].color} ${TYPE_CONFIG[type].bg} ${TYPE_CONFIG[type].border}`}>
                      <TypeIcon type={type} />
                      {type}
                    </span>
                    {pinned && <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">📌 Pinned</span>}
                    <span className="text-xs font-bold text-zinc-500 bg-white px-2.5 py-1 rounded-md border border-zinc-200">→ {audience}</span>
                  </div>
                  <h3 className="font-black text-zinc-900 text-lg mb-3">{title || "Your title here"}</h3>
                  <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-line">{body || "Your message will appear here…"}</p>
                  <p className="text-xs text-zinc-400 mt-4">From: Super Admin · Just now</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        {step !== "done" && step !== "sending" && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 bg-zinc-50 flex-shrink-0 gap-3">
            <div className="flex gap-2">
              <button onClick={() => setStep(step === "compose" ? "preview" : "compose")}
                className="px-4 py-2.5 border-2 border-zinc-200 text-zinc-700 font-bold rounded-xl text-sm hover:bg-white hover:border-zinc-300 transition-all">
                {step === "compose" ? "Preview" : "← Edit"}
              </button>
            </div>
            <motion.button onClick={handlePublish} disabled={!canPublish}
              whileHover={canPublish ? { scale: 1.02 } : {}}
              whileTap={canPublish ? { scale: 0.98 } : {}}
              className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black rounded-xl text-sm shadow-lg shadow-violet-200 transition-colors">
              <Send className="w-4 h-4" />
              Publish to {audience === "All Schools" ? "47" : audience === "Enterprise" ? "9" : "34"} Schools
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function TypeIcon({ type }: { type: AnnType }) {
  const cfg = TYPE_CONFIG[type];
  return <cfg.icon className="w-3.5 h-3.5" />;
}

// ─── Announcement Card ────────────────────────────────────────────────────────

function AnnCard({ ann, onTogglePin, onDelete, delay }: {
  ann: Announcement; onTogglePin: () => void; onDelete: () => void; delay: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const tCfg = TYPE_CONFIG[ann.type];
  const sCfg = STATUS_CONFIG[ann.status];
  const readRate = ann.totalRecipients > 0 ? Math.round(ann.readCount / ann.totalRecipients * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, ease: [0.22, 1, 0.36, 1] }}
      className={`bg-white border-2 rounded-2xl shadow-sm hover:shadow-md transition-all
        ${ann.pinned ? "border-amber-200" : ann.type === "Urgent" ? "border-red-200" : "border-zinc-100"}`}>

      <div className="p-5">
        {/* Tags row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md border ${tCfg.color} ${tCfg.bg} ${tCfg.border}`}>
              <tCfg.icon className="w-3.5 h-3.5" />{ann.type}
            </span>
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-md border ${sCfg.color} ${sCfg.bg} ${sCfg.border}`}>
              <sCfg.icon className="w-3 h-3" />{ann.status}
            </span>
            {ann.pinned && <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">📌 Pinned</span>}
            <span className="text-xs text-zinc-500 bg-zinc-50 border border-zinc-200 px-2.5 py-1 rounded-md flex items-center gap-1">
              <Globe className="w-3 h-3" />{ann.audience}
            </span>
          </div>
          {/* Action buttons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={onTogglePin} title={ann.pinned ? "Unpin" : "Pin"}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
              {ann.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
            </button>
            <button onClick={onDelete} title="Delete"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-black text-zinc-900 text-base leading-snug mb-2">{ann.title}</h3>

        {/* Body (expandable) */}
        <p className={`text-sm text-zinc-500 leading-relaxed ${expanded ? "" : "line-clamp-2"}`}>{ann.body}</p>
        {ann.body.length > 120 && (
          <button onClick={() => setExpanded(!expanded)} className="text-xs font-bold text-violet-600 mt-1 hover:underline">
            {expanded ? "Show less" : "Read more"}
          </button>
        )}

        {/* Meta */}
        <div className="flex items-center gap-4 mt-4 text-xs text-zinc-400">
          <span>From: <span className="font-semibold text-zinc-600">{ann.from}</span></span>
          <span>·</span>
          <span>{ann.status === "Scheduled" ? `Scheduled: ${ann.scheduledFor}` : ann.publishedAt}</span>
        </div>

        {/* Read rate */}
        {ann.status === "Published" && (
          <div className="mt-4 pt-4 border-t border-zinc-100">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-zinc-500 font-medium">Read by school admins</span>
              <span className="font-black text-zinc-800">{ann.readCount}/{ann.totalRecipients} ({readRate}%)</span>
            </div>
            <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${readRate}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full ${readRate === 100 ? "bg-emerald-500" : readRate >= 80 ? "bg-violet-500" : "bg-amber-400"}`} />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SuperAdminAnnouncementsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>(ANNOUNCEMENTS);
  const [composing, setComposing] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<AnnStatus | "All">("All");
  const [filterType, setFilterType] = useState<AnnType | "All">("All");

  const filtered = useMemo(() => {
    const pinned = announcements.filter(a => a.pinned);
    const rest = announcements.filter(a => !a.pinned);
    return [...pinned, ...rest].filter(a => {
      if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterStatus !== "All" && a.status !== filterStatus) return false;
      if (filterType !== "All" && a.type !== filterType) return false;
      return true;
    });
  }, [announcements, search, filterStatus, filterType]);

  const handlePublish = (ann: Omit<Announcement, "id" | "readCount" | "totalRecipients">) => {
    setAnnouncements(prev => [{
      ...ann, id: String(Date.now()), readCount: 0,
      totalRecipients: ann.audience === "All Schools" ? 47 : ann.audience === "Enterprise" ? 9 : 34,
    }, ...prev]);
  };

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      <div className="hidden lg:flex flex-shrink-0"><SuperSidebar active="/super-admin/announcements" /></div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-50 lg:hidden">
              <SuperSidebar active="/super-admin/announcements" mobile onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-zinc-100 flex-shrink-0 gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-zinc-100 text-zinc-500"><Menu className="w-5 h-5" /></button>
            <div>
              <h1 className="text-lg font-black text-zinc-900">Platform Announcements</h1>
              <p className="text-xs text-zinc-400 mt-0.5">Broadcast messages to all schools on EduFlow</p>
            </div>
          </div>
          <motion.button onClick={() => setComposing(true)}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-black rounded-xl text-sm shadow-lg shadow-violet-200 transition-colors">
            <Plus className="w-4 h-4" /> New Announcement
          </motion.button>
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-5">

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Published",  value: announcements.filter(a => a.status === "Published").length,  color: "bg-emerald-50 border-emerald-200 text-emerald-800" },
              { label: "Scheduled",  value: announcements.filter(a => a.status === "Scheduled").length,  color: "bg-amber-50 border-amber-200 text-amber-800" },
              { label: "Drafts",     value: announcements.filter(a => a.status === "Draft").length,      color: "bg-zinc-100 border-zinc-200 text-zinc-700" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
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
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search announcements…"
                className="text-sm bg-transparent outline-none text-zinc-700 placeholder:text-zinc-400 w-full" />
              {search && <button onClick={() => setSearch("")}><X className="w-4 h-4 text-zinc-400" /></button>}
            </div>
            <div className="flex gap-1 bg-zinc-100 p-1 rounded-xl">
              {(["All", "Published", "Scheduled", "Draft"] as const).map(f => (
                <button key={f} onClick={() => setFilterStatus(f as AnnStatus | "All")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterStatus === f ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500"}`}>
                  {f}
                </button>
              ))}
            </div>
            <div className="flex gap-1 flex-wrap">
              {(["All", "General", "Maintenance", "Feature", "Policy", "Urgent"] as const).map(f => {
                const cfg = f !== "All" ? TYPE_CONFIG[f as AnnType] : null;
                return (
                  <button key={f} onClick={() => setFilterType(f as AnnType | "All")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all
                      ${filterType === f
                        ? cfg ? `${cfg.bg} ${cfg.color} ${cfg.border}` : "bg-zinc-800 text-white border-zinc-800"
                        : "border-zinc-200 text-zinc-500 hover:border-zinc-300"}`}>
                    {f}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cards */}
          {filtered.length === 0 ? (
            <div className="py-20 bg-white border border-zinc-100 rounded-2xl text-center">
              <Megaphone className="w-12 h-12 text-zinc-200 mx-auto mb-3" />
              <p className="font-bold text-zinc-400">No announcements found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((ann, i) => (
                <AnnCard key={ann.id} ann={ann} delay={i * 0.05}
                  onTogglePin={() => setAnnouncements(prev => prev.map(a => a.id === ann.id ? { ...a, pinned: !a.pinned } : a))}
                  onDelete={() => setAnnouncements(prev => prev.filter(a => a.id !== ann.id))} />
              ))}
            </div>
          )}
        </main>
      </div>

      <AnimatePresence>
        {composing && <ComposeModal onClose={() => setComposing(false)} onPublish={handlePublish} />}
      </AnimatePresence>
    </div>
  );
}