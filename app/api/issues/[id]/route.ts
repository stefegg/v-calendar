import { type NextRequest, NextResponse } from "next/server"
import {
  getMaintenanceIssue,
  updateMaintenanceIssue,
  addMaintenanceComment,
  transformIssueForFrontend,
} from "@/lib/api/maintenance"
import type { MaintenanceIssueUpdate, MaintenanceCommentInsert } from "@/lib/api/maintenance"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json({ error: "Issue ID is required" }, { status: 400 })
    }

    // Fetch the issue from the database
    const issue = await getMaintenanceIssue(id)

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 })
    }

    // Transform the data to match the expected format in the frontend
    const transformedIssue = transformIssueForFrontend(issue)

    return NextResponse.json(transformedIssue)
  } catch (error) {
    console.error("Error fetching issue:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Issue ID is required" }, { status: 400 })
    }

    const updates: MaintenanceIssueUpdate = {}

    // Only include fields that are provided
    if (data.title !== undefined) updates.title = data.title
    if (data.description !== undefined) updates.description = data.description
    if (data.status !== undefined) updates.status = data.status
    if (data.priority !== undefined) updates.priority = data.priority
    if (data.building_id !== undefined) updates.building_id = data.building_id
    if (data.unit_number !== undefined) updates.unit_number = data.unit_number
    if (data.reported_by !== undefined) updates.reported_by = data.reported_by
    if (data.assigned_to !== undefined) updates.assigned_to = data.assigned_to

    const updatedIssue = await updateMaintenanceIssue(id, updates)
    return NextResponse.json(updatedIssue)
  } catch (error) {
    console.error("Error updating issue:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Issue ID is required" }, { status: 400 })
    }

    if (!data.comment || !data.user_id) {
      return NextResponse.json({ error: "Comment text and user ID are required" }, { status: 400 })
    }

    const comment: MaintenanceCommentInsert = {
      issue_id: id,
      user_id: data.user_id,
      text: data.comment,
    }

    const newComment = await addMaintenanceComment(comment)

    // Transform the comment to match the expected format in the frontend
    const transformedComment = {
      id: newComment.id,
      text: newComment.text,
      createdAt: newComment.created_at,
      user: {
        id: data.user_id,
        name: data.user_name || "User",
      },
    }

    return NextResponse.json(transformedComment, { status: 201 })
  } catch (error) {
    console.error("Error adding comment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
