import { NextResponse } from "next/server"
import { getEvents } from "@/lib/api/events"
import { getMaintenanceIssues } from "@/lib/api/maintenance"
import { getPayments } from "@/lib/api/payments"

export async function GET() {
  try {
    // Get current date
    const today = new Date()
    const thirtyDaysFromNow = new Date(today)
    thirtyDaysFromNow.setDate(today.getDate() + 30)

    // Format dates for API queries
    const startDate = today.toISOString().split("T")[0]
    const endDate = thirtyDaysFromNow.toISOString().split("T")[0]

    // Fetch upcoming events for the next 30 days
    const events = await getEvents(undefined, startDate, endDate)

    // Fetch open maintenance issues
    const openIssues = await getMaintenanceIssues(undefined, "open")

    // Fetch recent payments (last 6 months)
    const sixMonthsAgo = new Date(today)
    sixMonthsAgo.setMonth(today.getMonth() - 6)
    const sixMonthsAgoStr = sixMonthsAgo.toISOString().split("T")[0]

    const payments = await getPayments()

    // Filter payments for the last 6 months
    const recentPayments = payments.filter((payment) => new Date(payment.payment_date) >= sixMonthsAgo)

    // Group payments by month
    const paymentsByMonth = recentPayments.reduce((acc, payment) => {
      const date = new Date(payment.payment_date)
      const monthKey = date.toLocaleString("default", { month: "short" })
      const year = date.getFullYear()
      const key = `${monthKey}-${year}`

      if (!acc[key]) {
        acc[key] = {
          month: monthKey,
          year: year,
          total: 0,
          onTime: 0,
          late: 0,
        }
      }

      acc[key].total += payment.amount

      // Determine if payment was on time (assuming rent is due on the 1st)
      const dayOfMonth = date.getDate()
      if (dayOfMonth <= 5) {
        // Give a 5-day grace period
        acc[key].onTime += payment.amount
      } else {
        acc[key].late += payment.amount
      }

      return acc
    }, {})

    // Get the most recent payment
    const sortedPayments = [...recentPayments].sort(
      (a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime(),
    )
    const latestPayment = sortedPayments.length > 0 ? sortedPayments[0] : null

    // Prepare dashboard data
    const dashboardData = {
      upcomingEvents: events.length,
      events: events.slice(0, 3), // Just send the first 3 for the dashboard
      openIssues: openIssues.length,
      issues: openIssues.slice(0, 3), // Just send the first 3 for the dashboard
      paymentStatus: {
        status: latestPayment ? latestPayment.status : "unknown",
        lastPaymentDate: latestPayment ? latestPayment.payment_date : null,
        amount: latestPayment ? latestPayment.amount : 0,
      },
      paymentHistory: Object.values(paymentsByMonth),
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
