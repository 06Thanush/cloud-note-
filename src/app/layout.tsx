import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import FirebaseConfigNotice from "@/components/FirebaseConfigNotice";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CloudNotes — Real-Time Cloud Note-Taking App",
  description:
    "Securely create, edit, organize, search, and share your notes with real-time cloud synchronization.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#fcfbfe] dark:bg-[#0f0d15] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
        <AuthProvider>
          <FirebaseConfigNotice />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
