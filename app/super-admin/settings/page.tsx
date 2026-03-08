"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Shield, Settings, User, Bell, Globe, Lock,
  CreditCard, Zap, AlertTriangle, CheckCircle, Eye, EyeOff,
  Loader2, Save, RefreshCw, Trash2, Upload, Camera,
  Mail, Phone, MapPin, ExternalLink, ToggleLeft, ToggleRight,
  Server, Database, Key, Webhook,BarChart
} from "lucide-react";
import { SuperSidebar } from "../page";

// ─── Section Types ─────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "profile",      icon: User,      label: "Profile" },
  { id: "platform",     icon: Globe,     label: "Platform" },
  { id: "security",     icon: Lock,      label: "Security" },
  { id: "notifications",icon: Bell,      label: "Notifications" },
  { id: "integrations", icon: Zap,       label: "Integrations" },
  { id: "billing",      icon: CreditCard,label: "Billing Config" },
  { id: "danger",       icon: AlertTriangle, label: "Danger Zone" },
] as const;

type SectionId = typeof SECTIONS[number]["id"];

// ─── Reusable Toggle ──────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full transition-all flex items-center ${checked ? "bg-violet-600 justify-end" : "bg-zinc-300 justify-start"}`}>
      <div className="w-4.5 h-4.5 w-[18px] h-[18px] bg-white rounded-full shadow mx-0.5" />
    </button>
  );
}

// ─── Section: Profile ─────────────────────────────────────────────────────────

function ProfileSection() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "Super Admin", email: "admin@eduflow.app",
    phone: "+234 800 EDU FLOW", location: "Lagos, Nigeria",
    bio: "Platform administrator for EduFlow — responsible for managing all schools, subscriptions, and platform operations.",
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-zinc-900">Profile</h2>
        <p className="text-sm text-zinc-500 mt-0.5">Your Super Admin identity and contact information</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative group">
          <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-violet-200">
            SA
          </div>
          <button className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </button>
        </div>
        <div>
          <p className="font-black text-zinc-900">Super Admin</p>
          <p className="text-sm text-zinc-500 mt-0.5">Platform-level access · All permissions</p>
          <button className="mt-2 text-xs font-bold text-violet-600 hover:underline flex items-center gap-1">
            <Upload className="w-3 h-3" /> Change avatar
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { label: "Full Name",  key: "name",     icon: User,   type: "text" },
          { label: "Email",      key: "email",    icon: Mail,   type: "email" },
          { label: "Phone",      key: "phone",    icon: Phone,  type: "text" },
          { label: "Location",   key: "location", icon: MapPin, type: "text" },
        ].map(f => (
          <div key={f.key}>
            <label className="block text-xs font-black text-zinc-600 uppercase tracking-wide mb-1.5">{f.label}</label>
            <div className="relative">
              <f.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type={f.type}
                value={form[f.key as keyof typeof form]}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border-2 border-zinc-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-50 rounded-xl text-sm font-medium text-zinc-900 outline-none transition-all"
              />
            </div>
          </div>
        ))}
      </div>
      <div>
        <label className="block text-xs font-black text-zinc-600 uppercase tracking-wide mb-1.5">Bio</label>
        <textarea rows={3} value={form.bio} onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
          className="w-full px-4 py-3 border-2 border-zinc-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-50 rounded-xl text-sm text-zinc-700 outline-none resize-none transition-all" />
      </div>
      <motion.button onClick={handleSave} disabled={saving}
        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
        className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-70 text-white font-black rounded-xl text-sm shadow-md shadow-violet-200 transition-colors">
        {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</>
          : saved ? <><CheckCircle className="w-4 h-4" />Saved!</>
          : <><Save className="w-4 h-4" />Save Changes</>}
      </motion.button>
    </div>
  );
}

// ─── Section: Platform ────────────────────────────────────────────────────────

