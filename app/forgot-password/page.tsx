"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  School,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  KeyRound,
} from "lucide-react";

interface FormErrors {
  email?: string;
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};
    if (!email) newErrors.email = "Email address is required";
    else if (!validateEmail(email)) newErrors.email = "Enter a valid email address";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    setSent(true);
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
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/80 border border-slate-100 overflow-hidden">
          {/* Top accent bar */}
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
              {!sent ? (
                /* ── Request form ── */
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Icon */}
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 border border-emerald-100">
                    <KeyRound className="w-7 h-7 text-emerald-600" />
                  </div>

                  <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                    Forgot your password?
                  </h1>
                  <p className="text-sm text-slate-500 leading-relaxed mb-7">
                    No worries. Enter the email address linked to your EduFlow
                    account and we&apos;ll send you a reset link within seconds.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-slate-700"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          id="email"
                          type="email"
                          placeholder="admin@yourschool.edu.ng"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setErrors({});
                          }}
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 bg-white outline-none transition-all
                            ${
                              errors.email
                                ? "border-red-300 ring-2 ring-red-100"
                                : "border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
                            }`}
                        />
                      </div>
                      <AnimatePresence>
                        {errors.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-1.5 text-xs text-red-500 font-medium"
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                            {errors.email}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

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
                          Sending reset link…
                        </>
                      ) : (
                        <>
                          Send Reset Link
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </form>

                  <div className="mt-6 text-center">
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 font-semibold transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Sign In
                    </Link>
                  </div>
                </motion.div>
              ) : (
                /* ── Success state ── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-center"
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
                    Check your inbox!
                  </h2>
                  <p className="text-sm text-slate-500 leading-relaxed mb-2">
                    We&apos;ve sent a password reset link to
                  </p>
                  <p className="text-sm font-bold text-slate-800 bg-slate-100 rounded-lg px-4 py-2 inline-block mb-6">
                    {email}
                  </p>

                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left mb-7">
                    <p className="text-xs font-bold text-amber-800 mb-2">
                      Didn&apos;t receive the email?
                    </p>
                    <ul className="space-y-1.5 text-xs text-amber-700">
                      <li>• Check your spam or junk folder</li>
                      <li>• Make sure you entered the correct email</li>
                      <li>• The link expires in 30 minutes</li>
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      setSent(false);
                      setEmail("");
                    }}
                    className="text-sm text-emerald-600 font-bold hover:underline mb-5 block mx-auto"
                  >
                    Try a different email address
                  </button>

                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 font-semibold transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sign In
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
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