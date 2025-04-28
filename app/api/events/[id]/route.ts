import { type NextRequest, NextResponse } from "next/server"
import { getEvent, updateEvent, deleteEvent, transformEventForFrontend } from "@/lib/api/events"
import type { EventUpdate } from "@/lib/api/events"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
    }

    // Fetch the event from the database
    const event = await getEvent(id)

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Transform the data to match the expected format in the frontend
    const transformedEvent = transformEventForFrontend(event)

    return NextResponse.json(transformedEvent)
  } catch (error) {
    console.error("Error fetching event:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
    }

    const updates: EventUpdate = {}

    // Only include fields that are provided
    if (data.title !== undefined) updates.title = data.title
    if (data.description !== undefined) updates.description = data.description
    if (data.date !== undefined) updates.date = data.date
    if (data.start_time !== undefined) updates.start_time = data.start_time
    if (data.end_time !== undefined) updates.end_time = data.end_time
    if (data.is_all_day !== undefined) updates.is_all_day = data.is_all_day
    if (data.event_type !== undefined) updates.event_type = data.event_type
    if (data.building_id !== undefined) updates.building_id = data.building_id
    if (data.unit_number !== undefined) updates.unit_number = data.unit_number
    if (data.created_by !== undefined) updates.created_by = data.created_by

    const updatedEvent = await updateEvent(id, updates)
    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error("Error updating event:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
    }

    await deleteEvent(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting event:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
