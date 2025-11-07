"use client"

import type { Feedback } from "@/lib/feedback-store"
import { calculateKPIs } from "@/lib/sentiment-analyzer"
import { Card } from "@/components/ui/card"

interface KPICardsProps {
  feedback: Feedback[]
}

export function KPICards({ feedback }: KPICardsProps) {
  const kpis = calculateKPIs(feedback)

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="p-6">
        <div className="mb-2 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
          Average Rating
        </div>
        <div className="text-3xl font-bold text-foreground">{kpis.avgRating}</div>
        <div className="mt-1 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
          out of 5 stars
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-2 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
          Total Feedback
        </div>
        <div className="text-3xl font-bold text-foreground">{kpis.totalFeedback}</div>
        <div className="mt-1 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
          items analyzed
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-2 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
          Most Common Complaint
        </div>
        <div className="truncate text-2xl font-bold capitalize" style={{ color: "#ef4444" }}>
          {kpis.mostCommonComplaint.replace("_", " ")}
        </div>
        <div className="mt-1 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
          from negative feedback
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-2 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
          Most Praised Aspect
        </div>
        <div className="truncate text-2xl font-bold capitalize" style={{ color: "#059669" }}>
          {kpis.mostPraisedAspect.replace("_", " ")}
        </div>
        <div className="mt-1 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
          from positive feedback
        </div>
      </Card>
    </div>
  )
}
