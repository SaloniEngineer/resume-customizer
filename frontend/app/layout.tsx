import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "TailorCraft — AI Resume Customizer | ATS-Optimized",
  description:
    "Tailor your resume to match any Job Description using LLMs. Boost your ATS score, preserve 100% of your real experience, and download as PDF, DOCX, or TXT.",
  keywords: ["resume customizer", "ATS resume", "job description match", "career", "LLM resume builder"],
  authors: [{ name: "TailorCraft Engineering Team" }],
  openGraph: {
    title: "TailorCraft — AI Resume Customizer",
    description: "Align your resume to any job description with zero hallucination.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans transition-colors duration-150">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
