import { supabase, createServerSupabaseClient } from "@/lib/supabase"
import type { Database } from "@/types/database"

export type Building = Database["public"]["Tables"]["buildings"]["Row"]
export type BuildingInsert = Database["public"]["Tables"]["buildings"]["Insert"]
export type BuildingUpdate = Database["public"]["Tables"]["buildings"]["Update"]

// Client-side functions
export async function getBuildings() {
  const { data, error } = await supabase.from("buildings").select("*").order("name")

  if (error) {
    console.error("Error fetching buildings:", error)
    throw error
  }

  return data
}

export async function getBuilding(id: string) {
  const { data, error } = await supabase.from("buildings").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching building with id ${id}:`, error)
    throw error
  }

  return data
}

// Server-side functions
export async function createBuilding(building: BuildingInsert) {
  const supabaseServer = createServerSupabaseClient()

  const { data, error } = await supabaseServer.from("buildings").insert(building).select().single()

  if (error) {
    console.error("Error creating building:", error)
    throw error
  }

  return data
}

export async function updateBuilding(id: string, updates: BuildingUpdate) {
  const supabaseServer = createServerSupabaseClient()

  const { data, error } = await supabaseServer
    .from("buildings")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating building with id ${id}:`, error)
    throw error
  }

  return data
}

export async function deleteBuilding(id: string) {
  const supabaseServer = createServerSupabaseClient()

  const { error } = await supabaseServer.from("buildings").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting building with id ${id}:`, error)
    throw error
  }

  return true
}
