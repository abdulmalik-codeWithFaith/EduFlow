"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  School, LayoutDashboard, Users, UserCheck, CreditCard, BookOpen,
  Megaphone, BarChart3, Settings, Menu, X, GraduationCap, LogOut,
  Bell, Lock, Palette, Globe, CreditCard as BillingIcon, Shield,
  User, Mail, Phone, MapPin, Building, Camera, Save, Eye, EyeOff,
  CheckCircle, AlertCircle, Loader2, Trash2, ChevronRight, ToggleLeft,
  Moon, Sun, Monitor, Upload, RefreshCw, Key, Smartphone, AlertTriangle,
} from "lucide-react";

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard",     href: "/dashboard" },
  { icon: Users,           label: "Students",      href: "/dashboard/students" },
  { icon: GraduationCap,   label: "Teachers",      href: "/dashboard/teachers" },
  { icon: UserCheck,       label: "Attendance",    href: "/dashboard/attendance" },
  { icon: CreditCard,      label: "Fees",          href: "/dashboard/fees" },
  { icon: BookOpen,        label: "Results",       href: "/dashboard/results" },
  { icon: Megaphone,       label: "Announcements", href: "/dashboard/announcements" },
  { icon: BarChart3,       label: "Reports",       href: "/dashboard/reports" },
  { icon: Settings,        label: "Settings",      href: "/dashboard/settings", active: true },
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

// ─── Reusable Components ──────────────────────────────────────────────────────

