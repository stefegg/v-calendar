import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="relative">
      {/* Hero section with background image */}
      <div className="relative w-full h-screen overflow-hidden">
        <Image
          src="/images/treestreet.jpg"
          alt="Beautiful residential properties with trees and landscaping"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" /> {/* Darkening overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center max-w-full drop-shadow-md">
            Property Management Simplified
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl text-center drop-shadow">
            A comprehensive solution for property managers, owners, and renters to manage properties, track events, and
            communicate effectively.
          </p>

          <div className="flex gap-4 pb-8">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-black dark:text-white dark:hover:bg-white/20 hover:bg-black/20 hover:text-white shadow-md"
            >
              <Link href="/calendar">View Calendar</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-black dark:text-white dark:hover:bg-white/20 hover:bg-black/20 hover:text-white shadow-md"
            >
              <Link href="/issues">Report an Issue</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="dark:border-white">
              <CardHeader>
                <CardTitle>Event Calendar</CardTitle>
                <CardDescription>Track all building and unit events in one place</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  View and manage events for your units and buildings. See maintenance schedules, rent due dates, and
                  community meetings all in one calendar view.
                </p>
                <Button className="mt-4 dark:border-white" variant="outline" asChild>
                  <Link href="/calendar">Open Calendar</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="dark:border-white">
              <CardHeader>
                <CardTitle>Dashboard</CardTitle>
                <CardDescription>Access your personalized property management dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  View your upcoming events, track maintenance issues, and get a quick overview of your property status
                  all in one convenient dashboard.
                </p>
                <Button className="mt-4 dark:border-white" variant="outline" asChild>
                  <Link href="/dashboard">Open Dashboard</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="dark:border-white">
              <CardHeader>
                <CardTitle>Maintenance Issues</CardTitle>
                <CardDescription>Report and track maintenance issues in your unit or building</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Easily report maintenance issues, track their status, and communicate with property management about
                  repairs and resolutions.
                </p>
                <Button className="mt-4 dark:border-white" variant="outline" asChild>
                  <Link href="/issues">Report an Issue</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
