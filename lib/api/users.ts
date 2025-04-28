import { supabase, createServerSupabaseClient } from "@/lib/supabase"
import type { Database } from "@/types/database"

export type User = Database["public"]["Tables"]["users"]["Row"]
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"]
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"]

// Client-side functions
export async function getUsers(buildingId?: string, role?: string) {
  let query = supabase.from("users").select("*, buildings(id, name)")

  if (buildingId) {
    query = query.eq("building_id", buildingId)
  }

  if (role) {
    query = query.eq("role", role)
  }

  const { data, error } = await query.order("last_name")

  if (error) {
    console.error("Error fetching users:", error)
    throw error
  }

  return data
}

export async function getUser(id: string) {
  const { data, error } = await supabase.from("users").select("*, buildings(id, name)").eq("id", id).single()

  if (error) {
    console.error(`Error fetching user with id ${id}:`, error)
    throw error
  }

  return data
}

// Server-side functions
export async function createUser(user: UserInsert) {
  const supabaseServer = createServerSupabaseClient()

  const { data, error } = await supabaseServer.from("users").insert(user).select().single()

  if (error) {
    console.error("Error creating user:", error)
    throw error
  }

  return data
}

export async function updateUser(id: string, updates: UserUpdate) {
  const supabaseServer = createServerSupabaseClient()

  const { data, error } = await supabaseServer
    .from("users")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating user with id ${id}:`, error)
    throw error
  }

  return data
}

export async function deleteUser(id: string) {
  const supabaseServer = createServerSupabaseClient()

  const { error } = await supabaseServer.from("users").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting user with id ${id}:`, error)
    throw error
  }

  return true
}
