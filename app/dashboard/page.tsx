"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Home, AlertCircle, BarChart3, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

// Define types for dashboard data
interface DashboardData {
  upcomingEvents: number
  events: any[]
  openIssues: number
  issues: any[]
  paymentStatus: {
    status: string
    lastPaymentDate: string | null
    amount: number
  }
  paymentHistory: {
    month: string
    year: number
    total: number
    onTime: number
    late: number
  }[]
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/dashboard")

        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`)
        }

        const data = await response.json()
        setDashboardData(data)
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err)
        setError("Failed to load dashboard data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Get payment status text
  const getPaymentStatusText = () => {
    if (!dashboardData?.paymentStatus) return "Unknown"

    const { status } = dashboardData.paymentStatus
    if (status === "completed") return "Current"
    if (status === "pending") return "Pending"
    if (status === "failed") return "Failed"
    return "Unknown"
  }

  // Get months in chronological order for payment history
  const getOrderedMonths = () => {
    if (!dashboardData?.paymentHistory) return []

    // Sort months chronologically with year information
    return [...dashboardData.paymentHistory].sort((a, b) => {
      // Compare years first
      const yearA = a.year || new Date().getFullYear()
      const yearB = b.year || new Date().getFullYear()

      if (yearA !== yearB) {
        return yearA - yearB
      }

      // If years are the same, compare months
      const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
    })
  }

  // Calculate payment percentage for a month (for bar height)
  const getPaymentPercentage = (month: string) => {
    if (!dashboardData?.paymentHistory) return 0

    const monthData = dashboardData.paymentHistory.find((p) => p.month === month)
    if (!monthData) return 0

    // Calculate percentage based on the highest month total
    const maxTotal = Math.max(...dashboardData.paymentHistory.map((p) => p.total))
    return (monthData.total / maxTotal) * 100
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4 h-64 bg-muted rounded"></div>
            <div className="col-span-3 h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* User Profile Section */}
          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-primary/5 rounded-lg">
                <div className="relative w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  {/* Placeholder avatar - in a real app, this would be a user image */}
                  <span className="text-2xl font-bold text-primary">JD</span>
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-bold">John Doe</h2>
                  <p className="text-sm text-muted-foreground">Unit 101, Sunset Towers</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                      Tenant
                    </span>
                    <span className="text-muted-foreground">Member since May 2023</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 md:ml-auto flex flex-col md:flex-row gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    Account Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/events" className="block transition-transform hover:scale-[1.02]">
              <Card className="h-full hover:border-primary/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData?.upcomingEvents || 0}</div>
                  <p className="text-xs text-muted-foreground">In the next 30 days</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/issues" className="block transition-transform hover:scale-[1.02]">
              <Card className="h-full hover:border-primary/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData?.openIssues || 0}</div>
                  <p className="text-xs text-muted-foreground">Awaiting resolution</p>
                </CardContent>
              </Card>
            </Link>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getPaymentStatusText()}</div>
                <p className="text-xs text-muted-foreground">
                  Last payment: {formatDate(dashboardData?.paymentStatus?.lastPaymentDate)}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent interactions and notifications</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="space-y-4">
                  {/* Recent events */}
                  {dashboardData?.events && dashboardData.events.length > 0 ? (
                    dashboardData.events.map((event, index) => (
                      <div key={event.id || index} className="flex items-center gap-4 rounded-md p-2 hover:bg-accent">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <CalendarDays className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">New event: {event.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Scheduled for {formatDate(event.date)}
                            {event.start_time ? ` at ${event.start_time}` : ""}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-4 rounded-md p-2">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <CalendarDays className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">No recent events</p>
                        <p className="text-sm text-muted-foreground">Check back later for updates</p>
                      </div>
                    </div>
                  )}

                  {/* Recent issues */}
                  {dashboardData?.issues && dashboardData.issues.length > 0
                    ? dashboardData.issues.map((issue, index) => (
                        <div key={issue.id || index} className="flex items-center gap-4 rounded-md p-2 hover:bg-accent">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                            <AlertCircle className="h-5 w-5 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Issue status updated</p>
                            <p className="text-sm text-muted-foreground">
                              {issue.title}: Status changed to "{issue.status.replace("_", " ")}"
                            </p>
                          </div>
                        </div>
                      ))
                    : null}

                  {/* Building announcement - static for now */}
                  <div className="flex items-center gap-4 rounded-md p-2 hover:bg-accent">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <Home className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Building announcement</p>
                      <p className="text-sm text-muted-foreground">Window cleaning scheduled for next week</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link href="/issues/new" className="block">
                    <div className="flex items-center justify-between rounded-md p-2 hover:bg-accent cursor-pointer">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Report a new issue</span>
                      </div>
                      <span className="text-sm text-muted-foreground">→</span>
                    </div>
                  </Link>
                  <Link href="/calendar" className="block">
                    <div className="flex items-center justify-between rounded-md p-2 hover:bg-accent cursor-pointer">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">View calendar</span>
                      </div>
                      <span className="text-sm text-muted-foreground">→</span>
                    </div>
                  </Link>
                  <div className="flex items-center justify-between rounded-md p-2 hover:bg-accent cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Account settings</span>
                    </div>
                    <span className="text-sm text-muted-foreground">→</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Financial Overview Card */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>Monthly payment summary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Rent Payments</span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      ${dashboardData?.paymentStatus?.amount.toFixed(2) || "0.00"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Utilities</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">$145.75</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Maintenance Fees</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">$50.00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Other Charges</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">$25.00</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold">Total Monthly</span>
                      <span className="font-bold">
                        ${((dashboardData?.paymentStatus?.amount || 0) + 145.75 + 50 + 25).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment History Card */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[220px] flex items-end justify-between gap-2">
                  {/* Dynamic bar chart for payment history */}
                  {getOrderedMonths().map((monthData, index) => (
                    <div
                      key={`${monthData.month}-${monthData.year}`}
                      className="relative flex flex-col items-center group"
                    >
                      <div className="h-[180px] w-8 bg-muted rounded-t-md overflow-hidden">
                        <div
                          className="bg-green-500 w-full absolute bottom-0 h-0 animate-grow-up"
                          style={
                            {
                              animationDelay: `${index * 200}ms`,
                              "--bar-height": `${getPaymentPercentage(monthData.month)}%`,
                            } as React.CSSProperties
                          }
                        ></div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                          Paid on {monthData.month} 1, {monthData.year}
                        </div>
                      </div>
                      <span className="text-xs mt-1">{monthData.month}</span>
                    </div>
                  ))}

                  {/* If no payment history, show placeholder bars */}
                  {(!dashboardData?.paymentHistory || dashboardData.paymentHistory.length === 0) && (
                    <>
                      {["Dec", "Jan", "Feb", "Mar", "Apr", "May"].map((month, index) => (
                        <div key={month} className="relative flex flex-col items-center group">
                          <div className="h-[180px] w-8 bg-muted rounded-t-md overflow-hidden">
                            <div
                              className="bg-green-500 w-full absolute bottom-0 h-0 animate-grow-up"
                              style={
                                {
                                  animationDelay: `${index * 200}ms`,
                                  "--bar-height": `${index % 2 === 0 ? "95%" : "100%"}`,
                                } as React.CSSProperties
                              }
                            ></div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                              Paid on {month} 1, 2025
                            </div>
                          </div>
                          <span className="text-xs mt-1">{month}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                  On-time payments
                </div>
              </CardContent>
            </Card>

            {/* Maintenance Stats Card */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Maintenance Stats</CardTitle>
                <CardDescription>Issue resolution metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Average Resolution Time</span>
                      <span className="text-sm">3.2 days</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full w-[65%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Issues Resolved</span>
                      <span className="text-sm">85%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full w-[85%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Satisfaction Rating</span>
                      <span className="text-sm">4.7/5</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-amber-500 h-2.5 rounded-full w-[94%]"></div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Issues Reported</span>
                      <span className="text-lg font-bold">{dashboardData?.openIssues || 0}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Building Usage Card */}
            <Card>
              <CardHeader>
                <CardTitle>Building Usage</CardTitle>
                <CardDescription>Common area utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-4">
                  {/* Mock donut chart */}
                  <div className="relative w-40 h-40">
                    <div className="absolute inset-0 rounded-full border-8 border-blue-500"></div>
                    <div
                      className="absolute inset-0 rounded-full border-8 border-green-500 border-l-transparent border-r-transparent border-b-transparent"
                      style={{ transform: "rotate(45deg)" }}
                    ></div>
                    <div
                      className="absolute inset-0 rounded-full border-8 border-amber-500 border-l-transparent border-t-transparent border-b-transparent"
                      style={{ transform: "rotate(225deg)" }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">Usage</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                    <span className="text-sm">Gym (45%)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-sm">Pool (30%)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-amber-500 rounded-full mr-2"></span>
                    <span className="text-sm">Lounge (25%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Expenses Card */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Expenses</CardTitle>
                <CardDescription>Projected for next quarter</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-10 bg-blue-500 rounded-full mr-3"></div>
                      <div>
                        <p className="text-sm font-medium">Annual HVAC Maintenance</p>
                        <p className="text-xs text-muted-foreground">Due in 45 days</p>
                      </div>
                    </div>
                    <span className="font-bold">$350.00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-10 bg-amber-500 rounded-full mr-3"></div>
                      <div>
                        <p className="text-sm font-medium">Quarterly HOA Dues</p>
                        <p className="text-xs text-muted-foreground">Due in 30 days</p>
                      </div>
                    </div>
                    <span className="font-bold">$750.00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-10 bg-green-500 rounded-full mr-3"></div>
                      <div>
                        <p className="text-sm font-medium">Property Insurance</p>
                        <p className="text-xs text-muted-foreground">Due in 60 days</p>
                      </div>
                    </div>
                    <span className="font-bold">$1,200.00</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold">Total Upcoming</span>
                      <span className="font-bold">$2,300.00</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Manage your account settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Settings dashboard coming soon</p>
                <div className="w-full h-40 bg-muted rounded-md flex items-center justify-center">
                  <Settings className="h-10 w-10 text-muted-foreground/50" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
