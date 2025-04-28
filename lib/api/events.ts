import { supabase, createServerSupabaseClient } from "@/lib/supabase"
import type { Database } from "@/types/database"
import type { Event } from "@/types/app-types"

export type DbEvent = Database["public"]["Tables"]["events"]["Row"]
export type EventInsert = Database["public"]["Tables"]["events"]["Insert"]
export type EventUpdate = Database["public"]["Tables"]["events"]["Update"]

// Client-side functions
export async function getEvents(buildingId?: string, startDate?: string, endDate?: string) {
  let query = supabase.from("events").select("*, users!events_created_by_fkey(first_name, last_name)")

  if (buildingId) {
    query = query.eq("building_id", buildingId)
  }

  if (startDate) {
    query = query.gte("date", startDate)
  }

  if (endDate) {
    query = query.lte("date", endDate)
  }

  const { data, error } = await query.order("date")

  if (error) {
    console.error("Error fetching events:", error)
    throw error
  }

  return data
}

export async function getEvent(id: string) {
  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      users!events_created_by_fkey(id, first_name, last_name, email),
      buildings(id, name)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error fetching event with id ${id}:`, error)
    throw error
  }

  return data
}

// Server-side functions
export async function createEvent(event: EventInsert) {
  const supabaseServer = createServerSupabaseClient()

  const { data, error } = await supabaseServer.from("events").insert(event).select().single()

  if (error) {
    console.error("Error creating event:", error)
    throw error
  }

  return data
}

export async function updateEvent(id: string, updates: EventUpdate) {
  const supabaseServer = createServerSupabaseClient()

  const { data, error } = await supabaseServer
    .from("events")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating event with id ${id}:`, error)
    throw error
  }

  return data
}

export async function deleteEvent(id: string) {
  const supabaseServer = createServerSupabaseClient()

  const { error } = await supabaseServer.from("events").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting event with id ${id}:`, error)
    throw error
  }

  return true
}

// Add attendees to an event
export async function addEventAttendee(eventId: string, userId: string, role: "creator" | "attendee" = "attendee") {
  const supabaseServer = createServerSupabaseClient()

  const { data, error } = await supabaseServer.from("user_events").insert({
    event_id: eventId,
    user_id: userId,
    role,
  })

  if (error) {
    console.error(`Error adding attendee ${userId} to event ${eventId}:`, error)
    throw error
  }

  return true
}

// Helper function to transform database event to frontend event
export function transformEventForFrontend(dbEvent: any): Event {
  return {
    id: dbEvent.id,
    title: dbEvent.title,
    description: dbEvent.description || "",
    date: dbEvent.date,
    startTime: dbEvent.start_time || undefined,
    endTime: dbEvent.end_time || undefined,
    isAllDay: dbEvent.is_all_day,
    category: dbEvent.unit_number ? "unit" : "building",
    type: dbEvent.event_type,
    color: getEventColor(dbEvent.event_type),
    creator: {
      id: dbEvent.created_by || 0,
      name: dbEvent.users ? `${dbEvent.users.first_name} ${dbEvent.users.last_name}` : "Unknown",
    },
    unit: dbEvent.unit_number ? { id: 0, number: dbEvent.unit_number } : undefined,
    building: {
      id: dbEvent.building_id,
      name: dbEvent.buildings?.name || "",
    },
    contractors: [],
    comments: [],
  }
}

// Helper function to get color based on event type
export function getEventColor(eventType: string): string {
  switch (eventType) {
    case "rent_due":
      return "#FF6B6B"
    case "maintenance":
      return "#4ECDC4"
    case "inspection":
      return "#6A8EAE"
    case "meeting":
      return "#9D8DF1"
    default:
      return "#FFD166"
  }
}
