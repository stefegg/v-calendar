"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Building } from "@/lib/api/buildings"

export default function BuildingsList() {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBuildings() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/buildings")

        if (!response.ok) {
          throw new Error("Failed to fetch buildings")
        }

        const data = await response.json()
        setBuildings(data)
      } catch (err) {
        console.error("Error fetching buildings:", err)
        setError("Failed to load buildings. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBuildings()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-7 bg-muted rounded w-32"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded-md">{error}</div>
  }

  if (buildings.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground mb-4">No buildings found.</p>
          <Button asChild>
            <Link href="/buildings/new">Add Building</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {buildings.map((building) => (
        <Card key={building.id}>
          <CardHeader>
            <CardTitle>{building.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>{building.address}</p>
              <p>
                {building.city}, {building.state} {building.zip_code}
              </p>
              <p>Units: {building.total_units}</p>
              {building.description && <p>{building.description}</p>}
              <div className="pt-4">
                <Button asChild variant="outline" className="mr-2">
                  <Link href={`/buildings/${building.id}`}>View Details</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/buildings/${building.id}/edit`}>Edit</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
