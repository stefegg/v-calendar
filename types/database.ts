export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      buildings: {
        Row: {
          id: string
          name: string
          address: string
          city: string
          state: string
          zip_code: string
          total_units: number
          year_built: number | null
          description: string | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          city: string
          state: string
          zip_code: string
          total_units: number
          year_built?: number | null
          description?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          city?: string
          state?: string
          zip_code?: string
          total_units?: number
          year_built?: number | null
          description?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone: string | null
          role: "tenant" | "manager" | "owner" | "admin"
          building_id: string | null
          unit_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name: string
          last_name: string
          phone?: string | null
          role: "tenant" | "manager" | "owner" | "admin"
          building_id?: string | null
          unit_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          phone?: string | null
          role?: "tenant" | "manager" | "owner" | "admin"
          building_id?: string | null
          unit_number?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          date: string
          start_time: string | null
          end_time: string | null
          is_all_day: boolean
          event_type: "rent_due" | "maintenance" | "inspection" | "meeting" | "other"
          building_id: string
          unit_number: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          date: string
          start_time?: string | null
          end_time?: string | null
          is_all_day?: boolean
          event_type: "rent_due" | "maintenance" | "inspection" | "meeting" | "other"
          building_id: string
          unit_number?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          date?: string
          start_time?: string | null
          end_time?: string | null
          is_all_day?: boolean
          event_type?: "rent_due" | "maintenance" | "inspection" | "meeting" | "other"
          building_id?: string
          unit_number?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_events: {
        Row: {
          user_id: string
          event_id: string
          role: "creator" | "attendee"
        }
        Insert: {
          user_id: string
          event_id: string
          role: "creator" | "attendee"
        }
        Update: {
          user_id?: string
          event_id?: string
          role?: "creator" | "attendee"
        }
      }
      maintenance_issues: {
        Row: {
          id: string
          title: string
          description: string
          status: "open" | "in_progress" | "pending" | "resolved" | "closed"
          priority: "low" | "medium" | "high" | "urgent"
          reported_at: string
          resolved_at: string | null
          building_id: string
          unit_number: string | null
          reported_by: string | null
          assigned_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          status: "open" | "in_progress" | "pending" | "resolved" | "closed"
          priority: "low" | "medium" | "high" | "urgent"
          reported_at?: string
          resolved_at?: string | null
          building_id: string
          unit_number?: string | null
          reported_by?: string | null
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          status?: "open" | "in_progress" | "pending" | "resolved" | "closed"
          priority?: "low" | "medium" | "high" | "urgent"
          reported_at?: string
          resolved_at?: string | null
          building_id?: string
          unit_number?: string | null
          reported_by?: string | null
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      maintenance_comments: {
        Row: {
          id: string
          issue_id: string
          user_id: string | null
          text: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          issue_id: string
          user_id?: string | null
          text: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          issue_id?: string
          user_id?: string | null
          text?: string
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          amount: number
          payment_date: string
          payment_type: "ACH" | "check" | "credit_card" | "cash" | "other"
          status: "pending" | "completed" | "failed"
          user_id: string | null
          building_id: string
          unit_number: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          amount: number
          payment_date: string
          payment_type: "ACH" | "check" | "credit_card" | "cash" | "other"
          status: "pending" | "completed" | "failed"
          user_id?: string | null
          building_id: string
          unit_number?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          amount?: number
          payment_date?: string
          payment_type?: "ACH" | "check" | "credit_card" | "cash" | "other"
          status?: "pending" | "completed" | "failed"
          user_id?: string | null
          building_id?: string
          unit_number?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
