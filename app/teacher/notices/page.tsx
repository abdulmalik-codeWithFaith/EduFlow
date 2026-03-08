"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Bell, Search, Pin, PinOff, Eye, Clock,
  Megaphone, AlertTriangle, Calendar, BookOpen, Globe,
  ChevronDown, Filter, CheckCircle, Users,
} from "lucide-react";
import { TeacherSidebar } from "../page";

// ─── Types ────────────────────────────────────────────────────────────────────

type NoticeType = "General" | "Exam" | "Event" | "Alert" | "Holiday" | "Academic";
type NoticeAudience = "All" | "Teachers" | "Teachers & Students";

interface Notice {
  id: string;
  title: string;
  body: string;
  type: NoticeType;
  audience: NoticeAudience;
  from: string;
  publishedAt: string;
  pinned: boolean;
  read: boolean;
  urgent: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const NOTICES: Notice[] = [
  {
    id:"1", title:"Second Term Result Submission Deadline", urgent:true, pinned:true, read:false,
    body:"All subject teachers are reminded that the deadline for submitting second term CA scores is Friday, 31st January 2025. Please use the EduFlow portal to enter scores for all your assigned classes. Any scores submitted after the deadline will not be included in the published results. Contact the admin office if you need an extension.",
    type:"Alert", audience:"Teachers", from:"Dr. C. Okonkwo", publishedAt:"5 days ago",
  },
  {
    id:"2", title:"Staff Meeting — Thursday 4 PM", urgent:true, pinned:true, read:false,
    body:"All teaching and non-teaching staff are required to attend the staff meeting scheduled for Thursday, 30th January 2025 at 4:00 PM in the conference room. Agenda: second term result compilation, new academic calendar updates, and staff welfare matters. Please come prepared.",
    type:"General", audience:"Teachers", from:"Dr. C. Okonkwo", publishedAt:"2 days ago",
  },
  {
    id:"3", title:"Science Fair Registration Open", urgent:false, pinned:false, read:true,
    body:"The Annual Science and Technology Fair is scheduled for Friday, 21st February 2025. Subject teachers are encouraged to prepare students and assist them with project proposals. Registration deadline is 14th February. Coordinate with the Science department HOD.",
    type:"Event", audience:"Teachers & Students", from:"Mr. E. Abubakar (HOD Science)", publishedAt:"4 days ago",
  },
  {
    id:"4", title:"Mid-Term Break: 7th–10th February", urgent:false, pinned:false, read:true,
    body:"This is to inform all staff that the mid-term break will run from Friday, 7th February to Monday, 10th February 2025. School resumes full academic activities on Tuesday, 11th February 2025. Teachers should give students mid-term assignments before break.",
    type:"Holiday", audience:"All", from:"Admin", publishedAt:"3 days ago",
  },
  {
    id:"5", title:"New Academic Calendar 2025/2026 Released", urgent:false, pinned:false, read:false,
    body:"The academic calendar for the 2025/2026 session has been approved and is now available. Please note key dates: First Term resumption — Monday, 15th September 2025. The full calendar is available on the EduFlow portal and on the staff notice board.",
    type:"Academic", audience:"Teachers", from:"Admin", publishedAt:"1 week ago",
  },
  {
    id:"6", title:"Second Term Examination Timetable", urgent:false, pinned:false, read:true,
    body:"The examination timetable for the second term has been finalised. Examinations commence Monday, 3rd February 2025. Invigilators have been assigned — please check your duty rota on the EduFlow portal. Ensure all students are informed of exam rules.",
    type:"Exam", audience:"Teachers & Students", from:"Dr. C. Okonkwo", publishedAt:"1 week ago",
  },
  {
    id:"7", title:"Library Resource Update", urgent:false, pinned:false, read:true,
    body:"New textbooks and reference materials have been added to the school library for Mathematics, Physics and Chemistry. Teachers are encouraged to direct students to make use of these resources especially during revision. Library hours remain 7:30 AM to 4:00 PM.",
    type:"Academic", audience:"Teachers", from:"Mrs. N. Okonkwo (Librarian)", publishedAt:"2 weeks ago",
  },
];

// ─── Type & Audience Configs ──────────────────────────────────────────────────

const TYPE_CONFIG: Record<NoticeType, { color:string; bg:string }> = {
  General:  { color:"text-slate-600",   bg:"bg-slate-100" },
  Exam:     { color:"text-red-700",     bg:"bg-red-50" },
  Event:    { color:"text-blue-700",    bg:"bg-blue-50" },
  Alert:    { color:"text-orange-700",  bg:"bg-orange-50" },
  Holiday:  { color:"text-emerald-700", bg:"bg-emerald-50" },
  Academic: { color:"text-violet-700",  bg:"bg-violet-50" },
};

const AUDIENCE_CONFIG: Record<NoticeAudience, { color:string; bg:string; border:string }> = {
  "All":                  { color:"text-slate-600",   bg:"bg-slate-100",   border:"border-slate-200" },
  "Teachers":             { color:"text-indigo-700",  bg:"bg-indigo-50",   border:"border-indigo-200" },
  "Teachers & Students":  { color:"text-teal-700",    bg:"bg-teal-50",     border:"border-teal-200" },
};

// ─── Notice Detail Drawer ─────────────────────────────────────────────────────

function NoticeDrawer({ notice, onClose, onTogglePin }: {
  notice: Notice; onClose: () => void; onTogglePin: () => void;
}) {
  const typeCfg = TYPE_CONFIG[notice.type];
  const audCfg  = AUDIENCE_CONFIG[notice.audience];

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 bg-black/60 z-50 flex justify-end" onClick={onClose}>
      <motion.div initial={{ x:480 }} animate={{ x:0 }} exit={{ x:480 }}
        transition={{ type:"spring", damping:28, stiffness:260 }}
        className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}>

        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-black text-slate-900">Notice</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"><X className="w-5 h-5" /></button>
        </div>

