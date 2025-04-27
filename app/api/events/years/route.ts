import { NextResponse } from "next/server"

// In a real implementation, this would query the database for unique years
async function fetchEventYears(): Promise<number[]> {
  // Get current date
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()

  // Return current year, previous year, and 2025 for demonstration
  // Use a Set to ensure unique values
  const uniqueYears = new Set([currentYear - 1, currentYear, 2025])

  // Convert Set back to array
  return Array.from(uniqueYears)
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
