import { type NextRequest, NextResponse } from "next/server"
import { getEvents, transformEventForFrontend } from "@/lib/api/events"

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)

    // Extract parameters
    const startDate = searchParams.get("startDate") || undefined
    const endDate = searchParams.get("endDate") || undefined
    const buildingId = searchParams.get("buildingId") || undefined
    const year = searchParams.get("year") || undefined

    // Convert year to date range if provided
    let startDateParam = startDate
    let endDateParam = endDate

    if (year && !startDate && !endDate) {
      startDateParam = `${year}-01-01`
      endDateParam = `${year}-12-31`
    }

    // Fetch events from the database
    const events = await getEvents(buildingId, startDateParam, endDateParam)

    // Transform the data to match the expected format in the frontend
    const transformedEvents = events.map(transformEventForFrontend)

    return NextResponse.json(transformedEvents)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
