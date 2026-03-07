"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence, Variants } from "framer-motion";
import {
  CreditCard,
  UserCheck,
  Users,
  BarChart3,
  Bell,
  ShieldCheck,
  ArrowRight,
  PlayCircle,
  Sparkles,
  Zap,
  Heart,
  Check,
  Star,
  Tag,
  HelpCircle,
  ChevronDown,
  Menu,
  X,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  Calendar,
  type LucideIcon,
} from "lucide-react";

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface Feature {
  icon: LucideIcon;
  color: string;
  title: string;
  desc: string;
}

interface Plan {
  name: string;
  desc: string;
  price: string;
  sub: string;
  popular: boolean;
  items: string[];
  cta: string;
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatar: string;
}

interface Benefit {
  title: string;
  desc: string;
}

interface Faq {
  q: string;
  a: string;
}

// ─── Animated Section Wrapper ─────────────────────────────────────────────────

function AnimatedSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const links = ["Features", "Pricing", "Testimonials", "FAQ"] as const;

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-violet-200">
              E
            </div>
            <span className="font-bold text-2xl text-slate-900 tracking-tight">
              EduFlow
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors text-sm"
              >
                {l}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="#"
              className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors"
            >
              Sign In
            </a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg shadow-md shadow-violet-200 transition-colors text-sm"
            >
              Start Free Trial
            </motion.a>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-slate-200 shadow-xl px-6 py-6 flex flex-col gap-5"
          >
            {links.map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                onClick={() => setMobileOpen(false)}
                className="text-slate-700 font-medium text-lg"
              >
                {l}
              </a>
            ))}
            <a href="#" className="text-slate-600 font-medium">
              Sign In
            </a>
            <a
              href="#"
              className="px-5 py-3 bg-violet-600 text-white font-semibold rounded-lg text-center"
            >
              Start Free Trial
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

const heroStats = [
  { value: "500+", label: "Active Schools" },
  { value: "50K+", label: "Students Managed" },
  { value: "99.9%", label: "Uptime" },
] as const;

