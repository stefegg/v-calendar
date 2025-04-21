import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Property Management App",
  description: "A property management application for renters and property owners",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen flex flex-col">
            <header className="border-b px-4 py-3 flex items-center justify-between">
              <Link href="/" className="font-bold text-xl">
                Property Manager
              </Link>
              <div className="flex items-center gap-4">
                <Link href="/calendar" className="hover:underline">
                  Calendar
                </Link>
                <Link href="/events" className="hover:underline">
                  Events
                </Link>
                <ThemeToggle />
              </div>
            </header>
            <main className="flex-1 p-4">{children}</main>
            <footer className="border-t px-4 py-3 text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} Property Management App
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
