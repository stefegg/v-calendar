"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, ArrowLeft, Calendar, Clock, MapPin, User, Wrench, DollarSign } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import Link from "next/link"
import type {
  MaintenanceIssueWithAssignment,
  WorkDiscipline,
  Vendor,
  IssueUpdateFormData,
} from "@/types/maintenance-types"

// Helper function to format date
function formatDate(dateString: string | undefined): string {
  if (!dateString) return "Not scheduled"
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
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

// Helper function to format status text
function formatStatus(status: string): string {
  return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())
}

export default function MaintenanceIssuePage() {
  const params = useParams()
  const router = useRouter()
  const issueId = params.id as string

  const [issue, setIssue] = useState<MaintenanceIssueWithAssignment | null>(null)
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [newComment, setNewComment] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [updateFormData, setUpdateFormData] = useState<IssueUpdateFormData>({})
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  // Mock current user for demonstration
  const currentUser = {
    id: "d9e7f69c-8b4a-4b5c-8c9d-f5e8a7b9c0d1", // Valid UUID format
    name: "John Doe (Manager)",
    email: "john@example.com",
  }

  // Fetch issue details
  useEffect(() => {
    const fetchIssue = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // In a real app, this would be a call to your API
        const response = await fetch(`/api/manager/maintenance-issues/${issueId}`)

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Issue not found")
          }
          throw new Error(`API returned status: ${response.status}`)
        }

        const data = await response.json()
        setIssue(data)

        // Initialize form data with current values
        setUpdateFormData({
          status: data.status,
          priority: data.priority,
          workDiscipline: data.workDiscipline,
          vendorId: data.assignedVendor?.id,
          estimatedCost: data.estimatedCost,
          scheduledDate: data.scheduledDate,
          completionDate: data.completionDate,
        })

        if (data.scheduledDate) {
          setSelectedDate(new Date(data.scheduledDate))
        }

        // Fetch vendors
        const vendorsResponse = await fetch("/api/manager/vendors")
        if (vendorsResponse.ok) {
          const vendorsData = await vendorsResponse.json()
          setVendors(vendorsData)
        }
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

  // Handle form field changes
  const handleFormChange = (field: string, value: any) => {
    setUpdateFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      handleFormChange("scheduledDate", format(date, "yyyy-MM-dd"))
    } else {
      handleFormChange("scheduledDate", undefined)
    }
  }

  // Handle comment submission
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.trim() || isSubmitting) return

    setIsSubmitting(true)

    try {
      await handleAddComment(newComment)
      // Clear the comment input
      setNewComment("")
      // Show success message
      alert("Comment added successfully")
    } catch (err) {
      console.error("Failed to submit comment:", err)
      alert("Failed to submit comment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle issue update
  const handleUpdateIssue = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      // Prepare the data to send to the API
      const updateData = {
        status: updateFormData.status,
        priority: updateFormData.priority,
        work_discipline: updateFormData.workDiscipline,
        vendor_id: updateFormData.vendorId === "none" ? null : updateFormData.vendorId,
        estimated_cost: updateFormData.estimatedCost,
        scheduled_date: updateFormData.scheduledDate,
        completion_date: updateFormData.completionDate,
      }

      // In a real app, this would be a call to your API
      const response = await fetch(`/api/manager/maintenance-issues/${issueId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        throw new Error("Failed to update issue")
      }

      const updatedIssue = await response.json()

      // Update the local state
      setIssue(updatedIssue)

      // If there's a comment, add it separately
      if (updateFormData.comment && updateFormData.comment.trim()) {
        try {
          await handleAddComment(updateFormData.comment)
        } catch (commentError) {
          console.error("Failed to add comment:", commentError)
          // Show a warning but don't fail the whole update
          alert("Issue updated but comment could not be added. Please try adding the comment separately.")
        }
      } else {
        // Show success message
        alert("Issue updated successfully")
      }

      // Reset comment field
      handleFormChange("comment", "")
    } catch (err) {
      console.error("Failed to update issue:", err)
      alert("Failed to update issue. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper function to add a comment
  const handleAddComment = async (commentText: string) => {
    // Get a list of valid users from the database
    const usersResponse = await fetch("/api/users?role=manager")
    if (!usersResponse.ok) {
      throw new Error("Failed to fetch valid users")
    }

    const users = await usersResponse.json()

    // Use the first manager user ID if available, otherwise use a fallback approach
    const userId = users && users.length > 0 ? users[0].id : null

    const response = await fetch(`/api/manager/maintenance-issues/${issueId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment: commentText,
        user_id: userId,
        user_name: "System Manager",
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to add comment")
    }

    const newCommentData = await response.json()

    // Update the issue with the new comment
    if (issue) {
      setIssue({
        ...issue,
        comments: [...issue.comments, newCommentData],
      })
    }

    return newCommentData
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
            <Link href="/manager/maintenance">Back to Maintenance Issues</Link>
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
            <Link href="/manager/maintenance">Back to Maintenance Issues</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/manager/maintenance">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Maintenance Issues
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main issue details */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col md:flex-row justify-between items-start gap-2">
                <CardTitle>{issue.title}</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={getStatusBadgeVariant(issue.status)}>{formatStatus(issue.status)}</Badge>
                  <Badge variant={issue.priority === "urgent" || issue.priority === "high" ? "destructive" : "outline"}>
                    {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
                  </Badge>
                  {issue.workDiscipline && (
                    <Badge variant="secondary">
                      {issue.workDiscipline.charAt(0).toUpperCase() + issue.workDiscipline.slice(1)}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Reported: {formatDate(issue.createdAt)}</span>
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
                  {issue.scheduledDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Scheduled: {formatDate(issue.scheduledDate)}</span>
                    </div>
                  )}
                  {issue.completionDate && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Completed: {formatDate(issue.completionDate)}</span>
                    </div>
                  )}
                  {issue.estimatedCost != null && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>Estimated Cost: ${issue.estimatedCost.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <h3 className="font-medium mb-2">Description:</h3>
                  <p className="text-sm whitespace-pre-line">{issue.description}</p>
                </div>

                {/* Comments Section */}
                <div className="mt-6">
                  <h3 className="font-medium text-lg mb-4">Comments & Activity</h3>

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

        {/* Issue management panel */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Manage Issue</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={updateFormData.status} onValueChange={(value) => handleFormChange("status", value)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={updateFormData.priority} onValueChange={(value) => handleFormChange("priority", value)}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workDiscipline">Work Discipline</Label>
                <Select
                  value={updateFormData.workDiscipline}
                  onValueChange={(value) => handleFormChange("workDiscipline", value as WorkDiscipline)}
                >
                  <SelectTrigger id="workDiscipline">
                    <SelectValue placeholder="Select work discipline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plumbing">Plumbing</SelectItem>
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="hvac">HVAC</SelectItem>
                    <SelectItem value="carpentry">Carpentry</SelectItem>
                    <SelectItem value="painting">Painting</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="landscaping">Landscaping</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vendor">Assign Vendor</Label>
                <Select value={updateFormData.vendorId} onValueChange={(value) => handleFormChange("vendorId", value)}>
                  <SelectTrigger id="vendor">
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedCost">Estimated Cost ($)</Label>
                <Input
                  id="estimatedCost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={updateFormData.estimatedCost || ""}
                  onChange={(e) => handleFormChange("estimatedCost", Number.parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label>Schedule Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent mode="single" selected={selectedDate} onSelect={handleDateSelect} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="updateComment">Update Comment</Label>
                <Textarea
                  id="updateComment"
                  placeholder="Add a comment about this update..."
                  value={updateFormData.comment || ""}
                  onChange={(e) => handleFormChange("comment", e.target.value)}
                />
              </div>

              <Button className="w-full" onClick={handleUpdateIssue} disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Issue"}
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Wrench className="mr-2 h-4 w-4" />
                    Create Work Order
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Work Order</DialogTitle>
                    <DialogDescription>Generate a work order for this maintenance issue.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="workOrderTitle">Work Order Title</Label>
                      <Input id="workOrderTitle" defaultValue={`Work Order: ${issue.title}`} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workOrderInstructions">Special Instructions</Label>
                      <Textarea
                        id="workOrderInstructions"
                        placeholder="Add any special instructions for the vendor..."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Generate Work Order</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