function PlatformSection() {
  const [settings, setSettings] = useState({
    maintenanceMode: false, newSchoolRegistrations: true,
    freeTrial: true, freeTrialDays: "30",
    maxSchoolsPerPlan: { Professional: "500", Enterprise: "Unlimited" },
    platformName: "EduFlow", supportEmail: "support@eduflow.app",
  });

  const toggle = (key: keyof typeof settings) =>
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-zinc-900">Platform Configuration</h2>
        <p className="text-sm text-zinc-500 mt-0.5">Global platform settings that affect all schools</p>
      </div>

      {/* Maintenance mode warning */}
      {settings.maintenanceMode && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm font-bold text-red-700">Maintenance mode is ON — all school users see a maintenance page.</p>
        </motion.div>
      )}

      <div className="space-y-3">
        {[
          { key: "maintenanceMode", label: "Maintenance Mode", desc: "Temporarily block all school admin and user access", danger: true },
          { key: "newSchoolRegistrations", label: "Allow New Registrations", desc: "Schools can self-register on the public site" },
          { key: "freeTrial", label: "Free Trial Available", desc: "New schools can start a free trial before subscribing" },
        ].map(s => (
          <div key={s.key} className={`flex items-center justify-between p-4 rounded-xl border-2 ${s.danger && settings[s.key as keyof typeof settings] ? "border-red-200 bg-red-50" : "border-zinc-100 bg-white"}`}>
            <div>
              <p className={`text-sm font-black ${s.danger ? "text-red-900" : "text-zinc-800"}`}>{s.label}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{s.desc}</p>
            </div>
            <Toggle checked={!!settings[s.key as keyof typeof settings]} onChange={() => toggle(s.key as keyof typeof settings)} />
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-black text-zinc-600 uppercase tracking-wide mb-1.5">Platform Name</label>
          <input value={settings.platformName} onChange={e => setSettings(p => ({ ...p, platformName: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-zinc-200 focus:border-violet-400 rounded-xl text-sm font-medium outline-none transition-all" />
        </div>
        <div>
          <label className="block text-xs font-black text-zinc-600 uppercase tracking-wide mb-1.5">Support Email</label>
          <input value={settings.supportEmail} onChange={e => setSettings(p => ({ ...p, supportEmail: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-zinc-200 focus:border-violet-400 rounded-xl text-sm font-medium outline-none transition-all" />
        </div>
        <div>
          <label className="block text-xs font-black text-zinc-600 uppercase tracking-wide mb-1.5">Free Trial Duration (days)</label>
          <input value={settings.freeTrialDays} onChange={e => setSettings(p => ({ ...p, freeTrialDays: e.target.value }))}
            type="number" className="w-full px-4 py-3 border-2 border-zinc-200 focus:border-violet-400 rounded-xl text-sm font-medium outline-none transition-all" />
        </div>
      </div>

      <button className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-black rounded-xl text-sm shadow-md transition-colors">
        <Save className="w-4 h-4" /> Save Platform Settings
      </button>
    </div>
  );
}

// ─── Section: Security ────────────────────────────────────────────────────────

function SecuritySection() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [twoFA, setTwoFA] = useState(true);
  const [ipWhitelist, setIpWhitelist] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handle = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-zinc-900">Security</h2>
        <p className="text-sm text-zinc-500 mt-0.5">Manage your password and security settings</p>
      </div>

      {/* Change password */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 space-y-4">
        <h3 className="font-black text-zinc-800 text-sm">Change Password</h3>
        {[
          { label: "Current Password", show: showOld, toggle: () => setShowOld(!showOld) },
          { label: "New Password",     show: showNew, toggle: () => setShowNew(!showNew) },
          { label: "Confirm New Password", show: showNew, toggle: () => setShowNew(!showNew) },
        ].map(f => (
          <div key={f.label}>
            <label className="block text-xs font-black text-zinc-600 uppercase tracking-wide mb-1.5">{f.label}</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input type={f.show ? "text" : "password"} placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-3 border-2 border-zinc-200 focus:border-violet-400 rounded-xl text-sm outline-none transition-all bg-white" />
              <button type="button" onClick={f.toggle} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700">
                {f.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}
        <motion.button onClick={handle} disabled={saving} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-70 text-white font-black rounded-xl text-sm transition-colors">
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Updating…</>
            : saved ? <><CheckCircle className="w-4 h-4" />Updated!</>
            : "Update Password"}
        </motion.button>
      </div>

      {/* Security toggles */}
      <div className="space-y-3">
        {[
          { label: "Two-Factor Authentication", desc: "Require 2FA for all Super Admin logins", key: "twoFA", val: twoFA, set: setTwoFA },
          { label: "IP Whitelist",               desc: "Only allow access from approved IP addresses", key: "ipWhitelist", val: ipWhitelist, set: setIpWhitelist },
        ].map(s => (
          <div key={s.key} className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-zinc-100">
            <div>
              <p className="text-sm font-black text-zinc-800">{s.label}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{s.desc}</p>
            </div>
            <Toggle checked={s.val} onChange={s.set} />
          </div>
        ))}
      </div>

      {/* Active sessions */}
      <div>
        <h3 className="font-black text-zinc-800 text-sm mb-3">Active Sessions</h3>
        <div className="space-y-2">
          {[
            { device: "MacBook Pro — Chrome 122", location: "Lagos, Nigeria", time: "Now", current: true },
            { device: "iPhone 15 — Safari",       location: "Lagos, Nigeria", time: "2 hrs ago", current: false },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
              <div>
                <p className="text-sm font-bold text-zinc-800 flex items-center gap-2">
                  {s.device}
                  {s.current && <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Current</span>}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">{s.location} · {s.time}</p>
              </div>
              {!s.current && (
                <button className="text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all">Revoke</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Section: Notifications ───────────────────────────────────────────────────

function NotificationsSection() {
  const [settings, setSettings] = useState({
    newSchool: true, paymentFailed: true, schoolSuspended: true,
    trialExpiring: true, platformAlert: true, weeklyReport: true,
    emailEnabled: true, smsEnabled: false, pushEnabled: true,
  });
  const toggle = (key: keyof typeof settings) =>
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-zinc-900">Notifications</h2>
        <p className="text-sm text-zinc-500 mt-0.5">Configure what alerts you receive and how</p>
      </div>

      <div>
        <h3 className="font-black text-zinc-700 text-xs uppercase tracking-widest mb-3">Channels</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { key: "emailEnabled", label: "Email",  icon: Mail,   desc: "admin@eduflow.app" },
            { key: "smsEnabled",   label: "SMS",    icon: Phone,  desc: "+234 800 EDU FLOW" },
            { key: "pushEnabled",  label: "Push",   icon: Bell,   desc: "Browser notifications" },
          ].map(ch => (
            <div key={ch.key} className={`flex flex-col gap-2 p-4 rounded-xl border-2 transition-all ${settings[ch.key as keyof typeof settings] ? "border-violet-200 bg-violet-50" : "border-zinc-200 bg-white"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ch.icon className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm font-black text-zinc-800">{ch.label}</span>
                </div>
                <Toggle checked={!!settings[ch.key as keyof typeof settings]} onChange={() => toggle(ch.key as keyof typeof settings)} />
              </div>
              <p className="text-xs text-zinc-400">{ch.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-black text-zinc-700 text-xs uppercase tracking-widest mb-3">Alert Types</h3>
        <div className="space-y-2">
          {[
            { key: "newSchool",       label: "New school registration",      desc: "When a new school registers or requests approval" },
            { key: "paymentFailed",   label: "Payment failure",              desc: "When a school payment fails or is overdue" },
            { key: "schoolSuspended", label: "School suspension",            desc: "When a school account is suspended" },
            { key: "trialExpiring",   label: "Trial expiring soon",          desc: "3 days before a trial period ends" },
            { key: "platformAlert",   label: "Platform health alerts",       desc: "Uptime, errors, and performance warnings" },
            { key: "weeklyReport",    label: "Weekly summary report",        desc: "Sent every Monday with platform metrics" },
          ].map(s => (
            <div key={s.key} className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-zinc-100 hover:border-zinc-200 transition-all">
              <div>
                <p className="text-sm font-black text-zinc-800">{s.label}</p>
                <p className="text-xs text-zinc-400 mt-0.5">{s.desc}</p>
              </div>
              <Toggle checked={!!settings[s.key as keyof typeof settings]} onChange={() => toggle(s.key as keyof typeof settings)} />
            </div>
          ))}
        </div>
      </div>
      <button className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-black rounded-xl text-sm shadow-md transition-colors">
        <Save className="w-4 h-4" /> Save Preferences
      </button>
    </div>
  );
}

// ─── Section: Integrations ────────────────────────────────────────────────────

function IntegrationsSection() {
  const integrations = [
    { name: "Paystack",        desc: "Payment processing for school fees",           connected: true,  icon: CreditCard, category: "Payments"  },
    { name: "Flutterwave",     desc: "Alternative payment gateway",                  connected: true,  icon: CreditCard, category: "Payments"  },
    { name: "Twilio SMS",      desc: "SMS notifications to parents and teachers",    connected: true,  icon: Phone,      category: "Messaging" },
    { name: "SendGrid",        desc: "Transactional email delivery",                 connected: true,  icon: Mail,       category: "Messaging" },
    { name: "Firebase FCM",    desc: "Push notifications for mobile app",            connected: false, icon: Bell,       category: "Messaging" },
    { name: "Google Analytics",desc: "Platform usage and behavior tracking",         connected: false, icon: BarChart, category: "Analytics" },
    { name: "Sentry",          desc: "Error tracking and monitoring",                connected: true,  icon: AlertTriangle, category: "Monitoring"},
    { name: "Webhook URL",     desc: "Custom webhook for external integrations",     connected: false, icon: Webhook,    category: "Custom"    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-zinc-900">Integrations</h2>
        <p className="text-sm text-zinc-500 mt-0.5">Connect third-party services to EduFlow</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {integrations.map((int, i) => (
          <motion.div key={int.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-zinc-100 hover:border-zinc-200 transition-all">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${int.connected ? "bg-violet-100" : "bg-zinc-100"}`}>
              <int.icon className={`w-5 h-5 ${int.connected ? "text-violet-600" : "text-zinc-400"}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-black text-zinc-900">{int.name}</p>
                <span className="text-xs text-zinc-400 bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded-md">{int.category}</span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 truncate">{int.desc}</p>
            </div>
            <button className={`text-xs font-bold px-3 py-1.5 rounded-lg border-2 flex-shrink-0 transition-all
              ${int.connected ? "border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100" : "border-violet-200 text-violet-700 bg-violet-50 hover:bg-violet-100"}`}>
              {int.connected ? "Connected" : "Connect"}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Section: Danger Zone ─────────────────────────────────────────────────────

function DangerSection() {
  const [confirmText, setConfirmText] = useState("");
  const [showConfirm, setShowConfirm] = useState<string | null>(null);

  const dangers = [
    {
      id: "purge-trials",
      label: "Purge Expired Trials",
      desc: "Permanently delete all data from expired trial accounts that have been inactive for 90+ days.",
      confirm: "PURGE TRIALS",
      buttonLabel: "Purge Expired Trials",
      color: "border-orange-200",
      btnColor: "bg-orange-600 hover:bg-orange-700",
    },
    {
      id: "force-logout",
      label: "Force Logout All Users",
      desc: "Immediately invalidate all active sessions across the entire platform. All users will be logged out.",
      confirm: "FORCE LOGOUT",
      buttonLabel: "Force Logout All Users",
      color: "border-red-200",
      btnColor: "bg-red-600 hover:bg-red-700",
    },
    {
      id: "reset-platform",
      label: "Reset Platform Data",
      desc: "Permanently delete all school data, users, and configurations. THIS CANNOT BE UNDONE.",
      confirm: "RESET PLATFORM",
      buttonLabel: "Reset All Platform Data",
      color: "border-red-300",
      btnColor: "bg-red-700 hover:bg-red-800",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-red-700">Danger Zone</h2>
        <p className="text-sm text-zinc-500 mt-0.5">Irreversible and destructive actions — proceed with extreme caution</p>
      </div>

      <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-red-700 font-semibold">These actions are irreversible. There is no undo. Make sure you know what you are doing before proceeding.</p>
      </div>

      <div className="space-y-4">
        {dangers.map(d => (
          <div key={d.id} className={`bg-white border-2 ${d.color} rounded-2xl p-5`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-black text-zinc-900">{d.label}</h3>
                <p className="text-sm text-zinc-500 mt-1 max-w-lg">{d.desc}</p>
              </div>
              <button onClick={() => setShowConfirm(d.id)}
                className={`flex-shrink-0 px-4 py-2.5 ${d.btnColor} text-white font-black rounded-xl text-sm transition-colors shadow-sm`}>
                {d.buttonLabel}
              </button>
            </div>

            <AnimatePresence>
              {showConfirm === d.id && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="mt-4 pt-4 border-t border-red-200">
                    <p className="text-xs font-black text-red-700 mb-2">
                      Type <span className="bg-red-100 px-1.5 py-0.5 rounded font-mono">{d.confirm}</span> to confirm:
                    </p>
                    <div className="flex gap-3">
                      <input value={confirmText} onChange={e => setConfirmText(e.target.value)}
                        placeholder={`Type ${d.confirm}…`}
                        className="flex-1 px-4 py-2.5 border-2 border-red-300 focus:border-red-500 rounded-xl text-sm font-mono outline-none" />
                      <button
                        disabled={confirmText !== d.confirm}
                        onClick={() => { setConfirmText(""); setShowConfirm(null); }}
                        className="px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black rounded-xl text-sm transition-colors">
                        Confirm
                      </button>
                      <button onClick={() => { setShowConfirm(null); setConfirmText(""); }}
                        className="px-4 py-2.5 border-2 border-zinc-200 text-zinc-600 font-bold rounded-xl text-sm hover:bg-zinc-50 transition-all">
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Billing Config Section ───────────────────────────────────────────────────

function BillingConfigSection() {
  const plans = [
    { name: "Free Trial", price: "₦0", duration: "30 days", features: ["Up to 50 students", "Basic attendance", "Basic results", "Email support"] },
    { name: "Professional", price: "₦180,000", duration: "per term", features: ["Unlimited students", "Full attendance suite", "Results & reports", "Fee management", "Priority support"] },
    { name: "Enterprise", price: "₦350,000", duration: "per term", features: ["Everything in Professional", "Multi-branch support", "Custom branding", "API access", "Dedicated support", "SLA guarantee"] },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-zinc-900">Billing Configuration</h2>
        <p className="text-sm text-zinc-500 mt-0.5">Manage subscription plans and pricing</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {plans.map((plan, i) => (
          <div key={plan.name} className={`bg-white border-2 rounded-2xl p-5 relative ${i === 1 ? "border-violet-300 shadow-lg shadow-violet-100" : "border-zinc-200"}`}>
            {i === 1 && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-black px-3 py-1 rounded-full">Popular</div>}
            <p className="font-black text-zinc-900">{plan.name}</p>
            <div className="mt-2 mb-4">
              <span className="text-2xl font-black text-zinc-900">{plan.price}</span>
              <span className="text-xs text-zinc-400 ml-1">{plan.duration}</span>
            </div>
            <ul className="space-y-1.5 mb-4">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-xs text-zinc-600">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />{f}
                </li>
              ))}
            </ul>
            <button className="w-full py-2 border-2 border-zinc-200 text-zinc-600 hover:border-violet-300 hover:text-violet-700 font-bold rounded-xl text-xs transition-all">
              Edit Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SuperAdminSettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>("profile");

  const renderSection = () => {
    switch (activeSection) {
      case "profile":       return <ProfileSection />;
      case "platform":      return <PlatformSection />;
      case "security":      return <SecuritySection />;
      case "notifications": return <NotificationsSection />;
      case "integrations":  return <IntegrationsSection />;
      case "billing":       return <BillingConfigSection />;
      case "danger":        return <DangerSection />;
      default:              return null;
    }
  };

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      <div className="hidden lg:flex flex-shrink-0"><SuperSidebar active="/super-admin/settings" /></div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-50 lg:hidden">
              <SuperSidebar active="/super-admin/settings" mobile onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-zinc-100 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-zinc-100 text-zinc-500"><Menu className="w-5 h-5" /></button>
            <div>
              <h1 className="text-lg font-black text-zinc-900">Settings</h1>
              <p className="text-xs text-zinc-400 mt-0.5">Platform configuration & super admin preferences</p>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Settings sidebar */}
          <nav className="hidden md:flex flex-col w-56 bg-white border-r border-zinc-100 py-5 flex-shrink-0">
            <p className="text-xs font-black text-zinc-400 uppercase tracking-widest px-5 mb-3">Settings</p>
            {SECTIONS.map(s => {
              const isActive = activeSection === s.id;
              const isDanger = s.id === "danger";
              return (
                <button key={s.id} onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-3 px-5 py-2.5 text-sm font-semibold transition-all text-left w-full
                    ${isActive
                      ? isDanger ? "bg-red-50 text-red-700 border-r-2 border-red-500" : "bg-violet-50 text-violet-700 border-r-2 border-violet-500"
                      : isDanger ? "text-red-500 hover:bg-red-50" : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"}`}>
                  <s.icon className="w-4 h-4 flex-shrink-0" />
                  {s.label}
                </button>
              );
            })}
          </nav>

          {/* Mobile section selector */}
          <div className="md:hidden border-b border-zinc-100 bg-white px-4 py-2 flex gap-2 overflow-x-auto flex-shrink-0">
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0 transition-all
                  ${activeSection === s.id ? "bg-violet-600 text-white" : "bg-zinc-100 text-zinc-600"}`}>
                <s.icon className="w-3 h-3" />{s.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <main className="flex-1 overflow-y-auto px-6 py-7">
            <AnimatePresence mode="wait">
              <motion.div key={activeSection}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="max-w-2xl">
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}