function SectionCard({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <h3 className="font-black text-slate-900 text-sm">{title}</h3>
        {desc && <p className="text-xs text-slate-400 mt-0.5">{desc}</p>}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className={`w-11 h-6 rounded-full transition-colors flex-shrink-0 relative ${checked ? "bg-emerald-500" : "bg-slate-200"}`}>
      <motion.div animate={{ x: checked ? 22 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
    </button>
  );
}

function ToggleRow({ label, desc, checked, onChange }: { label: string; desc?: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-slate-50 last:border-0">
      <div>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {desc && <p className="text-xs text-slate-400 mt-0.5">{desc}</p>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function SaveButton({ onClick, loading, saved }: { onClick: () => void; loading: boolean; saved: boolean }) {
  return (
    <motion.button onClick={onClick} disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
      className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white font-black rounded-xl text-sm shadow-md transition-colors">
      {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</>
        : saved  ? <><CheckCircle className="w-4 h-4" />Saved!</>
        : <><Save className="w-4 h-4" />Save Changes</>}
    </motion.button>
  );
}

function useSave() {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved]   = useState(false);
  const trigger = async () => {
    setLoading(true); setSaved(false);
    await new Promise(r => setTimeout(r, 1100));
    setLoading(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  return { loading, saved, trigger };
}

function InputField({ label, value, onChange, type = "text", placeholder, error, hint }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; error?: string; hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-600 mb-1.5">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all
          ${error ? "border-red-300 ring-2 ring-red-100" : "border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"}`} />
      {error && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}
      {hint && !error && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

// ─── Tab Sections ─────────────────────────────────────────────────────────────

function ProfileSection() {
  const { loading, saved, trigger } = useSave();
  const [name,    setName]    = useState("Dr. Chidinma Okonkwo");
  const [email,   setEmail]   = useState("chidinma@greenfield.edu.ng");
  const [phone,   setPhone]   = useState("+234 803 456 7890");
  const [role,    setRole]    = useState("School Administrator");
  const [bio,     setBio]     = useState("School administrator at Greenfield College, Lagos. Passionate about quality education and student welfare.");

  return (
    <div className="space-y-5">
      <SectionCard title="Profile Photo" desc="Your profile picture visible across EduFlow">
        <div className="flex items-center gap-6">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
              CO
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors">
              <Camera className="w-3.5 h-3.5 text-slate-600" />
            </button>
          </div>
          <div>
            <button className="flex items-center gap-2 px-4 py-2 border-2 border-slate-200 hover:border-emerald-400 text-slate-700 font-bold rounded-xl text-sm transition-all">
              <Upload className="w-4 h-4" /> Upload New Photo
            </button>
            <p className="text-xs text-slate-400 mt-1.5">PNG, JPG up to 2MB. Recommended: 400×400px</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Personal Information" desc="Update your personal details">
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Full Name" value={name} onChange={setName} placeholder="Your full name" />
          <InputField label="Role / Title" value={role} onChange={setRole} placeholder="e.g. School Administrator" />
          <InputField label="Email Address" type="email" value={email} onChange={setEmail} placeholder="your@email.com" />
          <InputField label="Phone Number" type="tel" value={phone} onChange={setPhone} placeholder="+234 800 000 0000" />
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all resize-none" />
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <SaveButton onClick={trigger} loading={loading} saved={saved} />
        </div>
      </SectionCard>
    </div>
  );
}

function SchoolSection() {
  const { loading, saved, trigger } = useSave();
  const [schoolName, setSchoolName] = useState("Greenfield College");
  const [address,    setAddress]    = useState("14 Admiralty Way, Lekki Phase 1, Lagos");
  const [email,      setEmail]      = useState("info@greenfield.edu.ng");
  const [phone,      setPhone]      = useState("+234 1 234 5678");
  const [motto,      setMotto]      = useState("Excellence in Learning");
  const [founded,    setFounded]    = useState("1998");
  const [accredNo,   setAccredNo]   = useState("LASG/MoE/2024/00142");
  const [term,       setTerm]       = useState("Second Term");
  const [session,    setSession]    = useState("2024/2025");

  return (
    <div className="space-y-5">
      <SectionCard title="School Logo">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
            <School className="w-10 h-10 text-white" />
          </div>
          <div>
            <button className="flex items-center gap-2 px-4 py-2 border-2 border-slate-200 hover:border-emerald-400 text-slate-700 font-bold rounded-xl text-sm transition-all">
              <Upload className="w-4 h-4" /> Upload Logo
            </button>
            <p className="text-xs text-slate-400 mt-1.5">PNG with transparent background preferred. Min 200×200px.</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="School Information" desc="Basic school details displayed on reports and result sheets">
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="School Name" value={schoolName} onChange={setSchoolName} />
          <InputField label="School Motto" value={motto} onChange={setMotto} />
          <div className="sm:col-span-2">
            <InputField label="School Address" value={address} onChange={setAddress} />
          </div>
          <InputField label="Email Address" type="email" value={email} onChange={setEmail} />
          <InputField label="Phone Number" value={phone} onChange={setPhone} />
          <InputField label="Year Founded" value={founded} onChange={setFounded} />
          <InputField label="Accreditation Number" value={accredNo} onChange={setAccredNo} />
        </div>
        <div className="flex justify-end mt-5">
          <SaveButton onClick={trigger} loading={loading} saved={saved} />
        </div>
      </SectionCard>

      <SectionCard title="Academic Calendar" desc="Current session and term settings">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Current Session</label>
            <select value={session} onChange={e => setSession(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all bg-white font-semibold">
              {["2024/2025","2023/2024","2025/2026"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Current Term</label>
            <select value={term} onChange={e => setTerm(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all bg-white font-semibold">
              {["First Term","Second Term","Third Term"].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <SaveButton onClick={trigger} loading={loading} saved={saved} />
        </div>
      </SectionCard>
    </div>
  );
}

function SecuritySection() {
  const { loading, saved, trigger } = useSave();
  const [current,  setCurrent]  = useState("");
  const [newPwd,   setNewPwd]   = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showCur,  setShowCur]  = useState(false);
  const [showNew,  setShowNew]  = useState(false);
  const [showCon,  setShowCon]  = useState(false);
  const [twoFA,    setTwoFA]    = useState(false);
  const [sessions, setSessions] = useState(true);

  const strength = useMemo_strength(newPwd);

  const pwdError = newPwd.length > 0 && newPwd.length < 8 ? "Minimum 8 characters" : undefined;
  const confirmError = confirm.length > 0 && confirm !== newPwd ? "Passwords do not match" : undefined;

  return (
    <div className="space-y-5">
      <SectionCard title="Change Password" desc="Keep your account secure with a strong password">
        <div className="space-y-4">
          <PasswordField label="Current Password" value={current} onChange={setCurrent} show={showCur} onToggle={() => setShowCur(!showCur)} />
          <PasswordField label="New Password" value={newPwd} onChange={setNewPwd} show={showNew} onToggle={() => setShowNew(!showNew)} error={pwdError} />
          {newPwd.length > 0 && (
            <div>
              <div className="flex gap-1 mb-1.5">
                {[0,1,2,3].map(i => (
                  <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i < strength.score ? strength.color : "bg-slate-100"}`} />
                ))}
              </div>
              <p className={`text-xs font-bold ${strength.textColor}`}>{strength.label}</p>
            </div>
          )}
          <PasswordField label="Confirm New Password" value={confirm} onChange={setConfirm} show={showCon} onToggle={() => setShowCon(!showCon)} error={confirmError} />
        </div>
        <div className="flex justify-end mt-5">
          <SaveButton onClick={trigger} loading={loading} saved={saved} />
        </div>
      </SectionCard>

      <SectionCard title="Two-Factor Authentication" desc="Add an extra layer of security to your account">
        <ToggleRow label="Enable 2FA via SMS" desc="Get a verification code on your phone when logging in" checked={twoFA} onChange={() => setTwoFA(!twoFA)} />
        <ToggleRow label="Active session alerts" desc="Get notified when someone logs into your account" checked={sessions} onChange={() => setSessions(!sessions)} />
        {twoFA && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-emerald-800">2FA Active</p>
              <p className="text-xs text-emerald-700 mt-0.5">Verification codes will be sent to +234 803 *** 7890</p>
            </div>
          </motion.div>
        )}
      </SectionCard>

      <SectionCard title="Login Sessions" desc="Manage where you're currently logged in">
        <div className="space-y-3">
          {[
            { device:"Chrome on MacBook Pro", location:"Lagos, Nigeria", time:"Active now", current:true },
            { device:"Safari on iPhone 14", location:"Lagos, Nigeria", time:"2 hours ago", current:false },
            { device:"Chrome on Windows PC", location:"Abuja, Nigeria", time:"Yesterday", current:false },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${s.current ? "bg-emerald-100" : "bg-slate-200"}`}>
                  <Monitor className={`w-4 h-4 ${s.current ? "text-emerald-600" : "text-slate-500"}`} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{s.device}</p>
                  <p className="text-xs text-slate-400">{s.location} · {s.time}</p>
                </div>
              </div>
              {s.current
                ? <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">Current</span>
                : <button className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline transition-colors">Revoke</button>
              }
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function NotificationsSection() {
  const { loading, saved, trigger } = useSave();
  const [prefs, setPrefs] = useState({
    feeReminders: true, attendanceAlerts: true, resultPublished: true,
    announcements: true, staffMeetings: false, systemUpdates: false,
    emailNotifs: true, smsNotifs: false, pushNotifs: true,
    dailyDigest: false, weeklyReport: true,
  });
  const toggle = (k: keyof typeof prefs) => setPrefs(p => ({ ...p, [k]: !p[k] }));

  return (
    <div className="space-y-5">
      <SectionCard title="Notification Channels" desc="Choose how you receive notifications">
        <ToggleRow label="Email Notifications" desc="Receive updates to your email address" checked={prefs.emailNotifs} onChange={() => toggle("emailNotifs")} />
        <ToggleRow label="SMS Notifications" desc="Get urgent alerts via text message" checked={prefs.smsNotifs} onChange={() => toggle("smsNotifs")} />
        <ToggleRow label="Push Notifications" desc="Browser or app push notifications" checked={prefs.pushNotifs} onChange={() => toggle("pushNotifs")} />
      </SectionCard>

      <SectionCard title="Alert Preferences" desc="Choose which events trigger notifications">
        <ToggleRow label="Fee Payment Reminders" desc="Alert when students haven't paid fees" checked={prefs.feeReminders} onChange={() => toggle("feeReminders")} />
        <ToggleRow label="Attendance Alerts" desc="Notify when a class hasn't marked attendance" checked={prefs.attendanceAlerts} onChange={() => toggle("attendanceAlerts")} />
        <ToggleRow label="Result Published" desc="Notify when results are published for a class" checked={prefs.resultPublished} onChange={() => toggle("resultPublished")} />
        <ToggleRow label="New Announcements" desc="Get notified of school-wide announcements" checked={prefs.announcements} onChange={() => toggle("announcements")} />
        <ToggleRow label="Staff Meeting Reminders" desc="Calendar reminders for staff meetings" checked={prefs.staffMeetings} onChange={() => toggle("staffMeetings")} />
        <ToggleRow label="System Updates" desc="EduFlow platform update notifications" checked={prefs.systemUpdates} onChange={() => toggle("systemUpdates")} />
      </SectionCard>

      <SectionCard title="Digest Reports" desc="Scheduled summary reports sent to your email">
        <ToggleRow label="Daily Digest" desc="Summary of today's attendance, fees and activity" checked={prefs.dailyDigest} onChange={() => toggle("dailyDigest")} />
        <ToggleRow label="Weekly Report" desc="End-of-week performance summary every Friday" checked={prefs.weeklyReport} onChange={() => toggle("weeklyReport")} />
        <div className="flex justify-end mt-4">
          <SaveButton onClick={trigger} loading={loading} saved={saved} />
        </div>
      </SectionCard>
    </div>
  );
}

function AppearanceSection() {
  const [theme,  setTheme]  = useState<"light"|"dark"|"system">("light");
  const [accent, setAccent] = useState("emerald");
  const [density, setDensity] = useState<"comfortable"|"compact">("comfortable");
  const { loading, saved, trigger } = useSave();

  const accents = [
    { id:"emerald", color:"bg-emerald-500", label:"Emerald" },
    { id:"blue",    color:"bg-blue-500",    label:"Blue" },
    { id:"violet",  color:"bg-violet-500",  label:"Violet" },
    { id:"orange",  color:"bg-orange-500",  label:"Orange" },
    { id:"rose",    color:"bg-rose-500",    label:"Rose" },
    { id:"teal",    color:"bg-teal-500",    label:"Teal" },
  ];

  return (
    <div className="space-y-5">
      <SectionCard title="Theme" desc="Choose your preferred interface theme">
        <div className="grid grid-cols-3 gap-3">
          {([
            { id:"light",  icon:Sun,     label:"Light" },
            { id:"dark",   icon:Moon,    label:"Dark" },
            { id:"system", icon:Monitor, label:"System" },
          ] as const).map(t => (
            <button key={t.id} onClick={() => setTheme(t.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
                ${theme === t.id ? "border-emerald-400 bg-emerald-50" : "border-slate-200 hover:border-slate-300"}`}>
              <t.icon className={`w-5 h-5 ${theme === t.id ? "text-emerald-600" : "text-slate-500"}`} />
              <span className={`text-xs font-bold ${theme === t.id ? "text-emerald-700" : "text-slate-600"}`}>{t.label}</span>
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Accent Color" desc="Customize the primary action color">
        <div className="flex flex-wrap gap-3">
          {accents.map(a => (
            <button key={a.id} onClick={() => setAccent(a.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all
                ${accent === a.id ? "border-slate-800 bg-slate-50" : "border-slate-200 hover:border-slate-300"}`}>
              <div className={`w-4 h-4 rounded-full ${a.color} flex-shrink-0`} />
              <span className="text-xs font-bold text-slate-700">{a.label}</span>
              {accent === a.id && <CheckCircle className="w-3.5 h-3.5 text-slate-700" />}
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Display Density" desc="Control how compact the interface feels">
        <div className="grid grid-cols-2 gap-3">
          {(["comfortable","compact"] as const).map(d => (
            <button key={d} onClick={() => setDensity(d)}
              className={`p-4 rounded-xl border-2 text-left transition-all
                ${density === d ? "border-emerald-400 bg-emerald-50" : "border-slate-200 hover:border-slate-300"}`}>
              <p className={`text-sm font-bold capitalize ${density === d ? "text-emerald-700" : "text-slate-700"}`}>{d}</p>
              <p className="text-xs text-slate-400 mt-0.5">{d === "comfortable" ? "More breathing room between elements" : "Tighter layout, more info on screen"}</p>
            </button>
          ))}
        </div>
        <div className="flex justify-end mt-5">
          <SaveButton onClick={trigger} loading={loading} saved={saved} />
        </div>
      </SectionCard>
    </div>
  );
}

function BillingSection() {
  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest">Current Plan</p>
            <h3 className="text-2xl font-black mt-1">Professional</h3>
            <p className="text-emerald-100 text-sm mt-0.5">₦25,000 / term · Up to 2,000 students</p>
          </div>
          <div className="bg-white/20 rounded-xl px-3 py-1.5">
            <span className="text-white text-xs font-black">ACTIVE</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label:"Students", used:"1,284", max:"2,000" },
            { label:"Teachers", used:"48",    max:"100" },
            { label:"Storage",  used:"4.2 GB",max:"10 GB" },
          ].map(u => (
            <div key={u.label} className="bg-white/10 rounded-xl p-3">
              <p className="text-white/70 text-xs mb-0.5">{u.label}</p>
              <p className="text-white font-black text-sm">{u.used}</p>
              <p className="text-white/60 text-xs">of {u.max}</p>
            </div>
          ))}
        </div>
      </div>

      <SectionCard title="Billing History" desc="Recent invoices and payment history">
        <div className="space-y-3">
          {[
            { date:"Jan 2025", amount:"₦25,000", status:"Paid",    invoice:"INV-2025-001" },
            { date:"Sep 2024", amount:"₦25,000", status:"Paid",    invoice:"INV-2024-003" },
            { date:"May 2024", amount:"₦25,000", status:"Paid",    invoice:"INV-2024-002" },
            { date:"Jan 2024", amount:"₦25,000", status:"Paid",    invoice:"INV-2024-001" },
          ].map((b, i) => (
            <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="text-sm font-bold text-slate-900">{b.invoice}</p>
                <p className="text-xs text-slate-400">{b.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-black text-slate-800">{b.amount}</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">{b.status}</span>
                <button className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors">
                  <BookOpen className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Upgrade Plan" desc="Unlock more students, storage and features">
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { name:"Professional", price:"₦25,000/term", students:"2,000 students", current:true },
            { name:"Enterprise",   price:"Custom",        students:"Unlimited",      current:false },
          ].map(p => (
            <div key={p.name} className={`p-5 rounded-xl border-2 ${p.current ? "border-emerald-400 bg-emerald-50" : "border-slate-200 hover:border-slate-300 transition-colors"}`}>
              <div className="flex items-center justify-between mb-2">
                <p className={`font-black text-base ${p.current ? "text-emerald-800" : "text-slate-800"}`}>{p.name}</p>
                {p.current && <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Current</span>}
              </div>
              <p className="text-xl font-black text-slate-900 mb-1">{p.price}</p>
              <p className="text-xs text-slate-500 mb-4">{p.students}</p>
              {!p.current && (
                <button className="w-full py-2.5 bg-slate-900 hover:bg-slate-700 text-white font-black rounded-xl text-sm transition-colors">
                  Contact Sales
                </button>
              )}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function DangerSection() {
  const [confirmText, setConfirmText] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="space-y-5">
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-black text-red-900">Danger Zone</h3>
            <p className="text-xs text-red-700">Irreversible actions — proceed with extreme caution</p>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { label:"Clear All Attendance Records", desc:"Permanently delete all attendance data for this session. This cannot be undone.", btn:"Clear Records", severity:"medium" },
            { label:"Reset Result Entries", desc:"Delete all entered scores and results. Published results will be unpublished.", btn:"Reset Results", severity:"medium" },
            { label:"Delete School Account", desc:"Permanently delete your school account and all associated data. This action is irreversible.", btn:"Delete Account", severity:"high" },
          ].map(d => (
            <div key={d.label} className="flex items-start justify-between gap-4 p-4 bg-white rounded-xl border border-red-100">
              <div>
                <p className="text-sm font-bold text-slate-900">{d.label}</p>
                <p className="text-xs text-slate-500 mt-0.5 max-w-sm">{d.desc}</p>
              </div>
              <button
                onClick={() => d.severity === "high" && setShowConfirm(true)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all flex-shrink-0
                  ${d.severity === "high" ? "border-red-400 bg-red-50 text-red-700 hover:bg-red-100" : "border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100"}`}>
                {d.btn}
              </button>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.94 }} animate={{ scale: 1 }} exit={{ scale: 0.94 }}
              className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-sm">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-black text-slate-900 text-center mb-1">Delete Account</h3>
              <p className="text-xs text-slate-500 text-center mb-4">Type <span className="font-bold text-red-600">DELETE</span> to confirm</p>
              <input value={confirmText} onChange={e => setConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 mb-4 transition-all" />
              <div className="flex gap-3">
                <button onClick={() => { setShowConfirm(false); setConfirmText(""); }}
                  className="flex-1 py-2.5 border-2 border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50 transition-all">
                  Cancel
                </button>
                <button disabled={confirmText !== "DELETE"}
                  className="flex-1 py-2.5 bg-red-600 disabled:opacity-40 hover:bg-red-700 text-white font-black rounded-xl text-sm transition-colors">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Helper hooks / utils ─────────────────────────────────────────────────────

function useMemo_strength(pwd: string) {
  const score = [pwd.length >= 8, /[A-Z]/.test(pwd), /[0-9]/.test(pwd), /[^A-Za-z0-9]/.test(pwd)].filter(Boolean).length;
  const map = [
    { label:"Too short",  color:"bg-red-400",    textColor:"text-red-600" },
    { label:"Weak",       color:"bg-red-400",    textColor:"text-red-600" },
    { label:"Fair",       color:"bg-amber-400",  textColor:"text-amber-600" },
    { label:"Good",       color:"bg-blue-400",   textColor:"text-blue-600" },
    { label:"Strong",     color:"bg-emerald-500",textColor:"text-emerald-600" },
  ];
  return { score, ...map[Math.min(score, 4)] };
}

function PasswordField({ label, value, onChange, show, onToggle, error }: {
  label: string; value: string; onChange: (v: string) => void;
  show: boolean; onToggle: () => void; error?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-600 mb-1.5">{label}</label>
      <div className="relative">
        <input type={show ? "text" : "password"} value={value} onChange={e => onChange(e.target.value)}
          placeholder="••••••••"
          className={`w-full px-4 py-2.5 pr-11 rounded-xl border text-sm text-slate-900 placeholder:text-slate-300 outline-none transition-all
            ${error ? "border-red-300 ring-2 ring-red-100" : "border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"}`} />
        <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS = [
  { id:"profile",       label:"Profile",       icon: User },
  { id:"school",        label:"School",        icon: Building },
  { id:"security",      label:"Security",      icon: Lock },
  { id:"notifications", label:"Notifications", icon: Bell },
  { id:"appearance",    label:"Appearance",    icon: Palette },
  { id:"billing",       label:"Billing",       icon: BillingIcon },
  { id:"danger",        label:"Danger Zone",   icon: AlertTriangle },
] as const;

type TabId = typeof TABS[number]["id"];

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("profile");

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
              <h1 className="text-lg font-black text-slate-900">Settings</h1>
              <p className="text-xs text-slate-400 mt-0.5">Manage your account and school preferences</p>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Settings sidebar */}
          <aside className="hidden md:flex w-56 flex-col border-r border-slate-100 bg-white overflow-y-auto flex-shrink-0">
            <nav className="px-3 py-4 space-y-0.5">
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left
                    ${activeTab === tab.id ? "bg-emerald-600 text-white shadow-md shadow-emerald-100" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}
                    ${tab.id === "danger" ? activeTab !== tab.id ? "text-red-500 hover:bg-red-50" : "" : ""}`}>
                  <tab.icon className="w-4 h-4 flex-shrink-0" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Mobile tab bar */}
          <div className="md:hidden flex overflow-x-auto gap-1 px-4 py-2 bg-white border-b border-slate-100 flex-shrink-0 absolute w-full" style={{ top: 73 }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex-shrink-0
                  ${activeTab === tab.id ? "bg-emerald-600 text-white" : "text-slate-500 hover:bg-slate-100"}`}>
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                className="max-w-2xl space-y-5">
                {activeTab === "profile"       && <ProfileSection />}
                {activeTab === "school"        && <SchoolSection />}
                {activeTab === "security"      && <SecuritySection />}
                {activeTab === "notifications" && <NotificationsSection />}
                {activeTab === "appearance"    && <AppearanceSection />}
                {activeTab === "billing"       && <BillingSection />}
                {activeTab === "danger"        && <DangerSection />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}