"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, Home, User, Users, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import type { Event } from "@/types/event"

// Format time from 24-hour format to 12-hour format
function formatTime(time: string): string {
  if (!time) return ""

  const [hours, minutes] = time.split(":")
  const hour = Number.parseInt(hours, 10)
  const ampm = hour >= 12 ? "PM" : "AM"
  const formattedHour = hour % 12 || 12

  return `${formattedHour}:${minutes} ${ampm}`
}

export default function EventPage() {
  const params = useParams()
  const eventId = params.id as string

  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [newComment, setNewComment] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // Mock current user for demonstration
  const currentUser = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    unitId: 101,
  }

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/events/${eventId}`)

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Event not found")
          }
          throw new Error(`API returned status: ${response.status}`)
        }

        const data = await response.json()
        setEvent(data)
      } catch (err) {
        console.error("Failed to fetch event:", err)
        setError(err instanceof Error ? err.message : "Failed to load event details.")
      } finally {
        setIsLoading(false)
      }
    }

    if (eventId) {
      fetchEvent()
    }
  }, [eventId])

  // Check if user can comment on this event
  // Updated logic: If the user can see a unit event, they can comment on it
  const canComment = () => {
    if (!event) return false

    // Building events can be commented on by anyone
    if (event.category === "building") return true

    // If it's a unit event and the user can see it, they can comment on it
    // In a real app, this would check if the user has permission to see the event
    return true
  }

  // Handle comment submission
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.trim() || !canComment() || isSubmitting) return

    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call to save the comment
      // For now, we'll just simulate it and update the UI

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Update the event with the new comment
      if (event) {
        const newCommentObj = {
          id: Math.floor(Math.random() * 1000) + 100, // Random ID for demo
          text: newComment,
          createdAt: new Date().toISOString(),
          user: currentUser,
        }

        setEvent({
          ...event,
          comments: [...event.comments, newCommentObj],
        })

        // Clear the comment input
        setNewComment("")
      }
    } catch (err) {
      console.error("Failed to submit comment:", err)
      alert("Failed to submit comment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48"></div>
          <Card>
            <CardHeader>
              <div className="h-7 bg-muted rounded w-64"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-6 bg-muted rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4 flex gap-4">
          <Button variant="outline" asChild>
            <Link href="/events">Back to Events</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/calendar">View Calendar</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Event not found</AlertDescription>
        </Alert>
        <div className="mt-4 flex gap-4">
          <Button variant="outline" asChild>
            <Link href="/events">Back to Events</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/calendar">View Calendar</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex justify-between items-center">
        <Button variant="outline" size="sm" asChild>
          <Link href="/events">← Back to Events</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/calendar">View Calendar</Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle>{event.title}</CardTitle>
            <Badge variant={event.category === "unit" ? "destructive" : "secondary"}>
              {event.category === "unit" ? "Unit" : "Building"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{new Date(event.date).toLocaleDateString()}</span>
              {event.isAllDay ? (
                <span className="text-muted-foreground">(All day)</span>
              ) : (
                <span className="text-muted-foreground">
                  {formatTime(event.startTime || "")} - {formatTime(event.endTime || "")}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Created by: {event.creator.name}</span>
            </div>

            {event.unit && (
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-muted-foreground" />
                <span>Unit: {event.unit.number}</span>
              </div>
            )}

            {event.building && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Building: {event.building.name}</span>
              </div>
            )}

            {event.paymentType && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Payment Type: {event.paymentType}</span>
              </div>
            )}

            {event.contractors.length > 0 && (
              <div>
                <h3 className="font-medium mb-1">Contractors:</h3>
                <ul className="list-disc list-inside pl-2">
                  {event.contractors.map((contractor, index) => (
                    <li key={index} className="text-sm">
                      {contractor}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4">
              <h3 className="font-medium mb-1">Description:</h3>
              <p className="text-sm">{event.description}</p>
            </div>

            {/* Comments Section */}
            <div className="mt-6">
              <h3 className="font-medium text-lg mb-4">Comments</h3>

              {event.comments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No comments yet.</p>
              ) : (
                <div className="space-y-4">
                  {event.comments.map((comment) => (
                    <div key={comment.id} className="bg-muted p-3 rounded">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{comment.user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Comment Form - Always shown now based on updated logic */}
              <form onSubmit={handleSubmitComment} className="mt-4">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-2"
                />
                <Button type="submit" disabled={!newComment.trim() || isSubmitting}>
                  {isSubmitting ? "Posting..." : "Post Comment"}
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
