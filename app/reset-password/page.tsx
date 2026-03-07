"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  School,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Check,
} from "lucide-react";

interface FormErrors {
  password?: string;
  confirmPassword?: string;
}

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: "Weak", color: "bg-red-400", text: "text-red-500" };
  if (score === 2) return { score, label: "Fair", color: "bg-orange-400", text: "text-orange-500" };
  if (score === 3) return { score, label: "Good", color: "bg-yellow-400", text: "text-yellow-600" };
  return { score, label: "Strong", color: "bg-emerald-500", text: "text-emerald-600" };
}

const requirements = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
  { label: "One special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const strength = getPasswordStrength(password);

  const validate = () => {
    const e: FormErrors = {};
    if (!password) e.password = "New password is required";
    else if (password.length < 8) e.password = "Password must be at least 8 characters";
    if (!confirmPassword) e.confirmPassword = "Please confirm your new password";
    else if (password !== confirmPassword) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    setDone(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-100/40 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/80 border border-slate-100 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

          <div className="p-8">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2.5 mb-8">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-200">
                <School className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-xl text-slate-900 tracking-tight">
                Edu<span className="text-emerald-500">Flow</span>
              </span>
            </Link>

            <AnimatePresence mode="wait">
              {!done ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Icon */}
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 border border-emerald-100">
                    <ShieldCheck className="w-7 h-7 text-emerald-600" />
                  </div>

                  <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                    Set a new password
                  </h1>
                  <p className="text-sm text-slate-500 leading-relaxed mb-7">
                    Create a strong password for your EduFlow account.
                    Your new password must be different from your previous one.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    {/* New Password */}
                    <div className="space-y-1.5">
                      <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setErrors((p) => ({ ...p, password: undefined }));
                          }}
                          className={`w-full pl-10 pr-12 py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 bg-white outline-none transition-all
                            ${
                              errors.password
                                ? "border-red-300 ring-2 ring-red-100"
                                : "border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
                            }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Strength meter */}
                      {password && (
                        <div className="space-y-1.5 pt-1">
                          <div className="flex gap-1.5">
                            {[1, 2, 3, 4].map((bar) => (
                              <div
                                key={bar}
                                className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                                  bar <= strength.score ? strength.color : "bg-slate-200"
                                }`}
                              />
                            ))}
                          </div>
                          <p className={`text-xs font-semibold ${strength.text}`}>
                            {strength.label} password
                          </p>
                        </div>
                      )}

                      <AnimatePresence>
                        {errors.password && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-1.5 text-xs text-red-500 font-medium"
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                            {errors.password}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                      <label htmlFor="confirm" className="block text-sm font-semibold text-slate-700">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          id="confirm"
                          type={showConfirm ? "text" : "password"}
                          placeholder="Re-enter your new password"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setErrors((p) => ({ ...p, confirmPassword: undefined }));
                          }}
                          className={`w-full pl-10 pr-12 py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 bg-white outline-none transition-all
                            ${
                              errors.confirmPassword
                                ? "border-red-300 ring-2 ring-red-100"
                                : confirmPassword && password === confirmPassword
                                ? "border-emerald-400 ring-2 ring-emerald-50"
                                : "border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
                            }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                        >
                          {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {/* Match indicator */}
                      {confirmPassword && password === confirmPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Passwords match
                        </motion.p>
                      )}
                      <AnimatePresence>
                        {errors.confirmPassword && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-1.5 text-xs text-red-500 font-medium"
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                            {errors.confirmPassword}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Requirements checklist */}
                    {password && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2"
                      >
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                          Password requirements
                        </p>
                        {requirements.map((req) => {
                          const met = req.test(password);
                          return (
                            <div key={req.label} className="flex items-center gap-2">
                              <div
                                className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                                  met ? "bg-emerald-500" : "bg-slate-200"
                                }`}
                              >
                                {met && <Check className="w-2.5 h-2.5 text-white" />}
                              </div>
                              <span
                                className={`text-xs transition-colors ${
                                  met ? "text-emerald-700 font-semibold" : "text-slate-500"
                                }`}
                              >
                                {req.label}
                              </span>
                            </div>
                          );
                        })}
                      </motion.div>
                    )}

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white font-black rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 transition-colors text-sm"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Updating password…
                        </>
                      ) : (
                        <>
                          Reset Password
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                /* ── Success state ── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-2"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 220, delay: 0.1 }}
                    className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5"
                  >
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </motion.div>

                  <h2 className="text-2xl font-black text-slate-900 mb-2">
                    Password updated!
                  </h2>
                  <p className="text-sm text-slate-500 leading-relaxed mb-7 max-w-xs mx-auto">
                    Your password has been reset successfully. You can now sign
                    in with your new password.
                  </p>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/login"
                      className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-md shadow-emerald-100 transition-colors text-sm"
                    >
                      Go to Sign In
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Need help?{" "}
          <a href="mailto:support@eduflow.app" className="text-slate-600 hover:underline">
            support@eduflow.app
          </a>
        </p>
      </motion.div>
    </div>
  );
}