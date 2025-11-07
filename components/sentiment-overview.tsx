"use client"

import type { Feedback } from "@/lib/feedback-store"
import { calculateSentimentStats } from "@/lib/sentiment-analyzer"
import { Card } from "@/components/ui/card"

interface SentimentOverviewProps {
  feedback: Feedback[]
}

export function SentimentOverview({ feedback }: SentimentOverviewProps) {
  const stats = calculateSentimentStats(feedback)

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-6">
        <h3 className="mb-4 font-semibold text-foreground">Sentiment Distribution</h3>
        <div className="space-y-3">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-foreground">Positive</span>
              <span className="font-semibold" style={{ color: "hsl(var(--chart-1))" }}>
                {stats.positivePercent}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full transition-all" style={{ backgroundColor: "hsl(var(--chart-1))" }} />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-foreground">Neutral</span>
              <span className="font-semibold" style={{ color: "hsl(var(--chart-3))" }}>
                {stats.neutralPercent}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full transition-all" style={{ backgroundColor: "hsl(var(--chart-3))" }} />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-foreground">Negative</span>
              <span className="font-semibold" style={{ color: "hsl(var(--destructive))" }}>
                {stats.negativePercent}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full transition-all" style={{ backgroundColor: "hsl(var(--destructive))" }} />
            </div>
          </div>
        </div>
      </Card>

      <Card className="flex flex-col items-center justify-center p-6">
        <div className="mb-2 text-sm text-muted-foreground">Overall Sentiment</div>
        <div className="text-4xl font-bold text-foreground">{stats.headline}</div>
        <div className="mt-2 text-xs text-muted-foreground">{stats.total} total feedback items</div>
      </Card>
    </div>
  )
}
