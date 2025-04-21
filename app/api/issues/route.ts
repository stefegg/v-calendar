import { type NextRequest, NextResponse } from "next/server"
import type { Issue } from "@/types/issue"

// In a real implementation, this would be replaced with a database call
// This function simulates fetching issues from a database
async function fetchIssuesFromDatabase(): Promise<Issue[]> {
  // Mock user data
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", unitId: 101 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", unitId: 102 },
    { id: 3, name: "Property Manager", email: "manager@example.com" },
  ]

  // Current date for reference
  const currentDate = new Date()
  const oneWeekAgo = new Date(currentDate)
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  const twoWeeksAgo = new Date(currentDate)
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

  const oneMonthAgo = new Date(currentDate)
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

  // Mock issues data
  return [
    {
      id: 1,
      title: "Leaking faucet in bathroom",
      description:
        "The bathroom sink faucet has been leaking steadily for the past two days. Water is pooling in the sink.",
      location: "unit",
      locationDetail: "Unit 101 - Master Bathroom",
      status: "open",
      priority: "medium",
      createdAt: oneWeekAgo.toISOString(),
      updatedAt: oneWeekAgo.toISOString(),
      creator: users[0],
      comments: [
        {
          id: 1,
          text: "I've tried tightening it but it's still leaking.",
          createdAt: oneWeekAgo.toISOString(),
          user: users[0],
        },
      ],
    },
    {
      id: 2,
      title: "Broken light fixture in hallway",
      description: "The ceiling light in the main hallway is flickering and sometimes doesn't turn on at all.",
      location: "building",
      locationDetail: "3rd Floor Hallway",
      status: "in_progress",
      priority: "medium",
      createdAt: twoWeeksAgo.toISOString(),
      updatedAt: new Date(currentDate.getTime() - 86400000 * 2).toISOString(), // 2 days ago
      creator: users[1],
      assignedTo: users[2],
      comments: [
        {
          id: 2,
          text: "This is affecting all residents on the 3rd floor.",
          createdAt: twoWeeksAgo.toISOString(),
          user: users[1],
        },
        {
          id: 3,
          text: "Maintenance has been scheduled for tomorrow morning.",
          createdAt: new Date(currentDate.getTime() - 86400000 * 3).toISOString(), // 3 days ago
          user: users[2],
        },
        {
          id: 4,
          text: "Parts have been ordered, will be fixed by end of week.",
          createdAt: new Date(currentDate.getTime() - 86400000 * 2).toISOString(), // 2 days ago
          user: users[2],
        },
      ],
    },
    {
      id: 3,
      title: "No hot water",
      description: "There's no hot water in my unit since this morning. Cold water works fine.",
      location: "unit",
      locationDetail: "Unit 101",
      status: "resolved",
      priority: "high",
      createdAt: new Date(currentDate.getTime() - 86400000 * 10).toISOString(), // 10 days ago
      updatedAt: new Date(currentDate.getTime() - 86400000 * 8).toISOString(), // 8 days ago
      closedAt: new Date(currentDate.getTime() - 86400000 * 8).toISOString(), // 8 days ago
      creator: users[0],
      assignedTo: users[2],
      comments: [
        {
          id: 5,
          text: "This is urgent as I need to shower for work.",
          createdAt: new Date(currentDate.getTime() - 86400000 * 10).toISOString(),
          user: users[0],
        },
        {
          id: 6,
          text: "Maintenance person will be there within 2 hours.",
          createdAt: new Date(currentDate.getTime() - 86400000 * 10).toISOString(),
          user: users[2],
        },
        {
          id: 7,
          text: "The water heater needed to be reset. It's working now.",
          createdAt: new Date(currentDate.getTime() - 86400000 * 8).toISOString(),
          user: users[2],
        },
      ],
    },
    {
      id: 4,
      title: "Gym equipment broken",
      description: "The treadmill in the gym is making a loud noise and stops working after a few minutes.",
      location: "common_area",
      locationDetail: "Fitness Center",
      status: "closed",
      priority: "low",
      createdAt: oneMonthAgo.toISOString(),
      updatedAt: new Date(currentDate.getTime() - 86400000 * 20).toISOString(), // 20 days ago
      closedAt: new Date(currentDate.getTime() - 86400000 * 20).toISOString(), // 20 days ago
      creator: users[1],
      assignedTo: users[2],
      comments: [
        {
          id: 8,
          text: "It's making a grinding noise when used.",
          createdAt: oneMonthAgo.toISOString(),
          user: users[1],
        },
        {
          id: 9,
          text: "Maintenance company has been contacted.",
          createdAt: new Date(currentDate.getTime() - 86400000 * 25).toISOString(), // 25 days ago
          user: users[2],
        },
        {
          id: 10,
          text: "Repair completed. The belt was misaligned and has been fixed.",
          createdAt: new Date(currentDate.getTime() - 86400000 * 20).toISOString(), // 20 days ago
          user: users[2],
        },
      ],
    },
    {
      id: 5,
      title: "Parking spot being used by unauthorized vehicle",
      description: "Someone has been parking in my assigned spot (#42) for the past week.",
      location: "building",
      locationDetail: "Parking Garage - Spot #42",
      status: "pending",
      priority: "medium",
      createdAt: new Date(currentDate.getTime() - 86400000 * 5).toISOString(), // 5 days ago
      updatedAt: new Date(currentDate.getTime() - 86400000 * 3).toISOString(), // 3 days ago
      creator: users[0],
      assignedTo: users[2],
      comments: [
        {
          id: 11,
          text: "This has happened multiple times now.",
          createdAt: new Date(currentDate.getTime() - 86400000 * 5).toISOString(),
          user: users[0],
        },
        {
          id: 12,
          text: "We're reviewing security footage and will send a notice to all residents.",
          createdAt: new Date(currentDate.getTime() - 86400000 * 3).toISOString(),
          user: users[2],
        },
      ],
    },
  ]
}

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") // 'open', 'closed', or null for all

    // In a real app, this would query the database
    const issues = await fetchIssuesFromDatabase()

    // Filter issues based on status if provided
    let filteredIssues = issues
    if (status === "open") {
      filteredIssues = issues.filter((issue) => ["open", "in_progress", "pending"].includes(issue.status))
    } else if (status === "closed") {
      filteredIssues = issues.filter((issue) => ["resolved", "closed"].includes(issue.status))
    }

    return NextResponse.json(filteredIssues)
  } catch (error) {
    console.error("Error fetching issues:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // In a real app, this would validate and save to the database
    // For now, we'll just return a mock response

    // Mock current user
    const currentUser = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      unitId: 101,
    }

    const newIssue: Issue = {
      id: 6, // In a real app, this would be generated by the database
      title: data.title,
      description: data.description,
      location: data.location,
      locationDetail: data.locationDetail,
      status: "open",
      priority: data.priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      creator: currentUser,
      comments: [],
    }

    return NextResponse.json(newIssue, { status: 201 })
  } catch (error) {
    console.error("Error creating issue:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
