import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduFlow – School Attendance, Fees & Results Management Platform",
  description:
    "EduFlow is the all-in-one school management platform trusted by 500+ schools. Manage attendance, fees, results, parent communication, and analytics — all in one place.",
  keywords: [
    "school management system",
    "attendance tracking",
    "fee management",
    "result management",
    "parent portal",
    "school software",
    "student management",
    "school analytics",
    "EduFlow",
  ],
  authors: [{ name: "EduFlow" }],
  metadataBase: new URL("https://eduflow.app"),
  openGraph: {
    title: "EduFlow – School Attendance, Fees & Results Management Platform",
    description:
      "Manage your school's attendance, fees, results, and parent communication in one powerful platform. Start free today.",
    type: "website",
    url: "https://eduflow.app",
    siteName: "EduFlow",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduFlow – Modern School Management Platform",
    description:
      "Attendance, fees, results, and parent communication — all in one platform.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-white text-slate-900">{children}</body>
    </html>
  );
}