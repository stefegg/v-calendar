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

  // Generate rent due events for every month
  const rentDueEvents: Event[] = Array.from({ length: 12 }, (_, monthIndex) => {
    const month = monthIndex + 1 // JavaScript months are 0-indexed
    const formattedMonth = month.toString().padStart(2, "0")

    return {
      id: 1000 + month, // Unique ID for each rent event
      title: `${getMonthName(month)} Rent Due`,
      description: `Monthly rent payment for Unit 101`,
      date: `${currentYear}-${formattedMonth}-01`,
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
          id: 1000 + month,
          text: month <= 5 ? "Rent has been paid" : "Reminder: Rent is due today",
          createdAt: `${currentYear}-${formattedMonth}-01T10:15:00Z`,
          user: users[0],
        },
      ],
    }
  })

  // Additional events throughout the year
  const additionalEvents: Event[] = [
    // April Events
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
    // June Events
    {
      id: 20,
      title: "Pool Opening",
      description: "Seasonal opening of the community pool",
      date: `${currentYear}-06-15`,
      isAllDay: true,
      category: "building",
      type: "other",
      color: "#4ECDC4",
      creator: { id: 3, name: "Property Manager" },
      building: { id: 1, name: "Sunset Towers" },
      contractors: ["Blue Water Pool Services"],
      comments: [],
    },
    // July Events
    {
      id: 21,
      title: "Independence Day BBQ",
      description: "Community BBQ in the courtyard",
      date: `${currentYear}-07-04`,
      startTime: "12:00",
      endTime: "16:00",
      isAllDay: false,
      category: "building",
      type: "other",
      color: "#9D8DF1",
      creator: { id: 3, name: "Property Manager" },
      building: { id: 1, name: "Sunset Towers" },
      contractors: [],
      comments: [],
    },
    {
      id: 22,
      title: "HVAC Maintenance",
      description: "Annual air conditioning system check",
      date: `${currentYear}-07-15`,
      startTime: "09:00",
      endTime: "17:00",
      isAllDay: false,
      category: "building",
      type: "maintenance",
      color: "#4ECDC4",
      creator: { id: 3, name: "Property Manager" },
      building: { id: 1, name: "Sunset Towers" },
      contractors: ["Cool Air Services"],
      comments: [],
    },
    // August Events
    {
      id: 23,
      title: "HOA Meeting",
      description: "Quarterly homeowners association meeting",
      date: `${currentYear}-08-20`,
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
    // September Events
    {
      id: 24,
      title: "Roof Inspection",
      description: "Annual roof inspection and maintenance",
      date: `${currentYear}-09-10`,
      isAllDay: true,
      category: "building",
      type: "inspection",
      color: "#6A8EAE",
      creator: { id: 3, name: "Property Manager" },
      building: { id: 1, name: "Sunset Towers" },
      contractors: ["Top Notch Roofing"],
      comments: [],
    },
    // October Events
    {
      id: 25,
      title: "Halloween Party",
      description: "Community Halloween celebration in the common room",
      date: `${currentYear}-10-31`,
      startTime: "18:00",
      endTime: "21:00",
      isAllDay: false,
      category: "building",
      type: "other",
      color: "#9D8DF1",
      creator: { id: 3, name: "Property Manager" },
      building: { id: 1, name: "Sunset Towers" },
      contractors: [],
      comments: [],
    },
    // November Events
    {
      id: 26,
      title: "HOA Meeting",
      description: "Quarterly homeowners association meeting",
      date: `${currentYear}-11-20`,
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
    {
      id: 27,
      title: "Heating System Check",
      description: "Winter preparation - heating system inspection",
      date: `${currentYear}-11-15`,
      isAllDay: true,
      category: "building",
      type: "maintenance",
      color: "#4ECDC4",
      creator: { id: 3, name: "Property Manager" },
      building: { id: 1, name: "Sunset Towers" },
      contractors: ["Warm & Cozy Heating"],
      comments: [],
    },
    // December Events
    {
      id: 28,
      title: "Holiday Party",
      description: "Annual community holiday celebration",
      date: `${currentYear}-12-15`,
      startTime: "18:00",
      endTime: "22:00",
      isAllDay: false,
      category: "building",
      type: "other",
      color: "#9D8DF1",
      creator: { id: 3, name: "Property Manager" },
      building: { id: 1, name: "Sunset Towers" },
      contractors: [],
      comments: [],
    },
    {
      id: 29,
      title: "Snow Removal Service Begins",
      description: "Winter snow removal service contract starts",
      date: `${currentYear}-12-01`,
      isAllDay: true,
      category: "building",
      type: "maintenance",
      color: "#4ECDC4",
      creator: { id: 3, name: "Property Manager" },
      building: { id: 1, name: "Sunset Towers" },
      contractors: ["Snow Be Gone"],
      comments: [],
    },
    // January Events
    {
      id: 30,
      title: "New Year's Maintenance",
      description: "General building maintenance check",
      date: `${currentYear}-01-15`,
      isAllDay: true,
      category: "building",
      type: "maintenance",
      color: "#4ECDC4",
      creator: { id: 3, name: "Property Manager" },
      building: { id: 1, name: "Sunset Towers" },
      contractors: ["ABC Maintenance Co."],
      comments: [],
    },
    // February Events
    {
      id: 31,
      title: "HOA Meeting",
      description: "First quarterly homeowners association meeting",
      date: `${currentYear}-02-20`,
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
    // March Events
    {
      id: 32,
      title: "Spring Cleaning",
      description: "Common areas deep cleaning",
      date: `${currentYear}-03-15`,
      isAllDay: true,
      category: "building",
      type: "maintenance",
      color: "#4ECDC4",
      creator: { id: 3, name: "Property Manager" },
      building: { id: 1, name: "Sunset Towers" },
      contractors: ["Spotless Cleaning Services"],
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

  // Combine all events
  return [...rentDueEvents, ...additionalEvents]
}

// Helper function to get month name
function getMonthName(month: number): string {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  return monthNames[month - 1]
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
