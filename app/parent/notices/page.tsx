"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Bell, Search, Pin, PinOff, Clock,
  AlertTriangle, Calendar, BookOpen, Globe, Users,
  ChevronRight, CheckCircle,
} from "lucide-react";
import { ParentSidebar } from "../page";

// ─── Types ────────────────────────────────────────────────────────────────────

type NoticeType = "General" | "Exam" | "Event" | "Alert" | "Holiday" | "Academic";

interface Notice {
  id: string;
  title: string;
  body: string;
  type: NoticeType;
  audience: string;
  from: string;
  publishedAt: string;
  pinned: boolean;
  read: boolean;
  urgent: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const NOTICES: Notice[] = [
  {
    id: "1", urgent: true, pinned: true, read: false,
    title: "Second Term Examination Timetable Released",
    body: "Dear Parents, please note that the second term examination timetable has been published. Examinations commence Monday, 3rd February 2025 and run through to Friday, 14th February 2025. Please ensure your ward revises thoroughly and arrives at school on time on exam days. Breakfast before school is strongly encouraged.",
    type: "Exam", audience: "Parents & Students", from: "Dr. C. Okonkwo",
    publishedAt: "Today, 9:00 AM",
  },
  {
    id: "2", urgent: true, pinned: true, read: false,
    title: "PTA Meeting — Saturday, 1st February 2025",
    body: "Dear Parents and Guardians, you are cordially invited to the Parent-Teacher Association (PTA) meeting scheduled for Saturday, 1st February 2025 at 10:00 AM in the school auditorium. Agenda includes second term academic progress, school improvement initiatives, and welfare updates. Attendance is strongly encouraged.",
    type: "Event", audience: "Parents", from: "PTA Secretariat",
    publishedAt: "Yesterday, 3:30 PM",
  },
  {
    id: "3", urgent: false, pinned: false, read: false,
    title: "Mid-Term Break: 7th–10th February",
    body: "Please be informed that mid-term break will run from Friday, 7th February to Monday, 10th February 2025. School resumes full academic activities on Tuesday, 11th February. Students will be given mid-term assignments which should be completed during the break.",
    type: "Holiday", audience: "All", from: "Admin",
    publishedAt: "3 days ago",
  },
  {
    id: "4", urgent: false, pinned: false, read: true,
    title: "Annual Science & Technology Fair — Feb 21",
    body: "The Annual Science and Technology Fair is scheduled for Friday, 21st February 2025. Students are preparing exciting projects and exhibits. Parents are warmly invited to attend and support their wards. Entry is free for parents of enrolled students. More details to follow.",
    type: "Event", audience: "Parents & Students", from: "HOD Science",
    publishedAt: "4 days ago",
  },
  {
    id: "5", urgent: false, pinned: false, read: true,
    title: "Third Term Fee Payment Deadline — March 1",
    body: "This is a reminder to all parents that the payment deadline for third term school fees is Saturday, 1st March 2025. Students who have not paid fees by this date may not be allowed to sit for end-of-term examinations. Kindly use the EduFlow portal or contact the school bursary for payment assistance.",
    type: "Alert", audience: "Parents", from: "Bursary Office",
    publishedAt: "5 days ago",
  },
  {
    id: "6", urgent: false, pinned: false, read: true,
    title: "New Academic Calendar 2025/2026 Available",
    body: "The academic calendar for the 2025/2026 session has been approved by the school board and is now available. First term resumption is scheduled for Monday, 15th September 2025. Please plan your family schedule accordingly. The full calendar is available on the EduFlow parent portal.",
    type: "Academic", audience: "All", from: "Admin",
    publishedAt: "1 week ago",
  },
  {
    id: "7", urgent: false, pinned: false, read: true,
    title: "School Uniform Compliance Notice",
    body: "We remind all parents to ensure their wards comply fully with the school uniform policy. Students found in non-regulation uniforms from February onward will be sent home to change. This applies to footwear, socks, and accessories as well. Please review the handbook for full details.",
    type: "General", audience: "Parents & Students", from: "Vice Principal",
    publishedAt: "1 week ago",
  },
];

const TYPE_CONFIG: Record<NoticeType, { color: string; bg: string; border: string; icon: React.ElementType }> = {
  General:  { color: "text-stone-600",   bg: "bg-stone-100",   border: "border-stone-200",   icon: Globe },
  Exam:     { color: "text-red-700",     bg: "bg-red-50",      border: "border-red-200",     icon: BookOpen },
  Event:    { color: "text-blue-700",    bg: "bg-blue-50",     border: "border-blue-200",    icon: Calendar },
  Alert:    { color: "text-orange-700",  bg: "bg-orange-50",   border: "border-orange-200",  icon: AlertTriangle },
  Holiday:  { color: "text-teal-700",    bg: "bg-teal-50",     border: "border-teal-200",    icon: CheckCircle },
  Academic: { color: "text-violet-700",  bg: "bg-violet-50",   border: "border-violet-200",  icon: BookOpen },
};

// ─── Notice Detail Drawer ─────────────────────────────────────────────────────

function NoticeDrawer({ notice, onClose, onTogglePin }: {
  notice: Notice; onClose: () => void; onTogglePin: () => void;
}) {
  const cfg = TYPE_CONFIG[notice.type];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex justify-end" onClick={onClose}>
      <motion.div initial={{ x: 420 }} animate={{ x: 0 }} exit={{ x: 420 }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="w-full max-w-md bg-white h-full overflow-y-auto"
        onClick={e => e.stopPropagation()}>

        <div className="sticky top-0 bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-black text-stone-900 text-base">Notice</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-stone-100 text-stone-500"><X className="w-5 h-5" /></button>
        </div>

        <div className="px-6 py-5 border-b border-stone-100 bg-gradient-to-br from-stone-50 to-white">
          {notice.urgent && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 mb-4">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-xs font-bold text-red-700">Urgent — Please read carefully</p>
            </div>
          )}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md ${cfg.color} ${cfg.bg} ${cfg.border} border`}>
              <cfg.icon className="w-3.5 h-3.5" />{notice.type}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border border-stone-200 text-stone-600 bg-stone-50">
              <Users className="w-3 h-3" />{notice.audience}
            </span>
            {notice.pinned && <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">📌 Pinned</span>}
          </div>
          <h3 className="font-black text-stone-900 text-lg leading-snug">{notice.title}</h3>
          <p className="text-xs text-stone-400 mt-2">From: <span className="font-semibold text-stone-600">{notice.from}</span> · {notice.publishedAt}</p>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm text-stone-700 leading-relaxed">{notice.body}</p>
        </div>

        <div className="px-6 py-4 border-t border-stone-100">
          <button onClick={onTogglePin}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-stone-200 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 text-stone-600 font-bold rounded-xl text-sm transition-all">
            {notice.pinned ? <><PinOff className="w-4 h-4" />Unpin</> : <><Pin className="w-4 h-4" />Pin this notice</>}
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
  const cfg = TYPE_CONFIG[notice.type];
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className={`bg-white rounded-2xl border-2 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group relative
        ${notice.pinned ? "border-amber-200 hover:border-amber-300" : notice.urgent && !notice.read ? "border-red-200 hover:border-red-300" : "border-stone-100 hover:border-stone-200"}
        ${!notice.read ? "" : "opacity-90"}`}>

      {/* Unread dot */}
      {!notice.read && (
        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-teal-500" />
      )}

      <div className="flex flex-wrap gap-2 mb-3 pr-4">
        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
          <cfg.icon className="w-3.5 h-3.5" />{notice.type}
        </span>
        {notice.pinned && <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">📌 Pinned</span>}
        {notice.urgent && <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-200">⚠ Urgent</span>}
      </div>

      <h3 className={`font-black text-base leading-snug mb-2 ${!notice.read ? "text-stone-900" : "text-stone-700"}`}>
        {notice.title}
      </h3>
      <p className="text-sm text-stone-500 leading-relaxed line-clamp-2 mb-3">{notice.body}</p>

      <div className="flex items-center justify-between text-xs text-stone-400">
        <span className="font-medium">{notice.from}</span>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />{notice.publishedAt}
        </div>
      </div>

      {/* Hover pin button */}
      <button onClick={e => { e.stopPropagation(); onTogglePin(); }}
        className="absolute bottom-4 right-4 p-1.5 rounded-lg hover:bg-amber-50 text-stone-300 hover:text-amber-500 transition-colors opacity-0 group-hover:opacity-100">
        {notice.pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
      </button>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ParentNoticesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notices, setNotices] = useState<Notice[]>(NOTICES);
  const [viewing, setViewing] = useState<Notice | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<NoticeType | "All">("All");
  const [filterRead, setFilterRead] = useState<"all" | "unread">("all");

  const markRead = (id: string) =>
    setNotices(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const togglePin = (id: string) =>
    setNotices(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));

  const handleOpen = (n: Notice) => {
    markRead(n.id);
    setViewing({ ...n, read: true });
  };

  const filtered = useMemo(() => {
    const pinned = notices.filter(n => n.pinned);
    const rest   = notices.filter(n => !n.pinned);
    return [...pinned, ...rest].filter(n => {
      const q = search.toLowerCase();
      if (q && !n.title.toLowerCase().includes(q) && !n.body.toLowerCase().includes(q)) return false;
      if (filterType !== "All" && n.type !== filterType) return false;
      if (filterRead === "unread" && n.read) return false;
      return true;
    });
  }, [notices, search, filterType, filterRead]);

  const unreadCount = notices.filter(n => !n.read).length;

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">
      <div className="hidden lg:flex flex-shrink-0"><ParentSidebar active="/parent/notices" /></div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-50 lg:hidden">
              <ParentSidebar active="/parent/notices" mobile onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-stone-100 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-stone-100 text-stone-500">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-black text-stone-900">School Notices</h1>
              <p className="text-xs text-stone-400 mt-0.5">
                {unreadCount > 0
                  ? <span className="text-teal-600 font-bold">{unreadCount} unread</span>
                  : "All caught up ✓"
                } · From Greenfield College
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button onClick={() => setNotices(prev => prev.map(n => ({ ...n, read: true })))}
              className="text-xs font-bold text-stone-500 hover:text-stone-800 border border-stone-200 hover:border-stone-300 px-3 py-1.5 rounded-lg hover:bg-stone-50 transition-all">
              Mark all read
            </button>
          )}
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-5">

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total Notices", value: notices.length,                       color: "bg-white border-stone-100 text-stone-700" },
              { label: "Unread",        value: unreadCount,                          color: "bg-teal-50 border-teal-200 text-teal-700" },
              { label: "Pinned",        value: notices.filter(n => n.pinned).length, color: "bg-amber-50 border-amber-200 text-amber-700" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`border-2 rounded-2xl p-4 text-center shadow-sm ${s.color}`}>
                <p className="text-2xl font-black">{s.value}</p>
                <p className="text-xs font-bold mt-0.5 opacity-70">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Search & filters */}
          <div className="bg-white border border-stone-100 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5">
              <Search className="w-4 h-4 text-stone-400 flex-shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notices…"
                className="text-sm bg-transparent outline-none text-stone-700 placeholder:text-stone-400 w-full" />
              {search && <button onClick={() => setSearch("")}><X className="w-4 h-4 text-stone-400" /></button>}
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex gap-1 bg-stone-100 p-1 rounded-xl">
                {(["all","unread"] as const).map(f => (
                  <button key={f} onClick={() => setFilterRead(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${filterRead === f ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"}`}>
                    {f === "all" ? "All" : "Unread"}
                  </button>
                ))}
              </div>
              {(["All","General","Exam","Event","Alert","Holiday","Academic"] as const).map(t => {
                const active = filterType === t;
                const cfg = t !== "All" ? TYPE_CONFIG[t as NoticeType] : null;
                return (
                  <button key={t} onClick={() => setFilterType(t as NoticeType | "All")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all
                      ${active
                        ? cfg ? `${cfg.bg} ${cfg.color} ${cfg.border}` : "bg-stone-800 text-white border-stone-800"
                        : "border-stone-200 text-stone-500 hover:border-stone-300"}`}>
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notice cards */}
          {filtered.length === 0 ? (
            <div className="py-20 text-center bg-white border border-stone-100 rounded-2xl">
              <Bell className="w-12 h-12 text-stone-200 mx-auto mb-3" />
              <p className="font-bold text-stone-400">No notices found</p>
              <p className="text-xs text-stone-300 mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {filtered.map((n, i) => (
                <NoticeCard key={n.id} notice={n} delay={i * 0.04}
                  onClick={() => handleOpen(n)}
                  onTogglePin={() => togglePin(n.id)} />
              ))}
            </div>
          )}
        </main>
      </div>

      <AnimatePresence>
        {viewing && (
          <NoticeDrawer notice={viewing} onClose={() => setViewing(null)}
            onTogglePin={() => {
              togglePin(viewing.id);
              setViewing(prev => prev ? { ...prev, pinned: !prev.pinned } : null);
            }} />
        )}
      </AnimatePresence>
    </div>
  );
}