export type EventType = "rent_due" | "maintenance" | "inspection" | "meeting" | "other"
export type EventCategory = "unit" | "building"

export interface User {
  id: number
  name: string
  email: string
  unitId?: number
}

export interface Comment {
  id: number
  text: string
  createdAt: string
  user: User
}

export interface Event {
  id: number
  title: string
  description?: string
  date: string
  startTime?: string // Format: "HH:MM" (24-hour)
  endTime?: string // Format: "HH:MM" (24-hour)
  isAllDay: boolean
  category: EventCategory
  type: EventType
  color: string
  paymentType?: string
  creator: { id: number; name: string }
  unit?: { id: number; number: string }
  building?: { id: number; name: string }
  contractors: string[]
  comments: Comment[]
}

export interface EventsGroupedByMonth {
  [month: string]: Event[]
}

export interface EventsGroupedByYear {
  [year: string]: EventsGroupedByMonth
}
