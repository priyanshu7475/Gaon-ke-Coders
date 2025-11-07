"use client"

import type React from "react"
import { useState, useRef } from "react"
import {
  analyzeSentiment,
  getThemes,
  calculateSentimentStats,
  calculateKPIs,
  extractTopThemes,
} from "@/lib/sentiment-analyzer"
import type { Feedback } from "@/lib/feedback-store"
import { Button } from "@/components/ui/button"

interface FeedbackInputProps {
  onAddFeedback: (feedback: Omit<Feedback, "id">) => void
  onClearAll: () => void
  existingFeedback?: Feedback[]
}

export function FeedbackInput({ onAddFeedback, onClearAll, existingFeedback = [] }: FeedbackInputProps) {
  const [text, setText] = useState("")
  const [rating, setRating] = useState<number | "">(3)
  const [customer, setCustomer] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAddFeedback = () => {
    if (!text.trim()) return

    const sentiment = analyzeSentiment(text)
    const tags = getThemes(text)

    onAddFeedback({
      text: text.trim(),
      rating: rating ? Number.parseInt(rating.toString()) : undefined,
      customer: customer || "Anonymous",
      date: new Date(),
      sentiment,
      tags,
    })

    setText("")
    setRating(3)
    setCustomer("")
  }

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    try {
      const text = await file.text()
      const lines = text.split("\n").filter((line) => line.trim())

      if (lines.length === 0) {
        alert("CSV file is empty")
        return
      }

      // Skip header if present
      const startIndex = lines[0]?.toLowerCase().includes("feedback") ? 1 : 0
      let addedCount = 0

      lines.slice(startIndex).forEach((line) => {
        if (!line.trim()) return

        // Simple CSV parsing: text,rating,customer
        const parts = line.split(",").map((p) => p.trim())
        const feedbackText = parts[0]
        const feedbackRating = Number.parseInt(parts[1]) || undefined
        const feedbackCustomer = parts[2] || "Anonymous"

        if (feedbackText) {
          const sentiment = analyzeSentiment(feedbackText)
          const tags = getThemes(feedbackText)

          onAddFeedback({
            text: feedbackText,
            rating: feedbackRating,
            customer: feedbackCustomer,
            date: new Date(),
            sentiment,
            tags,
          })
          addedCount++
        }
      })

      alert(`Successfully added ${addedCount} feedback items from CSV`)
    } catch (error) {
      console.error("Error processing CSV:", error)
      alert("Error processing CSV file. Please check the format.")
    } finally {
      setIsProcessing(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleExportReport = () => {
    if (existingFeedback.length === 0) {
      alert("No feedback to export")
      return
    }

    const stats = calculateSentimentStats(existingFeedback)
    const kpis = calculateKPIs(existingFeedback)
    const positiveThemes = extractTopThemes(existingFeedback, "positive")
    const negativeThemes = extractTopThemes(existingFeedback, "negative")

    const report = `
FEEDBACK SENTIMENT ANALYSIS REPORT
Generated: ${new Date().toLocaleDateString()}
================================================

SENTIMENT OVERVIEW
Total Feedback Items: ${stats.total}
Positive: ${stats.positive} (${stats.positivePercent}%)
Neutral: ${stats.neutral} (${stats.neutralPercent}%)
Negative: ${stats.negative} (${stats.negativePercent}%)

KEY PERFORMANCE INDICATORS
Average Rating: ${kpis.avgRating} / 5
Most Common Complaint: ${kpis.mostCommonComplaint}
Most Praised Aspect: ${kpis.mostPraisedAspect}

TOP POSITIVE THEMES
${positiveThemes.map((t) => `- ${t.theme.replace("_", " ")}: ${t.count} mentions`).join("\n")}

TOP NEGATIVE THEMES
${negativeThemes.map((t) => `- ${t.theme.replace("_", " ")}: ${t.count} mentions`).join("\n")}

DETAILED FEEDBACK
${existingFeedback
  .map(
    (f) =>
      `[${f.sentiment.toUpperCase()}] ${f.customer} - Rating: ${f.rating || "N/A"}\n${f.text}\nDate: ${new Date(f.date).toLocaleDateString()}`,
  )
  .join("\n\n")}
    `.trim()

    const blob = new Blob([report], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `feedback-report-${new Date().getTime()}.txt`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="mb-4 text-xl font-semibold text-foreground">Add Feedback</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Feedback Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter customer feedback here..."
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            rows={4}
            aria-label="Feedback text input"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-foreground mb-2">
              Rating (1-5)
            </label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value ? Number.parseInt(e.target.value) : "")}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Customer rating"
            >
              <option value="">No rating</option>
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>
                  {r} Stars
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="customer" className="block text-sm font-medium text-foreground mb-2">
              Customer Name
            </label>
            <input
              id="customer"
              type="text"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="Optional"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Customer name"
            />
          </div>

          <div className="flex items-end">
            <Button
              onClick={handleAddFeedback}
              disabled={!text.trim() || isProcessing}
              className="w-full"
              aria-label="Add new feedback"
            >
              Add Feedback
            </Button>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <label htmlFor="csv-upload" className="block text-sm font-medium text-foreground mb-2">
            Upload CSV File
          </label>
          <div className="flex gap-2 items-center">
            <input
              id="csv-upload"
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt"
              onChange={handleCSVUpload}
              disabled={isProcessing}
              className="hidden"
              aria-label="CSV file upload"
            />
            <Button
              variant="outline"
              disabled={isProcessing}
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
            >
              {isProcessing ? "Processing..." : "Choose CSV File"}
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            CSV format: text,rating,customer (rating and customer optional)
          </p>
        </div>

        <div className="flex gap-2 flex-col sm:flex-row">
          <Button
            variant="outline"
            className="flex-1 bg-transparent"
            onClick={handleExportReport}
            disabled={existingFeedback.length === 0}
            aria-label="Export feedback analysis report"
          >
            Export Report
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm("Are you sure you want to clear all feedback?")) {
                onClearAll()
              }
            }}
            aria-label="Clear all feedback"
          >
            Clear All
          </Button>
        </div>
      </div>
    </div>
  )
}
