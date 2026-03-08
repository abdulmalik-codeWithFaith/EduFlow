"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  School, LayoutDashboard, Users, UserCheck, CreditCard, BookOpen,
  Megaphone, BarChart3, Settings, Search, Menu, X, Plus, Download,
  GraduationCap, LogOut, Eye, Pencil, Trash2, Send, Clock, CheckCircle,
  Pin, PinOff, Bell, BellOff, Globe, UserCheck as TeacherIcon,
  GraduationCap as StudentIcon, Users as ParentIcon, Filter,
  CalendarDays, ChevronDown, Loader2, ChevronLeft, ChevronRight,
  AlertCircle, BookMarked, Award, Megaphone as AnnouncementIcon,
  ArrowUpRight, MoreHorizontal, Image as ImageIcon,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Audience = "All" | "Students" | "Teachers" | "Parents" | "Students & Parents" | "Teachers & Students";
type AnnouncementType = "General" | "Exam" | "Event" | "Alert" | "Holiday" | "Academic";
type AnnouncementStatus = "Published" | "Draft" | "Scheduled";

interface Announcement {
  id: string;
  title: string;
  body: string;
  audience: Audience;
  type: AnnouncementType;
  status: AnnouncementStatus;
  pinned: boolean;
  author: string;
  publishedAt: string;
  scheduledFor?: string;
  views: number;
  notified: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id:"1", title:"Second Term Examination Timetable", body:"The second term examinations will commence on Monday, 3rd February 2025. All students must be seated by 7:45 AM. Students are advised to study hard and come prepared. Bring all required stationery. No student will be allowed into the hall after the examination has started.", audience:"Students", type:"Exam", status:"Published", pinned:true, author:"Dr. C. Okonkwo", publishedAt:"Today, 9:00 AM", views:412, notified:true },
  { id:"2", title:"PTA Meeting — Saturday, 1st February", body:"All parents and guardians are invited to the Parent-Teacher Association meeting scheduled for Saturday, 1st February 2025 at 10:00 AM in the school hall. Agenda includes: second term progress review, school development fund, and student welfare update. Attendance is mandatory.", audience:"Parents", type:"Event", status:"Published", pinned:true, author:"Dr. C. Okonkwo", publishedAt:"Yesterday, 2:30 PM", views:298, notified:true },
  { id:"3", title:"Staff Meeting — Thursday 4 PM", body:"All teaching and non-teaching staff are required to attend the staff meeting scheduled for Thursday, 30th January 2025 at 4:00 PM in the conference room. The agenda includes second term result compilation deadline, new academic calendar updates, and staff welfare matters.", audience:"Teachers", type:"General", status:"Published", pinned:false, author:"Dr. C. Okonkwo", publishedAt:"2 days ago", views:48, notified:true },
  { id:"4", title:"Mid-Term Break Notice", body:"Students and staff are hereby informed that the mid-term break will run from Friday, 7th February to Monday, 10th February 2025. School resumes on Tuesday, 11th February 2025. Students must return with mid-term assignments completed.", audience:"All", type:"Holiday", status:"Published", pinned:false, author:"Dr. C. Okonkwo", publishedAt:"3 days ago", views:645, notified:true },
  { id:"5", title:"Science Fair — Sign-Up Open", body:"The Annual Science and Technology Fair is scheduled for Friday, 21st February 2025. All SS students are encouraged to participate. Registration forms are available from your class teachers. Deadline for submission of project proposals is 14th February 2025.", audience:"Students & Parents", type:"Academic", status:"Published", pinned:false, author:"Mr. E. Abubakar", publishedAt:"4 days ago", views:187, notified:false },
  { id:"6", title:"Second Term Result Submission Deadline", body:"All subject teachers are reminded that the deadline for submitting second term CA scores is Friday, 31st January 2025. Please use the EduFlow portal to enter scores. Any scores submitted after the deadline will not be included in the published results.", audience:"Teachers", type:"Alert", status:"Published", pinned:false, author:"Dr. C. Okonkwo", publishedAt:"5 days ago", views:44, notified:true },
  { id:"7", title:"End of Term Prize Giving Day", body:"The school will host the second term Prize Giving Day on Friday, 28th February 2025. All award winners will be notified by their class teachers. Parents are warmly invited to attend this special ceremony. Dress code: full school uniform.", audience:"All", type:"Event", status:"Scheduled", pinned:false, author:"Dr. C. Okonkwo", publishedAt:"—", scheduledFor:"28 Feb 2025, 10:00 AM", views:0, notified:false },
  { id:"8", title:"New Academic Calendar 2025/2026", body:"The new academic calendar for the 2025/2026 session is now available. Please note that resumption for first term will be on Monday, 15th September 2025. Full calendar details are available on the school notice board and EduFlow portal.", audience:"Teachers & Students", type:"Academic", status:"Draft", pinned:false, author:"Dr. C. Okonkwo", publishedAt:"—", views:0, notified:false },
  { id:"9", title:"Library Reading Week — 10th–14th Feb", body:"The school library will host its annual Reading Week from 10th to 14th February 2025. Special prizes will be awarded to the most active readers. Students are encouraged to borrow books and participate in the reading challenge. Visit the library during break and free periods.", audience:"Students", type:"Academic", status:"Draft", pinned:false, author:"Mrs. N. Okonkwo", publishedAt:"—", views:0, notified:false },
];

