"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { Event } from "@/types/event"

// Simple function to format date as YYYY-MM-DD
function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

// Format time from 24-hour format to 12-hour format
function formatTime(time: string): string {
  if (!time) return ""

  const [hours, minutes] = time.split(":")
  const hour = Number.parseInt(hours, 10)
  const ampm = hour >= 12 ? "PM" : "AM"
  const formattedHour = hour % 12 || 12

  return `${formattedHour}:${minutes} ${ampm}`
}

export default function CalendarView() {
  const [date, setDate] = useState<Date>(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch events from the API when the date changes
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Get the year and month for the API request
        const year = date.getFullYear()
        const month = date.getMonth() + 1

        // Format month as MM
        const formattedMonth = String(month).padStart(2, "0")

        // Build the API URL with query parameters
        const url = `/api/events?year=${year}`

        const response = await fetch(url)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error("API error response:", errorData)
          throw new Error(`API returned status: ${response.status}`)
        }

        const data = await response.json()
        setEvents(data)
      } catch (err) {
        console.error("Failed to fetch events:", err)
        setError("Failed to load events. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [date])

  const handlePreviousMonth = () => {
    const newDate = new Date(date)
    newDate.setMonth(newDate.getMonth() - 1)
    setDate(newDate)
  }

  const handleNextMonth = () => {
    const newDate = new Date(date)
    newDate.setMonth(newDate.getMonth() + 1)
    setDate(newDate)
  }

  // Get events for a specific day using simple string comparison
  const getEventsForDay = (day: Date) => {
    if (!day || !(day instanceof Date) || isNaN(day.getTime())) {
      return []
    }

    const dateString = formatDateToYYYYMMDD(day)

    return events
      .filter((event) => {
        // Simple string comparison of dates (YYYY-MM-DD)
        const eventDateParts = event.date.split("T")[0] // Handle both YYYY-MM-DD and ISO formats
        return eventDateParts === dateString
      })
      .slice(0, 3) // Show max 3 events per day as per spec
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-center justify-center pb-2">
        <div className="flex items-center justify-center w-full max-w-md space-x-4">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="font-medium text-2xl px-8 text-center min-w-[200px]">
            {date.toLocaleDateString("en-US", { year: "numeric", month: "long" })}
          </div>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Custom calendar implementation for better control over sizing and events */}
        <div className="grid grid-cols-7 gap-1 text-center font-medium mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {generateCalendarDays(date).map((day, index) => {
            const isCurrentMonth = day.getMonth() === date.getMonth()
            const dayEvents = isCurrentMonth ? getEventsForDay(day) : []

            return (
              <div
                key={index}
                className={cn(
                  "min-h-[120px] border rounded-md p-2",
                  isCurrentMonth ? "bg-card" : "bg-muted/30 text-muted-foreground",
                  isLoading && "opacity-70",
                )}
              >
                <div className="font-medium text-right mb-1">{day.getDate()}</div>
                <div className="space-y-1">
                  {!isLoading && dayEvents.map((event) => <EventStripe key={event.id} event={event} />)}
                  {isLoading && isCurrentMonth && <div className="h-6 bg-muted rounded animate-pulse"></div>}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-[#FF6B6B]"></div>
            <span className="text-sm">Unit Events</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-[#4ECDC4]"></div>
            <span className="text-sm">Building Events</span>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/events">View All Events</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

// Helper function to generate all days for the current month view
function generateCalendarDays(date: Date): Date[] {
  const year = date.getFullYear()
  const month = date.getMonth()

  // First day of the month
  const firstDay = new Date(year, month, 1)
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0)

  // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = firstDay.getDay()

  // Calculate days from previous month to show
  const daysFromPrevMonth = firstDayOfWeek

  // Calculate total days needed (previous month days + current month days + next month days to fill grid)
  const totalDays = 42 // 6 rows of 7 days

  const days: Date[] = []

  // Add days from previous month
  for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
    const day = new Date(year, month, -i)
    days.push(day)
  }

  // Add days from current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const day = new Date(year, month, i)
    days.push(day)
  }

  // Add days from next month to fill the grid
  const remainingDays = totalDays - days.length
  for (let i = 1; i <= remainingDays; i++) {
    const day = new Date(year, month + 1, i)
    days.push(day)
  }

  return days
}

// Component for individual event stripes
function EventStripe({ event }: { event: Event }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className="text-sm px-2 py-1 rounded truncate cursor-pointer font-medium"
          style={{ backgroundColor: event.color, color: "#fff" }}
        >
          {event.title}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="font-medium">{event.title}</h3>
              <Badge variant={event.category === "unit" ? "destructive" : "secondary"}>
                {event.category === "unit" ? "Unit" : "Building"}
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground">
              {new Date(event.date).toLocaleDateString()}
              {event.isAllDay ? (
                <span className="ml-2">All day</span>
              ) : (
                <span className="ml-2">
                  {formatTime(event.startTime || "")} - {formatTime(event.endTime || "")}
                </span>
              )}
            </p>

            <p className="text-sm">{event.description || "No description available."}</p>

            {event.comments.length > 0 && (
              <div className="mt-2">
                <h4 className="text-xs font-medium mb-1">Comments ({event.comments.length})</h4>
                <div className="max-h-24 overflow-y-auto space-y-2">
                  {event.comments.slice(0, 2).map((comment) => (
                    <div key={comment.id} className="bg-muted p-2 rounded text-xs">
                      <div className="flex justify-between">
                        <span className="font-medium">{comment.user.name}</span>
                        <span className="text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-1">{comment.text}</p>
                    </div>
                  ))}
                  {event.comments.length > 2 && (
                    <div className="text-center text-xs text-muted-foreground">
                      <Link href={`/events/${event.id}`}>View all comments</Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            <Button size="sm" className="w-full mt-2" asChild>
              <Link href={`/events/${event.id}`}>See Details</Link>
            </Button>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
