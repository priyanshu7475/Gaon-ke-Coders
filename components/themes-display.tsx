"use client"

import type { Feedback } from "@/lib/feedback-store"
import { extractTopThemes } from "@/lib/sentiment-analyzer"
import { Card } from "@/components/ui/card"

interface ThemesDisplayProps {
  feedback: Feedback[]
}

export function ThemesDisplay({ feedback }: ThemesDisplayProps) {
  const positiveThemes = extractTopThemes(feedback, "positive")
  const negativeThemes = extractTopThemes(feedback, "negative")

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="mb-4 font-semibold text-foreground">Top Positive Themes</h3>
        <div className="space-y-3">
          {positiveThemes.length > 0 ? (
            positiveThemes.map((item) => (
              <div key={item.theme} className="flex items-center justify-between">
                <span className="capitalize text-foreground">{item.theme.replace("_", " ")}</span>
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
                  style={{ backgroundColor: "hsl(var(--chart-1) / 0.1)", color: "hsl(var(--chart-1))" }}
                >
                  {item.count}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No positive feedback yet</p>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 font-semibold text-foreground">Top Negative Themes</h3>
        <div className="space-y-3">
          {negativeThemes.length > 0 ? (
            negativeThemes.map((item) => (
              <div key={item.theme} className="flex items-center justify-between">
                <span className="capitalize text-foreground">{item.theme.replace("_", " ")}</span>
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium"
                  style={{ backgroundColor: "hsl(var(--destructive) / 0.1)", color: "hsl(var(--destructive))" }}
                >
                  {item.count}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No negative feedback yet</p>
          )}
        </div>
      </Card>
    </div>
  )
}
