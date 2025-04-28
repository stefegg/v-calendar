import { NextResponse } from "next/server"
import { getUsers } from "@/lib/api/users"

export async function GET(request: Request) {
  try {
    // Get query parameters
    const url = new URL(request.url)
    const buildingId = url.searchParams.get("buildingId") || undefined
    const role = url.searchParams.get("role") || undefined

    // Fetch users from the database
    const users = await getUsers(buildingId, role)

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
