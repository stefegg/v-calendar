"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, ArrowLeft, Calendar, Clock, MapPin, User } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import type { Issue } from "@/types/issue"

// Helper function to format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  })
}

// Helper function to get status badge variant
function getStatusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" | "success" {
  switch (status) {
    case "open":
      return "destructive"
    case "in_progress":
      return "default"
    case "pending":
      return "secondary"
    case "resolved":
    case "closed":
      return "success"
    default:
      return "outline"
  }
}

// Helper function to get priority badge variant
function getPriorityBadgeVariant(priority: string): "default" | "secondary" | "destructive" | "outline" {
  switch (priority) {
    case "low":
      return "secondary"
    case "medium":
      return "default"
    case "high":
      return "destructive"
    case "urgent":
      return "destructive"
    default:
      return "outline"
  }
}

// Helper function to format status text
function formatStatus(status: string): string {
  return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())
}

export default function IssueDetailPage() {
  const params = useParams()
  const issueId = params.id as string

  const [issue, setIssue] = useState<Issue | null>(null)
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

  // Fetch issue details
  useEffect(() => {
    const fetchIssue = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Skip fetching if the ID is "new" - this should be handled by the dedicated /issues/new route
        if (issueId === "new") {
          setIsLoading(false)
          return
        }

        const response = await fetch(`/api/issues/${issueId}`)

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Issue not found")
          }
          throw new Error(`API returned status: ${response.status}`)
        }

        const data = await response.json()
        setIssue(data)
      } catch (err) {
        console.error("Failed to fetch issue:", err)
        setError(err instanceof Error ? err.message : "Failed to load issue details.")
      } finally {
        setIsLoading(false)
      }
    }

    if (issueId) {
      fetchIssue()
    }
  }, [issueId])

  // Handle comment submission
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.trim() || isSubmitting) return

    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call to save the comment
      const response = await fetch(`/api/issues/${issueId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: newComment }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit comment")
      }

      const newCommentData = await response.json()

      // Update the issue with the new comment
      if (issue) {
        setIssue({
          ...issue,
          comments: [...issue.comments, newCommentData],
          updatedAt: new Date().toISOString(),
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
        <div className="mt-4">
          <Button variant="outline" asChild>
            <Link href="/issues">Back to Issues</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!issue) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Issue not found</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button variant="outline" asChild>
            <Link href="/issues">Back to Issues</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/issues">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Issues
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row justify-between items-start gap-2">
            <CardTitle>{issue.title}</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge variant={getStatusBadgeVariant(issue.status)}>{formatStatus(issue.status)}</Badge>
              <Badge variant={getPriorityBadgeVariant(issue.priority)}>
                Priority: {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Created: {formatDate(issue.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Last Updated: {formatDate(issue.updatedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Reported by: {issue.creator.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>Location: {issue.locationDetail}</span>
              </div>
              {issue.assignedTo && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Assigned to: {issue.assignedTo.name}</span>
                </div>
              )}
              {issue.closedAt && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Closed: {formatDate(issue.closedAt)}</span>
                </div>
              )}
            </div>

            <div className="mt-4">
              <h3 className="font-medium mb-2">Description:</h3>
              <p className="text-sm whitespace-pre-line">{issue.description}</p>
            </div>

            {/* Comments Section */}
            <div className="mt-6">
              <h3 className="font-medium text-lg mb-4">Comments</h3>

              {issue.comments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No comments yet.</p>
              ) : (
                <div className="space-y-4">
                  {issue.comments.map((comment) => (
                    <div key={comment.id} className="bg-muted p-3 rounded">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{comment.user.name}</span>
                        <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm whitespace-pre-line">{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Comment Form */}
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
