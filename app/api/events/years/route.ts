import { NextResponse } from "next/server"

// In a real implementation, this would query the database for unique years
async function fetchEventYears(): Promise<number[]> {
  // Get current date
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()

  // Return current year and previous year for demonstration
  return [currentYear - 1, currentYear]
}

export async function GET() {
  try {
    // In a real app, this would query the database for unique years with events
    const years = await fetchEventYears()

    // Sort years in descending order (newest first)
    years.sort((a, b) => b - a)

    return NextResponse.json(years)
  } catch (error) {
    console.error("Error fetching event years:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
