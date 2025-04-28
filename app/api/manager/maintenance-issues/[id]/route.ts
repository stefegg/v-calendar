import { NextResponse } from "next/server"
import { getMaintenanceIssue, updateMaintenanceIssue, addMaintenanceComment } from "@/lib/api/maintenance"
import type { MaintenanceIssueUpdate, MaintenanceCommentInsert } from "@/lib/api/maintenance"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: Request, { params }: { params: { id: string } }) {
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

    return NextResponse.json(issue)
  } catch (error) {
    console.error("Error fetching maintenance issue:", error)
    return NextResponse.json({ error: "Failed to fetch maintenance issue" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
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
    if (data.work_discipline !== undefined) updates.work_discipline = data.work_discipline
    if (data.vendor_id !== undefined) updates.vendor_id = data.vendor_id
    if (data.estimated_cost !== undefined) updates.estimated_cost = data.estimated_cost
    if (data.scheduled_date !== undefined) updates.scheduled_date = data.scheduled_date
    if (data.completion_date !== undefined) updates.completion_date = data.completion_date

    // If status is being updated to resolved or closed, set resolved_at
    if (updates.status === "resolved" || updates.status === "closed") {
      updates.resolved_at = updates.resolved_at || new Date().toISOString()
    }

    const updatedIssue = await updateMaintenanceIssue(id, updates)

    // Fetch the updated issue with all related data
    const fullUpdatedIssue = await getMaintenanceIssue(id)

    return NextResponse.json(fullUpdatedIssue)
  } catch (error) {
    console.error("Error updating maintenance issue:", error)
    return NextResponse.json({ error: "Failed to update maintenance issue" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
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

    // Get the user details for the comment
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, first_name, last_name, email")
      .eq("id", data.user_id)
      .single()

    if (userError) {
      console.error("Error fetching user:", userError)
    }

    // Transform the comment to match the expected format in the frontend
    const transformedComment = {
      id: newComment.id,
      text: newComment.text,
      createdAt: newComment.created_at,
      user: {
        id: data.user_id,
        name: userData ? `${userData.first_name} ${userData.last_name}` : data.user_name || "User",
        email: userData?.email || "",
      },
    }

    return NextResponse.json(transformedComment, { status: 201 })
  } catch (error) {
    console.error("Error adding comment:", error)
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 })
  }
}
