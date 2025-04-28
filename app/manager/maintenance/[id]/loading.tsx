import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function Loading() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/manager/maintenance">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Maintenance Issues
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main issue details */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="h-7 bg-muted rounded w-64 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-6 bg-muted rounded animate-pulse"></div>
                  ))}
                </div>
                <div className="h-24 bg-muted rounded animate-pulse"></div>
                <div className="h-6 bg-muted rounded w-1/3 animate-pulse"></div>
                <div className="space-y-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Issue management panel */}
        <div>
          <Card>
            <CardHeader>
              <div className="h-7 bg-muted rounded w-40 animate-pulse"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                  <div className="h-10 bg-muted rounded animate-pulse"></div>
                </div>
              ))}
              <div className="h-10 bg-muted rounded animate-pulse"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
