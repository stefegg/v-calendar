import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { FeatureCard } from "@/components/feature-card"

export default function Home() {
  return (
    <div className="relative">
      {/* Hero section with background image */}
      <div className="relative w-full h-screen overflow-hidden">
        <Image
          src="/images/treestreet.jpg"
          alt="Beautiful residential properties with trees and landscaping"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" /> {/* Darkening overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center max-w-full drop-shadow-md">
            Property Management Simplified
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl text-center drop-shadow">
            A comprehensive solution for property managers, owners, and renters to manage properties, track events, and
            communicate effectively.
          </p>

          <div className="flex gap-4 pb-8">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-black dark:text-white dark:hover:bg-white/20 hover:bg-black/20 hover:text-white shadow-md"
            >
              <Link href="/calendar">View Calendar</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-black dark:text-white dark:hover:bg-white/20 hover:bg-black/20 hover:text-white shadow-md"
            >
              <Link href="/issues">Report an Issue</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <FeatureCard
              title="Event Calendar"
              description="Track all building and unit events in one place"
              content="View and manage events for your units and buildings. See maintenance schedules, rent due dates, and community meetings all in one calendar view."
              linkText="Open Calendar"
              linkHref="/calendar"
            />
            <FeatureCard
              title="Dashboard"
              description="Access your personalized property management dashboard"
              content="View your upcoming events, track maintenance issues, and get a quick overview of your property status all in one convenient dashboard."
              linkText="Open Dashboard"
              linkHref="/dashboard"
            />
            <FeatureCard
              title="Maintenance Issues"
              description="Report and track maintenance issues in your unit or building"
              content="Easily report maintenance issues, track their status, and communicate with property management about repairs and resolutions."
              linkText="Report an Issue"
              linkHref="/issues"
            />
            <FeatureCard
              title="Maintenance Management"
              description="For property managers"
              content="Assign work disciplines, select vendors, schedule repairs, and manage the full lifecycle of maintenance issues across all properties."
              linkText="Manage Maintenance"
              linkHref="/manager/maintenance"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
