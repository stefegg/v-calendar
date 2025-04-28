import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container mx-auto py-6">
      <div className="h-8 bg-muted rounded w-48 mb-6 animate-pulse"></div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="h-10 bg-muted rounded w-full md:w-2/3 animate-pulse"></div>
        <div className="h-10 bg-muted rounded w-full md:w-1/3 animate-pulse"></div>
      </div>

      <div className="h-12 bg-muted rounded w-full mb-6 animate-pulse"></div>

      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
