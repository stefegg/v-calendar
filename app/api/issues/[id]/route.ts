import { type NextRequest, NextResponse } from "next/server"
import type { Issue } from "@/types/issue"

// In a real implementation, this would be replaced with a database call
// This function simulates fetching an issue from a database
async function fetchIssueFromDatabase(id: string): Promise<Issue | null> {
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
  const issues: Record<string, Issue> = {
    "1": {
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
    "2": {
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
    "3": {
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
    "4": {
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
    "5": {
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
  }

  return issues[id] || null
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json({ error: "Issue ID is required" }, { status: 400 })
    }

    // Check if the ID is numeric
    if (isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid issue ID" }, { status: 400 })
    }

    // In a real app, this would query the database
    const issue = await fetchIssueFromDatabase(id)

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 })
    }

    return NextResponse.json(issue)
  } catch (error) {
    console.error("Error fetching issue:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Issue ID is required" }, { status: 400 })
    }

    // In a real app, this would validate and save to the database
    // For now, we'll just return a mock response

    // Mock current user
    const currentUser = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      unitId: 101,
    }

    // Mock adding a comment
    if (data.comment) {
      const newComment = {
        id: Math.floor(Math.random() * 1000) + 100, // Random ID for demo
        text: data.comment,
        createdAt: new Date().toISOString(),
        user: currentUser,
      }

      return NextResponse.json(newComment, { status: 201 })
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  } catch (error) {
    console.error("Error updating issue:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
