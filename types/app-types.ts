// Import the Supabase database types as our source of truth
import type { Database } from "./database"

// Export database row types for direct use
export type DbBuilding = Database["public"]["Tables"]["buildings"]["Row"]
export type DbEvent = Database["public"]["Tables"]["events"]["Row"]
export type DbMaintenanceIssue = Database["public"]["Tables"]["maintenance_issues"]["Row"]
export type DbUser = Database["public"]["Tables"]["users"]["Row"]
export type DbPayment = Database["public"]["Tables"]["payments"]["Row"]
export type DbMaintenanceComment = Database["public"]["Tables"]["maintenance_comments"]["Row"]

// Event types
export type EventType = "rent_due" | "maintenance" | "inspection" | "meeting" | "other"
export type EventCategory = "unit" | "building"

// Frontend-specific types that extend or transform the database types
export interface User {
  id: string
  name: string
  email: string
  firstName?: string
  lastName?: string
  role?: string
  unitNumber?: string
}

export interface Comment {
  id: string
  text: string
  createdAt: string
  user: User
}

// Frontend Event type for UI components
export interface Event {
  id: string
  title: string
  description?: string
  date: string
  startTime?: string
  endTime?: string
  isAllDay: boolean
  category: EventCategory
  type: EventType
  color: string
  paymentType?: string
  creator: { id: string | number; name: string }
  unit?: { id: string | number; number: string }
  building?: { id: string; name: string }
  contractors: string[]
  comments: Comment[]
}

// Maintenance issue types
export type IssueStatus = "open" | "in_progress" | "pending" | "resolved" | "closed"
export type IssueLocation = "unit" | "building" | "common_area"
export type IssuePriority = "low" | "medium" | "high" | "urgent"

export interface Issue {
  id: string
  title: string
  description: string
  location: IssueLocation
  locationDetail: string
  status: IssueStatus
  priority: IssuePriority
  createdAt: string
  updatedAt: string
  closedAt?: string
  creator: User
  assignedTo?: User
  comments: Comment[]
}

export interface IssueFormData {
  title: string
  description: string
  location: IssueLocation
  locationDetail: string
  priority: IssuePriority
}

// Helper types for grouping events
export interface EventsGroupedByMonth {
  [month: string]: Event[]
}

export interface EventsGroupedByYear {
  [year: string]: EventsGroupedByMonth
}

// Payment type
export interface Payment {
  id: string
  amount: number
  paymentDate: string
  paymentType: string
  status: string
  userId?: string
  buildingId: string
  unitNumber?: string
  description?: string
  user?: User
  building?: { id: string; name: string }
}