// ─── Audience config ──────────────────────────────────────────────────────────

const AUDIENCE_CONFIG: Record<Audience, { color: string; bg: string; border: string; icon: React.ElementType; desc: string }> = {
  "All":                { color:"text-slate-700", bg:"bg-slate-100", border:"border-slate-200", icon: Globe, desc:"Everyone in the school" },
  "Students":           { color:"text-blue-700",  bg:"bg-blue-50",   border:"border-blue-200",  icon: StudentIcon, desc:"Students only" },
  "Teachers":           { color:"text-violet-700",bg:"bg-violet-50", border:"border-violet-200",icon: TeacherIcon, desc:"Teaching staff only" },
  "Parents":            { color:"text-emerald-700",bg:"bg-emerald-50",border:"border-emerald-200",icon:ParentIcon, desc:"Parents & guardians" },
  "Students & Parents": { color:"text-teal-700",  bg:"bg-teal-50",   border:"border-teal-200",  icon: Users, desc:"Students and their parents" },
  "Teachers & Students":{ color:"text-indigo-700",bg:"bg-indigo-50", border:"border-indigo-200",icon:Users, desc:"All teachers and students" },
};

const TYPE_CONFIG: Record<AnnouncementType, { color: string; bg: string }> = {
  General:  { color:"text-slate-600",   bg:"bg-slate-100" },
  Exam:     { color:"text-red-700",     bg:"bg-red-50" },
  Event:    { color:"text-blue-700",    bg:"bg-blue-50" },
  Alert:    { color:"text-orange-700",  bg:"bg-orange-50" },
  Holiday:  { color:"text-emerald-700", bg:"bg-emerald-50" },
  Academic: { color:"text-violet-700",  bg:"bg-violet-50" },
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Students", href: "/dashboard/students" },
  { icon: GraduationCap, label: "Teachers", href: "/dashboard/teachers" },
  { icon: UserCheck, label: "Attendance", href: "/dashboard/attendance" },
  { icon: CreditCard, label: "Fees", href: "/dashboard/fees" },
  { icon: BookOpen, label: "Results", href: "/dashboard/results" },
  { icon: Megaphone, label: "Announcements", href: "/dashboard/announcements", active: true },
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

// ─── Audience Pill ────────────────────────────────────────────────────────────

function AudiencePill({ audience, size = "md" }: { audience: Audience; size?: "sm" | "md" }) {
  const cfg = AUDIENCE_CONFIG[audience];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 font-bold border rounded-full ${cfg.color} ${cfg.bg} ${cfg.border}
      ${size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1"}`}>
      <Icon className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      {audience}
    </span>
  );
}

function TypeTag({ type }: { type: AnnouncementType }) {
  const cfg = TYPE_CONFIG[type];
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${cfg.color} ${cfg.bg}`}>{type}</span>;
}

function StatusPill({ status }: { status: AnnouncementStatus }) {
  const map = {
    Published: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Draft: "bg-amber-50 text-amber-700 border-amber-200",
    Scheduled: "bg-blue-50 text-blue-700 border-blue-200",
  };
  const dots = { Published:"bg-emerald-500", Draft:"bg-amber-500", Scheduled:"bg-blue-500" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${map[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status]}`} />
      {status}
    </span>
  );
}

