import { NextResponse } from "next/server"
import { getBuildings, createBuilding } from "@/lib/api/buildings"
import type { BuildingInsert } from "@/lib/api/buildings"

export async function GET() {
  try {
    const buildings = await getBuildings()
    return NextResponse.json(buildings)
  } catch (error) {
    console.error("Error in GET /api/buildings:", error)
    return NextResponse.json({ error: "Failed to fetch buildings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.address || !data.city || !data.state || !data.zip_code || !data.total_units) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const building: BuildingInsert = {
      name: data.name,
      address: data.address,
      city: data.city,
      state: data.state,
      zip_code: data.zip_code,
      total_units: data.total_units,
      year_built: data.year_built || null,
      description: data.description || null,
      image_url: data.image_url || null,
    }

    const newBuilding = await createBuilding(building)
    return NextResponse.json(newBuilding, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/buildings:", error)
    return NextResponse.json({ error: "Failed to create building" }, { status: 500 })
  }
}
