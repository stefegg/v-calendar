import { NextResponse } from "next/server"
import { getMaintenanceIssues, createMaintenanceIssue } from "@/lib/api/maintenance"
import type { MaintenanceIssueInsert } from "@/lib/api/maintenance"

export async function GET(request: Request) {
  try {
    // Get query parameters
    const url = new URL(request.url)
    const buildingId = url.searchParams.get("buildingId") || undefined
    const status = url.searchParams.get("status") || undefined

    // Fetch issues from the database
    const issues = await getMaintenanceIssues(buildingId, status)

    return NextResponse.json(issues)
  } catch (error) {
    console.error("Error fetching maintenance issues:", error)
    return NextResponse.json({ error: "Failed to fetch maintenance issues" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.description || !data.building_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const issue: MaintenanceIssueInsert = {
      title: data.title,
      description: data.description,
      status: data.status || "open",
      priority: data.priority || "medium",
      building_id: data.building_id,
      unit_number: data.unit_number || null,
      reported_by: data.reported_by || null,
      assigned_to: data.assigned_to || null,
      work_discipline: data.work_discipline || null,
      vendor_id: data.vendor_id || null,
      estimated_cost: data.estimated_cost || null,
      scheduled_date: data.scheduled_date || null,
      completion_date: data.completion_date || null,
    }

    const newIssue = await createMaintenanceIssue(issue)
    return NextResponse.json(newIssue, { status: 201 })
  } catch (error) {
    console.error("Error creating maintenance issue:", error)
    return NextResponse.json({ error: "Failed to create maintenance issue" }, { status: 500 })
  }
}