        {/* Header area */}
        <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
          {notice.urgent && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-xl mb-4">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-xs font-bold text-red-700">Urgent Notice — Action Required</p>
            </div>
          )}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${typeCfg.color} ${typeCfg.bg}`}>{notice.type}</span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${audCfg.color} ${audCfg.bg} ${audCfg.border}`}>
              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{notice.audience}</span>
            </span>
            {notice.pinned && <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">📌 Pinned</span>}
          </div>
          <h3 className="font-black text-slate-900 text-lg leading-snug">{notice.title}</h3>
          <p className="text-xs text-slate-400 mt-2">From: <span className="font-semibold text-slate-600">{notice.from}</span> · {notice.publishedAt}</p>
        </div>

        {/* Body */}
        <div className="px-6 py-5 border-b border-slate-100">
          <p className="text-sm text-slate-700 leading-relaxed">{notice.body}</p>
        </div>

        {/* Actions */}
        <div className="px-6 py-5">
          <button onClick={() => { onTogglePin(); }}
            className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-slate-200 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 text-slate-700 font-bold rounded-xl text-sm transition-all">
            {notice.pinned ? <><PinOff className="w-4 h-4" />Unpin Notice</> : <><Pin className="w-4 h-4" />Pin Notice</>}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Notice Card ──────────────────────────────────────────────────────────────

function NoticeCard({ notice, onClick, onTogglePin, delay }: {
  notice: Notice; onClick: () => void; onTogglePin: () => void; delay: number;
}) {
  const typeCfg = TYPE_CONFIG[notice.type];
  const audCfg  = AUDIENCE_CONFIG[notice.audience];

  return (
    <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
      transition={{ delay, duration:0.38, ease:[0.22,1,0.36,1] }}
      onClick={onClick}
      className={`bg-white rounded-2xl border-2 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group
        ${notice.pinned ? "border-amber-200 hover:border-amber-300" : notice.urgent && !notice.read ? "border-red-200 hover:border-red-300" : "border-slate-100 hover:border-slate-200"}
        ${!notice.read ? "ring-2 ring-indigo-100" : ""}`}>

      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-wrap gap-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${typeCfg.color} ${typeCfg.bg}`}>{notice.type}</span>
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${audCfg.color} ${audCfg.bg} ${audCfg.border} flex items-center gap-1`}>
            <Users className="w-3 h-3" />{notice.audience}
          </span>
          {notice.pinned && <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">📌</span>}
          {notice.urgent && <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">⚠ Urgent</span>}
          {!notice.read && <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1 flex-shrink-0" />}
        </div>
        <button onClick={e => { e.stopPropagation(); onTogglePin(); }}
          className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-300 hover:text-amber-500 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0">
          {notice.pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Title */}
      <h3 className={`font-black text-base leading-snug mb-2 ${!notice.read ? "text-slate-900" : "text-slate-700"}`}>
        {notice.title}
      </h3>

      {/* Body preview */}
      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-3">{notice.body}</p>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="font-medium">{notice.from}</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{notice.publishedAt}</span>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TeacherNoticesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notices, setNotices]         = useState<Notice[]>(NOTICES);
  const [viewing, setViewing]         = useState<Notice | null>(null);
  const [search, setSearch]           = useState("");
  const [filterType, setFilterType]   = useState<NoticeType | "All">("All");
  const [filterRead, setFilterRead]   = useState<"all"|"unread"|"read">("all");

  const markRead = (id: string) =>
    setNotices(prev => prev.map(n => n.id === id ? { ...n, read:true } : n));

  const togglePin = (id: string) =>
    setNotices(prev => prev.map(n => n.id === id ? { ...n, pinned:!n.pinned } : n));

  const handleOpen = (n: Notice) => {
    markRead(n.id);
    setViewing({ ...n, read:true });
  };

  const filtered = useMemo(() => {
    const pinned = notices.filter(n => n.pinned);
    const rest   = notices.filter(n => !n.pinned);
    return [...pinned, ...rest].filter(n => {
      const q = search.toLowerCase();
      if (q && !n.title.toLowerCase().includes(q) && !n.body.toLowerCase().includes(q)) return false;
      if (filterType !== "All" && n.type !== filterType) return false;
      if (filterRead === "unread" && n.read) return false;
      if (filterRead === "read"   && !n.read) return false;
      return true;
    });
  }, [notices, search, filterType, filterRead]);

  const unreadCount = notices.filter(n => !n.read).length;
  const types: NoticeType[] = ["General","Exam","Event","Alert","Holiday","Academic"];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <div className="hidden lg:flex flex-shrink-0"><TeacherSidebar active="/teacher/notices" /></div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-40 lg:hidden" />
            <motion.div initial={{ x:-260 }} animate={{ x:0 }} exit={{ x:-260 }}
              transition={{ type:"spring", damping:28, stiffness:260 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50 lg:hidden">
              <TeacherSidebar active="/teacher/notices" mobile onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 gap-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 rounded-lg hover:bg-slate-100"><Menu className="w-5 h-5" /></button>
            <div>
              <h1 className="text-lg font-black text-slate-900">Notices &amp; Announcements</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {unreadCount > 0
                  ? <span className="text-indigo-600 font-bold">{unreadCount} unread</span>
                  : "All caught up"
                } · From school administration
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button onClick={() => setNotices(prev => prev.map(n => ({ ...n, read:true })))}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-all">
              Mark all read
            </button>
          )}
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-5">

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label:"Total Notices", value:notices.length, color:"text-slate-700 bg-white border-slate-100" },
              { label:"Unread",        value:unreadCount,    color:"text-indigo-700 bg-indigo-50 border-indigo-100" },
              { label:"Pinned",        value:notices.filter(n=>n.pinned).length, color:"text-amber-700 bg-amber-50 border-amber-100" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
                className={`border rounded-2xl p-4 text-center shadow-sm ${s.color}`}>
                <p className="text-2xl font-black">{s.value}</p>
                <p className="text-xs font-bold mt-0.5 opacity-70">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Search + filters */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notices…"
                className="text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400 w-full" />
              {search && <button onClick={() => setSearch("")}><X className="w-4 h-4 text-slate-400" /></button>}
            </div>
            <div className="flex flex-wrap gap-2">
              {/* Read filter */}
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                {(["all","unread","read"] as const).map(f => (
                  <button key={f} onClick={() => setFilterRead(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${filterRead===f?"bg-white text-slate-900 shadow-sm":"text-slate-500"}`}>
                    {f}
                  </button>
                ))}
              </div>
              {/* Type filters */}
              <button onClick={() => setFilterType("All")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all ${filterType==="All"?"border-slate-800 bg-slate-800 text-white":"border-slate-200 text-slate-500"}`}>
                All Types
              </button>
              {types.map(t => {
                const cfg = TYPE_CONFIG[t];
                const active = filterType === t;
                return (
                  <button key={t} onClick={() => setFilterType(t)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all
                      ${active ? `border-current ${cfg.bg} ${cfg.color}` : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notice cards */}
          {filtered.length === 0 ? (
            <div className="py-20 text-center bg-white border border-slate-100 rounded-2xl">
              <Bell className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="font-bold text-slate-500">No notices found</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {filtered.map((n, i) => (
                <NoticeCard key={n.id} notice={n} delay={i*0.04}
                  onClick={() => handleOpen(n)}
                  onTogglePin={() => togglePin(n.id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <AnimatePresence>
        {viewing && (
          <NoticeDrawer notice={viewing} onClose={() => setViewing(null)}
            onTogglePin={() => { togglePin(viewing.id); setViewing(prev => prev ? { ...prev, pinned:!prev.pinned } : null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}