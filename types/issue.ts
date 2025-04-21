import type { User, Comment } from "./event"

export type IssueStatus = "open" | "in_progress" | "pending" | "resolved" | "closed"
export type IssueLocation = "unit" | "building" | "common_area"
export type IssuePriority = "low" | "medium" | "high" | "urgent"

export interface Issue {
  id: number
  title: string
  description: string
  location: IssueLocation
  locationDetail: string // Unit number, building name, or specific common area
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
