import { NextResponse } from "next/server"
import { getVendors, createVendor } from "@/lib/api/vendors"
import type { VendorInsert } from "@/lib/api/vendors"
import type { WorkDiscipline } from "@/types/maintenance-types"

export async function GET(request: Request) {
  try {
    // Get query parameters
    const url = new URL(request.url)
    const discipline = url.searchParams.get("discipline") || undefined

    // Fetch vendors from the database
    const vendors = await getVendors(discipline)

    return NextResponse.json(vendors)
  } catch (error) {
    console.error("Error fetching vendors:", error)
    return NextResponse.json({ error: "Failed to fetch vendors" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name) {
      return NextResponse.json({ error: "Vendor name is required" }, { status: 400 })
    }

    const vendor: VendorInsert = {
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      address: data.address || null,
      notes: data.notes || null,
      is_preferred: data.is_preferred || false,
    }

    const disciplines = data.disciplines || []

    const newVendor = await createVendor(vendor, disciplines as WorkDiscipline[])
    return NextResponse.json(newVendor, { status: 201 })
  } catch (error) {
    console.error("Error creating vendor:", error)
    return NextResponse.json({ error: "Failed to create vendor" }, { status: 500 })
  }
}
