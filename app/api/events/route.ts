import { type NextRequest, NextResponse } from "next/server"
import type { Event } from "@/types/event"

// In a real implementation, this would be replaced with a database call
// This function simulates fetching events from a database
async function fetchEventsFromDatabase(
  startDate?: string,
  endDate?: string,
  userId?: string,
  year?: string,
): Promise<Event[]> {
  console.log("Fetching events with params:", { startDate, endDate, userId, year })

  // Get current date to use for mock data if no dates provided
  const currentDate = new Date()
  const currentYear = year ? Number.parseInt(year) : currentDate.getFullYear()

  // Mock user data
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", unitId: 101 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", unitId: 102 },
    { id: 3, name: "Property Manager", email: "manager@example.com" },
  ]

  // Mock data for demonstration - using provided year or current year
  return [
    // April Events
    {
      id: 10,
      title: "April Rent Due",
      description: "Monthly rent payment for Unit 101",
      date: `${currentYear}-04-01`,
      isAllDay: true,
      category: "unit",
      type: "rent_due",
      color: "#FF6B6B",
      creator: { id: 3, name: "Property Manager" },
      unit: { id: 1, number: "101" },
      building: { id: 1, name: "Sunset Towers" },
      contractors: [],
      comments: [
        {
          id: 10,
          text: "Rent has been paid",
          createdAt: `${currentYear}-04-01T10:15:00Z`,
          user: users[0],
        },
      ],
    },
    {
      id: 11,
      title: "Window Cleaning",
      description: "Exterior window cleaning for all units",
      date: `${currentYear}-04-15`,
      startTime: "09:00",
      endTime: "17:00",
      isAllDay: false,
      category: "building",
      type: "maintenance",
      color: "#4ECDC4",
      creator: { id: 3, name: "Property Manager" },
      building: { id: 1, name: "Sunset Towers" },
      contractors: ["Clear View Window Services"],
      comments: [],
    },
    {
      id: 12,
      title: "Fire Alarm Testing",
      description: "Annual fire alarm testing for the building",
      date: `${currentYear}-04-22`,
      startTime: "10:00",
      endTime: "12:00",
      isAllDay: false,
      category: "building",
      type: "inspection",
      color: "#6A8EAE",
      creator: { id: 3, name: "Property Manager" },
      building: { id: 1, name: "Sunset Towers" },
      contractors: ["Fire Safety Inc."],
      comments: [],
    },
    // May Events
    {
      id: 1,
      title: "Rent Due",
      description: "Monthly rent payment for Unit 101",
      date: `${currentYear}-05-01`,
      isAllDay: true,
      category: "unit",
      type: "rent_due",
      color: "#FF6B6B",
      creator: { id: 3, name: "Property Manager" },
      unit: { id: 1, number: "101" },
      building: { id: 1, name: "Sunset Towers" },
      contractors: [],
      comments: [
        {
          id: 1,
          text: "I'll pay this by the end of the day",
          createdAt: `${currentYear}-05-01T09:30:00Z`,
          user: users[0],
        },
      ],
    },
    {
      id: 2,
      title: "Boiler Maintenance",
      description: "Regular maintenance of the building boiler system",
      date: `${currentYear}-05-05`,
      isAllDay: true,
      category: "building",
      type: "maintenance",
      color: "#4ECDC4",
      creator: { id: 3, name: "Property Manager" },
      building: { id: 1, name: "Sunset Towers" },
      contractors: ["ABC Maintenance Co."],
      comments: [
        {
          id: 2,
          text: "Will this affect hot water availability?",
          createdAt: `${currentYear}-05-03T14:20:00Z`,
          user: users[0],
        },
        {
          id: 3,
          text: "Yes, hot water will be unavailable from 10am to 2pm",
          createdAt: `${currentYear}-05-03T15:45:00Z`,
          user: users[2],
        },
      ],
    },
    {
      id: 3,
      title: "Annual Inspection",
      description: "Annual safety inspection for all units",
      date: `${currentYear}-05-15`,
      startTime: "09:00",
      endTime: "17:00",
      isAllDay: false,
      category: "building",
      type: "inspection",
      color: "#6A8EAE",
      creator: { id: 3, name: "Property Manager" },
      building: { id: 1, name: "Sunset Towers" },
      contractors: ["City Inspector"],
      comments: [],
    },
    {
      id: 4,
      title: "Plumbing Repair",
      description: "Fix leaking faucet in Unit 101",
      date: `${currentYear}-05-15`,
      startTime: "13:00",
      endTime: "15:00",
      isAllDay: false,
      category: "unit",
      type: "maintenance",
      color: "#FF6B6B",
      creator: { id: 3, name: "Property Manager" },
      unit: { id: 1, number: "101" },
      building: { id: 1, name: "Sunset Towers" },
      contractors: ["Quick Plumbing Services"],
      comments: [],
    },
    {
      id: 5,
      title: "HOA Meeting",
      description: "Quarterly homeowners association meeting",
      date: `${currentYear}-05-20`,
      startTime: "19:00",
      endTime: "21:00",
      isAllDay: false,
      category: "building",
      type: "meeting",
      color: "#9D8DF1",
      creator: { id: 3, name: "Property Manager" },
      building: { id: 1, name: "Sunset Towers" },
      contractors: [],
      comments: [
        {
          id: 4,
          text: "Will there be discussion about the new security system?",
          createdAt: `${currentYear}-05-18T10:15:00Z`,
          user: users[1],
        },
      ],
    },
    {
      id: 6,
      title: "Pest Control",
      description: "Regular pest control service for the building",
      date: `${currentYear}-05-25`,
      isAllDay: true,
      category: "building",
      type: "maintenance",
      color: "#4ECDC4",
      creator: { id: 3, name: "Property Manager" },
      building: { id: 1, name: "Sunset Towers" },
      contractors: ["Pest Away Inc."],
      comments: [],
    },
    // Add some events for previous year to demonstrate year filtering
    {
      id: 7,
      title: "Previous Year Rent Due",
      description: "Monthly rent payment for Unit 101",
      date: `${currentYear - 1}-12-01`,
      isAllDay: true,
      category: "unit",
      type: "rent_due",
      color: "#FF6B6B",
      creator: { id: 3, name: "Property Manager" },
      unit: { id: 1, number: "101" },
      building: { id: 1, name: "Sunset Towers" },
      contractors: [],
      comments: [],
    },
    {
      id: 8,
      title: "Previous Year HOA Meeting",
      description: "End of year homeowners association meeting",
      date: `${currentYear - 1}-12-15`,
      startTime: "19:00",
      endTime: "21:00",
      isAllDay: false,
      category: "building",
      type: "meeting",
      color: "#9D8DF1",
      creator: { id: 3, name: "Property Manager" },
      building: { id: 1, name: "Sunset Towers" },
      contractors: [],
      comments: [],
    },
  ]
}

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    console.log("Received search params:", Object.fromEntries(searchParams.entries()))

    // Extract parameters
    const startDate = searchParams.get("startDate") || undefined
    const endDate = searchParams.get("endDate") || undefined
    const userId = searchParams.get("userId") || undefined
    const year = searchParams.get("year") || undefined

    // In a real app, this would query the database
    // Simulate database query with a delay to mimic real-world behavior
    const events = await fetchEventsFromDatabase(startDate, endDate, userId, year)

    // Filter events by year if specified
    const filteredEvents = year ? events.filter((event) => event.date.startsWith(year)) : events

    return NextResponse.json(filteredEvents)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
