import { NextResponse } from "next/server"
import { addMaintenanceComment } from "@/lib/api/maintenance"
import type { MaintenanceCommentInsert } from "@/lib/api/maintenance"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Issue ID is required" }, { status: 400 })
    }

    if (!data.comment) {
      return NextResponse.json({ error: "Comment text is required" }, { status: 400 })
    }

    // If no user_id is provided, try to find a valid manager user
    if (!data.user_id) {
      const { data: managers, error } = await supabase.from("users").select("id").eq("role", "manager").limit(1)

      if (error || !managers || managers.length === 0) {
        return NextResponse.json({ error: "No valid user found to assign comment to" }, { status: 400 })
      }

      data.user_id = managers[0].id
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
        name: userData ? `${userData.first_name} ${userData.last_name}` : data.user_name || "System User",
        email: userData?.email || "",
      },
    }

    return NextResponse.json(transformedComment, { status: 201 })
  } catch (error) {
    console.error("Error adding comment:", error)
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 })
  }
}
