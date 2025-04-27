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
import dayjs from "dayjs"
import weekday from "dayjs/plugin/weekday"
import weekOfYear from "dayjs/plugin/weekOfYear"

// Initialize dayjs plugins
dayjs.extend(weekday)
dayjs.extend(weekOfYear)

// Define DateAttr interface for calendar days
interface DateAttr {
  dateString: string
  dayNumber: number
  isCurrentMonth: boolean
}

// Helper functions for calendar generation
const getMonthDayCount = (year: number, month: number): number => {
  return dayjs(`${year}-${month}-01`).daysInMonth()
}

// Find what day of the week a date is on (0 is Sunday)
const getDayIndex = (dateString: string | number | dayjs.Dayjs | Date | null | undefined): number => {
  return dayjs(dateString).weekday()
}

const currentMonthDisplay = (year: number, month: number): DateAttr[] => {
  // Format month as MM
  const formattedMonth = String(month).padStart(2, "0")

  // Build current month array
  return [...Array(getMonthDayCount(year, month))].map((_, idx) => {
    return {
      dateString: dayjs(`${year}-${formattedMonth}-${idx + 1}`).format("YYYY-MM-DD"),
      dayNumber: idx + 1,
      isCurrentMonth: true,
    }
  })
}

const prevMonthDisplay = (year: number, month: number, currentMonthDays: DateAttr[]): DateAttr[] => {
  // Format month as MM
  const formattedMonth = String(month).padStart(2, "0")

  // Get index that represents the day of the week for first day of current month
  const visibleNumberOfDays = getDayIndex(currentMonthDays[0].dateString)
  const previousMonth = dayjs(`${year}-${formattedMonth}-01`).subtract(1, "month")

  // First displayed day of previous month, will always start on Sunday if any are visible
  const lastSundayDayOfMonth = dayjs(currentMonthDays[0].dateString).subtract(visibleNumberOfDays, "day").date()

  // Build prevMonth array
  return [...Array(visibleNumberOfDays)].map((_, idx) => {
    return {
      dateString: dayjs(`${previousMonth.year()}-${previousMonth.month() + 1}-${lastSundayDayOfMonth + idx}`).format(
        "YYYY-MM-DD",
      ),
      dayNumber: lastSundayDayOfMonth + idx,
      isCurrentMonth: false,
    }
  })
}

const nextMonthDisplay = (year: number, month: number, currentMonthDays: DateAttr[]): DateAttr[] => {
  // Format month as MM
  const formattedMonth = String(month).padStart(2, "0")

  const lastDayOfTheMonthWeekday = getDayIndex(`${year}-${formattedMonth}-${currentMonthDays.length}`)
  const nextMonth = dayjs(`${year}-${formattedMonth}-01`).add(1, "month")

  // Subtract last day of the month from 6 to determine visible number of days for next month
  const visibleNumberOfDays = 6 - lastDayOfTheMonthWeekday

  // Build nextMonth array
  return [...Array(visibleNumberOfDays)].map((_, idx) => {
    return {
      dateString: dayjs(`${nextMonth.year()}-${nextMonth.month() + 1}-${idx + 1}`).format("YYYY-MM-DD"),
      dayNumber: idx + 1,
      isCurrentMonth: false,
    }
  })
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
  const [calendarDays, setCalendarDays] = useState<DateAttr[]>([])

  // Generate calendar days when date changes
  useEffect(() => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1 // JavaScript months are 0-indexed, dayjs expects 1-indexed

    // Generate current month days
    const currentDays = currentMonthDisplay(year, month)

    // Generate previous month days
    const prevDays = prevMonthDisplay(year, month, currentDays)

    // Generate next month days
    const nextDays = nextMonthDisplay(year, month, currentDays)

    // Combine all days
    setCalendarDays([...prevDays, ...currentDays, ...nextDays])
  }, [date])

  // Fetch events from the API when the date changes
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Get the year for the API request
        const year = date.getFullYear()

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

  // Get events for a specific day
  const getEventsForDay = (dateString: string) => {
    return events
      .filter((event) => {
        // Simple string comparison of dates (YYYY-MM-DD)
        const eventDateParts = event.date.split("T")[0] // Handle both YYYY-MM-DD and ISO formats
        return eventDateParts === dateString
      })
      .slice(0, 3) // Show max 3 events per day as per spec
  }

  return (
    <Card className="w-full bg-primary/15 dark:bg-card">
      <CardHeader className="flex flex-col items-center justify-center pb-2">
        <div className="flex items-center justify-center w-full max-w-md space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousMonth}
            className="border-primary-foreground/70 dark:border-input"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="font-medium text-2xl px-8 text-center min-w-[200px]">
            {date.toLocaleDateString("en-US", { year: "numeric", month: "long" })}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            className="border-primary-foreground/70 dark:border-input"
          >
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

        {/* Custom calendar implementation */}
        <div className="grid grid-cols-7 gap-1 text-center font-medium mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const dayEvents = getEventsForDay(day.dateString)

            return (
              <div
                key={index}
                className={cn(
                  "min-h-[120px] border rounded-md p-2",
                  day.isCurrentMonth ? "bg-white dark:bg-card" : "bg-muted/30 text-muted-foreground",
                  isLoading && "opacity-70",
                )}
              >
                <div className="font-medium text-right mb-1">{day.dayNumber}</div>
                <div className="space-y-1">
                  {!isLoading && dayEvents.map((event) => <EventStripe key={event.id} event={event} />)}
                  {isLoading && day.isCurrentMonth && <div className="h-6 bg-muted rounded animate-pulse"></div>}
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
        <Button variant="outline" size="sm" asChild className="border-primary-foreground/70 dark:border-input">
          <Link href="/events">View All Events</Link>
        </Button>
      </CardFooter>
    </Card>
  )
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
