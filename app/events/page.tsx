"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, Calendar, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import type { Event, EventsGroupedByMonth } from "@/types/event"

// Format time from 24-hour format to 12-hour format
function formatTime(time: string): string {
  if (!time) return ""

  const [hours, minutes] = time.split(":")
  const hour = Number.parseInt(hours, 10)
  const ampm = hour >= 12 ? "PM" : "AM"
  const formattedHour = hour % 12 || 12

  return `${formattedHour}:${minutes} ${ampm}`
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [years, setYears] = useState<number[]>([])
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [groupedEvents, setGroupedEvents] = useState<EventsGroupedByMonth>({})

  // Fetch available years
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await fetch("/api/events/years")

        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`)
        }

        const data = await response.json()
        setYears(data)

        // Set the most recent year as the default
        if (data.length > 0) {
          setSelectedYear(data[0].toString())
        }
      } catch (err) {
        console.error("Failed to fetch years:", err)
        setError("Failed to load available years. Using current year instead.")

        // Fallback to current year if API fails
        const currentYear = new Date().getFullYear()
        setYears([currentYear])
        setSelectedYear(currentYear.toString())
      }
    }

    fetchYears()
  }, [])

  // Fetch events for the selected year
  useEffect(() => {
    if (!selectedYear) return

    const fetchEvents = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/events?year=${selectedYear}`)

        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`)
        }

        const data = await response.json()
        setEvents(data)

        // Group events by month
        const grouped: EventsGroupedByMonth = {}

        data.forEach((event: Event) => {
          const date = new Date(event.date)
          const monthKey = date.toLocaleDateString("en-US", { month: "long" })

          if (!grouped[monthKey]) {
            grouped[monthKey] = []
          }

          grouped[monthKey].push(event)
        })

        setGroupedEvents(grouped)
      } catch (err) {
        console.error("Failed to fetch events:", err)
        setError("Failed to load events. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [selectedYear])

  // Get month names in chronological order
  const monthNames = Object.keys(groupedEvents).sort((a, b) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    return months.indexOf(a) - months.indexOf(b)
  })

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Events</h1>

        <div className="w-full md:w-auto">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-7 bg-muted rounded w-32"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-16 bg-muted rounded"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : events.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p>No events found for {selectedYear}.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {monthNames.map((month) => (
            <Card key={month}>
              <CardHeader>
                <CardTitle>
                  {month} {selectedYear}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {groupedEvents[month].map((event) => (
                    <div
                      key={event.id}
                      className="flex flex-col md:flex-row justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{event.title}</h3>
                          <Badge variant={event.category === "unit" ? "destructive" : "secondary"}>
                            {event.category === "unit" ? "Unit" : "Building"}
                          </Badge>
                        </div>

                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>

                          {event.isAllDay ? (
                            <span className="ml-2">All day</span>
                          ) : (
                            <span className="ml-2 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTime(event.startTime || "")} - {formatTime(event.endTime || "")}
                            </span>
                          )}
                        </div>

                        <p className="text-sm">{event.description}</p>

                        {event.comments.length > 0 && (
                          <div className="mt-1 text-xs text-muted-foreground">
                            {event.comments.length} comment{event.comments.length !== 1 ? "s" : ""}
                          </div>
                        )}
                      </div>

                      <div className="mt-2 md:mt-0 md:ml-4 flex items-start">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/events/${event.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
