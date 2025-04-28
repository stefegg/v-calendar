import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FeatureCardProps {
  title: string
  description: string
  content: string
  linkText: string
  linkHref: string
}

export function FeatureCard({ title, description, content, linkText, linkHref }: FeatureCardProps) {
  return (
    <Card className="dark:border-white">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
        <Button className="mt-4 dark:border-white" variant="outline" asChild>
          <Link href={linkHref}>{linkText}</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
