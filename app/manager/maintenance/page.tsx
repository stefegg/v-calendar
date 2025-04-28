"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Clock, MapPin, Search, Plus, Filter } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import type { MaintenanceIssueWithAssignment } from "@/types/maintenance-types"

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

export default function ManagerMaintenancePage() {
  const router = useRouter()
  const [issues, setIssues] = useState<MaintenanceIssueWithAssignment[]>([])
  const [filteredIssues, setFilteredIssues] = useState<MaintenanceIssueWithAssignment[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null)

  useEffect(() => {
    const fetchIssues = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // In a real app, this would be a call to your API with proper filtering
        const response = await fetch(`/api/manager/maintenance-issues`)

        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`)
        }

        const data = await response.json()
        setIssues(data)
        setFilteredIssues(data)
      } catch (err) {
        console.error("Failed to fetch issues:", err)
        setError("Failed to load maintenance issues. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchIssues()
  }, [])

  // Apply filters when tab, search query, or priority filter changes
  useEffect(() => {
    let filtered = [...issues]

    // Filter by status (tab)
    if (activeTab !== "all") {
      if (activeTab === "open") {
        filtered = filtered.filter((issue) => ["open", "in_progress", "pending"].includes(issue.status))
      } else if (activeTab === "assigned") {
        filtered = filtered.filter((issue) => issue.assignedTo !== undefined)
      } else if (activeTab === "unassigned") {
        filtered = filtered.filter((issue) => issue.assignedTo === undefined)
      } else if (activeTab === "scheduled") {
        filtered = filtered.filter((issue) => issue.scheduledDate !== undefined)
      } else {
        filtered = filtered.filter((issue) => issue.status === activeTab)
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (issue) =>
          issue.title.toLowerCase().includes(query) ||
          issue.description.toLowerCase().includes(query) ||
          issue.locationDetail.toLowerCase().includes(query),
      )
    }

    // Filter by priority
    if (priorityFilter) {
      filtered = filtered.filter((issue) => issue.priority === priorityFilter)
    }

    setFilteredIssues(filtered)
  }, [issues, activeTab, searchQuery, priorityFilter])

  const handleViewIssue = (issueId: string) => {
    router.push(`/manager/maintenance/${issueId}`)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Maintenance Management</h1>

        <Button asChild>
          <Link href="/manager/maintenance/new">
            <Plus className="mr-2 h-4 w-4" /> Create Work Order
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search issues..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex gap-2">
              <Filter className="h-4 w-4" />
              {priorityFilter
                ? `Priority: ${priorityFilter.charAt(0).toUpperCase() + priorityFilter.slice(1)}`
                : "Filter by Priority"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setPriorityFilter(null)}>All Priorities</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPriorityFilter("urgent")}>Urgent</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPriorityFilter("high")}>High</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPriorityFilter("medium")}>Medium</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPriorityFilter("low")}>Low</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6 mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="assigned">Assigned</TabsTrigger>
          <TabsTrigger value="unassigned">Unassigned</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <TabsContent value={activeTab} className="mt-0">
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
          ) : filteredIssues.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No maintenance issues found matching your criteria.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredIssues.map((issue) => (
                <Card key={issue.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between mb-2">
                      <h3 className="font-medium text-lg">{issue.title}</h3>
                      <div className="flex flex-wrap gap-2 mt-1 md:mt-0">
                        <Badge variant={getStatusBadgeVariant(issue.status)}>{formatStatus(issue.status)}</Badge>
                        <Badge
                          variant={issue.priority === "urgent" || issue.priority === "high" ? "destructive" : "outline"}
                        >
                          {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
                        </Badge>
                        {issue.workDiscipline && (
                          <Badge variant="secondary">
                            {issue.workDiscipline.charAt(0).toUpperCase() + issue.workDiscipline.slice(1)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center text-sm text-muted-foreground gap-y-1 md:gap-x-4 mb-3">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Reported: {formatDate(issue.createdAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{issue.locationDetail}</span>
                      </div>
                      {issue.scheduledDate && (
                        <div className="flex items-center font-medium text-primary">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Scheduled: {formatDate(issue.scheduledDate)}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm line-clamp-2 mb-3">{issue.description}</p>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                      <div>
                        {issue.assignedVendor ? (
                          <div className="text-sm">
                            <span className="font-medium">Vendor:</span> {issue.assignedVendor.name}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">No vendor assigned</div>
                        )}
                      </div>
                      <Button onClick={() => handleViewIssue(issue.id)}>Manage Issue</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
