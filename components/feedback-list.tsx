"use client"

import { useState, useMemo } from "react"
import type { Feedback } from "@/lib/feedback-store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface FeedbackListProps {
  feedback: Feedback[]
}

const ITEMS_PER_PAGE = 10

export function FeedbackList({ feedback }: FeedbackListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sentimentFilter, setSentimentFilter] = useState<"all" | "positive" | "negative" | "neutral">("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredFeedback = useMemo(() => {
    return feedback.filter((item) => {
      const matchesSentiment = sentimentFilter === "all" || item.sentiment === sentimentFilter
      const matchesSearch =
        searchTerm === "" ||
        item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customer.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesSentiment && matchesSearch
    })
  }, [feedback, sentimentFilter, searchTerm])

  const totalPages = Math.ceil(filteredFeedback.length / ITEMS_PER_PAGE)
  const paginatedFeedback = filteredFeedback.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const getSentimentBadge = (sentiment: string) => {
    const colors = {
      positive: { bg: "hsl(var(--chart-1) / 0.1)", text: "hsl(var(--chart-1))" },
      negative: { bg: "hsl(var(--destructive) / 0.1)", text: "hsl(var(--destructive))" },
      neutral: { bg: "hsl(var(--chart-3) / 0.1)", text: "hsl(var(--chart-3))" },
    }
    const color = colors[sentiment as keyof typeof colors] || colors.neutral
    return color
  }

  return (
    <Card className="p-6">
      <h3 className="mb-4 font-semibold text-foreground">Feedback Items</h3>

      <div className="mb-4 space-y-3">
        <input
          type="text"
          placeholder="Search feedback..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <div className="flex flex-wrap gap-2">
          {(["all", "positive", "negative", "neutral"] as const).map((filter) => (
            <Button
              key={filter}
              variant={sentimentFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSentimentFilter(filter)
                setCurrentPage(1)
              }}
              className="capitalize"
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {paginatedFeedback.length > 0 ? (
          paginatedFeedback.map((item) => (
            <div key={item.id} className="border border-border rounded-lg p-4 hover:bg-accent/50 transition">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1">
                  <p className="text-sm text-foreground line-clamp-2">{item.text}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap capitalize`}
                  style={{
                    backgroundColor: getSentimentBadge(item.sentiment).bg,
                    color: getSentimentBadge(item.sentiment).text,
                  }}
                >
                  {item.sentiment}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>{item.customer}</span>
                  {item.rating && <span>{item.rating} Stars</span>}
                </div>
                <span>{new Date(item.date).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground py-4">No feedback matches your filters</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
