import type { Issue } from "@/types/app-types"

// Work disciplines that can be assigned to maintenance issues
export type WorkDiscipline =
  | "plumbing"
  | "electrical"
  | "hvac"
  | "carpentry"
  | "painting"
  | "cleaning"
  | "landscaping"
  | "general"
  | "other"

// Vendor interface
export interface Vendor {
  id: string
  name: string
  email: string | null
  phone: string | null
  disciplines: WorkDiscipline[]
  address?: string | null
  notes?: string | null
  isPreferred?: boolean
}

// Extended issue interface with work discipline and vendor
export interface MaintenanceIssueWithAssignment extends Issue {
  workDiscipline?: WorkDiscipline
  assignedVendor?: Vendor
  estimatedCost?: number
  scheduledDate?: string
  completionDate?: string
}

// Form data for updating an issue
export interface IssueUpdateFormData {
  status?: string
  priority?: string
  workDiscipline?: WorkDiscipline
  vendorId?: string
  comment?: string
  estimatedCost?: number
  scheduledDate?: string
  completionDate?: string
}
