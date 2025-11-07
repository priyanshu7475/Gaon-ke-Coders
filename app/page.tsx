"use client"

import { useState, useEffect } from "react"
import { FeedbackInput } from "@/components/feedback-input"
import { SentimentOverview } from "@/components/sentiment-overview"
import { KPICards } from "@/components/kpi-cards"
import { ThemesDisplay } from "@/components/themes-display"
import { FeedbackList } from "@/components/feedback-list"
import { TrendChart } from "@/components/trend-chart"
import { useFeedbackStore } from "@/lib/feedback-store"
import { ActionItems } from "@/components/action-items"

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { feedback, addFeedback, clearAll } = useFeedbackStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground">Feedback Sentiment Dashboard</h1>
          <p className="mt-2 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
            Real-time analysis of customer feedback with sentiment detection and theme extraction
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8">
          {/* Input Section */}
          <FeedbackInput onAddFeedback={addFeedback} onClearAll={clearAll} />

          {feedback.length > 0 ? (
            <>
              {/* Sentiment Overview */}
              <SentimentOverview feedback={feedback} />

              {/* KPI Cards */}
              <KPICards feedback={feedback} />

              {/* Themes and Trends */}
              <div className="grid gap-8 lg:grid-cols-2">
                <ThemesDisplay feedback={feedback} />
                <TrendChart feedback={feedback} />
              </div>

              {/* Action Items */}
              <ActionItems feedback={feedback} />

              {/* Feedback List */}
              <FeedbackList feedback={feedback} />
            </>
          ) : (
            <div className="rounded-lg border border-border bg-card p-12 text-center">
              <p className="text-muted-foreground">No feedback yet. Add some feedback to get started!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