// ─── Compose Modal ────────────────────────────────────────────────────────────

interface ComposeForm {
  title: string;
  body: string;
  audience: Audience;
  type: AnnouncementType;
  pinned: boolean;
  notify: boolean;
  schedule: boolean;
  scheduledFor: string;
}

function ComposeModal({ existing, onClose, onSave }: {
  existing?: Announcement | null;
  onClose: () => void;
  onSave: (a: Announcement) => void;
}) {
  const [form, setForm] = useState<ComposeForm>({
    title: existing?.title ?? "",
    body: existing?.body ?? "",
    audience: existing?.audience ?? "All",
    type: existing?.type ?? "General",
    pinned: existing?.pinned ?? false,
    notify: existing?.notified ?? true,
    schedule: existing?.status === "Scheduled",
    scheduledFor: existing?.scheduledFor ?? "",
  });
  const [errors, setErrors] = useState<Partial<ComposeForm>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [publishMode, setPublishMode] = useState<"publish" | "draft">("publish");

  const set = <K extends keyof ComposeForm>(k: K, v: ComposeForm[K]) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => ({ ...p, [k]: undefined }));
  };

  const validate = () => {
    const e: Partial<ComposeForm> = {};
    if (!form.title.trim()) e.title = "Title is required" as never;
    if (!form.body.trim()) e.body = "Announcement body is required" as never;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async (mode: "publish" | "draft") => {
    if (!validate()) return;
    setPublishMode(mode);
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));

    const a: Announcement = {
      id: existing?.id ?? Date.now().toString(),
      title: form.title,
      body: form.body,
      audience: form.audience,
      type: form.type,
      pinned: form.pinned,
      notified: form.notify,
      author: "Dr. C. Okonkwo",
      publishedAt: mode === "publish" ? "Just now" : "—",
      scheduledFor: form.schedule ? form.scheduledFor : undefined,
      views: existing?.views ?? 0,
      status: mode === "draft" ? "Draft" : form.schedule ? "Scheduled" : "Published",
    };

    onSave(a);
    setLoading(false);
    setDone(true);
    setTimeout(onClose, 900);
  };

  const audienceOptions: Audience[] = ["All","Students","Teachers","Parents","Students & Parents","Teachers & Students"];
  const typeOptions: AnnouncementType[] = ["General","Exam","Event","Alert","Holiday","Academic"];

  const selectedAudience = AUDIENCE_CONFIG[form.audience];
  const AudienceIcon = selectedAudience.icon;
  const recipientDesc = selectedAudience.desc;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 20 }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <AnnouncementIcon className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-black text-slate-900">{existing ? "Edit Announcement" : "New Announcement"}</h2>
              <p className="text-xs text-slate-400">Compose and send to your audience</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"><X className="w-5 h-5" /></button>
        </div>

        {done ? (
          <div className="flex flex-col items-center justify-center py-14 text-center px-6">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 220 }}
              className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </motion.div>
            <h3 className="font-black text-slate-900 text-lg mb-1">
              {publishMode === "publish" ? "Announcement Published!" : "Saved as Draft"}
            </h3>
            <p className="text-sm text-slate-500">
              {publishMode === "publish" ? `Sent to: ${form.audience}` : "You can publish it later."}
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Announcement Title *</label>
              <input value={form.title} onChange={e => set("title", e.target.value)}
                placeholder="e.g. Second Term Examination Timetable"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none transition-all
                  ${errors.title ? "border-red-300 ring-2 ring-red-100" : "border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"}`} />
              {errors.title && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{String(errors.title)}</p>}
            </div>

            {/* Audience + Type row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Audience */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Target Audience *</label>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {audienceOptions.map(opt => {
                      const cfg = AUDIENCE_CONFIG[opt];
                      const Icon = cfg.icon;
                      const selected = form.audience === opt;
                      return (
                        <button key={opt} type="button" onClick={() => set("audience", opt)}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-xs font-bold transition-all text-left
                            ${selected ? `${cfg.border} ${cfg.bg} ${cfg.color}` : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"}`}>
                          <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${selectedAudience.bg} ${selectedAudience.border} border`}>
                    <AudienceIcon className={`w-4 h-4 ${selectedAudience.color} flex-shrink-0`} />
                    <p className={`text-xs font-semibold ${selectedAudience.color}`}>{recipientDesc}</p>
                  </div>
                </div>
              </div>

              {/* Type + options */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Announcement Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {typeOptions.map(opt => {
                      const cfg = TYPE_CONFIG[opt];
                      const selected = form.type === opt;
                      return (
                        <button key={opt} type="button" onClick={() => set("type", opt)}
                          className={`px-3 py-2 rounded-xl border-2 text-xs font-bold transition-all
                            ${selected ? `border-current ${cfg.bg} ${cfg.color}` : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-2">
                  {[
                    { key: "pinned" as const, label: "📌 Pin to top", sub: "Always show first" },
                    { key: "notify" as const, label: "🔔 Send notification", sub: "Push alert to app" },
                    { key: "schedule" as const, label: "📅 Schedule for later", sub: "Set a publish date" },
                  ].map(t => (
                    <div key={t.key} onClick={() => set(t.key, !form[t.key])}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-all
                        ${form[t.key] ? "border-emerald-400 bg-emerald-50" : "border-slate-200 hover:border-slate-300"}`}>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{t.label}</p>
                        <p className="text-xs text-slate-400">{t.sub}</p>
                      </div>
                      <div className={`w-9 h-5 rounded-full transition-all flex-shrink-0 ${form[t.key] ? "bg-emerald-500" : "bg-slate-200"}`}>
                        <motion.div animate={{ x: form[t.key] ? 16 : 2 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          className="w-4 h-4 mt-0.5 bg-white rounded-full shadow-sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Scheduled date input */}
            <AnimatePresence>
              {form.schedule && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Schedule Date & Time</label>
                  <input type="datetime-local" value={form.scheduledFor} onChange={e => set("scheduledFor", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Body */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Announcement Body *</label>
              <textarea value={form.body} onChange={e => set("body", e.target.value)} rows={6}
                placeholder="Write the full announcement here…"
                className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all resize-none leading-relaxed
                  ${errors.body ? "border-red-300 ring-2 ring-red-100" : "border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"}`} />
              <div className="flex items-center justify-between mt-1">
                {errors.body ? <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{String(errors.body)}</p> : <span />}
                <p className="text-xs text-slate-400">{form.body.length} characters</p>
              </div>
            </div>

            {/* Preview card */}
            {(form.title || form.body) && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Preview</p>
                <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <AudiencePill audience={form.audience} size="sm" />
                    <TypeTag type={form.type} />
                    {form.pinned && <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">📌 Pinned</span>}
                  </div>
                  <h4 className="font-black text-slate-900 text-sm mb-1.5">{form.title || "Untitled announcement"}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{form.body || "No body yet…"}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {!done && (
          <div className="px-6 py-4 border-t border-slate-100 flex gap-3 flex-shrink-0">
            <button onClick={() => handleSave("draft")} disabled={loading}
              className="flex-1 py-3 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl text-sm transition-all disabled:opacity-60">
              Save as Draft
            </button>
            <motion.button onClick={() => handleSave("publish")} disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-colors">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Publishing…</>
                : form.schedule ? <><CalendarDays className="w-4 h-4" />Schedule</>
                : <><Send className="w-4 h-4" />Publish Now</>}
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Detail Drawer ────────────────────────────────────────────────────────────

function AnnouncementDrawer({ a, onClose, onEdit, onDelete, onPublish, onTogglePin }: {
  a: Announcement; onClose: () => void; onEdit: () => void;
  onDelete: () => void; onPublish: () => void; onTogglePin: () => void;
}) {
  const cfg = AUDIENCE_CONFIG[a.audience];
  const AudienceIcon = cfg.icon;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex justify-end" onClick={onClose}>
      <motion.div initial={{ x: 480 }} animate={{ x: 0 }} exit={{ x: 480 }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}>

        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-black text-slate-900">Announcement</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"><X className="w-5 h-5" /></button>
        </div>

        {/* Top meta */}
        <div className={`px-6 py-5 border-b border-slate-100 ${cfg.bg}`}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex flex-wrap gap-2">
              <AudiencePill audience={a.audience} />
              <TypeTag type={a.type} />
              {a.pinned && <span className="text-xs font-bold text-amber-600 bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-full">📌 Pinned</span>}
            </div>
            <StatusPill status={a.status} />
          </div>
          <h3 className={`font-black text-slate-900 text-lg leading-tight mb-2`}>{a.title}</h3>
          <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
            <span className="font-semibold">{a.author}</span>
            <span>·</span>
            <span>{a.status === "Scheduled" ? `Scheduled: ${a.scheduledFor}` : a.publishedAt}</span>
            {a.status === "Published" && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{a.views} views</span>
              </>
            )}
          </div>
        </div>

        {/* Audience breakdown */}
        <div className="px-6 py-5 border-b border-slate-100">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Recipients</p>
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${cfg.border} ${cfg.bg}`}>
            <div className={`w-10 h-10 bg-white/70 rounded-xl flex items-center justify-center flex-shrink-0`}>
              <AudienceIcon className={`w-5 h-5 ${cfg.color}`} />
            </div>
            <div>
              <p className={`font-black text-sm ${cfg.color}`}>{a.audience}</p>
              <p className="text-xs text-slate-500">{cfg.desc}</p>
            </div>
            {a.notified && (
              <div className="ml-auto flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <Bell className="w-3 h-3" /> Notified
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 border-b border-slate-100">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Content</p>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{a.body}</p>
        </div>

        {/* Actions */}
        <div className="px-6 py-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => { onTogglePin(); }}
              className="flex items-center justify-center gap-2 py-2.5 border-2 border-slate-200 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 text-slate-700 font-bold rounded-xl text-sm transition-all">
              {a.pinned ? <><PinOff className="w-4 h-4" /> Unpin</> : <><Pin className="w-4 h-4" /> Pin</>}
            </button>
            <button onClick={onEdit}
              className="flex items-center justify-center gap-2 py-2.5 border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-bold rounded-xl text-sm transition-all">
              <Pencil className="w-4 h-4" /> Edit
            </button>
          </div>
          {a.status !== "Published" && (
            <button onClick={() => { onPublish(); onClose(); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-sm shadow-md transition-colors">
              <Send className="w-4 h-4" /> Publish Now
            </button>
          )}
          <button onClick={() => { onDelete(); onClose(); }}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-sm transition-all">
            <Trash2 className="w-4 h-4" /> Delete Announcement
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Announcement Card ────────────────────────────────────────────────────────

function AnnouncementCard({ a, onClick, onEdit, onDelete, onTogglePin, onPublish, delay }: {
  a: Announcement; onClick: () => void; onEdit: () => void;
  onDelete: () => void; onTogglePin: () => void; onPublish: () => void; delay: number;
}) {
  const cfg = AUDIENCE_CONFIG[a.audience];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22,1,0.36,1] }}
      className={`bg-white border-2 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group cursor-pointer
        ${a.pinned ? "border-amber-200 hover:border-amber-300" : "border-slate-100 hover:border-slate-200"}`}
      onClick={onClick}>

      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-wrap gap-2 flex-1 min-w-0">
          <AudiencePill audience={a.audience} size="sm" />
          <TypeTag type={a.type} />
          {a.pinned && <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">📌 Pinned</span>}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusPill status={a.status} />
          <div className="relative" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={onTogglePin} className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-colors" title={a.pinned ? "Unpin" : "Pin"}>
                {a.pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
              </button>
              <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
              <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-black text-slate-900 text-base leading-tight mb-2 line-clamp-2">{a.title}</h3>

      {/* Body preview */}
      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4">{a.body}</p>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-500">{a.author}</span>
          <span>·</span>
          <span>{a.status === "Scheduled" ? `Scheduled: ${a.scheduledFor}` : a.publishedAt}</span>
        </div>
        <div className="flex items-center gap-3">
          {a.notified && <span className="flex items-center gap-1 text-emerald-600 font-semibold"><Bell className="w-3 h-3" />Sent</span>}
          {a.status === "Published" && <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{a.views}</span>}
          {a.status !== "Published" && (
            <button onClick={e => { e.stopPropagation(); onPublish(); }}
              className="text-xs font-black text-emerald-600 hover:underline">Publish →</button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AnnouncementsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [search, setSearch] = useState("");
  const [filterAudience, setFilterAudience] = useState<Audience | "All">("All");
  const [filterStatus, setFilterStatus] = useState<AnnouncementStatus | "All">("All");
  const [filterType, setFilterType] = useState<AnnouncementType | "All">("All");
  const [showFilters, setShowFilters] = useState(false);
  const [composing, setComposing] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [viewing, setViewing] = useState<Announcement | null>(null);
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");

  const stats = useMemo(() => ({
    total: announcements.length,
    published: announcements.filter(a => a.status === "Published").length,
    drafts: announcements.filter(a => a.status === "Draft").length,
    scheduled: announcements.filter(a => a.status === "Scheduled").length,
    pinned: announcements.filter(a => a.pinned).length,
  }), [announcements]);

  const filtered = useMemo(() => {
    const pinned = announcements.filter(a => a.pinned);
    const rest = announcements.filter(a => !a.pinned);
    return [...pinned, ...rest].filter(a => {
      const q = search.toLowerCase();
      if (q && !a.title.toLowerCase().includes(q) && !a.body.toLowerCase().includes(q)) return false;
      if (filterAudience !== "All" && a.audience !== filterAudience) return false;
      if (filterStatus !== "All" && a.status !== filterStatus) return false;
      if (filterType !== "All" && a.type !== filterType) return false;
      return true;
    });
  }, [announcements, search, filterAudience, filterStatus, filterType]);

  const hasFilters = filterAudience !== "All" || filterStatus !== "All" || filterType !== "All";

  const update = (id: string, patch: Partial<Announcement>) =>
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a));

  const handleSave = (a: Announcement) => {
    setAnnouncements(prev => {
      const exists = prev.find(x => x.id === a.id);
      return exists ? prev.map(x => x.id === a.id ? a : x) : [a, ...prev];
    });
  };

  const audienceOptions: Audience[] = ["All","Students","Teachers","Parents","Students & Parents","Teachers & Students"];

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
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 rounded-lg hover:bg-slate-100"><Menu className="w-5 h-5" /></button>
            <div>
              <h1 className="text-lg font-black text-slate-900">Announcements</h1>
              <p className="text-xs text-slate-400 mt-0.5">{stats.published} published · {stats.drafts} drafts · {stats.scheduled} scheduled</p>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => setComposing(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition-colors">
            <Plus className="w-4 h-4" /> New Announcement
          </motion.button>
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-5">

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { label:"Total", value:stats.total, color:"text-slate-700", bg:"bg-white border border-slate-100" },
              { label:"Published", value:stats.published, color:"text-emerald-700", bg:"bg-emerald-50 border border-emerald-100" },
              { label:"Drafts", value:stats.drafts, color:"text-amber-700", bg:"bg-amber-50 border border-amber-100" },
              { label:"Scheduled", value:stats.scheduled, color:"text-blue-700", bg:"bg-blue-50 border border-blue-100" },
              { label:"Pinned", value:stats.pinned, color:"text-orange-700", bg:"bg-orange-50 border border-orange-100" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`${s.bg} rounded-2xl p-4 shadow-sm text-center`}>
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-xs font-bold text-slate-500 mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Audience quick filters */}
          <div className="flex flex-wrap gap-2">
            <p className="text-xs font-bold text-slate-500 flex items-center mr-1">Filter by audience:</p>
            {(["All" as const, "Students", "Teachers", "Parents", "Students & Parents", "Teachers & Students"] as (Audience | "All")[]).map(opt => {
              const selected = filterAudience === opt;
              const cfg = opt !== "All" ? AUDIENCE_CONFIG[opt] : null;
              const Icon = cfg?.icon;
              return (
                <button key={opt} onClick={() => setFilterAudience(opt)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all
                    ${selected
                      ? cfg ? `${cfg.border} ${cfg.bg} ${cfg.color}` : "border-slate-800 bg-slate-800 text-white"
                      : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Search + filters bar */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
                <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search announcements…"
                  className="text-sm text-slate-700 placeholder:text-slate-400 bg-transparent outline-none w-full" />
                {search && <button onClick={() => setSearch("")}><X className="w-4 h-4 text-slate-400" /></button>}
              </div>
              <button onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 border-2 rounded-xl text-sm font-bold transition-all ${showFilters || hasFilters ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600"}`}>
                <Filter className="w-4 h-4" /> Filters {hasFilters && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
              </button>
            </div>
            <AnimatePresence>
              {showFilters && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                    {[
                      { label:"Status", value:filterStatus, onChange:(v:string) => setFilterStatus(v as AnnouncementStatus | "All"), options:["All","Published","Draft","Scheduled"] },
                      { label:"Type", value:filterType, onChange:(v:string) => setFilterType(v as AnnouncementType | "All"), options:["All","General","Exam","Event","Alert","Holiday","Academic"] },
                    ].map(f => (
                      <div key={f.label}>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">{f.label}</label>
                        <select value={f.value} onChange={e => f.onChange(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 outline-none focus:border-emerald-400">
                          {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                    ))}
                    <div className="flex items-end">
                      <button onClick={() => { setFilterStatus("All"); setFilterType("All"); setFilterAudience("All"); }}
                        className="w-full py-2 text-xs font-bold text-red-500 hover:text-red-700 border border-red-200 hover:bg-red-50 rounded-xl transition-all">
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">
                <span className="font-bold text-slate-700">{filtered.length}</span> announcements
              </p>
            </div>
          </div>

          {/* Announcement cards */}
          {filtered.length === 0 ? (
            <div className="py-20 text-center bg-white border border-slate-100 rounded-2xl">
              <Megaphone className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="font-bold text-slate-500">No announcements found</p>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
              <button onClick={() => setComposing(true)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-sm">
                <Plus className="w-4 h-4" /> Create Announcement
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((a, i) => (
                <AnnouncementCard key={a.id} a={a} delay={i * 0.04}
                  onClick={() => setViewing(a)}
                  onEdit={() => { setEditing(a); setComposing(true); }}
                  onDelete={() => setAnnouncements(prev => prev.filter(x => x.id !== a.id))}
                  onTogglePin={() => update(a.id, { pinned: !a.pinned })}
                  onPublish={() => update(a.id, { status: "Published", publishedAt: "Just now" })}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {composing && (
          <ComposeModal
            existing={editing}
            onClose={() => { setComposing(false); setEditing(null); }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {viewing && (
          <AnnouncementDrawer a={viewing}
            onClose={() => setViewing(null)}
            onEdit={() => { setEditing(viewing); setComposing(true); setViewing(null); }}
            onDelete={() => { setAnnouncements(prev => prev.filter(x => x.id !== viewing.id)); setViewing(null); }}
            onPublish={() => update(viewing.id, { status: "Published", publishedAt: "Just now" })}
            onTogglePin={() => update(viewing.id, { pinned: !viewing.pinned })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}