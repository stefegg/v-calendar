import { supabase, createServerSupabaseClient } from "@/lib/supabase"
import type { Database } from "@/types/database"
import type { Issue, Comment } from "@/types/app-types"

export type MaintenanceIssue = Database["public"]["Tables"]["maintenance_issues"]["Row"]
export type MaintenanceIssueInsert = Database["public"]["Tables"]["maintenance_issues"]["Insert"]
export type MaintenanceIssueUpdate = Database["public"]["Tables"]["maintenance_issues"]["Update"]

export type MaintenanceComment = Database["public"]["Tables"]["maintenance_comments"]["Row"]
export type MaintenanceCommentInsert = Database["public"]["Tables"]["maintenance_comments"]["Insert"]

// Client-side functions
export async function getMaintenanceIssues(buildingId?: string, status?: string) {
  let query = supabase.from("maintenance_issues").select(`
      *,
      reported_by:users!maintenance_issues_reported_by_fkey(id, first_name, last_name),
      assigned_to:users!maintenance_issues_assigned_to_fkey(id, first_name, last_name),
      buildings(id, name)
    `)

  if (buildingId) {
    query = query.eq("building_id", buildingId)
  }

  if (status) {
    if (status === "open") {
      query = query.in("status", ["open", "in_progress", "pending"])
    } else if (status === "closed") {
      query = query.in("status", ["resolved", "closed"])
    } else {
      query = query.eq("status", status)
    }
  }

  const { data, error } = await query.order("reported_at", { ascending: false })

  if (error) {
    console.error("Error fetching maintenance issues:", error)
    throw error
  }

  return data
}

export async function getMaintenanceIssue(id: string) {
  const { data, error } = await supabase
    .from("maintenance_issues")
    .select(`
      *,
      reported_by:users!maintenance_issues_reported_by_fkey(id, first_name, last_name, email),
      assigned_to:users!maintenance_issues_assigned_to_fkey(id, first_name, last_name, email),
      buildings(id, name),
      maintenance_comments(
        id,
        text,
        created_at,
        users(id, first_name, last_name)
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error fetching maintenance issue with id ${id}:`, error)
    throw error
  }

  return data
}

// Server-side functions
export async function createMaintenanceIssue(issue: MaintenanceIssueInsert) {
  const supabaseServer = createServerSupabaseClient()

  const { data, error } = await supabaseServer.from("maintenance_issues").insert(issue).select().single()

  if (error) {
    console.error("Error creating maintenance issue:", error)
    throw error
  }

  return data
}

export async function updateMaintenanceIssue(id: string, updates: MaintenanceIssueUpdate) {
  const supabaseServer = createServerSupabaseClient()

  // If status is being updated to resolved or closed, set resolved_at
  if (updates.status === "resolved" || updates.status === "closed") {
    updates.resolved_at = updates.resolved_at || new Date().toISOString()
  }

  const { data, error } = await supabaseServer
    .from("maintenance_issues")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating maintenance issue with id ${id}:`, error)
    throw error
  }

  return data
}

export async function addMaintenanceComment(comment: MaintenanceCommentInsert) {
  const supabaseServer = createServerSupabaseClient()

  const { data, error } = await supabaseServer.from("maintenance_comments").insert(comment).select().single()

  if (error) {
    console.error("Error adding maintenance comment:", error)
    throw error
  }

  return data
}

// Helper function to transform database issue to frontend issue
export function transformIssueForFrontend(dbIssue: any): Issue {
  // Transform comments
  const comments: Comment[] = dbIssue.maintenance_comments
    ? dbIssue.maintenance_comments.map((comment: any) => ({
        id: comment.id,
        text: comment.text,
        createdAt: comment.created_at,
        user: {
          id: comment.users?.id || 0,
          name: comment.users ? `${comment.users.first_name} ${comment.users.last_name}` : "Unknown",
          email: comment.users?.email || "",
        },
      }))
    : []

  return {
    id: dbIssue.id,
    title: dbIssue.title,
    description: dbIssue.description,
    location: dbIssue.unit_number ? "unit" : "building",
    locationDetail: dbIssue.unit_number
      ? `Unit ${dbIssue.unit_number}${dbIssue.buildings ? ` - ${dbIssue.buildings.name}` : ""}`
      : dbIssue.buildings
        ? dbIssue.buildings.name
        : "Building",
    status: dbIssue.status,
    priority: dbIssue.priority,
    createdAt: dbIssue.reported_at,
    updatedAt: dbIssue.updated_at,
    closedAt: dbIssue.resolved_at,
    creator: dbIssue.reported_by
      ? {
          id: dbIssue.reported_by.id,
          name: `${dbIssue.reported_by.first_name} ${dbIssue.reported_by.last_name}`,
          email: dbIssue.reported_by.email || "",
        }
      : { id: 0, name: "Unknown", email: "" },
    assignedTo: dbIssue.assigned_to
      ? {
          id: dbIssue.assigned_to.id,
          name: `${dbIssue.assigned_to.first_name} ${dbIssue.assigned_to.last_name}`,
          email: dbIssue.assigned_to.email || "",
        }
      : undefined,
    comments: comments,
  }
}
