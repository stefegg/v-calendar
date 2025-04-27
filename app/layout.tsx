import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Lato } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

const lato = Lato({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
})

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
      <body className={lato.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-40 w-full border-b backdrop-blur-lg transition-all bg-primary/75 dark:bg-background/75 text-white dark:text-foreground">
              <div className="container mx-auto flex h-14 items-center justify-between px-4">
                <Link href="/" className="font-bold text-xl text-white dark:text-foreground">
                  Property Manager
                </Link>
                <div className="flex items-center gap-4">
                  <Link
                    href="/dashboard"
                    className="text-white hover:text-white/90 dark:text-foreground dark:hover:text-foreground/90"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/calendar"
                    className="text-white hover:text-white/90 dark:text-foreground dark:hover:text-foreground/90"
                  >
                    Calendar
                  </Link>
                  <Link
                    href="/events"
                    className="text-white hover:text-white/90 dark:text-foreground dark:hover:text-foreground/90"
                  >
                    Events
                  </Link>
                  <Link
                    href="/issues"
                    className="text-white hover:text-white/90 dark:text-foreground dark:hover:text-foreground/90"
                  >
                    Issues
                  </Link>
                  <ThemeToggle />
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t px-4 py-3 text-center text-sm text-muted-foreground bg-primary/20 dark:bg-transparent border-primary/20 dark:border-border">
              © {new Date().getFullYear()} Property Management App
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
