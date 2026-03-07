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
  Phone,
  MapPin,
  User,
  Building2,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  BookOpen,
  Shield,
  Users,
  Check,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SchoolInfo {
  schoolName: string;
  schoolEmail: string;
  schoolPhone: string;
  address: string;
  schoolType: string;
}

interface AdminInfo {
  adminName: string;
  adminEmail: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

type Step = 1 | 2 | 3;

interface FieldErrors {
  [key: string]: string | undefined;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SCHOOL_TYPES = [
  "Nursery & Primary School",
  "Secondary School",
  "Nursery, Primary & Secondary",
  "Tertiary Institution",
  "Vocational School",
  "Islamic School",
  "International School",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string) {
  return /^[0-9+\-\s()]{7,15}$/.test(phone.trim());
}

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-red-400" };
  if (score === 2) return { score, label: "Fair", color: "bg-orange-400" };
  if (score === 3) return { score, label: "Good", color: "bg-yellow-400" };
  return { score, label: "Strong", color: "bg-emerald-500" };
}

// ─── Reusable Input ───────────────────────────────────────────────────────────

function Field({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  suffix,
  hint,
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
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Icon className="w-4 h-4" />
        </div>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-10 ${suffix ? "pr-12" : "pr-4"} py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 bg-white outline-none transition-all
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
      {hint && !error && (
        <p className="text-xs text-slate-400">{hint}</p>
      )}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1.5 text-xs text-red-500 font-medium"
          >
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  error,
  icon: Icon,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  error?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Icon className="w-4 h-4" />
        </div>
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-slate-900 bg-white outline-none appearance-none cursor-pointer transition-all
            ${
              error
                ? "border-red-300 ring-2 ring-red-100"
                : "border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
            }
            ${value === "" ? "text-slate-400" : "text-slate-900"}`}
        >
          <option value="" disabled>
            Select school type
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
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

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: Step }) {
  const steps = [
    { num: 1, label: "School Info" },
    { num: 2, label: "Admin Account" },
    { num: 3, label: "Confirmed" },
  ];

  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((s, i) => (
        <div key={s.num} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black transition-all duration-300
                ${
                  current > s.num
                    ? "bg-emerald-600 text-white"
                    : current === s.num
                    ? "bg-emerald-600 text-white ring-4 ring-emerald-100"
                    : "bg-slate-100 text-slate-400"
                }`}
            >
              {current > s.num ? <Check className="w-4 h-4" /> : s.num}
            </div>
            <span
              className={`text-xs font-semibold whitespace-nowrap ${
                current >= s.num ? "text-slate-800" : "text-slate-400"
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mb-5 mx-2 transition-all duration-500 ${
                current > s.num ? "bg-emerald-500" : "bg-slate-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Left Panel ───────────────────────────────────────────────────────────────

function LeftPanel() {
  const features = [
    {
      icon: BookOpen,
      title: "Result Management",
      desc: "Auto-generate report cards at the end of every term.",
    },
    {
      icon: Shield,
      title: "Data Security",
      desc: "Bank-grade encryption and daily backups for all your data.",
    },
    {
      icon: Users,
      title: "Multi-Role Access",
      desc: "Separate dashboards for admins, teachers, and parents.",
    },
  ];

  return (
    <div className="hidden lg:flex flex-col justify-between h-full p-12 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl" />
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

      {/* Middle */}
      <div className="relative space-y-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <p className="text-emerald-400 text-sm font-bold tracking-widest uppercase mb-3">
            Get started free
          </p>
          <h2 className="text-4xl font-black text-white leading-tight">
            Your school.
            <br />
            <span className="text-emerald-400">Fully organised.</span>
          </h2>
          <p className="text-slate-400 mt-4 text-base leading-relaxed">
            Join 500+ schools that replaced paper registers and spreadsheets
            with EduFlow. Set up takes less than 5 minutes.
          </p>
        </motion.div>

        <div className="space-y-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <f.icon className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-white text-sm font-bold">{f.title}</div>
                <div className="text-slate-400 text-xs mt-0.5">{f.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trial badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="inline-flex items-center gap-2.5 px-5 py-3 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-300 text-sm font-semibold">
            14-day free trial · No credit card needed
          </span>
        </motion.div>
      </div>

      {/* Trust logos placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative pt-8 border-t border-white/10"
      >
        <p className="text-xs text-slate-600 mb-4 uppercase tracking-widest font-semibold">
          Approved &amp; pending approval
        </p>
        <div className="flex gap-6">
          {["Lagos State", "Abuja FCT", "Enugu State", "Rivers State"].map((state) => (
            <div key={state} className="text-xs text-slate-500 font-medium">
              {state}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Step 1 — School Information ──────────────────────────────────────────────

function StepOne({
  data,
  onChange,
  errors,
}: {
  data: SchoolInfo;
  onChange: <K extends keyof SchoolInfo>(key: K, val: SchoolInfo[K]) => void;
  errors: FieldErrors;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35 }}
      className="space-y-4"
    >
      <Field
        id="schoolName"
        label="School Name *"
        placeholder="e.g. Greenfield College"
        value={data.schoolName}
        onChange={(v) => onChange("schoolName", v)}
        error={errors.schoolName}
        icon={Building2}
      />

      <div className="grid grid-cols-2 gap-4">
        <Field
          id="schoolEmail"
          label="School Email *"
          type="email"
          placeholder="info@school.edu.ng"
          value={data.schoolEmail}
          onChange={(v) => onChange("schoolEmail", v)}
          error={errors.schoolEmail}
          icon={Mail}
        />
        <Field
          id="schoolPhone"
          label="Phone Number *"
          type="tel"
          placeholder="+234 800 000 0000"
          value={data.schoolPhone}
          onChange={(v) => onChange("schoolPhone", v)}
          error={errors.schoolPhone}
          icon={Phone}
        />
      </div>

      <Field
        id="address"
        label="School Address *"
        placeholder="12 Education Road, Lagos"
        value={data.address}
        onChange={(v) => onChange("address", v)}
        error={errors.address}
        icon={MapPin}
      />

      <SelectField
        id="schoolType"
        label="School Type *"
        value={data.schoolType}
        onChange={(v) => onChange("schoolType", v)}
        options={SCHOOL_TYPES}
        error={errors.schoolType}
        icon={School}
      />
    </motion.div>
  );
}

// ─── Step 2 — Admin Information ───────────────────────────────────────────────

function StepTwo({
  data,
  onChange,
  errors,
}: {
  data: AdminInfo;
  onChange: <K extends keyof AdminInfo>(key: K, val: AdminInfo[K]) => void;
  errors: FieldErrors;
}) {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const strength = getPasswordStrength(data.password);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35 }}
      className="space-y-4"
    >
      <Field
        id="adminName"
        label="Full Name *"
        placeholder="e.g. Dr. Chidinma Okonkwo"
        value={data.adminName}
        onChange={(v) => onChange("adminName", v)}
        error={errors.adminName}
        icon={User}
        hint="This will be your display name on the platform."
      />

      <Field
        id="adminEmail"
        label="Admin Email Address *"
        type="email"
        placeholder="chidinma@school.edu.ng"
        value={data.adminEmail}
        onChange={(v) => onChange("adminEmail", v)}
        error={errors.adminEmail}
        icon={Mail}
        hint="You'll use this email to log in."
      />

      <div className="space-y-1.5">
        <Field
          id="password"
          label="Password *"
          type={showPass ? "text" : "password"}
          placeholder="Create a strong password"
          value={data.password}
          onChange={(v) => onChange("password", v)}
          error={errors.password}
          icon={Lock}
          suffix={
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="text-slate-400 hover:text-slate-700 transition-colors"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />
        {/* Password strength */}
        {data.password && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                    bar <= strength.score ? strength.color : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
            <p className={`text-xs font-semibold ${
              strength.score <= 1 ? "text-red-500"
              : strength.score === 2 ? "text-orange-500"
              : strength.score === 3 ? "text-yellow-600"
              : "text-emerald-600"
            }`}>
              Password strength: {strength.label}
            </p>
          </div>
        )}
      </div>

      <Field
        id="confirmPassword"
        label="Confirm Password *"
        type={showConfirm ? "text" : "password"}
        placeholder="Re-enter your password"
        value={data.confirmPassword}
        onChange={(v) => onChange("confirmPassword", v)}
        error={errors.confirmPassword}
        icon={Lock}
        suffix={
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="text-slate-400 hover:text-slate-700 transition-colors"
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        }
      />

      {/* Terms */}
      <div className="pt-1">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div
            onClick={() => onChange("agreeTerms", !data.agreeTerms)}
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all cursor-pointer
              ${data.agreeTerms ? "bg-emerald-600 border-emerald-600" : "border-slate-300 group-hover:border-emerald-400"}`}
          >
            {data.agreeTerms && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.15 }}>
                <Check className="w-3 h-3 text-white" />
              </motion.div>
            )}
          </div>
          <span className="text-sm text-slate-600 leading-relaxed select-none">
            I agree to EduFlow&apos;s{" "}
            <Link href="/terms" className="text-emerald-600 font-semibold hover:underline" target="_blank">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-emerald-600 font-semibold hover:underline" target="_blank">
              Privacy Policy
            </Link>
            . I confirm I am authorised to register this school.
          </span>
        </label>
        <AnimatePresence>
          {errors.agreeTerms && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 text-xs text-red-500 font-medium mt-1.5 ml-8"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.agreeTerms}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Step 3 — Success ─────────────────────────────────────────────────────────

function StepSuccess({ schoolName }: { schoolName: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="text-center py-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 200 }}
        className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle className="w-10 h-10 text-emerald-600" />
      </motion.div>

      <h3 className="text-2xl font-black text-slate-900 mb-2">
        Registration Submitted! 🎉
      </h3>
      <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
        <strong className="text-slate-700">{schoolName || "Your school"}</strong> has been
        registered successfully. Your account is pending approval by our team — this usually
        takes <strong className="text-slate-700">1–2 business hours</strong>.
      </p>

      {/* What happens next */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-3 mb-6">
        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">
          What happens next
        </p>
        {[
          "Check your inbox for a verification email",
          "Our team reviews and approves your school",
          "You receive login credentials and get started",
          "Import students & teachers via CSV",
        ].map((step, i) => (
          <div key={step} className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black flex-shrink-0">
              {i + 1}
            </div>
            <p className="text-sm text-slate-600">{step}</p>
          </div>
        ))}
      </div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link
          href="/login"
          className="block w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-sm text-center shadow-md shadow-emerald-100 transition-colors"
        >
          Go to Login Page
        </Link>
      </motion.div>
    </motion.div>
  );
}

// ─── Register Page ────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>({
    schoolName: "",
    schoolEmail: "",
    schoolPhone: "",
    address: "",
    schoolType: "",
  });

  const [adminInfo, setAdminInfo] = useState<AdminInfo>({
    adminName: "",
    adminEmail: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const updateSchool = <K extends keyof SchoolInfo>(key: K, val: SchoolInfo[K]) => {
    setSchoolInfo((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const updateAdmin = <K extends keyof AdminInfo>(key: K, val: AdminInfo[K]) => {
    setAdminInfo((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const validateStep1 = (): boolean => {
    const e: FieldErrors = {};
    if (!schoolInfo.schoolName.trim()) e.schoolName = "School name is required";
    if (!schoolInfo.schoolEmail) e.schoolEmail = "School email is required";
    else if (!validateEmail(schoolInfo.schoolEmail)) e.schoolEmail = "Enter a valid email";
    if (!schoolInfo.schoolPhone) e.schoolPhone = "Phone number is required";
    else if (!validatePhone(schoolInfo.schoolPhone)) e.schoolPhone = "Enter a valid phone number";
    if (!schoolInfo.address.trim()) e.address = "School address is required";
    if (!schoolInfo.schoolType) e.schoolType = "Please select a school type";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = (): boolean => {
    const e: FieldErrors = {};
    if (!adminInfo.adminName.trim()) e.adminName = "Full name is required";
    if (!adminInfo.adminEmail) e.adminEmail = "Email is required";
    else if (!validateEmail(adminInfo.adminEmail)) e.adminEmail = "Enter a valid email address";
    if (!adminInfo.password) e.password = "Password is required";
    else if (adminInfo.password.length < 8) e.password = "Password must be at least 8 characters";
    if (!adminInfo.confirmPassword) e.confirmPassword = "Please confirm your password";
    else if (adminInfo.password !== adminInfo.confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!adminInfo.agreeTerms) e.agreeTerms = "You must agree to the terms to continue";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = async () => {
    if (step === 1) {
      if (!validateStep1()) return;
      setStep(2);
      setErrors({});
    } else if (step === 2) {
      if (!validateStep2()) return;
      setLoading(true);
      await new Promise((r) => setTimeout(r, 2000)); // simulate API
      setLoading(false);
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setErrors({});
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <LeftPanel />

      {/* Right — form */}
      <div className="flex items-start justify-center px-6 py-10 bg-slate-50 min-h-screen overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md py-4"
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
          {step !== 3 && (
            <div className="mb-6">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
                Register your school
              </h1>
              <p className="text-slate-500 text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-emerald-600 font-bold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          )}

          {/* Step indicator */}
          {step !== 3 && <StepIndicator current={step} />}

          {/* Step label */}
          {step !== 3 && (
            <div className="mb-5">
              <h2 className="text-base font-black text-slate-800">
                {step === 1 ? "School Information" : "Administrator Account"}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {step === 1
                  ? "Tell us about your school so we can set up your account."
                  : "Create the main admin account for managing your school."}
              </p>
            </div>
          )}

          {/* Form steps */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <StepOne
                key="step1"
                data={schoolInfo}
                onChange={updateSchool}
                errors={errors}
              />
            )}
            {step === 2 && (
              <StepTwo
                key="step2"
                data={adminInfo}
                onChange={updateAdmin}
                errors={errors}
              />
            )}
            {step === 3 && (
              <StepSuccess key="step3" schoolName={schoolInfo.schoolName} />
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          {step !== 3 && (
            <div className={`flex gap-3 mt-6 ${step === 1 ? "justify-end" : "justify-between"}`}>
              {step === 2 && (
                <motion.button
                  type="button"
                  onClick={handleBack}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-5 py-3 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl text-sm transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </motion.button>
              )}
              <motion.button
                type="button"
                onClick={handleNext}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-black rounded-xl text-sm shadow-md shadow-emerald-100 transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Registering school…
                  </>
                ) : step === 1 ? (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Register School
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          )}

          {/* Footer */}
          {step !== 3 && (
            <p className="text-center text-xs text-slate-400 mt-6">
              Your data is encrypted and protected.{" "}
              <Link href="/privacy" className="text-slate-500 hover:underline">
                Privacy Policy
              </Link>
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}