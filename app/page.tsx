import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Property Management App</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
          A comprehensive solution for property managers, owners, and renters to manage properties, track events, and
          communicate effectively.
        </p>

        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link href="/calendar">View Calendar</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/issues">Report an Issue</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Event Calendar</CardTitle>
            <CardDescription>Track all building and unit events in one place</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              View and manage events for your units and buildings. See maintenance schedules, rent due dates, and
              community meetings all in one calendar view.
            </p>
            <Button className="mt-4" variant="outline" asChild>
              <Link href="/calendar">Open Calendar</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Event Comments</CardTitle>
            <CardDescription>Communicate about events with property managers and other residents</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Leave comments on building-wide events or events specific to your unit. Ask questions, provide feedback,
              and stay informed about important updates.
            </p>
            <Button className="mt-4" variant="outline" asChild>
              <Link href="/events">View Events</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance Issues</CardTitle>
            <CardDescription>Report and track maintenance issues in your unit or building</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Easily report maintenance issues, track their status, and communicate with property management about
              repairs and resolutions.
            </p>
            <Button className="mt-4" variant="outline" asChild>
              <Link href="/issues">Report an Issue</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