function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-violet-50 via-white to-indigo-50 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div>
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Trusted by 500+ Schools Worldwide
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="visible"
            className="text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight"
          >
            Modern School Management Made{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">
              Simple
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate="visible"
            className="text-xl text-slate-600 mb-8 leading-relaxed"
          >
            Streamline fee collection, track attendance, and manage your entire
            school operations with our all-in-one SaaS platform. Save time,
            reduce errors, and improve parent satisfaction.
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={3}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-4 mb-12"
          >
            <motion.a
              href="#"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-lg shadow-lg shadow-violet-200 transition-colors"
            >
              Start Free 14-Day Trial
              <ArrowRight className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-lg transition-all"
            >
              <PlayCircle className="w-5 h-5" />
              Watch Demo
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-3 gap-6"
          >
            {heroStats.map((s, i) => (
              <motion.div key={s.label} variants={fadeUp} custom={i + 4}>
                <div className="text-3xl font-extrabold text-slate-900 mb-1">
                  {s.value}
                </div>
                <div className="text-sm text-slate-600">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, x: 60, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          }}
          className="relative"
        >
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-violet-200 rounded-full blur-3xl opacity-40 pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-40 pointer-events-none" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            alt="School Management Dashboard"
            className="relative rounded-2xl shadow-2xl w-full h-auto"
          />
        </motion.div>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────

const features: Feature[] = [
  {
    icon: CreditCard,
    color: "violet",
    title: "Automated Fee Management",
    desc: "Collect fees online, send automated reminders, generate invoices, and track payments in real-time with zero manual effort.",
  },
  {
    icon: UserCheck,
    color: "indigo",
    title: "Digital Attendance Tracking",
    desc: "Mark attendance digitally, generate reports instantly, and notify parents via SMS or WhatsApp automatically.",
  },
  {
    icon: Users,
    color: "pink",
    title: "Student & Teacher Management",
    desc: "Manage student records, teacher profiles, class assignments, and academic performance all in one place.",
  },
  {
    icon: BarChart3,
    color: "emerald",
    title: "Advanced Analytics & Reports",
    desc: "Get actionable insights with detailed reports on fees, attendance, performance, and school operations.",
  },
  {
    icon: Bell,
    color: "orange",
    title: "Parent Communication",
    desc: "Send announcements, notifications, and updates to parents via SMS, WhatsApp, or email instantly.",
  },
  {
    icon: ShieldCheck,
    color: "blue",
    title: "Role-Based Access Control",
    desc: "Secure access with role-based permissions for admins, teachers, and parents with complete data privacy.",
  },
];

const colorMap: Record<string, string> = {
  violet: "bg-violet-100 text-violet-600",
  indigo: "bg-indigo-100 text-indigo-600",
  pink: "bg-pink-100 text-pink-600",
  emerald: "bg-emerald-100 text-emerald-600",
  orange: "bg-orange-100 text-orange-600",
  blue: "bg-blue-100 text-blue-600",
};

function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <motion.div
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-medium mb-4"
          >
            <Zap className="w-4 h-4" />
            Powerful Features
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight"
          >
            Everything You Need to Run Your School
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-xl text-slate-600 max-w-3xl mx-auto"
          >
            From fee management to attendance tracking, we&apos;ve got all the
            tools you need in one comprehensive platform.
          </motion.p>
        </AnimatedSection>

        <AnimatedSection className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              custom={i}
              whileHover={{
                y: -6,
                boxShadow: "0 20px 40px -12px rgba(0,0,0,0.12)",
              }}
              className="bg-white border border-slate-200 rounded-2xl p-8 transition-shadow cursor-default"
            >
              <div
                className={`w-14 h-14 ${colorMap[f.color]} rounded-xl flex items-center justify-center mb-6`}
              >
                <f.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {f.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Benefits ─────────────────────────────────────────────────────────────────

const benefits: Benefit[] = [
  {
    title: "Save 20+ Hours Per Week",
    desc: "Automate repetitive tasks and focus on what matters - educating students.",
  },
  {
    title: "Reduce Fee Collection Time by 80%",
    desc: "Online payments and automated reminders ensure faster fee collection.",
  },
  {
    title: "Improve Parent Satisfaction",
    desc: "Real-time updates and transparent communication keep parents happy and informed.",
  },
  {
    title: "Zero Technical Knowledge Required",
    desc: "Intuitive interface that anyone can use - no training needed.",
  },
];

function Benefits() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div
        ref={ref}
        className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center"
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            alt="School Benefits"
            className="rounded-2xl shadow-2xl w-full h-auto"
          />
        </motion.div>

        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-medium mb-4"
          >
            <Heart className="w-4 h-4" />
            Why Schools Love Us
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight"
          >
            Built for Modern Schools, Loved by Everyone
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-lg text-slate-600 mb-10"
          >
            EduFlow is designed to make school management effortless for
            administrators, teachers, and parents alike.
          </motion.p>

          <div className="space-y-7">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                variants={fadeUp}
                custom={i + 3}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    {b.title}
                  </h3>
                  <p className="text-slate-600">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

const testimonials: Testimonial[] = [
  {
    quote:
      "EduFlow transformed our school operations. Fee collection is now seamless, and parents love the real-time updates. Highly recommended!",
    name: "Sarah Johnson",
    role: "Principal, Springfield High",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    quote:
      "As a teacher, marking attendance is now so easy. The automated parent notifications save me hours every week. Game changer!",
    name: "Michael Chen",
    role: "Teacher, Riverside Academy",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    quote:
      "I can track my child's attendance and pay fees online. The transparency and convenience are amazing. Thank you EduFlow!",
    name: "Emily Rodriguez",
    role: "Parent",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

function Testimonials() {
  return (
    <section
      id="testimonials"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <motion.div
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-medium mb-4"
          >
            <Star className="w-4 h-4" />
            Testimonials
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight"
          >
            Loved by Schools Worldwide
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-xl text-slate-600 max-w-3xl mx-auto"
          >
            See what school administrators, teachers, and parents are saying
            about EduFlow.
          </motion.p>
        </AnimatedSection>

        <AnimatedSection className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -4 }}
              className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className="w-5 h-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-slate-900">{t.name}</div>
                  <div className="text-sm text-slate-500">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

const plans: Plan[] = [
  {
    name: "Starter",
    desc: "Perfect for small schools",
    price: "$49",
    sub: "Up to 100 students",
    popular: false,
    items: [
      "Fee Management",
      "Attendance Tracking",
      "Basic Reports",
      "Email Support",
    ],
    cta: "Start Free Trial",
  },
  {
    name: "Professional",
    desc: "For growing schools",
    price: "$99",
    sub: "Up to 500 students",
    popular: true,
    items: [
      "Everything in Starter",
      "Advanced Analytics",
      "SMS Notifications",
      "Priority Support",
      "Custom Reports",
    ],
    cta: "Start Free Trial",
  },
  {
    name: "Enterprise",
    desc: "For large institutions",
    price: "$249",
    sub: "Unlimited students",
    popular: false,
    items: [
      "Everything in Professional",
      "Multi-Branch Support",
      "WhatsApp Integration",
      "Dedicated Account Manager",
      "Custom Integrations",
    ],
    cta: "Contact Sales",
  },
];

function Pricing() {
  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <motion.div
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-medium mb-4"
          >
            <Tag className="w-4 h-4" />
            Simple Pricing
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight"
          >
            Choose the Perfect Plan for Your School
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-xl text-slate-600 max-w-3xl mx-auto"
          >
            No hidden fees. No surprises. Cancel anytime.
          </motion.p>
        </AnimatedSection>

        <AnimatedSection className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -6 }}
              className={`relative rounded-2xl p-8 transition-shadow ${
                p.popular
                  ? "bg-violet-600 border-2 border-violet-600 shadow-2xl shadow-violet-200"
                  : "bg-white border border-slate-200 hover:shadow-xl"
              }`}
            >
              {p.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-yellow-400 text-slate-900 text-sm font-bold rounded-full shadow-md">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3
                  className={`text-2xl font-bold mb-2 ${p.popular ? "text-white" : "text-slate-900"}`}
                >
                  {p.name}
                </h3>
                <p
                  className={`mb-6 text-sm ${p.popular ? "text-violet-100" : "text-slate-500"}`}
                >
                  {p.desc}
                </p>
                <div className="mb-1">
                  <span
                    className={`text-5xl font-extrabold ${p.popular ? "text-white" : "text-slate-900"}`}
                  >
                    {p.price}
                  </span>
                  <span
                    className={
                      p.popular ? "text-violet-100" : "text-slate-500"
                    }
                  >
                    /month
                  </span>
                </div>
                <p
                  className={`text-sm ${p.popular ? "text-violet-200" : "text-slate-400"}`}
                >
                  {p.sub}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {p.items.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <Check
                      className={`w-5 h-5 flex-shrink-0 ${p.popular ? "text-white" : "text-emerald-500"}`}
                    />
                    <span
                      className={p.popular ? "text-white" : "text-slate-600"}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-4 font-semibold rounded-lg transition-colors ${
                  p.popular
                    ? "bg-white hover:bg-slate-50 text-violet-600"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                }`}
              >
                {p.cta}
              </motion.button>
            </motion.div>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const faqs: Faq[] = [
  {
    q: "How does the free trial work?",
    a: "You get full access to all features for 14 days. No credit card required. Cancel anytime during the trial period with no charges.",
  },
  {
    q: "Can I change plans later?",
    a: "Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. We use enterprise-grade encryption, regular backups, and comply with GDPR and local data privacy regulations to keep your school's data safe.",
  },
  {
    q: "Do you offer training?",
    a: "Yes! All plans include onboarding support. Professional and Enterprise plans include live training sessions and dedicated onboarding.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards, bank transfers, and popular digital payment methods. Contact us for custom invoicing on Enterprise plans.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <motion.div
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-medium mb-4"
          >
            <HelpCircle className="w-4 h-4" />
            FAQ
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-xl text-slate-600"
          >
            Everything you need to know about EduFlow
          </motion.p>
        </AnimatedSection>

        <AnimatedSection className="space-y-3">
          {faqs.map((f, i) => (
            <motion.div
              key={f.q}
              variants={fadeUp}
              custom={i}
              className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between text-left px-6 py-5 gap-4"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <h3 className="font-semibold text-lg text-slate-900">{f.q}</h3>
                <motion.div
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-slate-500" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.22, 1, 0.36, 1] as [
                        number,
                        number,
                        number,
                        number,
                      ],
                    }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-slate-600 leading-relaxed">
                      {f.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function CTA() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-violet-600 to-indigo-600"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight"
        >
          Ready to Transform Your School?
        </motion.h2>
        <motion.p
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-xl text-violet-100 mb-10 leading-relaxed"
        >
          Join 500+ schools already using EduFlow to streamline operations and
          improve efficiency.
        </motion.p>

        <motion.div
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.a
            href="#"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-violet-600 font-semibold rounded-lg shadow-xl transition-colors"
          >
            Start Free 14-Day Trial
            <ArrowRight className="w-5 h-5" />
          </motion.a>
          <motion.a
            href="#"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white hover:bg-white/10 text-white font-semibold rounded-lg transition-all"
          >
            <Calendar className="w-5 h-5" />
            Schedule a Demo
          </motion.a>
        </motion.div>

        <motion.p
          variants={fadeUp}
          custom={3}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-violet-100 text-sm mt-6"
        >
          No credit card required · Cancel anytime · 24/7 support
        </motion.p>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

const footerCols = [
  {
    title: "Product",
    links: ["Features", "Pricing", "Security", "Integrations"],
  },
  { title: "Company", links: ["About Us", "Blog", "Careers", "Contact"] },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"],
  },
] as const;

const socialIcons: LucideIcon[] = [Twitter, Facebook, Linkedin, Instagram];

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                E
              </div>
              <span className="font-bold text-2xl text-white">EduFlow</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Modern school management made simple. Trusted by 500+ schools
              worldwide.
            </p>
          </div>

          {footerCols.map((col) => (
            <div key={col.title}>
              <h3 className="font-semibold text-white mb-4">{col.title}</h3>
              <ul className="space-y-3 text-sm">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            &copy; 2024 EduFlow. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {socialIcons.map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.2 }}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label={`Social link ${i + 1}`}
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EduFlowPage() {
  return (
    <main className="min-h-screen font-sans antialiased">
      <Navbar />
      <Hero />
      <Features />
      <Benefits />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}