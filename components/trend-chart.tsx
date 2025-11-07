"use client"

import type { Feedback } from "@/lib/feedback-store"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface TrendChartProps {
  feedback: Feedback[]
}

export function TrendChart({ feedback }: TrendChartProps) {
  // Aggregate by rating
  const ratingData = Array.from({ length: 5 }, (_, i) => {
    const rating = i + 1
    const count = feedback.filter((f) => f.rating === rating).length
    return { rating: `${rating}★`, count }
  })

  return (
    <Card className="p-6">
      <h3 className="mb-4 font-semibold text-foreground">Rating Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={ratingData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="rating" stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
          />
          <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
