"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence, Variants } from "framer-motion";
import {
  UserCheck,
  CreditCard,
  BarChart3,
  Bell,
  BookOpen,
  Megaphone,
  ArrowRight,
  PlayCircle,
  Sparkles,
  Check,
  Star,
  ChevronDown,
  Menu,
  X,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  School,
  Users,
  TrendingUp,
  Shield,
  Mail,
  Phone,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";


const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      delay: i * 0.09,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};


function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}


function Badge({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={0}
      className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-sm font-semibold mb-6"
    >
      <Icon className="w-3.5 h-3.5" />
      {text}
    </motion.div>
  );
}


const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
] as const;

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-100 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md shadow-emerald-200">
              <School className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-xl text-slate-900 tracking-tight">
              Edu<span className="text-emerald-500">Flow</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/login"
              className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors px-3 py-2"
            >
              Login
            </Link>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/register"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-sm shadow-md shadow-emerald-200 transition-colors"
              >
                Register School
              </Link>
            </motion.div>
          </div>

          <button
            className="lg:hidden p-2 text-slate-600"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22 }}
            className="fixed top-16 inset-x-0 z-40 bg-white border-b border-slate-200 shadow-xl px-6 py-6 flex flex-col gap-4 lg:hidden"
          >
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-slate-700 font-semibold text-base"
              >
                {l.label}
              </a>
            ))}
            <hr className="border-slate-100" />
            <Link href="/login" className="text-slate-600 font-medium">
              Login
            </Link>
            <Link
              href="/register"
              className="px-5 py-3 bg-emerald-600 text-white font-bold rounded-lg text-center shadow-md"
            >
              Register School
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative pt-28 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-emerald-100/60 via-teal-50/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-50/50 to-transparent rounded-full blur-3xl" />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <div>
            <motion.div
              variants={fadeUp}
              custom={0}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-sm font-semibold mb-6"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Trusted by 500+ Schools Across Africa
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              initial="hidden"
              animate="visible"
              className="text-5xl lg:text-[3.6rem] font-black text-slate-900 leading-[1.1] tracking-tight mb-6"
            >
              Manage Attendance,{" "}
              <span className="relative">
                <span className="relative z-10 text-emerald-600">Fees</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-emerald-100 -z-0 rounded" />
              </span>{" "}
              &amp; Results in{" "}
              <span className="text-teal-600">One Platform</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              initial="hidden"
              animate="visible"
              className="text-lg text-slate-500 leading-relaxed mb-8 max-w-xl"
            >
              EduFlow gives school administrators, teachers, and parents a
              single command center — track attendance in real time, collect
              fees online, publish results, and keep parents in the loop
              automatically. No spreadsheets. No chaos.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={3}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row gap-3 mb-12"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-colors text-base"
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white border-2 border-slate-200 hover:border-emerald-300 text-slate-700 font-bold rounded-xl transition-all text-base"
                >
                  <PlayCircle className="w-4 h-4 text-emerald-500" />
                  See How It Works
                </a>
              </motion.div>
            </motion.div>

            {/* Social proof */}
            <motion.div
              variants={fadeUp}
              custom={4}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-3 gap-5 border-t border-slate-100 pt-8"
            >
              {[
                { n: "500+", label: "Schools" },
                { n: "80K+", label: "Students" },
                { n: "98%", label: "Satisfaction" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-black text-slate-900">{s.n}</div>
                  <div className="text-sm text-slate-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="relative"
          >
            <div className="absolute -top-8 -right-8 w-64 h-64 bg-emerald-200/50 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-teal-200/40 rounded-full blur-3xl pointer-events-none" />

            {/* Dashboard card */}
            <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
              {/* Header bar */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/30" />
                  <div className="w-3 h-3 rounded-full bg-white/30" />
                  <div className="w-3 h-3 rounded-full bg-white/30" />
                </div>
                <div className="flex-1 bg-white/20 rounded-md h-5 w-40 mx-auto" />
              </div>

              {/* Stat cards */}
              <div className="p-5 grid grid-cols-2 gap-3">
                {[
                  { label: "Total Students", value: "1,284", color: "bg-emerald-50 text-emerald-700", bar: "w-3/4 bg-emerald-400" },
                  { label: "Fees Collected", value: "₦4.2M", color: "bg-blue-50 text-blue-700", bar: "w-2/3 bg-blue-400" },
                  { label: "Attendance Today", value: "94.2%", color: "bg-violet-50 text-violet-700", bar: "w-4/5 bg-violet-400" },
                  { label: "Outstanding Fees", value: "₦820K", color: "bg-orange-50 text-orange-700", bar: "w-1/2 bg-orange-400" },
                ].map((card) => (
                  <div key={card.label} className={`${card.color} rounded-xl p-4`}>
                    <div className="text-xs font-semibold opacity-70 mb-1">{card.label}</div>
                    <div className="text-xl font-black mb-2">{card.value}</div>
                    <div className="h-1.5 bg-black/10 rounded-full">
                      <div className={`h-full ${card.bar} rounded-full`} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Attendance row */}
              <div className="px-5 pb-5">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="text-xs font-bold text-slate-500 mb-3">RECENT ATTENDANCE — SS1A</div>
                  {[
                    { name: "Amara Johnson", status: "Present", dot: "bg-emerald-400" },
                    { name: "David Okafor", status: "Absent", dot: "bg-red-400" },
                    { name: "Faith Adeyemi", status: "Present", dot: "bg-emerald-400" },
                  ].map((row) => (
                    <div key={row.name} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${row.dot}`} />
                        <span className="text-sm font-medium text-slate-700">{row.name}</span>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${row.status === "Present" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                        {row.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────

interface FeatureCard {
  icon: LucideIcon;
  title: string;
  desc: string;
  accent: string;
  iconBg: string;
}

const features: FeatureCard[] = [
  {
    icon: UserCheck,
    title: "Attendance Tracking",
    desc: "Mark attendance per class in seconds. Generate daily, weekly, and monthly reports. Parents get automatic SMS/WhatsApp alerts when a child is absent.",
    accent: "border-t-emerald-500",
    iconBg: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: CreditCard,
    title: "Fee Management",
    desc: "Create flexible fee structures, record payments, and identify defaulters instantly. Accept online payments and issue digital receipts automatically.",
    accent: "border-t-blue-500",
    iconBg: "bg-blue-100 text-blue-600",
  },
  {
    icon: BookOpen,
    title: "Result Management",
    desc: "Teachers enter test and exam scores; the system computes final grades, class rankings, and generates printable report cards — zero manual calculation.",
    accent: "border-t-violet-500",
    iconBg: "bg-violet-100 text-violet-600",
  },
  {
    icon: Bell,
    title: "Parent Notifications",
    desc: "Keep parents informed with instant SMS and WhatsApp notifications for attendance, fees due, results published, and school announcements.",
    accent: "border-t-orange-500",
    iconBg: "bg-orange-100 text-orange-600",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    desc: "Understand your school at a glance. Track attendance trends, fee collection rates, and academic performance with beautiful, real-time charts.",
    accent: "border-t-pink-500",
    iconBg: "bg-pink-100 text-pink-600",
  },
  {
    icon: Megaphone,
    title: "Announcement System",
    desc: "Send targeted announcements to teachers, students, or parents. Schedule broadcasts, pin important messages, and manage all communications centrally.",
    accent: "border-t-teal-500",
    iconBg: "bg-teal-100 text-teal-600",
  },
];

function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <Section className="text-center mb-16">
          <Badge icon={Sparkles} text="Everything Your School Needs" />
          <motion.h2 variants={fadeUp} custom={1} className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Six Powerful Modules,{" "}
            <span className="text-emerald-600">One Platform</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-lg text-slate-500 max-w-2xl mx-auto">
            Every feature is purpose-built for African schools — affordable,
            reliable, and working even on slow internet connections.
          </motion.p>
        </Section>

        <Section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -5, boxShadow: "0 24px 48px -12px rgba(0,0,0,0.1)" }}
              className={`bg-white border border-slate-200 border-t-4 ${f.accent} rounded-2xl p-7 transition-shadow cursor-default`}
            >
              <div className={`w-12 h-12 ${f.iconBg} rounded-xl flex items-center justify-center mb-5`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </Section>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────

const steps = [
  {
    num: "01",
    title: "Register Your School",
    desc: "Sign up in under 5 minutes. Verify your email, get approved, and your school dashboard is live. No IT team needed.",
    icon: School,
    color: "bg-emerald-500",
  },
  {
    num: "02",
    title: "Add Teachers & Students",
    desc: "Bulk-import students via CSV or add them one by one. Assign teachers to classes and subjects. Set up your fee structures.",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    num: "03",
    title: "Track Daily Operations",
    desc: "Teachers mark attendance on any device. Parents receive instant alerts. Fees are tracked automatically. Everything syncs in real time.",
    icon: TrendingUp,
    color: "bg-violet-500",
  },
  {
    num: "04",
    title: "Generate Reports & Results",
    desc: "At term end, generate complete report cards, fee summaries, and attendance reports. Export to PDF or Excel in one click.",
    icon: BarChart3,
    color: "bg-orange-500",
  },
];

function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <Section className="text-center mb-16">
          <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-full text-sm font-semibold mb-6">
            <TrendingUp className="w-3.5 h-3.5" />
            Up & Running in Minutes
          </motion.div>
          <motion.h2 variants={fadeUp} custom={1} className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            How EduFlow Works
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-lg text-slate-400 max-w-2xl mx-auto">
            Four simple steps to transform how your school operates — no technical expertise required.
          </motion.p>
        </Section>

        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="relative bg-slate-900 border border-slate-800 rounded-2xl p-7"
            >
              <div className="text-5xl font-black text-slate-800 mb-4">{s.num}</div>
              <div className={`w-11 h-11 ${s.color} rounded-xl flex items-center justify-center mb-5 shadow-lg`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

const testimonials = [
  {
    quote: "EduFlow cut our fee collection time by 70%. Parents can now pay online and we get instant confirmation. It's been a game changer for our bursar's office.",
    name: "Mrs. Chidinma Okonkwo",
    role: "Principal",
    school: "Sunrise International School, Lagos",
    rating: 5,
    avatar: "CO",
    avatarColor: "bg-emerald-500",
  },
  {
    quote: "Marking attendance used to take 20 minutes per class. Now it takes 2 minutes and parents get notified automatically. My teachers love it.",
    name: "Mr. Ibrahim Musa",
    role: "School Administrator",
    school: "Al-Noor Academy, Abuja",
    rating: 5,
    avatar: "IM",
    avatarColor: "bg-blue-500",
  },
  {
    quote: "The result management module is brilliant. No more manual calculations or spreadsheet errors. Report cards are generated with one click at end of term.",
    name: "Dr. Adaobi Nwosu",
    role: "Head Teacher",
    school: "Greenfield College, Enugu",
    rating: 5,
    avatar: "AN",
    avatarColor: "bg-violet-500",
  },
];

function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <Section className="text-center mb-16">
          <Badge icon={Star} text="School Reviews" />
          <motion.h2 variants={fadeUp} custom={1} className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Schools That Trust EduFlow
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-lg text-slate-500 max-w-2xl mx-auto">
            Hear directly from the administrators, teachers, and principals who run their schools on EduFlow every day.
          </motion.p>
        </Section>

        <Section className="grid md:grid-cols-3 gap-7">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -4 }}
              className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm"
            >
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 ${t.avatarColor} rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                  <div className="text-xs text-emerald-600 font-semibold mt-0.5">{t.school}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </Section>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  tagline: string;
  items: string[];
  popular: boolean;
  cta: string;
  ctaHref: string;
}

const plans: PricingPlan[] = [
  {
    name: "Basic",
    price: "Free",
    period: "14-day trial",
    tagline: "Perfect for small schools getting started",
    items: [
      "Up to 200 students",
      "Attendance tracking",
      "Student management",
      "Basic reports (PDF)",
      "1 admin account",
      "Email support",
    ],
    popular: false,
    cta: "Start Free Trial",
    ctaHref: "/register",
  },
  {
    name: "Premium",
    price: "₦25,000",
    period: "per term",
    tagline: "Everything growing schools need",
    items: [
      "Unlimited students",
      "SMS & WhatsApp notifications",
      "Online fee payments",
      "Advanced analytics & charts",
      "Result generator & report cards",
      "Announcement system",
      "Multi-teacher access",
      "Priority support",
      "Data export (PDF + Excel)",
    ],
    popular: true,
    cta: "Get Premium",
    ctaHref: "/register?plan=premium",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    tagline: "For school networks & large institutions",
    items: [
      "Everything in Premium",
      "Multi-branch management",
      "Dedicated account manager",
      "Custom integrations & API",
      "White-label option",
      "SLA & uptime guarantee",
      "Custom training sessions",
    ],
    popular: false,
    cta: "Contact Sales",
    ctaHref: "/contact",
  },
];

function Pricing() {
  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <Section className="text-center mb-16">
          <Badge icon={Shield} text="Transparent Pricing" />
          <motion.h2 variants={fadeUp} custom={1} className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Simple Plans,{" "}
            <span className="text-emerald-600">No Hidden Fees</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-lg text-slate-500 max-w-2xl mx-auto">
            Start free and scale as your school grows. All plans include a 14-day full-access trial.
          </motion.p>
        </Section>

        <Section className="grid md:grid-cols-3 gap-7 max-w-6xl mx-auto">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -5 }}
              className={`relative rounded-2xl p-8 transition-all ${
                p.popular
                  ? "bg-gradient-to-b from-emerald-600 to-teal-700 text-white shadow-2xl shadow-emerald-200"
                  : "bg-white border border-slate-200 hover:shadow-xl"
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-amber-400 text-slate-900 text-xs font-black rounded-full shadow-md uppercase tracking-wide">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-7">
                <h3 className={`text-lg font-black mb-1 ${p.popular ? "text-white" : "text-slate-900"}`}>
                  {p.name}
                </h3>
                <p className={`text-xs mb-5 ${p.popular ? "text-emerald-100" : "text-slate-500"}`}>
                  {p.tagline}
                </p>
                <div className="flex items-end gap-1 mb-1">
                  <span className={`text-4xl font-black ${p.popular ? "text-white" : "text-slate-900"}`}>
                    {p.price}
                  </span>
                </div>
                <div className={`text-sm ${p.popular ? "text-emerald-100" : "text-slate-400"}`}>
                  {p.period}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {p.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <Check
                      className={`w-4 h-4 flex-shrink-0 mt-0.5 ${p.popular ? "text-emerald-200" : "text-emerald-500"}`}
                    />
                    <span className={p.popular ? "text-white/90" : "text-slate-600"}>{item}</span>
                  </li>
                ))}
              </ul>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={p.ctaHref}
                  className={`block w-full py-3 px-4 font-bold rounded-xl text-center text-sm transition-colors ${
                    p.popular
                      ? "bg-white hover:bg-slate-50 text-emerald-700"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-100"
                  }`}
                >
                  {p.cta}
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </Section>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const faqs = [
  {
    q: "How does the 14-day free trial work?",
    a: "You get full access to all Premium features for 14 days — no credit card required. After the trial, choose a plan that fits your school or stay on the free Basic tier.",
  },
  {
    q: "Can multiple teachers use EduFlow at the same time?",
    a: "Yes! Premium and Enterprise plans support unlimited teacher accounts. Each teacher only sees their assigned classes and subjects, ensuring data privacy.",
  },
  {
    q: "Is my school's data secure?",
    a: "Absolutely. All data is encrypted in transit and at rest. We run daily backups, and your data is stored on secure cloud servers. We never share your data with third parties.",
  },
  {
    q: "Can parents track their child's attendance and fees?",
    a: "Yes. Each parent has a dedicated portal where they can see their child's attendance history, outstanding fees, results, and school announcements — all in real time.",
  },
  {
    q: "Does EduFlow work on mobile phones?",
    a: "EduFlow is fully responsive and works on any device — phones, tablets, or computers. Teachers can mark attendance right from their smartphones without any app download.",
  },
  {
    q: "Can I import existing student data?",
    a: "Yes. You can bulk-import students and teachers using a CSV template we provide. Most schools are fully set up within one day.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <Section className="text-center mb-14">
          <Badge icon={Shield} text="Common Questions" />
          <motion.h2 variants={fadeUp} custom={1} className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Frequently Asked Questions
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-lg text-slate-500">
            Everything you need to know before getting started.
          </motion.p>
        </Section>

        <Section className="space-y-3">
          {faqs.map((f, i) => (
            <motion.div
              key={f.q}
              variants={fadeUp}
              custom={i}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between text-left px-6 py-5 gap-4"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <h3 className="font-bold text-slate-900 text-sm">{f.q}</h3>
                <motion.div
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.22 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    key="body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-slate-500 text-sm leading-relaxed">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </Section>
      </div>
    </section>
  );
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────

function CTA() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.h2
          variants={fadeUp} custom={0} initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-5"
        >
          Your School Deserves Better Tools.
          <br />
          <span className="text-emerald-200">Start Today — It&apos;s Free.</span>
        </motion.h2>

        <motion.p
          variants={fadeUp} custom={1} initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-emerald-100 text-lg mb-10 max-w-xl mx-auto leading-relaxed"
        >
          Join 500+ schools already saving time, reducing errors, and keeping parents happy with EduFlow.
          14-day full-access trial. No credit card. Cancel anytime.
        </motion.p>

        <motion.div
          variants={fadeUp} custom={2} initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-emerald-700 font-black rounded-xl shadow-2xl transition-colors text-base"
            >
              Register Your School Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white/40 hover:border-white/80 text-white font-bold rounded-xl transition-all text-base"
            >
              Already have an account? Login
            </Link>
          </motion.div>
        </motion.div>

        <motion.p
          variants={fadeUp} custom={3} initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-emerald-200/70 text-xs mt-8"
        >
          No credit card · No lock-in contract · 24/7 support
        </motion.p>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "Data Processing", href: "#" },
    ],
  },
] as const;

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
] as const;

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <School className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-xl text-white tracking-tight">
                Edu<span className="text-emerald-400">Flow</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed mb-6 max-w-xs">
              The all-in-one school management platform built for African schools. Manage attendance, fees, results, and parents — all in one place.
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>support@eduflow.app</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>+234 800 000 0000</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Lagos, Nigeria</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h3 className="font-bold text-white text-sm mb-4">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm text-slate-500 hover:text-white transition-colors">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} EduFlow. All rights reserved. Built with ❤️ for African schools.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                whileHover={{ scale: 1.2 }}
                aria-label={label}
                className="text-slate-600 hover:text-white transition-colors"
              >
                <Icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}