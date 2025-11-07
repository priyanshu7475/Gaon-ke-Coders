"use client"

import type { Feedback } from "@/lib/feedback-store"
import { getActionItems } from "@/lib/sentiment-analyzer"
import { Card } from "@/components/ui/card"

interface ActionItemsProps {
  feedback: Feedback[]
}

export function ActionItems({ feedback }: ActionItemsProps) {
  const negativeCount = feedback.filter((f) => f.sentiment === "negative").length

  if (negativeCount === 0) {
    return (
      <Card
        className="p-6"
        style={{ borderColor: "hsl(var(--chart-1) / 0.2)", backgroundColor: "hsl(var(--chart-1) / 0.05)" }}
      >
        <h3 className="mb-2 font-semibold" style={{ color: "hsl(var(--chart-1))" }}>
          All Clear!
        </h3>
        <p className="text-sm text-muted-foreground">No negative feedback detected. Keep up the great work!</p>
      </Card>
    )
  }

  const actionItems = getActionItems(feedback)

  return (
    <Card
      className="p-6"
      style={{ borderColor: "hsl(var(--destructive) / 0.2)", backgroundColor: "hsl(var(--destructive) / 0.05)" }}
    >
      <h3 className="mb-4 font-semibold" style={{ color: "hsl(var(--destructive))" }}>
        Recommended Action Items
      </h3>
      <div className="space-y-3">
        {actionItems.map((item) => (
          <div key={item.theme} className="flex gap-3">
            <div
              className="mt-1 flex-shrink-0 w-2 h-2 rounded-full"
              style={{ backgroundColor: "hsl(var(--destructive))" }}
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground capitalize">
                {item.theme.replace("_", " ")} — {item.count} mentions
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{item.suggestion}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
