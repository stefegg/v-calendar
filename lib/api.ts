// This would be used in a real application to fetch data from the API
import { z } from "zod"

// Event schema for validation
export const eventSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().optional(),
  date: z.string(),
  category: z.enum(["unit", "building"]),
  type: z.string(),
  color: z.string(),
})

export const eventDetailsSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  date: z.string(),
  category: z.enum(["unit", "building"]),
  type: z.string(),
  paymentType: z.string().optional(),
  creator: z.object({
    id: z.number(),
    name: z.string(),
  }),
  unit: z
    .object({
      id: z.number(),
      number: z.string(),
    })
    .optional(),
  building: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .optional(),
  contractors: z.array(z.string()),
})

export type Event = z.infer<typeof eventSchema>
export type EventDetails = z.infer<typeof eventDetailsSchema>

// Function to fetch events for the calendar
export async function getEvents(startDate: string, endDate: string): Promise<Event[]> {
  const response = await fetch(`/api/events?startDate=${startDate}&endDate=${endDate}`)

  if (!response.ok) {
    throw new Error("Failed to fetch events")
  }

  const data = await response.json()
  return eventSchema.array().parse(data)
}

// Function to fetch a specific event
export async function getEvent(id: string): Promise<EventDetails> {
  const response = await fetch(`/api/events/${id}`)

  if (!response.ok) {
    throw new Error("Failed to fetch event")
  }

  const data = await response.json()
  return eventDetailsSchema.parse(data)
}
