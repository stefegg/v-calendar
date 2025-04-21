"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, Clock, MapPin, Plus } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import type { Issue } from "@/types/issue"

// Helper function to format date
function formatDate(dateString: string): string {
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

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("open")

  useEffect(() => {
    const fetchIssues = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/issues?status=${activeTab}`)

        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`)
        }

        const data = await response.json()
        setIssues(data)
      } catch (err) {
        console.error("Failed to fetch issues:", err)
        setError("Failed to load issues. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchIssues()
  }, [activeTab])

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Maintenance Issues</h1>

        <Button asChild>
          <Link href="/issues/new">
            <Plus className="mr-2 h-4 w-4" /> Report New Issue
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="open" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="open">Open Issues</TabsTrigger>
          <TabsTrigger value="closed">Historic Issues</TabsTrigger>
        </TabsList>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <TabsContent value="open" className="mt-0">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                      <div className="h-4 bg-muted rounded w-1/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : issues.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No open issues found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {issues.map((issue) => (
                <Card key={issue.id} className="overflow-hidden">
                  <Link href={`/issues/${issue.id}`} className="block hover:bg-accent/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between mb-2">
                        <h3 className="font-medium text-lg">{issue.title}</h3>
                        <Badge variant={getStatusBadgeVariant(issue.status)} className="md:ml-2 mt-1 md:mt-0 w-fit">
                          {formatStatus(issue.status)}
                        </Badge>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center text-sm text-muted-foreground gap-y-1 md:gap-x-4">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Created: {formatDate(issue.createdAt)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Updated: {formatDate(issue.updatedAt)}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{issue.locationDetail}</span>
                        </div>
                      </div>
                      {issue.comments.length > 0 && (
                        <div className="mt-2 text-xs">
                          {issue.comments.length} comment{issue.comments.length !== 1 ? "s" : ""}
                        </div>
                      )}
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="closed" className="mt-0">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                      <div className="h-4 bg-muted rounded w-1/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : issues.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No historic issues found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {issues.map((issue) => (
                <Card key={issue.id} className="overflow-hidden">
                  <Link href={`/issues/${issue.id}`} className="block hover:bg-accent/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between mb-2">
                        <h3 className="font-medium text-lg">{issue.title}</h3>
                        <Badge variant={getStatusBadgeVariant(issue.status)} className="md:ml-2 mt-1 md:mt-0 w-fit">
                          {formatStatus(issue.status)}
                        </Badge>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center text-sm text-muted-foreground gap-y-1 md:gap-x-4">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Created: {formatDate(issue.createdAt)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Closed: {formatDate(issue.closedAt || issue.updatedAt)}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{issue.locationDetail}</span>
                        </div>
                      </div>
                      {issue.comments.length > 0 && (
                        <div className="mt-2 text-xs">
                          {issue.comments.length} comment{issue.comments.length !== 1 ? "s" : ""}
                        </div>
                      )}
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
