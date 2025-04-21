import CalendarView from "@/components/calendar-view"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Property Management Calendar",
  description: "View and manage property-related events",
}

export default function CalendarPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Property Calendar</h1>
      <CalendarView />
    </div>
  )
}
