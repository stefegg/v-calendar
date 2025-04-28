import type { Metadata } from "next"
import BuildingsList from "@/components/buildings-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Buildings | Property Management",
  description: "View and manage buildings",
}

export default function BuildingsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Buildings</h1>
        <Button asChild>
          <Link href="/buildings/new">Add Building</Link>
        </Button>
      </div>

      <BuildingsList />
    </div>
  )
}
