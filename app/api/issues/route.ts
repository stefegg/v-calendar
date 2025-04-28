import { type NextRequest, NextResponse } from "next/server"
import { getMaintenanceIssues, createMaintenanceIssue, transformIssueForFrontend } from "@/lib/api/maintenance"
import type { MaintenanceIssueInsert } from "@/lib/api/maintenance"

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || undefined
    const buildingId = searchParams.get("buildingId") || undefined

    // Fetch issues from the database
    const issues = await getMaintenanceIssues(buildingId, status)

    // Transform the data to match the expected format in the frontend
    const transformedIssues = issues.map(transformIssueForFrontend)

    return NextResponse.json(transformedIssues)
  } catch (error) {
    console.error("Error fetching issues:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.description || !data.building_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const issue: MaintenanceIssueInsert = {
      title: data.title,
      description: data.description,
      status: "open",
      priority: data.priority || "medium",
      building_id: data.building_id,
      unit_number: data.unit_number || null,
      reported_by: data.reported_by || null,
      assigned_to: data.assigned_to || null,
    }

    const newIssue = await createMaintenanceIssue(issue)
    return NextResponse.json(newIssue, { status: 201 })
  } catch (error) {
    console.error("Error creating issue:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
