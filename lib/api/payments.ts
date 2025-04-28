import { supabase, createServerSupabaseClient } from "@/lib/supabase"
import type { Database } from "@/types/database"

export type Payment = Database["public"]["Tables"]["payments"]["Row"]
export type PaymentInsert = Database["public"]["Tables"]["payments"]["Insert"]
export type PaymentUpdate = Database["public"]["Tables"]["payments"]["Update"]

// Client-side functions
export async function getPayments(buildingId?: string, userId?: string, status?: string) {
  let query = supabase.from("payments").select(`
      *,
      users(id, first_name, last_name),
      buildings(id, name)
    `)

  if (buildingId) {
    query = query.eq("building_id", buildingId)
  }

  if (userId) {
    query = query.eq("user_id", userId)
  }

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query.order("payment_date", { ascending: false })

  if (error) {
    console.error("Error fetching payments:", error)
    throw error
  }

  return data
}

export async function getPayment(id: string) {
  const { data, error } = await supabase
    .from("payments")
    .select(`
      *,
      users(id, first_name, last_name, email),
      buildings(id, name)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error fetching payment with id ${id}:`, error)
    throw error
  }

  return data
}

// Server-side functions
export async function createPayment(payment: PaymentInsert) {
  const supabaseServer = createServerSupabaseClient()

  const { data, error } = await supabaseServer.from("payments").insert(payment).select().single()

  if (error) {
    console.error("Error creating payment:", error)
    throw error
  }

  return data
}

export async function updatePayment(id: string, updates: PaymentUpdate) {
  const supabaseServer = createServerSupabaseClient()

  const { data, error } = await supabaseServer
    .from("payments")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating payment with id ${id}:`, error)
    throw error
  }

  return data
}

export async function deletePayment(id: string) {
  const supabaseServer = createServerSupabaseClient()

  const { error } = await supabaseServer.from("payments").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting payment with id ${id}:`, error)
    throw error
  }

  return true
}
