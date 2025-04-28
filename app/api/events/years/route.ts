import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    // Query the database to get unique years from events
    const { data, error } = await supabase.from("events").select("date").order("date", { ascending: false })

    if (error) {
      throw error
    }

    // Extract years from dates and remove duplicates
    const years = data
      .map((event) => new Date(event.date).getFullYear())
      .filter((year, index, self) => self.indexOf(year) === index)

    // If no years found, return current year
    if (years.length === 0) {
      const currentYear = new Date().getFullYear()
      return NextResponse.json([currentYear])
    }

    return NextResponse.json(years)
  } catch (error) {
    console.error("Error fetching event years:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
