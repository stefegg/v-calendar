import { supabase, createServerSupabaseClient } from "@/lib/supabase"
import type { Database } from "@/types/database"
import type { Vendor, WorkDiscipline } from "@/types/maintenance-types"

export type DbVendor = Database["public"]["Tables"]["vendors"]["Row"]
export type VendorInsert = Database["public"]["Tables"]["vendors"]["Insert"]
export type VendorUpdate = Database["public"]["Tables"]["vendors"]["Update"]

// Client-side functions
export async function getVendors(discipline?: string) {
  let query = supabase.from("vendors").select(`
    *,
    vendor_disciplines(discipline)
  `)

  if (discipline) {
    query = query.eq("vendor_disciplines.discipline", discipline)
  }

  const { data, error } = await query.order("name")

  if (error) {
    console.error("Error fetching vendors:", error)
    throw error
  }

  // Transform the data to match the expected format
  const vendors: Vendor[] = data.map((vendor) => ({
    id: vendor.id,
    name: vendor.name,
    email: vendor.email,
    phone: vendor.phone,
    address: vendor.address,
    notes: vendor.notes,
    isPreferred: vendor.is_preferred,
    disciplines: vendor.vendor_disciplines.map((d) => d.discipline as WorkDiscipline),
  }))

  return vendors
}

export async function getVendor(id: string) {
  const { data, error } = await supabase
    .from("vendors")
    .select(`
      *,
      vendor_disciplines(discipline)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error fetching vendor with id ${id}:`, error)
    throw error
  }

  // Transform the data to match the expected format
  const vendor: Vendor = {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    address: data.address,
    notes: data.notes,
    isPreferred: data.is_preferred,
    disciplines: data.vendor_disciplines.map((d) => d.discipline as WorkDiscipline),
  }

  return vendor
}

// Server-side functions
export async function createVendor(vendor: VendorInsert, disciplines: WorkDiscipline[]) {
  const supabaseServer = createServerSupabaseClient()

  // Start a transaction
  const { data: vendorData, error: vendorError } = await supabaseServer.from("vendors").insert(vendor).select().single()

  if (vendorError) {
    console.error("Error creating vendor:", vendorError)
    throw vendorError
  }

  // Insert disciplines
  if (disciplines.length > 0) {
    const disciplineInserts = disciplines.map((discipline) => ({
      vendor_id: vendorData.id,
      discipline,
    }))

    const { error: disciplineError } = await supabaseServer.from("vendor_disciplines").insert(disciplineInserts)

    if (disciplineError) {
      console.error("Error adding vendor disciplines:", disciplineError)
      throw disciplineError
    }
  }

  return {
    ...vendorData,
    disciplines,
  }
}

export async function updateVendor(id: string, updates: VendorUpdate, disciplines?: WorkDiscipline[]) {
  const supabaseServer = createServerSupabaseClient()

  // Update vendor
  const { data: vendorData, error: vendorError } = await supabaseServer
    .from("vendors")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (vendorError) {
    console.error(`Error updating vendor with id ${id}:`, vendorError)
    throw vendorError
  }

  // Update disciplines if provided
  if (disciplines) {
    // Delete existing disciplines
    const { error: deleteError } = await supabaseServer.from("vendor_disciplines").delete().eq("vendor_id", id)

    if (deleteError) {
      console.error(`Error deleting vendor disciplines for vendor ${id}:`, deleteError)
      throw deleteError
    }

    // Insert new disciplines
    if (disciplines.length > 0) {
      const disciplineInserts = disciplines.map((discipline) => ({
        vendor_id: id,
        discipline,
      }))

      const { error: insertError } = await supabaseServer.from("vendor_disciplines").insert(disciplineInserts)

      if (insertError) {
        console.error(`Error adding vendor disciplines for vendor ${id}:`, insertError)
        throw insertError
      }
    }
  }

  return {
    ...vendorData,
    disciplines: disciplines || [],
  }
}

export async function deleteVendor(id: string) {
  const supabaseServer = createServerSupabaseClient()

  // Delete vendor (will cascade delete disciplines due to foreign key constraint)
  const { error } = await supabaseServer.from("vendors").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting vendor with id ${id}:`, error)
    throw error
  }

  return true
}
