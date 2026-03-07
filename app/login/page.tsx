"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  School,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  UserCheck,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  email: string;
  password: string;
  remember: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── Input Component ──────────────────────────────────────────────────────────

function InputField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  suffix,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  icon: React.ElementType;
  suffix?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          <Icon className="w-4 h-4" />
        </div>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-10 pr-${suffix ? "12" : "4"} py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 bg-white outline-none transition-all
            ${
              error
                ? "border-red-300 ring-2 ring-red-100 focus:border-red-400"
                : "border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
            }`}
        />
        {suffix && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{suffix}</div>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1.5 text-xs text-red-500 font-medium"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Left Panel ───────────────────────────────────────────────────────────────

function LeftPanel() {
  const highlights = [
    { icon: UserCheck, text: "Track attendance across all classes in real time" },
    { icon: ShieldCheck, text: "Bank-grade encryption keeps your data safe" },
    { icon: BarChart3, text: "Analytics that show you exactly how your school performs" },
  ];

  return (
    <div className="hidden lg:flex flex-col justify-between h-full p-12 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative flex items-center gap-2.5"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
          <School className="w-5 h-5 text-white" />
        </div>
        <span className="font-black text-2xl text-white tracking-tight">
          Edu<span className="text-emerald-400">Flow</span>
        </span>
      </motion.div>

      {/* Middle content */}
      <div className="relative space-y-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <p className="text-emerald-400 text-sm font-bold tracking-widest uppercase mb-3">
            Welcome back
          </p>
          <h2 className="text-4xl font-black text-white leading-tight">
            Your school runs
            <br />
            <span className="text-emerald-400">better with data.</span>
          </h2>
          <p className="text-slate-400 mt-4 text-base leading-relaxed">
            Log back in and pick up right where you left off. Your dashboard,
            reports, and team are waiting.
          </p>
        </motion.div>

        <div className="space-y-4">
          {highlights.map((h, i) => (
            <motion.div
              key={h.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <h.icon className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{h.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative grid grid-cols-3 gap-4 pt-8 border-t border-white/10"
      >
        {[
          { n: "500+", label: "Schools" },
          { n: "80K+", label: "Students" },
          { n: "99.9%", label: "Uptime" },
        ].map((s) => (
          <div key={s.label}>
            <div className="text-xl font-black text-white">{s.n}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────

export default function LoginPage() {
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const setField = <K extends keyof FormState>(key: K, val: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: undefined, general: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.email) newErrors.email = "Email address is required";
    else if (!validateEmail(form.email)) newErrors.email = "Enter a valid email address";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    setSuccess(true);

    // In production: call your auth API, then redirect based on role
    // e.g. router.push('/dashboard') or '/admin' or '/teacher'
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <LeftPanel />

      {/* Right — form */}
      <div className="flex items-center justify-center px-6 py-12 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <School className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-xl text-slate-900">
              Edu<span className="text-emerald-500">Flow</span>
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
              Sign in to your account
            </h1>
            <p className="text-slate-500 text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-emerald-600 font-bold hover:underline">
                Register your school
              </Link>
            </p>
          </div>

          {/* Success state */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-emerald-800">Login successful!</p>
                  <p className="text-xs text-emerald-600">Redirecting to your dashboard…</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* General error */}
          <AnimatePresence>
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700 font-medium">{errors.general}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <InputField
              id="email"
              label="Email Address"
              type="email"
              placeholder="admin@yourschool.edu.ng"
              value={form.email}
              onChange={(v) => setField("email", v)}
              error={errors.email}
              icon={Mail}
            />

            <InputField
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={form.password}
              onChange={(v) => setField("password", v)}
              error={errors.password}
              icon={Lock}
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-700 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  onClick={() => setField("remember", !form.remember)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer
                    ${form.remember ? "bg-emerald-600 border-emerald-600" : "border-slate-300 group-hover:border-emerald-400"}`}
                >
                  {form.remember && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.15 }}
                    >
                      <CheckCircle className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </div>
                <span className="text-sm text-slate-600 select-none">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-emerald-600 font-semibold hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading || success}
              whileHover={{ scale: loading || success ? 1 : 1.02 }}
              whileTap={{ scale: loading || success ? 1 : 0.98 }}
              className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-black rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 transition-colors text-sm mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in…
                </>
              ) : success ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Signed In!
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-7">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">Role-based access</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Role badges */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { role: "Super Admin", color: "bg-violet-50 text-violet-700 border-violet-200", dot: "bg-violet-500" },
              { role: "School Admin", color: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
              { role: "Teacher", color: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
              { role: "Parent", color: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-500" },
            ].map((r) => (
              <div
                key={r.role}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold ${r.color}`}
              >
                <div className={`w-2 h-2 rounded-full ${r.dot}`} />
                {r.role}
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-400 mt-3">
            You&apos;ll be redirected to your role&apos;s dashboard automatically.
          </p>

          {/* Footer */}
          <p className="text-center text-xs text-slate-400 mt-8">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-slate-600 hover:underline">Terms</Link>{" "}
            &amp;{" "}
            <Link href="/privacy" className="text-slate-600 hover:underline">Privacy Policy</Link>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}