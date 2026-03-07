import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduFlow – Modern School Management System",
  description:
    "Streamline fee collection, track attendance, and manage your entire school operations with EduFlow. Trusted by 500+ schools worldwide.",
  keywords: [
    "school management",
    "fee management",
    "attendance tracking",
    "school software",
    "EduFlow",
  ],
  authors: [{ name: "EduFlow" }],
  openGraph: {
    title: "EduFlow – Modern School Management System",
    description:
      "Streamline fee collection, track attendance, and manage your entire school operations with EduFlow.",
    type: "website",
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