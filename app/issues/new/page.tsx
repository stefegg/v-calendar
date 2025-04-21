"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import type { IssueFormData } from "@/types/issue"

export default function NewIssuePage() {
  const router = useRouter()
  const [formData, setFormData] = useState<IssueFormData>({
    title: "",
    description: "",
    location: "unit",
    locationDetail: "",
    priority: "medium",
  })
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Validate form
      if (!formData.title.trim()) {
        throw new Error("Title is required")
      }
      if (!formData.description.trim()) {
        throw new Error("Description is required")
      }
      if (!formData.locationDetail.trim()) {
        throw new Error("Location details are required")
      }

      // Submit form
      const response = await fetch("/api/issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create issue")
      }

      const data = await response.json()

      // Redirect to the issue detail page
      router.push(`/issues/${data.id}`)
    } catch (err) {
      console.error("Error submitting form:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
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

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Report a Maintenance Issue</CardTitle>
          <CardDescription>
            Fill out the form below to report a maintenance issue in your unit or building.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Issue Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Brief description of the issue"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Please provide as much detail as possible about the issue"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Location Type</Label>
              <RadioGroup
                value={formData.location}
                onValueChange={(value) => handleSelectChange("location", value)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unit" id="unit" />
                  <Label htmlFor="unit">Unit</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="building" id="building" />
                  <Label htmlFor="building">Building</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="common_area" id="common_area" />
                  <Label htmlFor="common_area">Common Area</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="locationDetail">Location Details</Label>
              <Input
                id="locationDetail"
                name="locationDetail"
                placeholder={
                  formData.location === "unit"
                    ? "e.g., Unit 101 - Kitchen"
                    : formData.location === "building"
                      ? "e.g., 3rd Floor Hallway"
                      : "e.g., Fitness Center"
                }
                value={formData.locationDetail}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Not urgent</SelectItem>
                  <SelectItem value="medium">Medium - Needs attention soon</SelectItem>
                  <SelectItem value="high">High - Requires prompt attention</SelectItem>
                  <SelectItem value="urgent">Urgent - Immediate attention needed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/issues">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Issue"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
